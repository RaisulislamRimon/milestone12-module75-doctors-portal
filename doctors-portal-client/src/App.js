import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Routes/Router";
import "./App.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="max-w-[1440px] mx-auto">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
