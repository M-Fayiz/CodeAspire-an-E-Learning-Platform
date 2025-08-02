
import  { useEffect,  useState } from 'react'
import type{ ICategoryEdit, ICategoryTree } from "@/types/category.types"
import { Input } from "@/components/ui/Inputs" 
import { SelectInput } from "@/components/ui/SelectInput" 

interface EditCategoryProps{
  category:ICategoryTree,
  allCategory:ICategoryTree[];
  editedData:(editData:ICategoryEdit)=>void

}

function EditCategory({category,allCategory,editedData}:EditCategoryProps) {
  const [formData,setFormData]=useState<ICategoryEdit>({slug:'',title:'',parentId:''})
  const [parent,setParent]=useState('')
 
  const findParent=(categories:ICategoryTree[])=>{
    for(let node of categories){
      if(node.key==category.parent){
        setParent(node.label)
        return node
      }
      if(node.children&&node.children.length>0){
        let foundNode=findParent(node.children)
        if(foundNode){
          setParent(foundNode.label)
        }
      }
    }
  }
  useEffect(()=>{
  findParent(allCategory)
  setFormData(prv=>({...prv,slug:category.slug,title:category.label,parentId:category.parent?category.parent:''}))
  },[category,allCategory])

  const handleChange = (e:{ target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const onSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    
    editedData({...formData,slug:category.slug})
  }

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
            placeholder={category.label}
          />

          <SelectInput 
            name="parentId"
            placeholder={parent?parent:'select a parent'}
            value={formData.parentId}
            onChange={handleChange}
            options={[
              { label: "None", value: 'none' }, 
                ...allCategory.filter(data=>data.key!==category.key).map(cat => ({
                label: cat.label,
                value: cat.key,
                        
              })),
            ]}
                   
          />
          
          <button type="submit" className="text-blue-700 hover:text-white border rounded-s-md border-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Submit</button>
          
        </form>
      </div>
           
    </div>
  )
}

export default EditCategory
