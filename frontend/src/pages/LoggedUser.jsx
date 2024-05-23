import { Button, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
export default function LoggedUser() {
  const navigate = useNavigate();
  return (
    <>
      <Typography.Text>Logged in User home</Typography.Text>
      <Flex justify="flex-end" style={{ marginRight: 10 }}>
        <Button type="primary" onClick={() => navigate("/add-blog")}>
          Create Post
        </Button>
      </Flex>
    </>
  );
}
