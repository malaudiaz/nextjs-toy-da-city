import Breadcrumbs from "@/components/shared/BreadCrumbs";
import React from "react";

const MissionPage = () => {
  return (
    <div className="w-full bg-[#FAF1DE] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            {/* Breadcrumb */}
            <Breadcrumbs />

            {/* Título */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3E50] border-b-2 border-[#3498DB] pb-3">
              Our Mission
            </h1>

            {/* Contenido */}
            <section className="mt-4">
              <p className="mb-4 text-gray-700">
                At Toydacity, our mission is to create a sustainable and supportive ecosystem where families can give a second life to children's items—while also building meaningful connections with one another.
              </p>
              <p className="mb-4 text-gray-700">
                We believe that every toy, book, piece of clothing, or gear deserves the chance to bring joy to more than one child. By enabling parents to buy, sell, trade, or donate gently used children's products, we not only help reduce waste and unnecessary spending, but also promote a culture of sharing, empathy, and environmental responsibility.
              </p>
              <p className="mb-4 text-gray-700">
                More than just a marketplace, Toydacity is a community of parents helping parents—a place to find resources, ask questions, organize local events, and support one another in the journey of raising children.
              </p>
              <p className="text-gray-700">
                Our commitment is to empower families with tools to consume consciously, give generously, and raise the next generation in a world that values sustainability, connection, and care.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;