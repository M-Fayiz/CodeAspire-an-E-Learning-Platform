import { Search } from "lucide-react";

export interface searchProps{
  name:string,
  role:string,
  isActive:string
}



export const SearchAndFilter: React.FC<{
  searchTerm: searchProps;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  
}> = ({ searchTerm, onSearchChange}) => {
  
  

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          name="name"
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm.name}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-2">
        <select
          name="role"
          value={searchTerm.role}
          onChange={onSearchChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="mentor">Mentors</option>
          <option value="learner">Learners</option>
        </select>
        
        <select
          name='isActive'
          value={searchTerm.isActive}
          onChange={onSearchChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Block</option>
        </select>
      </div>
    </div>
  );
};