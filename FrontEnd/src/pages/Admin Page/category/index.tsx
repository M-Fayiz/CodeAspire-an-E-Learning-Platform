
import ManagementLayout from "@/components/layout/ManagementLayout"
import AddCategoryAccordion from "@/features/admin/category/AddCategory"
import categoryService from "@/service/client-API/admin/category.service"
// import type { ICategoryTree } from "@/types/category.types"
import { useEffect, useState } from "react"
import { Tree } from 'primereact/tree';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';         
import EditCategory from "@/features/admin/category/EditCategory"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet"
import type { ICategoryEdit, ICategoryTree } from "@/types/category.types"
import { toastService } from "@/components/toast/ToastSystem"



const CategoryManagement=()=>{
    const [fetchedData,setFetchedData]=useState<ICategoryTree[]>([])
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [selectedCategory,setSelectedCategory]=useState<ICategoryTree|null>(null)
    const [sheetOpen,setSheetOpen]=useState(false)
    const [toFetch,setToFetch]=useState(false)

    useEffect(()=>{
        const fetchCategories =async()=>{
            const result=await categoryService.listCategory()
            
            setFetchedData(result)
        }
        fetchCategories()
    },[toFetch])
  
    const editCategry=async(editData:ICategoryEdit)=>{
        console.log('edit category :',editCategry)
        try {
            const result= await categoryService.editCategory(editData.slug,editData)
            if(result){
                setToFetch(true)
                setSheetOpen(false)    
            }
        } catch (error) {
            if(error instanceof Error){
                toastService.error(error.message)
            }
        }
    }
   
    const AddCategory=async (title:string,parentId:string)=>{
        try {
            
            const result=await categoryService.createCategory(title,parentId)
            if(result){
                setToFetch(true)
            }
        } catch (error) {
            if(error instanceof Error){
                toastService.error(error.message)
            }
        }
    }
  

    
    const findCategoryByKey=(key:string)=>{
       
        function serachNode(node:ICategoryTree[]):ICategoryTree|null{
            for(let elem of node){
                if(elem.key==key){
                    return elem 
                }
                if(elem.children?.length){
                    const result=serachNode(elem.children)
                    if(result){
                        return result
                    }
                }
            }
            return null
        }
        const foundCatgory=serachNode(fetchedData)
        if (foundCatgory && foundCatgory.key !== selectedCategory?.key) {
          setSelectedCategory(foundCatgory);
        }

     
    }
    const onSelectionChange = (e: any) => {
        const key = e.value;
        setSelectedKey(key);
        if (key) {
            findCategoryByKey(key);
            setSheetOpen(true)
        }
    };




    return(
        <ManagementLayout title="Category Management" description="Manage category and edit it ">
         <div className="flex flex-col md:justify-start gap-4">
            <div className="bg-white rounded-sm outline-1">

            <AddCategoryAccordion allCategories={fetchedData} addCat={AddCategory} />
            </div>
            <div className=" gap-6">
                <div className=" bg-white p-4 rounded">

               <Tree
                    value={fetchedData}
                    selectionMode="single"
                    selectionKeys={selectedKey}
                    onSelectionChange={onSelectionChange}
                />
                </div>
                {selectedCategory && (
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent className="w-[400px] sm:w-[500px]">
                    <SheetHeader>
                        <SheetTitle className="text-gray-600">Edit Category</SheetTitle>
                        <SheetDescription>
                        You are editing <strong>{selectedCategory.label}</strong>
                        </SheetDescription>
                    </SheetHeader>

                    <EditCategory
                        editedData={editCategry}
                        category={selectedCategory}
                        allCategory={fetchedData}
                    />
                    </SheetContent>
                </Sheet>
                )}

                
            </div>
         </div>
        </ManagementLayout>
    )
}

export default CategoryManagement