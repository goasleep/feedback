import { Typography, Button, message, Space } from "antd";
import React, { useRef } from "react";
import { useGetFeedback } from "../hook/useGetFeedback";
import { genKey } from "../util";
import { ipcRenderer } from "electron";
import path from "path";
import os from "os";
import { DownloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { Paragraph } = Typography;

const progressStatusMap = [
  "注意力集中",
  "偶尔走神",
  "注意力不够集中",
  "紧跟老师思路",
  "思维活跃",
  "积极互动",
];

const ParentStatusMap = ["", "家长", "妈妈", "爸爸"];

export default ({ name }) => {
  const feedbackData = useGetFeedback(name);
  const router = useRouter();

  const ref = useRef();

  const downloadPDF = async () => {
    const filePath = path.join(
      os.homedir(),
      "Desktop",
      `${feedbackData.name}.pdf`
    );
    const html = ref?.current?.outerHTML;
    const result = await ipcRenderer.invoke("exportPDF", { html, filePath });
    if (result) {
      message.success("成功导出到桌面");
    }
  };

  return (
    <div>
      <div ref={ref}>
        <Paragraph>
          {feedbackData?.name}
          {ParentStatusMap[parseInt(feedbackData?.parent || 0)]}
          您好，以下是
          {feedbackData?.date} &nbsp;
          {feedbackData?.timeRange[0]?.split(":")?.[0]}点 ~
          {feedbackData?.timeRange[1]?.split(":")?.[0]}点 化学课程的反馈
        </Paragraph>
        {feedbackData?.classname && (
          <b style={{ fontSize: 20 }}>课堂名称：{feedbackData?.classname}</b>
        )}
        <br />
        {(feedbackData?.beforeAccuracy || feedbackData?.errorPoint) && (
          <span>
            <b>上周作业完成情况 </b>{" "}
            {feedbackData?.beforeAccuracy ? (
              <>正确率：{feedbackData?.beforeAccuracy || 0} %</>
            ) : (
              <></>
            )}
          </span>
        )}

        {feedbackData?.errorPoint && (
          <Paragraph>
            错误知识点
            <ol>
              {feedbackData?.errorPoint?.map((item) => (
                <li key={genKey()}>
                  {item.title}: {item.desc}
                </li>
              ))}
            </ol>
          </Paragraph>
        )}

        {feedbackData?.beforeClassPoint && (
          <>
            <span>
              <b>课前小测</b>{" "}
              {feedbackData?.beforeClassAccuracy ? (
                <>正确率：{feedbackData?.beforeClassAccuracy || 0} %</>
              ) : (
                <></>
              )}
            </span>
            <Paragraph>
              错误知识点
              <ol>
                {feedbackData?.beforeClassPoint?.map((item) => (
                  <li key={genKey()}>
                    {item.title}: {item.desc}
                  </li>
                ))}
              </ol>
            </Paragraph>
          </>
        )}

        {feedbackData?.progressStatus && (
          <>
            <span>
              <b>上课状态:</b> {feedbackData?.progressRate}分，总分5分
            </span>
            <Paragraph>
              {feedbackData?.progressStatus
                ?.map((item) => progressStatusMap[parseInt(item) - 1])
                ?.join(", ")}
            </Paragraph>
          </>
        )}

        {feedbackData?.masterPoint && (
          <>
            <b>掌握情况</b>
            <Paragraph>
              <ol>
                {feedbackData?.masterPoint?.map((item) => (
                  <li key={genKey()}>
                    {item.title}: {item.desc}
                  </li>
                ))}
              </ol>
            </Paragraph>
          </>
        )}
        {feedbackData?.homeworkError && (
          <>
            <b>课后作业</b>
            <Paragraph>{feedbackData?.homeworkError} </Paragraph>
          </>
        )}
      </div>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            router.push({
              pathname: "/edit",
              query: { name: feedbackData.key },
            });
          }}
        >
          编辑
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          onClick={downloadPDF}
        />
      </Space>
    </div>
  );
};
