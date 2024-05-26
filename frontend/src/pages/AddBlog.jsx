import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Select,
  Upload,
  Radio,
} from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const baseUrl = process.env.REACT_APP_BASE_URL;

export default function AddBlog() {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [isPublic, setIsPublic] = useState(true); // New state for public/private

  const onFinish = async (values) => {
    if (!blogImage) {
      message.error("Please upload an image!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(blogImage);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      const requestData = {
        createdBy: jwtDecode(localStorage.getItem("token")).user._id,
        title: values.title,
        category: values.category,
        content: values.content,
        image: base64Image,
        public: isPublic, // Include the public state in the request data
      };

      try {
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
          setBlogImage(null);
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Failed to add Blog. Please try again.");
      }
    };
  };

  const beforeUpload = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPG, JPEG, or PNG files!");
      return Upload.LIST_IGNORE;
    }

    setBlogImage(file);
    return false; // Prevent the upload from automatically occurring
  };

  const clearForm = () => {
    form.resetFields(); // Reset form fields
    setBlogImage(null); // Clear the blogImage state
    setIsPublic(true); // Reset the public/private state
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
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

          <Form.Item
            label="Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            extra="Please upload an image for the blog"
            rules={[
              {
                required: true,
                message: "Please upload an image for the blog",
              },
            ]}
          >
            <Upload
              name="image"
              listType="picture"
              accept=".png, .jpeg, .jpg"
              beforeUpload={beforeUpload}
              onRemove={() => setBlogImage(null)}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Visibility"
            name="visibility"
            rules={[
              {
                required: true,
                message: "Please select the visibility of the blog",
              },
            ]}
          >
            <Radio.Group
              onChange={(e) => setIsPublic(e.target.value)}
              value={isPublic}
            >
              <Radio value={true}>Public</Radio>
              <Radio value={false}>Private</Radio>
            </Radio.Group>
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
      </div>
    </>
  );
}
