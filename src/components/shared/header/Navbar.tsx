"use client";

import React from "react";
import TopNavbar from "./TopNavbar";
import MiddleNavbar from "./MiddleNavbar";

interface PageProps {
  params: {
    locale: string;
  };
}

const Navbar = ({params}: PageProps) => {
  return (
    <>
      <TopNavbar params={params} />
      <MiddleNavbar />
    </>
  );
};

export default Navbar;
