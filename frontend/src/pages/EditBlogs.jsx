import React, { useState, useEffect } from "react";
import {
  Input,
  InputNumber,
  Modal,
  Table,
  Typography,
  message,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function EditBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [editedBlogId, setEditedBlogId] = useState("");
  const [editedTitle, setEditedTitle] = useState(null);
  const [editedCategory, setEditedCategory] = useState(null);
  const [editedContent, setEditedContent] = useState(null);
  const [record, setRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}blog/get-all-blogs/${
            jwtDecode(localStorage.getItem("token")).user._id
          }`
        );
        setBlogs(response.data.blogs);
      } catch (error) {
        message.error("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const columns = [
    {
      key: 1,
      title: "Title",
      dataIndex: "title",
    },
    {
      key: 2,
      title: "Category",
      dataIndex: "category",
    },
    {
      key: 3,
      title: "Content",
      dataIndex: "content",
      render: (text) => (
        <div
          style={{
            maxWidth: 200,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      key: 4,
      title: "Views",
      dataIndex: "views",
    },
    {
      key: 5,
      title: "Likes",
      dataIndex: "likes",
      render: (likes) => likes.length,
    },
    {
      key: 6,
      title: "Comments",
      dataIndex: "comments",
      render: (comments) => comments.length,
    },
    {
      key: 7,
      title: "Visibility",
      dataIndex: "public",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "green" : "blue"} style={{ fontSize: 14 }}>
          {isBlocked ? "Public" : "Private"}
        </Tag>
      ),
      filters: [
        { text: "Public", value: true },
        { text: "Private", value: false },
      ],
      onFilter: (value, record) => record.public === value,
    },
    {
      key: 8,
      title: "Date Created",
      dataIndex: "createdAt",
      render: (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleString(); // Convert date to a human-readable format
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      key: 9,
      title: "Actions",
      width: 150,
      render: (record) => {
        return (
          <>
            {record.public ? (
              <Tooltip title="Click to Hide blog for public">
                <EyeInvisibleOutlined
                  onClick={() => onHide(record)}
                  style={{
                    color: "red",
                    fontSize: 20,
                    marginRight: 25,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Click to Un-hide blog for public">
                <EyeOutlined
                  onClick={() => onUnHide(record)}
                  style={{
                    color: "green",
                    fontSize: 20,
                    marginRight: 25,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}
            <EditOutlined
              onClick={() => onEdit(record)}
              style={{
                color: "#164863",
                fontSize: 20,
                marginRight: 25,
                cursor: "pointer",
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(record)}
              style={{ color: "red", fontSize: 20, cursor: "pointer" }}
            />
          </>
        );
      },
    },
  ];

  const onUnHide = async (record) => {
    try {
      const response = await axios.put(
        `${baseUrl}blog/unhide-blog/${record._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Update the blog's public status in the state
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === record._id ? { ...blog, public: true } : blog
          )
        );
      } else {
        console.log(response);
        message.error("Failed to unhide blog");
      }
    } catch (error) {
      message.error("Error unhiding blog");
    }
  };

  const onHide = async (record) => {
    try {
      const response = await axios.put(
        `${baseUrl}blog/hide-blog/${record._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Update the blog's public status in the state
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === record._id ? { ...blog, public: false } : blog
          )
        );
      } else {
        message.error("Failed to hide blog");
      }
    } catch (error) {
      message.error("Error hiding blog");
    }
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this blog?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await axios
          .delete(`${baseUrl}blog/delete-blog/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the insurance list after deletion
              setBlogs(blogs.filter((blog) => blog._id !== record._id));
            } else {
              message.error("Failed to delete blog");
            }
          })
          .catch((error) => {
            message.error("Error deleting blog");
          });
      },
    });
  };

  const onEdit = (record) => {
    setShowEditModal(true);
    setRecord(record);
    setEditedBlogId(record._id);
    setEditedTitle(record.title);
    setEditedCategory(record.category);
    setEditedContent(record.content);
  };

  const handleEditRecords = async () => {
    if (!editedTitle || !editedCategory || !editedContent) {
      message.error("Please fill all the fields");
      return;
    }
    const data = {
      title: editedTitle,
      category: editedCategory,
      content: editedContent,
    };

    const initialData = {
      title: record.title,
      category: record.category,
      content: record.content,
    };

    const dataChanged = Object.keys(data).some(
      (key) => data[key] !== initialData[key]
    );

    if (!dataChanged) {
      message.warning("No changes made. Nothing to update.");
      setShowEditModal(false);
      return;
    }

    try {
      const response = await axios.put(
        `${baseUrl}blog/edit-blog/${editedBlogId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === editedBlogId ? { ...blog, ...data } : blog
          )
        );
        message.success(response.data.message);
        setShowEditModal(false);
      }
    } catch (error) {
      message.error("Error Updating Insurance");
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
        <>
          <Typography.Title level={2}>Blogs Details</Typography.Title>
          <Table
            columns={columns}
            dataSource={blogs}
            scroll={{ x: 768 }}
            pagination={{ pageSize: 7 }}
          />
        </>
      )}
      <Modal
        title="Edit Blog"
        open={showEditModal}
        okText="Save"
        onOk={handleEditRecords}
        onCancel={() => setShowEditModal(false)}
      >
        <Typography.Text>Blog Title:</Typography.Text>
        <Input
          value={editedTitle}
          placeholder="Enter Blog Title"
          onChange={(e) => setEditedTitle(e.target.value)}
          style={{ marginBottom: 15 }}
        />
        <Typography.Text>Blog Category:</Typography.Text>
        <InputNumber
          value={editedCategory}
          placeholder="Enter Insurance Price"
          onChange={(value) => setEditedCategory(value)}
          style={{ width: "100%", marginBottom: 15 }}
        />
        <Typography.Text>Blog Content:</Typography.Text>
        <Input
          value={editedContent}
          placeholder="Enter Insurance Description"
          onChange={(e) => setEditedContent(e.target.value)}
          style={{ marginBottom: 15 }}
        />
      </Modal>
    </>
  );
}
