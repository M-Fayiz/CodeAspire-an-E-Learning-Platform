import ImageUploadPreview from "@/components/ui/ImageFile"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/SelectWithSearch"
import categoryService from "@/service/client-API/admin/category.service"
import type { ICategoryTree } from "@/types/category.types"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"


const BasicCourseInformation=()=>{
    const [categories,setCategories]=useState<ICategoryTree[]>([])
    const {register,control,formState:{errors}}=useFormContext()
    useEffect(()=>{
        const fetchCategories=async()=>{
        const result=await categoryService.listCategory()
        if(result){
            setCategories(result)
        }
        }
    fetchCategories()
    },[])
    const boxData=useMemo(()=>
      categories.map(category=>({
      key: category.key,
      label: category.label
  
    })),[categories])

    return(
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>           
            </div>

            <div className="space-y-6">
            <Controller
             name="title"
             control={control}
             rules={{required:'Title is required'}}
             render={({field})=>(
                <Input {...field} placeholder="Course Title"/>
            )}
            />
            {errors.title?.message=== 'string' && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
            <Controller
             name="description"
             control={control}
             rules={{required:'description is required',minLength:20}}
             render={({field})=>(
                <Input {...field} placeholder="write Course description"/>
            )}
            />
            {errors.description?.message=== 'string' && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
            <Controller
             name="price"
             control={control}
             rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be greater than 0' } }}
             render={({field})=>(
                <Input {...field} placeholder="Enter Course Price" />
            )}
            />
            {errors.price?.message=== 'string' && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}

            <Controller
             name="categoryId"
             control={control}
             rules={{ required: 'category is required'}}
             render={({field})=>(
                <Combobox {...field}
                 label="Choose a Category"
                 value={field.value}
                 boxOptions={boxData}
                 name={field.name}
                 onChange={(value) => {
                    field.onChange(value); 
                }}
                 />
            )}
            />
            {errors.categoryId?.message=== 'string' && (
                <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
            )}
            <Controller
             name="subCategoryId"
             control={control}
             rules={{ required: 'Sub-Category is required'}}
             render={({field})=>(
                <Combobox {...field}
                 label="Choose a Sub-Category"
                 value={field.value}
                 boxOptions={boxData}
                 name={field.name}
                  onChange={(value) => {
                    field.onChange(value); 
                }}
                 />
            )}
            />
            {errors.subCategoryId?.message=== 'string' && (
                <p className="text-red-500 text-sm">{errors.subCategoryId.message}</p>
            )}

            
           
            {/* <div className='flex gap-3'>

                <Combobox
                label='Select Course Language'
                name='language'
                onChange={handleInputChange}
                value={formData.language}
                boxOptions={[...COURSE_LANGUAGE.map((data)=>({
                label:data,
                key:data 
                }))]}
                setCategory={(label)=>setSelectedCategory(label||'')}
                
                />
                <Combobox
                label='Select Course Level'
                name='level'
                onChange={handleInputChange}
                value={formData.level}
                boxOptions={[...COURSE_LEVEL.map((data)=>({
                label:data,
                key:data 
                }))]}
                setCategory={(label)=>setSelectedCategory(label||'')}
                
                />
            </div> */}
            <ImageUploadPreview/> 
    
        </div>

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
          {/* <button
            onClick={handleCancel}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button> */}
          
          {/* <button
            onClick={handleSaveAndNext}

            className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            Save & Next
          </button> */}
        </div>
      </div>
    )
}

export default BasicCourseInformation