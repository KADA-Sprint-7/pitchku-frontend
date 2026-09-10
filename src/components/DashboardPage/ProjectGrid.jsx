import { Plus, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";

export default function ProjectGrid({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#131B2E] border border-slate-800/80 my-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <Presentation className="w-7 h-7 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Tidak Ada Proyek Ditemukan
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          Tidak ada deck presentasi yang cocok dengan kata kunci pencarian atau filter status yang dipilih.
        </p>
        <Link to="/new">
          <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Mulai Buat Proyek Baru</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
