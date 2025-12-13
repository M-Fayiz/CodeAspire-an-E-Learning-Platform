import { useEffect, useState } from "react";
import type { ICategory, ICategoryEdit } from "@/types/category.types";
import { Input } from "@/components/ui/Inputs";
import { SelectInput } from "@/components/ui/SelectInput";

interface EditCategoryProps {
  category: ICategory;
  allCategory: ICategory[];
  editedData: (editData: ICategoryEdit) => void;
}

function EditCategory({
  category,
  allCategory,
  editedData,
}: EditCategoryProps) {
  const [formData, setFormData] = useState<ICategoryEdit>({
    _id: "",
    title: "",
    parentId: "",
  });

  const [parent, setParent] = useState("");

  const findParentName = (): string => {
    for (const node of allCategory) {
      if (node._id == category.parent) {
        setParent(node.title);
      }
    }
    return "";
  };

  useEffect(() => {
    findParentName();
    console.log(category.parent);
    setFormData({
      _id: category._id,
      title: category.title,
      parentId: category.parent || "none",
    });
  }, [category]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editedData({
      ...formData,
      parentId: formData.parentId === "none" ? null : formData.parentId,
    });
  };

  return (
    <div className="p-5 h-full">
      <div>
        <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
          <Input
            type="text"
            value={formData.title}
            name="title"
            label="category Title"
            onChange={handleChange}
            placeholder={category.title}
          />

          <SelectInput
            name="parentId"
            placeholder={parent ? parent : "No Parent"}
            value={formData.parentId as string}
            onChange={handleChange}
            options={[
              { label: "None", value: "none" },
              ...allCategory
                .filter((data) => data._id !== category._id)
                .map((cat) => ({
                  label: cat.title,
                  value: cat._id,
                })),
            ]}
          />

          <button
            type="submit"
            className="text-blue-700 hover:text-white border rounded-s-md border-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;
