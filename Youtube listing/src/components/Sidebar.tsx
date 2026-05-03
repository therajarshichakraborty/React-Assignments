import { Home, Compass, History, ThumbsUp, Clock } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 bg-[#0f0f0f] p-4 hidden md:block border-r border-gray-800">
      <h1 className="text-xl font-bold mb-6">YouTube</h1>

      <nav className="space-y-4">
        <SidebarItem icon={<Home />} label="Home" active />
        <SidebarItem icon={<Compass />} label="Explore" />

        <div className="border-t border-gray-700 my-4"></div>

        <SidebarItem icon={<History />} label="History" />
        <SidebarItem icon={<Clock />} label="Watch Later" />
        <SidebarItem icon={<ThumbsUp />} label="Liked Videos" />
      </nav>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${active ? "bg-white text-black" : "hover:bg-gray-800"}
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
