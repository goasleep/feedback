import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Layout,
  Form,
  Select,
  InputNumber,
  Menu,
  DatePicker,
  Switch,
  Slider,
  Button,
} from "antd";
import { ipcRenderer } from "electron";

const { Header, Content, Sider } = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

function Home() {
  const onClick = async () => {
    const c = await ipcRenderer.invoke("create", { content: 1 });
  };
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-javascript-ant-design)</title>
      </Head>
      <Content style={{ padding: 48 }}>
        <Form layout="horizontal">
          <FormItem
            label="Switch"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Switch defaultChecked />
          </FormItem>

          <FormItem
            label="Slider"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Slider defaultValue={70} />
          </FormItem>

          <FormItem
            label="Select"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Select size="large" defaultValue="lucy" style={{ width: 192 }}>
              <Option value="jack">jack</Option>
              <Option value="lucy">lucy</Option>
              <Option value="disabled" disabled>
                disabled
              </Option>
              <Option value="yiminghe">yiminghe</Option>
            </Select>
          </FormItem>

          <FormItem
            label="DatePicker"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <DatePicker name="startDate" />
          </FormItem>
          <FormItem
            style={{ marginTop: 48 }}
            wrapperCol={{ span: 8, offset: 8 }}
          >
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              // onClick={onClick}
              onClick={onClick}
            >
              OK
            </Button>
            <Button size="large" style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </FormItem>
        </Form>
      </Content>
    </React.Fragment>
  );
}

export default Home;
