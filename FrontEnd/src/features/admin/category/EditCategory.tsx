import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React, { useState } from 'react'
import type{ ITree } from "@/types/category.types"
import { Input } from "@/components/ui/Inputs" 
import { SelectInput } from "@/components/ui/SelectInput" 

interface EditCategoryProps{
  category:ITree,
  allCategory:ITree[]
}

function EditCategory({category,allCategory}:EditCategoryProps) {
  const [formData,setFormData]=useState({title:'',parentId:''})

  const handleChange = (e:{ target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  console.log('category',category)

  return (
    <div className="h-full">
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[500px]">
            <SheetHeader>
            <SheetTitle className="text-gray-600">Edit Category </SheetTitle>
            <SheetDescription>
               <div>
                  <form action="" className="flex flex-col gap-2.5">
                   <Input
                    type="text"
                    value={formData.title}
                    name="title"
                    label="category Title"
                    onChange={handleChange} 
                    placeholder={category.label}
                   />

                   <SelectInput 
                    name="parentId"
                    placeholder={`${allCategory.find(cat=>cat.key==category.parent)?.label??'select a parent'}`}
                    value={formData.parentId}
                    onChange={handleChange}
                    options={[
                      { label: "None", value: "none" }, 
                      ...allCategory.map(cat => ({
                        label: cat.label,
                        value: cat.key,
                        
                      })),
                    ]}
                   
                   />
                  </form>
               </div>
            </SheetDescription>
            </SheetHeader>
        </SheetContent>
        </Sheet>
    </div>
  )
}

export default EditCategory
