import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Spin,
  message,
  Card,
  Row,
  Col,
  Avatar,
  List,
  Button,
  Form,
  Input,
  Divider,
} from "antd";
import axios from "axios";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const { Title, Text } = Typography;
const { TextArea } = Input;

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function BlogDetail() {
  const params = useParams();
  const blogId = params.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${baseUrl}blog/get-blog/${blogId}`);
        setBlog(response.data.blog);
      } catch (error) {
        message.error("Failed to fetch blog details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`${baseUrl}blog/like-blog`, {
        blogId,
        userId: jwtDecode(localStorage.getItem("token")).user._id,
      });
      if (response.status === 200) {
        setBlog((prevBlog) => ({
          ...prevBlog,
          likes: response.data.likes,
        }));
      }
    } catch (error) {
      message.error("Failed to like the blog. Please try again.");
    }
  };

  const handleComment = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}blog/comment-blog`, {
        blogId,
        comment: values.comment,
        userId: jwtDecode(localStorage.getItem("token")).user._id,
      });
      if (response.status === 200) {
        setBlog((prevBlog) => ({
          ...prevBlog,
          comments: response.data.comments,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Card style={{ margin: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={2}>{blog.title}</Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Avatar size="large" style={{ marginRight: 8 }}>
                  {blog.createdBy.name[0]}
                </Avatar>
                <div>
                  <Text>By: {blog.createdBy.name}</Text>
                  <br />
                  <Text type="secondary">Category: {blog.category}</Text>
                </div>
              </div>
            </Col>
            <Col span={24}>
              <img
                src={blog.image}
                alt="Blog cover"
                style={{ width: "100%", height: "auto" }}
              />
            </Col>
            <Col span={24}>
              <Title level={4}>Content</Title>
              <Text>{blog.content}</Text>
            </Col>
            <Col span={24}>
              <div style={{ marginTop: 10 }}>
                <Button
                  size="large"
                  type="text"
                  style={{ fontSize: 18 }}
                  icon={
                    blog.likes.includes(
                      jwtDecode(localStorage.getItem("token")).user._id
                    ) ? (
                      <LikeFilled style={{ color: "#006eec", fontSize: 22 }} />
                    ) : (
                      <LikeOutlined style={{ fontSize: 22 }} />
                    )
                  }
                  onClick={handleLike}
                >
                  {blog.likes.length}
                </Button>
              </div>
            </Col>
            <Col span={24}>
              <Title level={4}>Comments</Title>
              <List
                dataSource={blog.comments}
                renderItem={(item) => (
                  <>
                    <li key={item._id} style={{ marginBottom: 7 }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar style={{ marginRight: 8 }}>
                          {item.user.name[0]}
                        </Avatar>
                        <div>
                          <Text strong>{item.user.name}</Text>
                          <br />
                          <Text>{item.comment}</Text>
                        </div>
                      </div>
                    </li>
                    <Divider />
                  </>
                )}
              />
              <Form onFinish={handleComment}>
                <Form.Item
                  name="comment"
                  rules={[
                    { required: true, message: "Please enter a comment" },
                  ]}
                >
                  <TextArea rows={2} placeholder="Add a comment" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Comment
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
}
