"use client";

import React from "react";
import TopNavbar from "./TopNavbar";
import MiddleNavbar from "./MiddleNavbar";

interface NavbarProps {
  locale: string; // ← Asegúrate que acepte string
}

export default function Navbar({ locale }: NavbarProps) {
  return (
    <>
      <TopNavbar />
      <MiddleNavbar locale={locale} />
    </>
  );
};
