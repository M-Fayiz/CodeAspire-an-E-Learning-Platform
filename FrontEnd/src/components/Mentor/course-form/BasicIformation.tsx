import ImageUploadPreview from "@/components/ui/ImageFile"
import { Input } from "@/components/ui/Inputs"
import { Combobox } from "@/components/ui/SelectWithSearch"
import { COURSE_LANGUAGE, COURSE_LEVEL } from "@/constants/courseInputs.constant"
import categoryService from "@/service/client-API/admin/category.service"
import type { ICategoryTree } from "@/types/category.types"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"


const BasicCourseInformation=()=>{
    const [categories,setCategories]=useState<ICategoryTree[]>([])
    const {control,formState:{errors}}=useFormContext()
    const [selectedCategory,setSelectedCategory]=useState('')
    const [subCategoy,setSubCategory]=useState<ICategoryTree[]>([])

    useEffect(()=>{
      const fetchCategories=async()=>{
       const result=await categoryService.listCategory()
        if(result){
          setCategories(result)
        }
      }
    fetchCategories()
    },[])

    const FormError=({message}:{message?:string})=>{
      return message?<p className="text-red-500 text-sm pt-0  ">{message}</p>:null
    }
    
    const handleSubCategory=(selectedLabel:string|undefined)=>{
      if(selectedLabel){
        setSelectedCategory(selectedLabel)
      }
    }
    useEffect(()=>{
      const categoryChildren=categories.find(data=>data.label==selectedCategory)?.children
      if(categoryChildren){
        setSubCategory(categoryChildren)
      }
    },[selectedCategory])


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

            <div className="space-y-2">
            <Controller
             name="title"
             control={control}
             rules={{required:'Title is required'}}
             render={({field})=>(
                <Input {...field}
                 placeholder="Course Title"
                 label="Course Title"
                 error={errors.title?.message as string}
                />
            )}
            />

            <Controller
             name="description"
             control={control}
             rules={{
              required:'description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            }}
             render={({field})=>(
                <Input {...field} 
                 textArea
                 placeholder="write Course description"
                 label={'Course description'}
                 error={errors.description?.message as string}
                />
            )}
            />
            

            <Controller
             name="price"
             control={control}
             rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be greater than 0' } }}
             render={({field})=>(
                <Input {...field} 
                placeholder="Enter Course Price" 
                label="Course Price"
                error={errors.price?.message as string}
                />
            )}
            />
           <div className="flex gap-5">
             <div className="flex flex-col gap-2">
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
                    setCategory={handleSubCategory}
                    onChange={(value) => {
                      field.onChange(value); 
                    }}
                  />
                )}
              />
              <FormError message={errors.categoryId?.message  as string}/>
             </div>
              {subCategoy.length>0&&(
                <>
                  <Controller
                    name="subCategoryId"
                    control={control}
                    rules={{ required: 'Sub-Category is required'}}
                    render={({field})=>(
                      <Combobox {...field}
                        label="Choose a Sub-Category"
                        value={field.value}
                        boxOptions={subCategoy}
                        name={field.name}
                          onChange={(value) => {
                            field.onChange(value); 
                        }}
                      />
                    )}
                  />
                  <FormError message={errors.subCategoryId?.message  as string}/>
                </>
              )}
           </div>

            <div className='flex gap-3'>
              <div className="flex flex-col gap-2">
                <Controller
                  name="language"
                  control={control}
                  rules={{ required: 'Select a language  is required'}}
                  render={({field})=>(
                    <Combobox {...field}
                      label="Select a Language"
                      value={field.value}
                      boxOptions={[...COURSE_LANGUAGE.map((data)=>({
                        label:data,
                        key:data 
                      }))]}
                      name={field.name}
                        onChange={(value) => {
                          field.onChange(value); 
                      }}
                    />
                  )}
                />
                <FormError message={errors.language?.message  as string}/>
              </div>
              <div className="flex flex-col gap-2">

                <Controller
                  name="level"
                  control={control}
                  rules={{ required: 'Select a your Course  is required'}}
                  render={({field})=>(
                    <Combobox {...field}
                      label="Select a Course Level"
                      value={field.value}
                      boxOptions={[...COURSE_LEVEL.map((data)=>({
                        label:data,
                        key:data 
                      }))]}
                      name={field.name}
                        onChange={(value) => {
                          field.onChange(value); 
                      }}
                    />
                  )}
                />
                <FormError message={errors.level?.message  as string}/>
              </div>
            </div>
            <ImageUploadPreview/> 
    
        </div>

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
  
           <button
              type="submit"
              className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
            >
              Save & Next
            </button>
        </div>
      </div>
    )
}

export default BasicCourseInformation