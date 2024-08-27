import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Spin,
  Typography,
  Statistic,
  Select,
  Button,
} from "antd";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const { Title } = Typography;
const { Option } = Select;

const baseUrl = process.env.REACT_APP_BASE_URL;
const formatter = (value) => <CountUp end={value} separator="," />;

export default function Dashboard() {
  const [data, setData] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalComments: 0,
    daily: [],
    monthly: [],
    yearly: [],
  });
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("daily");
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}blog/stats/${
            jwtDecode(localStorage.getItem("token")).user._id
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (value) => {
    setChartType(value);
  };

  const handleDownload = async () => {
    const input = chartRef.current;
    const pdf = new jsPDF("landscape");
    await html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10);
    });
    pdf.save("dashboard.pdf");
  };

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

  const formatChartData = (data, type) => {
    return data.map((item) => {
      let formattedItem = { ...item };
      if (type === "daily") {
        formattedItem.date = new Date(item._id).toLocaleDateString();
      } else if (type === "monthly") {
        const [year, month] = item._id.split("-");
        formattedItem.month = new Date(year, month - 1).toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        );
      } else if (type === "yearly") {
        formattedItem.year = item._id;
      }
      return formattedItem;
    });
  };

  const chartData = formatChartData(data[chartType], chartType);
  const xAxisKey =
    chartType === "daily" ? "date" : chartType === "monthly" ? "month" : "year";

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
          <Select
            defaultValue="daily"
            style={{ width: 200, marginBottom: 20 }}
            onChange={handleChange}
          >
            <Option value="daily">Daily Activity</Option>
            <Option value="monthly">Monthly Activity</Option>
            <Option value="yearly">Yearly Activity</Option>
          </Select>
          <Button
            type="primary"
            onClick={handleDownload}
            style={{ marginBottom: 20, marginLeft: 20 }}
          >
            Download Report
          </Button>
          <Card
            title={`${
              chartType.charAt(0).toUpperCase() + chartType.slice(1)
            } Activity`}
            bordered={false}
          >
            <div ref={chartRef}>
              <BarChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis>
                  <Label value="Count" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Legend wrapperStyle={{ marginBottom: 20, marginTop: 10 }} />
                <Bar dataKey="blogs" fill="#8884d8" />
                <Bar dataKey="likes" fill="#82ca9d" />
                <Bar dataKey="comments" fill="#ffc658" />
              </BarChart>
            </div>
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
