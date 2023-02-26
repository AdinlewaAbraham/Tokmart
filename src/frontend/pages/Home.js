import React, { useEffect } from "react";
import Topsection from "../components/home/topSection/Topsection";
import MiddleSection from "../components/home/middleSection/MiddleSection";
import BaseSection from "../components/home/baseSection/BaseSection";
const Home = () => {
  useEffect(() => {
    document.title = "Home";
  }, []);
  return (
    <>
      <Topsection />
      <MiddleSection />
      <BaseSection />
    </>
  );
};

export default Home;
