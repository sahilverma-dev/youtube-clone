import { Metadata } from "next";
import RegisterForm from "./components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

const Register = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Register;
