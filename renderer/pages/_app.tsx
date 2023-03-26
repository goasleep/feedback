import React from "react";
import type { AppProps } from "next/app";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { FundProjectionScreenOutlined, SendOutlined } from "@ant-design/icons";
const { Sider, Content } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const items = [
    {
      key: 1,
      label: "列表",
      path: "/feedbackList",
      icon: <FundProjectionScreenOutlined />,
    },
    {
      key: 2,
      label: "新建",
      path: "/new",
      icon: <SendOutlined />,
    },
  ];
  const switchMenu = ({ item }) => {
    router.push(item.props.path);
  };
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
        <Content style={{ overflow: "auto", scrollbarWidth: "none" }}>
          <React.Fragment>
            <Component {...pageProps} />
          </React.Fragment>
        </Content>
      </Layout>
    </Layout>
    // </div>
  );
}

export default MyApp;
