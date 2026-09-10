import { useState, useMemo } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import AppSidebar from "@/components/layout/AppSidebar";
import DashboardHeader from "@/components/DashboardPage/DashboardHeader";
import DashboardMetrics from "@/components/DashboardPage/DashboardMetrics";
import DashboardFilterBar from "@/components/DashboardPage/DashboardFilterBar";
import ProjectGrid from "@/components/DashboardPage/ProjectGrid";
import { mockProjects, mockWorkspaceMetrics } from "@/lib/mockProjects";

function DashboardPage() {
  usePageTitle("Dasbor Proyek");

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate status counts
  const counts = useMemo(() => {
    const total = mockProjects.length;
    const selesai = mockProjects.filter((p) => p.status === "selesai").length;
    const draft = mockProjects.filter((p) => p.status === "draft").length;
    return { all: total, selesai, draft };
  }, []);

  // Filter projects by active status tab and search keyword
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      // Status filter
      const matchesStatus =
        activeFilter === "all" || project.status === activeFilter;

      // Search keyword filter (title or description)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.templateName.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#070C15] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Canva-style narrow icon-rail sidebar */}
      <AppSidebar />

      {/* Main dashboard content workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <DashboardHeader />

          {/* Metrics (Strictly 2 cards: Total projects & Kuota AI) */}
          <DashboardMetrics metrics={mockWorkspaceMetrics} />

          {/* Controls: Filter tabs & Search input */}
          <DashboardFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            counts={counts}
          />

          {/* Project Cards Grid */}
          <ProjectGrid projects={filteredProjects} />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
