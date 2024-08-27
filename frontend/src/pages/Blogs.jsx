import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Input, message, Spin, Row, Col, Select } from "antd";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}blog/get-blogs`);
        setBlogs(response.data.blogs);
        setFilteredBlogs(response.data.blogs);
      } catch (error) {
        message.error("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory]);

  const filterBlogs = () => {
    let filtered = blogs;
    if (searchTerm) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }
    setFilteredBlogs(filtered);
  };

  const handleClickBlog = async (blogId) => {
    const response = await axios.put(`${baseUrl}blog/view-blog/${blogId}`);
    if (response.data.success) navigate(`/${blogId}`);
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
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={18}>
              <Input
                allowClear
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16, width: "100%" }}
                suffix={<SearchOutlined />}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Filter by category"
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                style={{ width: "100%" }}
              >
                <Option value="">All Categories</Option>
                {Array.from(new Set(blogs.map((blog) => blog.category))).map(
                  (category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  )
                )}
              </Select>
            </Col>
          </Row>
          <Row gutter={16}>
            {filteredBlogs.map((blog) => (
              <Col span={6} key={blog._id} style={{ marginBottom: 16 }}>
                <Card
                  hoverable
                  cover={<img alt="blog cover" src={blog.image} height={200} />}
                  onClick={() => handleClickBlog(blog._id)}
                  key={blog._id}
                >
                  <Card.Meta
                    title={blog.title}
                    description={blog.createdBy.name}
                  />
                  <div style={{ marginTop: 10 }}>
                    <Text>Category: </Text>
                    <Text strong>{blog.category}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}
