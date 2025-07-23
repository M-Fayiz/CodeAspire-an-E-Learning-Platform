import React from "react"


interface a_props{
    href:string
    label:string
}

export const A_tag:React.FC<a_props>=({href,label})=>{


    return(
        <a href={href} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">{label}</a>
    )
}
