import React, { useEffect, useState } from "react";
import { Space, Typography, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const HeaderComponent = ({ collapsed, handleToggle }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      if (decodedToken && decodedToken.user && decodedToken.user.name) {
        setName(decodedToken.user.name);
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header style={headerStyle}>
      <Space size="large">
        <Tooltip title="Click to toggle the Sidebar" color="black">
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 26, color: "#fbfbfb" }}
              onClick={handleToggle}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 26, color: "#fbfbfb" }}
              onClick={handleToggle}
            />
          )}
        </Tooltip>
        <Typography.Text
          style={{ fontSize: 20, color: "#fbfbfb", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Blogging Website
        </Typography.Text>
      </Space>
      <Space size="large">
        {name ? (
          <Typography.Text
            style={{ fontSize: 17, fontWeight: "normal", color: "#fbfbfb" }}
          >
            {name}
          </Typography.Text>
        ) : (
          <Typography.Text
            type="primary"
            onClick={handleLogin}
            style={{ cursor: "pointer", color: "white", fontSize: 22 }}
          >
            <LoginOutlined style={{ marginRight: 8 }} />
            Login
          </Typography.Text>
        )}
      </Space>
    </header>
  );
};

const headerStyle = {
  color: "#fff",
  height: 55,
  backgroundColor: "#164863",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

export default HeaderComponent;
