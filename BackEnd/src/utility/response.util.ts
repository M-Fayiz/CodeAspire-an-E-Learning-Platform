
export const successResponse=(message:string,data:any={})=>{
    return ({success:true,message:message,...data})
}