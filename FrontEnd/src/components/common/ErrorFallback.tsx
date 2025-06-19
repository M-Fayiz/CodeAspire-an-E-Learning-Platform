import { useRouteError } from "react-router";

const ErrorFallback=()=>{
    const error=useRouteError()
    console.log('❌',error)
    
    return(
        <div className="p-6 text-red-600">
      <h1>Something went wrong!</h1>
      <p>{(error as Error)?.message || "Unknown error"}</p>
    </div>
    )
}

export default ErrorFallback