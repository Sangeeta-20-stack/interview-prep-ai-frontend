import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser}=useContext(UserContext);
  const navigate = useNavigate(); // ✅ Use the hook here

  const handleLogin = async (e) => {
    e.preventDefault();
      console.log("🔁 Login form submitted");

   if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      console.log("❌ Invalid email");

      return;
    }

    if (!password) {
      setError("Please enter the password.");
      console.log("❌ No password");
      return;
    }
    console.log("✅ Validation passed. Sending request to:", API_PATHS.AUTH.LOGIN);

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

       console.log("✅ Login success response:", response.data);
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        console.log("💾 Token saved:", token);
        updateUser(response.data)
        navigate("/dashboard"); // ✅ Correct usage
      } else {
        console.log("❌ No token received");
        setError("No token received. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <div className="grid grid-cols-1 gap-2">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="vk@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs py-2.5">{error}</p>}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-medium py-2 rounded mt-4 hover:bg-orange-600 transition"
        >
          LOGIN
        </button>

        <p className="text-[13px] text-slate-800 mt-3 text-center">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
