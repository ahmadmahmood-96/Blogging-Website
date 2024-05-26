import React, { useEffect, useState } from "react";
import { Button, Typography, Card, List, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [commentForm] = Form.useForm();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}blog/get-blogs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBlogs(response.data.blogs);
        console.log(response.data.blogs);
      } catch (error) {
        message.error("Failed to fetch blogs. Please try again.");
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(
        `${baseUrl}blog/like-blog`,
        { blogId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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

  const handleComment = async (blogId, comment) => {
    try {
      const response = await axios.post(
        `${baseUrl}blog/comment-blog`,
        { blogId, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId
              ? { ...blog, comments: response.data.comments }
              : blog
          )
        );
        commentForm.resetFields();
      }
    } catch (error) {
      message.error("Failed to comment on the blog. Please try again.");
    }
  };

  return (
    <>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={blogs}
        renderItem={(blog) => (
          <List.Item>
            <Card
              title={blog.title}
              cover={<img alt="blog cover" src={blog.image} />}
              actions={[
                <Button onClick={() => handleLike(blog._id)}>
                  Like ({blog.likes.length})
                </Button>,
              ]}
            >
              <Text>Category: {blog.category}</Text>
              <br />
              <Text>By: {blog.createdBy.name}</Text>
              <br />
              <Text>{blog.content}</Text>
              <div style={{ marginTop: 20 }}>
                <Title level={5}>Comments</Title>
                {blog.comments.map((comment) => (
                  <div key={comment._id}>
                    <Text strong>{comment.user.name}:</Text> {comment.comment}
                  </div>
                ))}
                <Form
                  form={commentForm}
                  onFinish={(values) => handleComment(blog._id, values.comment)}
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
    </>
  );
}
