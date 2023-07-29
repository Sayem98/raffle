import React from "react";
import Header from "../Components/Raffle/Header";
import Cards from "../Components/Raffle/Cards";
export default function Auction() {
  return (
    <div className="min-h-screen py-24 flex flex-col gap-4  bg-[#F3FCFF] ">
      <div className="container-sk mt-5">
        <Header />

        <div className="mt-5 grid    md:grid-cols-3 grid-cols-2 lg:grid-cols-4 lg:gap-10 gap-5">
          <Cards />
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </div>
  );
}
