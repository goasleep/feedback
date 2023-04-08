import { ProFormList, ProCard, ProForm } from "@ant-design/pro-components";
import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import AutoCompleteSearch from "./AutoCompleteSearch";

export default ({ name }) => {
  return (
    <ProFormList
      deleteIconProps={{
        Icon: CloseOutlined,
      }}
      name={name}
      copyIconProps={false}
      style={{ width: 900 }}
      creatorButtonProps={{
        creatorButtonText: "添加知识点",
      }}
      itemRender={({ action }) => (
        <ProCard
          bordered
          style={{ marginBlockEnd: 8 }}
          title={
            <ProForm.Item name="title" label="知识点">
              <AutoCompleteSearch
                component={<Input />}
                searchKey="searchKnowledge"
              />
            </ProForm.Item>
          }
          extra={action}
          bodyStyle={{ paddingBlockEnd: 0 }}
        >
          <ProForm.Item name="desc" label="描述">
            <AutoCompleteSearch
              component={<Input.TextArea showCount autoSize />}
              searchKey="searchKnowledgeDesc"
            />
          </ProForm.Item>
        </ProCard>
      )}
    ></ProFormList>
  );
};
