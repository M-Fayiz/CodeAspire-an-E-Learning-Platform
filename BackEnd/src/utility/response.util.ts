
export const successResponse=(message:string,data:Record<string,any>={})=>{
    return ({success:true,message:message,...data})
}