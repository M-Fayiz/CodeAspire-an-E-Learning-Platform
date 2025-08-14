"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ICategoryTree } from "@/types/category.types";
import { SelectInput } from "@/components/ui/SelectInput";

interface IAddCategoryProps {
  allCategories: ICategoryTree[];
  addCat: (title: string, parentId: string) => void;
}

const AddCategoryAccordion: React.FC<IAddCategoryProps> = ({
  allCategories,
  addCat,
}) => {
  const [formData, setFormData] = useState({ title: "", parentId: "" });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Title is required");
    addCat(formData.title, formData.parentId);
  };

  return (
    <Accordion type="single" collapsible className="w-full max-w-md mx-auto">
      <AccordionItem value="add-category">
        <AccordionTrigger className="flex text-1xl items-center gap-2 text-gray-700 font-semibold hover:text-grey-700 transition-colors duration-200">
          Add New Category
        </AccordionTrigger>
        <AccordionContent>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Input
              name="title"
              placeholder="Category Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <SelectInput
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              options={[
                { label: "None", value: "none" },
                ...allCategories.map((cat) => ({
                  label: cat.label,
                  value: cat.key,
                })),
              ]}
            />
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
            >
              Add Category
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AddCategoryAccordion;
