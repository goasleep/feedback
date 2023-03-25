import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import path from "path";
import fs from "fs-extra";
import { app } from "electron";

// 根据process.type来分辨在哪种模式使用哪种模块

const STORE_PATH = app.getPath("userData"); // 获取electron应用的用户目录

// 判断路径是否存在，若不存在，就创建
if (process.type !== "renderer") {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH);
  }
}

// 初始化lowdb读写的json文件名以及存储路径
const adapter = new FileSync(path.join(STORE_PATH, "/feedback.json"));

const db = low(adapter);
db.defaults({ docs: [] }).write();

export default db;
