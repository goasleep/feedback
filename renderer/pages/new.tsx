import type { ProColumns } from "@ant-design/pro-components";
import {
  EditableProTable,
  ProForm,
  ProFormText,
  ProFormRate,
  ProFormGroup,
  ProFormSelect,
  ProFormDigit,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Input, message, Select } from "antd";
import React, { useState } from "react";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: "知识点一",
    decs: "",
    state: "open",
    created_at: "1590486176000",
  },
];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: "知识点",
    dataIndex: "title",
    width: "25%",
  },
  {
    title: "描述",
    dataIndex: "decs",
    width: "65%",
    renderFormItem: (_, { record }) => {
      return <Input addonBefore={(record as any)?.addonBefore} />;
    },
  },
  {
    title: "操作",
    valueType: "option",
  },
];

const options = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id)
  );
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <ProForm<{
      name: string;
      company: string;
    }>
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success("提交成功");
      }}
      initialValues={{
        useMode: "1",
      }}
      layout="horizontal"
    >
      <ProForm.Group title="基本信息">
        <ProFormText
          width="md"
          name="name"
          label="学生姓名"
          placeholder="请输入姓名"
        />
        <ProFormText width="sm" name="classname" label="课堂名称" />
      </ProForm.Group>

      <ProFormGroup title="上周作业完成情况">
        <ProFormDigit
          label="正确率"
          name="accuracy"
          fieldProps={{
            min: 0,
            max: 100,
            defaultValue: 0,
            formatter: (value) => `${value}%`,
            parser: (value) => value!.replace("%", ""),
          }}
        />

        <ProForm.Item label="错误知识点" name="error">
          <Select
            mode="tags"
            style={{ width: 500 }}
            placeholder="Tags Mode"
            onChange={handleChange}
            options={options}
          />
        </ProForm.Item>
      </ProFormGroup>
      <ProFormGroup title="上课状态">
        <ProFormRate name="rate" />
        <ProFormSelect
          width="md"
          request={async () => [
            { label: "注意力集中", value: "1" },
            { label: "偶尔走神", value: "2" },
            { label: "注意力不够集中", value: "3" },
            { label: "紧跟老师思路", value: "4" },
            { label: "思维活跃", value: "5" },
            { label: "积极互动", value: "6" },
          ]}
          name="useMode"
        />
      </ProFormGroup>
      <ProFormGroup title="掌握情况">
        <ProForm.Item
          name="dataSource"
          initialValue={defaultData}
          trigger="onValuesChange"
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: "dataSource",
              record: () => ({
                id: Date.now(),
              }),
            }}
            editable={{
              type: "multiple",
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
      </ProFormGroup>

      <ProFormGroup title="做题情况">
        <ProFormDigit
          label="正确率"
          name="accuracy"
          fieldProps={{
            min: 0,
            max: 100,
            defaultValue: 0,
            formatter: (value) => `${value}%`,
            parser: (value) => value!.replace("%", ""),
          }}
        />
        <ProFormSelect
          width="md"
          request={async () => [
            { label: "做题认真", value: "1" },
            { label: "粗心大意", value: "2" },
          ]}
          name="useMode"
        />
      </ProFormGroup>
      <ProFormGroup title="课后作业">
        <ProFormTextArea width="xl" label="课后作业" name="error" />
      </ProFormGroup>
    </ProForm>
  );
};
