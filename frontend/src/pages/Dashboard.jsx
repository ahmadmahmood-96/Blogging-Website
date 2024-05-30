import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Typography, Statistic } from "antd";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const { Title } = Typography;
const baseUrl = process.env.REACT_APP_BASE_URL;
const formatter = (value) => <CountUp end={value} separator="," />;

export default function Dashboard() {
  const [data, setData] = useState({
    totalBlogs: 10,
    totalLikes: 0,
    totalComments: 0,
    daily: [],
    monthly: [],
    yearly: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}blog/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
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
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Blogs" bordered={false}>
            <Statistic
              value={data.totalBlogs}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Likes" bordered={false}>
            <Statistic
              value={data.totalLikes}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Comments" bordered={false}>
            <Statistic
              value={data.totalComments}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Daily Activity" bordered={false}>
            <BarChart width={600} height={300} data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="blogs" fill="#8884d8" />
              <Bar dataKey="likes" fill="#82ca9d" />
              <Bar dataKey="comments" fill="#ffc658" />
            </BarChart>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Monthly Activity" bordered={false}>
            <BarChart width={600} height={300} data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="blogs" fill="#8884d8" />
              <Bar dataKey="likes" fill="#82ca9d" />
              <Bar dataKey="comments" fill="#ffc658" />
            </BarChart>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Yearly Activity" bordered={false}>
            <BarChart width={600} height={300} data={data.yearly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="blogs" fill="#8884d8" />
              <Bar dataKey="likes" fill="#82ca9d" />
              <Bar dataKey="comments" fill="#ffc658" />
            </BarChart>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const styles = {
  color: "#50ab00",
  fontSize: 30,
};
