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
import type { ICategory } from "@/types/category.types";
import { SelectInput } from "@/components/ui/SelectInput";
import { categorySchema } from "@/schema/category.schema";

interface IAddCategoryProps {
  allCategories: ICategory[];
  addCat: (title: string, parentId: string | null) => void;
}

const AddCategoryAccordion: React.FC<IAddCategoryProps> = ({
  allCategories,
  addCat,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    parentId: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
   
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = categorySchema.safeParse(formData);

    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;

      });
      setErrors(fieldErrors);
      return;
    }

   const parentToSend =
  formData.parentId === "none" ? null : formData.parentId;


    addCat(formData.title, parentToSend);

    setFormData({ title: "", parentId: "" });
    setErrors({});
  };

  return (
    <Accordion type="single" collapsible className="w-full max-w-md mx-auto">
      <AccordionItem value="add-category">
        <AccordionTrigger className="flex text-xl items-center gap-2 text-gray-700 font-semibold hover:text-gray-900 transition">
          Add New Category
        </AccordionTrigger>

        <AccordionContent>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <Input
                name="title"
                placeholder="Category Title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <SelectInput
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              options={[
                { label: "None (Parent Category)", value: "none" },
                ...allCategories.map((cat) => ({
                  label: cat.title,
                  value: cat._id,
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
