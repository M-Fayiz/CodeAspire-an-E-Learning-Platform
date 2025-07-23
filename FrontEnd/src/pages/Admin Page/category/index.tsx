
import ManagementLayout from "@/components/layout/ManagementLayout"
import AddCategoryAccordion from "@/features/admin/category/AddCategory"
import categoryService from "@/service/client-API/admin/category.service"
import type { ITree } from "@/types/category.types"
import { useEffect, useState } from "react"
import { Tree } from 'primereact/tree';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';         
import EditCategory from "@/features/admin/category/EditCategory"

const CategoryManagement=()=>{
    const [fetchedData,setFetchedData]=useState<ITree[]>([])
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [selectedCategory,setSelectedCategory]=useState<ITree|null>(null)

    useEffect(()=>{
        const fetchCategories =async()=>{
            const result=await categoryService.listCategory()
            
            setFetchedData(result)
        }
        fetchCategories()
    },[])
    console.log('selected Category ',selectedCategory)

    
    const findCategoryByKey=(key:string)=>{
       
        function serachNode(node:ITree[]):ITree|null{
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
        if(foundCatgory){
            setSelectedCategory(foundCatgory)
        }
     
    }
   const onSelectionChange = (e: any) => {
        const key = e.value;
        setSelectedKey(key);
        if (key) {
            findCategoryByKey(key);
        }
    };


    return(
        <ManagementLayout title="Category Management" description="Manage category and edit it ">
         <div className="flex flex-col md:justify-start gap-4">
            <div className="bg-white rounded-sm outline-1">

            <AddCategoryAccordion allCategories={fetchedData} />
            </div>
            <div className="flex gap-6">
                <div className="w-1/2 bg-white p-4 rounded">

               <Tree
                    value={fetchedData}
                    selectionMode="single"
                    selectionKeys={selectedKey}
                    onSelectionChange={onSelectionChange}
                />
                </div>
                {selectedCategory&&<EditCategory category={selectedCategory} allCategory={fetchedData}/>}
                
            </div>
            <div>{selectedKey}</div>
            
         </div>
        </ManagementLayout>
    )
}

export default CategoryManagement