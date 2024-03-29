import { Metadata } from "next";
import LoginForm from "./components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
