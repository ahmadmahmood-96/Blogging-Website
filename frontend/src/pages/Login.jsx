import React, { useState, useEffect } from "react";
import { Button, Flex, Form, Input, Typography, message, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (localStorage.getItem("token")) navigate("/home");
  // });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(!(email && password));
  }, [email, password]);

  const onFinish = async (values) => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(`${baseUrl}auth/login`, values);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        message.success(response.data.message);
        setEmail("");
        setPassword("");

        // Navigate to the home page after successful login
        navigate("/");
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
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (rule, value) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address");
    }
    return Promise.resolve();
  };

  return (
    <Flex vertical justify="center" align="center" style={{ height: "100vh" }}>
      <Typography.Title level={2}>
        Welcome to Our Blogging Website
      </Typography.Title>
      <Card bordered={false} style={{ backgroundColor: "#f7f7f7", width: 500 }}>
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            width: "100%",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                validator: validateEmail,
              },
            ]}
          >
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 10,
              span: 16,
            }}
            style={{ paddingTop: 20 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              disabled={isButtonDisabled}
              loading={isLoading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}
