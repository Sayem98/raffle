import React from "react";
import Header from "./Header";

export default function Layout({ children ,loggedin,setLoggedin}) {
  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-transparent">
        <Header loggedin={loggedin} setLoggedin={setLoggedin}/>
      </header>

      <main>{children}</main>

    </>
  );
}
