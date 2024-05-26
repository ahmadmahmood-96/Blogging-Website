import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  HomeOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";

const SiderComponent = () => {
  const navigate = useNavigate();

  const onClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear();
      navigate("/");
    } else {
      navigate(key);
    }
  };

  return (
    <Menu
      onClick={onClick}
      style={{
        width: "100%",
        backgroundColor: "#DDF2FD",
      }}
      selectedKeys={[window.location.pathname]}
      mode="inline"
      items={items}
    />
  );
};

const items = [
  { key: "/blogs", label: "See All Blogs", icon: <HomeOutlined /> },
  {
    key: "/home/user-details",
    label: "See My Blogs",
    icon: <EyeOutlined />,
  },
  {
    key: "/home/order-details",
    label: "Dashboard",
    icon: <EditOutlined />,
  },
  { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
];

export default SiderComponent;
