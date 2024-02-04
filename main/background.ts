import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import db from "./datastore";
import lo from "lodash";
const fs = require("fs");
const path = require("path");

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1200,
    height: 1000,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.handle("createFeedback", async (event, data) => {
  const doc = await db.get("docs").push(data).write();
  return doc;
});

ipcMain.handle("getFeedbacks", async (event) => {
  const doc = await db.get("docs").value();
  console.log(doc);
  return doc;
});

ipcMain.handle("getFeedback", async (event, key) => {
  const doc = await db.get("docs").find({ key }).value();
  return doc;
});
ipcMain.handle("updateFeedback", async (event, feedback) => {
  const { key } = feedback;
  const doc = await db
    .get("docs")
    .find({ key })
    .assign({ ...feedback })
    .write();

  return doc;
});
ipcMain.handle("getAllName", async (event) => {
  const doc = await db
    .get("docs")
    .map((item) => item.name)
    .value();
  const names = lo.uniq(doc);
  return names;
});

ipcMain.handle("searchClass", async (event) => {
  const class_ = await db
    .get("docs")
    .map((item) => item?.classname)
    .value();
  return Array.from(new Set(lo.flattenDeep(class_))).map((item) => ({
    value: item,
  }));
});

ipcMain.handle("searchKnowledge", async (event, keyword) => {
  // 查询知识点
  const points = await db
    .get("docs")
    .map((item) =>
      [...(item?.errorPoint || []), ...(item?.masterPoint || [])]
        .map((item) =>
          Array.isArray(item?.title) ? item?.title?.[0] : item.title
        )
        .filter((item) => item?.includes(keyword))
    )
    .value();
  return Array.from(new Set(lo.flattenDeep(points))).map((item) => ({
    value: item,
  }));
});

ipcMain.handle("searchKnowledgeDesc", async (event, { keyword, title }) => {
  // 查询知识点的描述
  console.log(keyword);
  console.log(title + ">>>>>");
  const points = await db
    .get("docs")
    .map((item) =>
      [...(item?.errorPoint || []), ...(item?.masterPoint || [])]
        .filter((item) => item?.title === title)
        .map((item) => item.desc)
        .filter((item) => item?.includes(keyword))
    )
    .value();
  return Array.from(new Set(lo.flattenDeep(points))).map((item) => ({
    value: item,
  }));
});

let pdfWindow: BrowserWindow | null = null;

ipcMain.handle("exportPDF", async (_event, obj) => {
  let pdfWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    show: false, // 如果不想显示窗口可以改为false
    width: 800,
    height: 600,
    fullscreenable: true,
    minimizable: false,
  });
  pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(obj.html)}`);

  pdfWindow.webContents.on("did-finish-load", () => {
    // Use default printing options
    const pdfPath = getNoneExistFilePath(obj.filePath);
    pdfWindow.webContents
      .printToPDF({
        printBackground: true,
      })
      .then((data) => {
        fs.writeFile(pdfPath, data, (error) => {
          if (error) throw error;

          pdfWindow.close(); // 保存pdf过后关闭该窗口
          pdfWindow = null;
        });
      })
      .catch((error) => {});
  });

  return true;
});

const getNoneExistFilePath = (filePath) => {
  let sumSuffix = 1;
  let newPath = filePath;
  const parsedPath = path.parse(filePath);
  while (fs.existsSync(newPath)) {
    newPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}_${sumSuffix}${parsedPath.ext}`
    );
    sumSuffix++;
  }
  return newPath;
};
