import {
  ProForm,
  ProFormText,
  ProFormRate,
  ProFormGroup,
  ProFormSelect,
  ProFormDigit,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormTimePicker,
} from "@ant-design/pro-components";
import { Input, message, Space } from "antd";
import { ipcRenderer } from "electron";
import React from "react";
import { useRouter } from "next/router";
import KnowledgePointList from "../components/KnowledgePointList";
import AutoCompleteSearch from "../components/AutoCompleteSearch";

export default () => {
  const router = useRouter();
  const { query } = router;

  return (
    <ProForm
      onFinish={async (values) => {
        console.log(values);
        const key = `${values.name}_${values.date}_${values.timeRange[0]}`;
        const data = await ipcRenderer.invoke("createFeedback", {
          key,
          ...values,
        });
        if (data) {
          message.success("提交成功");
          router.push({
            pathname: "/home",
            query: { name: key },
          });
        }
      }}
      initialValues={{}}
      layout="horizontal"
    >
      <ProForm.Group title="基本信息">
        <ProFormText
          width="md"
          name="name"
          label="学生姓名"
          placeholder="请输入姓名"
          rules={[{ required: true }]}
        />
        <ProForm.Item
          name="classname"
          label="课堂名称"
          width="xl"
          rules={[{ required: true }]}
          style={{ width: "300px" }}
        >
          <AutoCompleteSearch component={<Input />} searchKey="searchClass" />
        </ProForm.Item>
        <Space>
          <ProFormDatePicker
            name="date"
            label="日期"
            rules={[{ required: true }]}
          />
          <ProFormTimePicker.RangePicker
            name="timeRange"
            format={"HH:mm"}
            rules={[{ required: true }]}
          />
        </Space>
      </ProForm.Group>

      <ProFormGroup title="上周作业完成情况">
        <ProFormDigit
          label="正确率"
          name="beforeAccuracy"
          fieldProps={{
            min: 0,
            max: 100,
            defaultValue: 0,
            formatter: (value) => `${value}%`,
            parser: (value) => value?.replace("%", ""),
          }}
        />
        <KnowledgePointList name="errorPoint" />
      </ProFormGroup>
      <ProFormGroup title="课前小测">
        <ProFormDigit
          label="正确率"
          name="beforeClassAccuracy"
          fieldProps={{
            min: 0,
            max: 100,
            defaultValue: 0,
            formatter: (value) => `${value}%`,
            parser: (value) => value?.replace("%", ""),
          }}
        />
        <KnowledgePointList name="beforeClassPoint" />
      </ProFormGroup>
      <ProFormGroup title="上课状态">
        <ProFormRate name="progressRate" />
        <ProFormSelect
          width="md"
          mode="multiple"
          request={async () => [
            { label: "注意力集中", value: "1" },
            { label: "偶尔走神", value: "2" },
            { label: "注意力不够集中", value: "3" },
            { label: "紧跟老师思路", value: "4" },
            { label: "思维活跃", value: "5" },
            { label: "积极互动", value: "6" },
          ]}
          name="progressStatus"
        />
      </ProFormGroup>
      <ProFormGroup title="掌握情况">
        <KnowledgePointList name="masterPoint" />
      </ProFormGroup>
      <ProFormGroup title="课后作业">
        <ProFormTextArea width="xl" label="课后作业" name="homeworkError" />
      </ProFormGroup>
    </ProForm>
  );
};
