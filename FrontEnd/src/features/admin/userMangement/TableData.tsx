
import type { IUserType } from "../../../types/users.type";
import { useNavigate } from "react-router-dom";


const TableRow: React.FC<{user: IUserType; onDelete: (id:string  ) => void}> = ({ user, onDelete }) => {
  
  
  const navigate=useNavigate()


  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        

        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${user.role=='mentor'?'bg-blue-100 text-blue-800 border-blue-200':'bg-purple-100 text-purple-800 border-purple-200'}`}>
        {user.role}
        </span>
       
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${user.isActive?'bg-green-100 text-green-800 border-green-200':'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {user.isActive?'Active':'Block'}
        </span>
        
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>Joined: {'23/06/2024'}</div>
        
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
         <div className="flex items-center space-x-2">
            <button onClick={()=>navigate(`/admin/user-profile/${user.id}`)}               
              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View Details"
            >
              view
            
            </button>
            <button
                onClick={() => onDelete(user.id)}
                title="Delete User"
                className={`px-3 py-1 text-sm  font-medium rounded transition-colors
                ${user.isActive
                  ? 'text-green-600 hover:text-red-600 hover:bg-red-50'   
                  : 'text-red-600 hover:text-green-600 hover:bg-green-50' 
                }`}
            >
                {user.isActive ? (
                    'block'
                     ) : (
                    'unblock'
                     )}
            </button>
        </div>
      </td>
    </tr>
  );
};


export default TableRow