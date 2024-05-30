import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  EyeOutlined,
  EditOutlined,
  BarChartOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const SiderComponent = () => {
  const navigate = useNavigate();

  const onClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear();
      navigate("/login");
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
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: <BarChartOutlined />,
  },
  { key: "/", label: "See All Blogs", icon: <EyeOutlined /> },
  {
    key: "/edit-blog",
    label: "Edit My Blogs",
    icon: <EditOutlined />,
  },
  {
    key: "/add-blog",
    label: "Add Blog",
    icon: <PlusCircleOutlined />,
  },
  { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
];

export default SiderComponent;
