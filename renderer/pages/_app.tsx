import type { AppProps } from "next/app";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/router";
import {
  FundProjectionScreenOutlined,
  SendOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { ArrowLeftOutlined } from "@ant-design/icons";

import React from "react";
const { Sider, Content, Header } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const items = [
    {
      key: 1,
      label: "查询",
      path: "/home",
      icon: <FundProjectionScreenOutlined />,
    },
    {
      key: 2,
      label: "新建",
      path: "/new",
      icon: <SendOutlined />,
    },
    {
      key: 3,
      label: "全部",
      path: "/list",
      icon: <UnorderedListOutlined />,
    },
  ];
  const switchMenu = ({ item }) => {
    router.push(item.props.path);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider theme="light" collapsible>
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={switchMenu}
        />
      </Sider>

      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer, height: 50 }}
        >
          <ArrowLeftOutlined
            onClick={() => router.back()}
            style={{
              fontSize: 24,
              paddingTop: 0,
              paddingLeft: 10,
            }}
          />
        </Header>
        <Content
          style={{
            overflow: "auto",
            scrollbarWidth: "none",
            paddingLeft: 20,
            paddingTop: 20,
          }}
        >
          <React.Fragment>
            <Component {...pageProps} />
          </React.Fragment>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MyApp;
