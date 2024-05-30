import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  List,
  Input,
  Form,
  message,
  Spin,
} from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}blog/get-blogs`);
        setBlogs(response.data.blogs);
      } catch (error) {
        message.error("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(`${baseUrl}blog/like-blog`, {
        blogId,
        userId: jwtDecode(localStorage.getItem("token")).user._id,
      });
      if (response.status === 200) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId ? { ...blog, likes: response.data.likes } : blog
          )
        );
      }
    } catch (error) {
      message.error("Failed to like the blog. Please try again.");
    }
  };

  const handleComment = async (blogId, comment, form) => {
    try {
      const response = await axios.post(`${baseUrl}blog/comment-blog`, {
        blogId,
        comment,
        userId: jwtDecode(localStorage.getItem("token")).user._id,
      });
      if (response.status === 200) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId
              ? { ...blog, comments: response.data.comments }
              : blog
          )
        );
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
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={blogs}
          renderItem={(blog) => (
            <List.Item>
              <Card
                hoverable
                title={blog.title}
                cover={<img alt="blog cover" src={blog.image} />}
              >
                <Text>Category: </Text>
                <Text strong>{blog.category}</Text>
                <br />
                <Text>By: </Text>
                <Text strong>{blog.createdBy.name}</Text>
                <br />
                <Text>{blog.content}</Text>
                <div style={{ marginTop: 10 }}>
                  <Button
                    size="large"
                    type="text"
                    style={{ fontSize: 18 }}
                    icon={
                      blog.likes.includes(
                        jwtDecode(localStorage.getItem("token")).user._id
                      ) ? (
                        <LikeFilled style={{ color: "red", fontSize: 22 }} />
                      ) : (
                        <LikeOutlined style={{ fontSize: 22 }} />
                      )
                    }
                    onClick={() => handleLike(blog._id)}
                  >
                    {blog.likes.length}
                  </Button>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Title level={5}>Comments</Title>
                  {blog.comments.map((comment) => (
                    <div key={comment._id} style={{ marginBottom: 7 }}>
                      <Text strong>{comment.user.name}:</Text> {comment.comment}
                    </div>
                  ))}
                  <Form
                    form={blog.form}
                    onFinish={(values) =>
                      handleComment(blog._id, values.comment, blog.form)
                    }
                  >
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
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
}
