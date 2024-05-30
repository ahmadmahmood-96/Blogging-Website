import React, { useState } from "react";
import { Typography } from "antd";
import SiderComponent from "../components/SiderComponent";
import HeaderComponent from "../components/HeaderComponent";
import { Layout } from "antd";
import LoggedUserRoutes from "../routes/LoggedUserRoutes";
import Blogs from "./Blogs";
const { Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Return true if token exists
  };
  return isAuthenticated() ? (
    <>
      <Layout style={layoutStyle}>
        <HeaderComponent collapsed={collapsed} handleToggle={handleToggle} />
        <Layout>
          <Sider
            width="230px"
            style={siderStyle}
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            breakpoint="md"
            onBreakpoint={() => {
              setCollapsed(!collapsed);
            }}
          >
            <SiderComponent />
          </Sider>
          <Content style={contentStyle}>
            <LoggedUserRoutes />
          </Content>
        </Layout>
      </Layout>
    </>
  ) : (
    <>
      <Typography.Text>Not Logged in User</Typography.Text>
      <Blogs />
    </>
  );
}

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  minHeight: "100vh", // Set the minimum height of the layout to fill the screen
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#DDF2FD",
  // height: "calc(100vh - 110px)", // Remove fixed height
  height: "inherit", // Set the height to 100% to fill the container
};

const contentStyle = {
  backgroundColor: "#f7f7f7",
  padding: 10,
  height: "100%", // Set the height to 100% to fill the container
};
