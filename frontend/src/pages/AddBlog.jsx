import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Select, Flex } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;
const baseUrl = process.env.REACT_APP_BASE_URL;

export default function AddBlog() {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const onFinish = async (values) => {
    try {
      const requestData = {
        createdBy: jwtDecode(localStorage.getItem("token")).user._id,
        title: values.title,
        category: values.category,
        content: values.content,
      };
      console.log(requestData);

      const response = await axios.post(
        `${baseUrl}blog/add-blog`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        clearForm();
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Failed to add Blog. Please try again.");
    }
  };

  const clearForm = () => {
    form.resetFields(); // Reset form fields
  };

  return (
    <>
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ height: "100vh" }}
      >
        <Typography.Title level={2}>Add blog</Typography.Title>

        <Form
          form={form}
          name="addBlogForm"
          onFinish={onFinish}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 32 }}
        >
          <Form.Item
            label="Blog Title"
            name="title"
            rules={[
              { required: true, message: "Please enter the blog title!" },
            ]}
          >
            <Input
              placeholder="Enter Blog Title"
              value={title}
              allowClear
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select Blog Category"
              value={category}
              onChange={(value) => setCategory(value)}
              allowClear
            >
              <Option value="Artificial Intelligence">
                Artificial Intelligence
              </Option>
              <Option value="Web Development">Web Development</Option>
              <Option value="Data Science">Data Science</Option>
              <Option value="Machine Learning">Machine Learning</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[
              {
                required: true,
                message: "Please enter blog content!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Add Blog
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={clearForm}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
}
