import { Typography, Rate, Button, Table, message } from "antd";
import React, { useRef, useState } from "react";
import { useGetFeedback } from "../hook/useGetFeedback";
import { genKey } from "../util";
import { ipcRenderer } from "electron";
import path from "path";
import os from "os";
import { DownloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { Title, Paragraph } = Typography;

const progressStatusMap = [
  "注意力集中",
  "偶尔走神",
  "注意力不够集中",
  "紧跟老师思路",
  "思维活跃",
  "积极互动",
];

const columns = [
  {
    title: "知识点",
    dataIndex: "title",
    width: "25%",
  },
  {
    title: "描述",
    dataIndex: "decs",
    width: "65%",
  },
];

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
          {feedbackData?.name} 家长您好。以下是{feedbackData?.date}
          {feedbackData?.timeRange[0]}-{feedbackData?.timeRange[1]}
          化学课程的反馈
        </Paragraph>
        <Title level={2}>课堂名称：{feedbackData?.classname}</Title>
        <Title level={3}>上周作业完成情况: </Title>
        <Paragraph>正确率：{feedbackData?.beforeAccuracy} %</Paragraph>
        <Paragraph>
          错误知识点
          <ol>
            {feedbackData?.errorPoint?.map((item) => (
              <li key={genKey()}>
                {item.title}: {item.decs}
              </li>
            ))}
          </ol>
        </Paragraph>

        <Title level={3}>上课状态:</Title>
        <Paragraph>
          <ul>
            {feedbackData?.progressStatus?.map((item) => (
              <li key={genKey()}>{progressStatusMap[parseInt(item) - 1]}</li>
            ))}
          </ul>
        </Paragraph>
        <Paragraph>{progressStatusMap[feedbackData?.progressStatus]}</Paragraph>
        <Paragraph>评分： {feedbackData?.progressRate}分，总分5分</Paragraph>

        <Title level={3}> 掌握情况</Title>
        <Paragraph>
          <ol>
            {feedbackData?.masterPoint?.map((item) => (
              <li key={genKey()}>
                {item.title}: {item.decs}
              </li>
            ))}
          </ol>
        </Paragraph>
        {/* <Title level={5}> 掌握情况</Title>
        <Paragraph>
          <Table
            dataSource={feedbackData?.masterPoint}
            columns={columns}
            pagination={false}
          />
        </Paragraph> */}
        <Title level={3}> 课后作业</Title>
        <Paragraph>{feedbackData?.homeworkError} </Paragraph>
      </div>

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
    </div>
  );
};
