import React from "react";
import DonationForm from "../Components/DonationForm";

const Donate = (props) => {
  const { check } = props;
  return (
    <div className="do-na-tion">
      <DonationForm check={check} />
    </div>
  );
};

export default Donate;
