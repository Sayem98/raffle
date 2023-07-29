import React from "react";
import Banner from "../Components/Home/Banner";

export default function Index({setLoggedin}) {
  const backgroundImage = {
    background: "url('/bg1.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  };

  return (
    <>
      <div style={backgroundImage} className="bg-fill">
        <div className="backdrop-blur-[3px]">
          <div className="container-sk flex flex-col justify-center items-center h-full min-h-screen">
            <div className="w-full">
              <Banner setLoggedin={setLoggedin}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
