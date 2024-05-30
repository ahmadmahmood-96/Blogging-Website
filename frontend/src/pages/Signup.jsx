import React, { useState, useEffect } from "react";
import { Button, Flex, Form, Input, Typography, message, Card } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    setIsButtonDisabled(!(name && email && password && phoneNumber));
  }, [name, email, password, phoneNumber]);

  const onFinish = async (values) => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(`${baseUrl}auth/signup`, values);
      if (response.status === 200) {
        message.success(response.data.message);
        // After successful signup, navigate to the login page
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      // Handle signup errors
      if (e.response && e.response.data && e.response.data.message) {
        message.error(e.response.data.message);
      } else {
        message.error("Failed to sign up. Please try again");
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

  const validatePassword = (rule, value) => {
    // Password length validation
    if (value.length < 6) {
      return Promise.reject("Password must be at least 6 characters long");
    }
    return Promise.resolve();
  };

  return (
    <Flex vertical justify="center" align="center" style={{ height: "100vh" }}>
      <Typography.Title level={2}>Sign Up</Typography.Title>
      <Card bordered={false} style={{ backgroundColor: "#f7f7f7", width: 500 }}>
        <Form
          name="signup"
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

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
              {
                validator: validatePassword,
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
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
}
