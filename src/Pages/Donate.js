import React from "react";
import DonationForm from "../Components/DonationForm";

const Donate = (props) => {
  const { check } = props;
  return (
    <div>
      <DonationForm check={check} />
    </div>
  );
};

export default Donate;
