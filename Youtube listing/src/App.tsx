import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar.tsx";
import VideoGrid from "./components/VideoGrid.tsx";

export default function App() {
  return (
    <div className="flex bg-[#0f0f0f] text-white h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <VideoGrid />
      </div>
    </div>
  );
}
