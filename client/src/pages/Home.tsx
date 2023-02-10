import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import MainTweet from "../components/MainTweet";
import RightSidebar from "../components/RightSidebar";
import Signin from "./Signin";

import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state: { user: any }) => state.user);

  return (
    <>
      {!currentUser ? (
        <Signin />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="px-6">
            <LeftSidebar />
          </div>
          <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
            <MainTweet />
          </div>
          <div className="px-6">
            <RightSidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
