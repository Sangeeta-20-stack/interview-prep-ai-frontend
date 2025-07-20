import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-black">{label}</label>

      <div className="relative w-full">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400 bg-gray-50"
          value={value}
          onChange={onChange}
        />

        {type === "password" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
            {showPassword ? (
              <FaRegEye size={18} className="text-black" onClick={toggleShowPassword} />
            ) : (
              <FaRegEyeSlash size={18} className="text-gray-400" onClick={toggleShowPassword} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
