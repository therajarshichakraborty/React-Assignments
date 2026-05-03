import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
      
      {/* Search */}
      <div className="flex items-center bg-[#121212] rounded-full px-4 py-2 w-[40%]">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none flex-1 text-sm"
        />
        <Search size={18} />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />
        <User className="cursor-pointer" />
      </div>
    </div>
  );
}