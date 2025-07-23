
import React, { type ReactNode } from "react"


interface ManagementProps{
    title:string
    description:string
    children:ReactNode
}
const ManagementLayout:React.FC<ManagementProps>=({title,description,children})=>{
    return(
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                <div>
                     <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-600 mt-1">{description}</p>
                </div>
                </div>
                {children}
            </div>
        </div>
    )
}
export default ManagementLayout