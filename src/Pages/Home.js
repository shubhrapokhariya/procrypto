import React from "react";
import Carousel from "../Components/Carousel";
import CoinsTable from "../Components/CoinsTable";

export const Home = (props) => {
  const { check } = props;
  return (
    <>
      <Carousel check={check} />
      <CoinsTable check={check} />
    </>
  );
};

export default Home;
