import { Result, Button } from "antd";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/login">Go back to Login</Link>
          </Button>
        }
      />
    </>
  );
}
