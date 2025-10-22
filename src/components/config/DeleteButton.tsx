"use client";
import React from "react";
import { Button } from "../ui/button";
import { deleteToy } from "@/lib/actions/toysAction";

const DeleteButton = ({ id }: { id: string }) => {
  const handleDelete = async (id: string) => {
    await deleteToy(id);
  };
  return (
    <Button
      className="bg-red-700 hover:bg-red-800 text-white"
      onClick={() => handleDelete(id)}
    >
      Eliminar
    </Button>
  );
};

export default DeleteButton;
