import React from "react";
import logo from "../Imgs/DEPIlogoProject.svg";

const Loading = ({ message = "Loading...", fullScreen = false }) => {
  const containerClasses = fullScreen
    ? "min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4"
    : "flex items-center justify-center py-12 px-4";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Rotating Logo Spinner */}
        <div className="mb-6 flex justify-center">
          <img
            src={logo}
            alt="Loading"
            className="h-20 w-20 animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {message}
        </p>

        {/* Decorative dots */}
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;

