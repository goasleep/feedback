import { Select } from "antd";
import { useState } from "react";
import { useGetFeedbackKeys } from "../hook/useGetFeedback";
import ShowText from "./showText";
import { useRouter } from "next/router";
import {
  ProForm,
  ProFormDatePicker,
  ProFormTimePicker,
} from "@ant-design/pro-components";
export default (props) => {
  const { query } = useRouter();
  const options = useGetFeedbackKeys();
  const [selectKey, setSelectKey] = useState(query.name);
  return (
    <>
      <ProForm
        onFinish={async (values) => {
          const value = `${values.name}_${values.date}_${values.timeRange}`;
          setSelectKey(value);
        }}
        submitter={{ searchConfig: { submitText: "搜索" } }}
        initialValues={{ name: query.name }}
        layout="horizontal"
      >
        <ProForm.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="学生姓名"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={options}
            style={{ width: 500 }}
          />
        </ProForm.Item>
        <ProFormDatePicker
          name="date"
          label="上课日期"
          rules={[{ required: true }]}
        />
        <ProFormTimePicker
          name="timeRange"
          label="上课时间"
          rules={[{ required: true }]}
          fieldProps={{
            format: "HH:mm:00",
          }}
        />
      </ProForm>
      {selectKey && <ShowText name={selectKey}></ShowText>}
    </>
  );
};
