import { Typography } from "antd";
import LoggedUser from "./LoggedUser";

export default function Home() {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Return true if token exists
  };
  return isAuthenticated() ? (
    <>
      <LoggedUser />
    </>
  ) : (
    <>
      <Typography.Text>Not Logged in User</Typography.Text>
    </>
  );
}
