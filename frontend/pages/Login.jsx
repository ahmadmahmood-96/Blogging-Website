import React, { useState, useEffect } from "react";
import { Button, Form, Input, Typography, Flex, Row, Col, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}auth/login`, values);
      console.log(response.data);
      if (response.status === 200 && response.data.role === "Admin") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        message.success(response.data.message);
        setEmail("");
        setPassword("");

        // Navigate to the home page after successful login
        navigate("/home", { replace: true });
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      // Handle login errors
      if (e.response && e.response.data && e.response.data.message) {
        message.error(e.response.data.message);
      } else if (!axios.isCancel(e)) {
        message.error("Failed to log in. Please try again");
      }
    }
  };

  return <></>;
}
