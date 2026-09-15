import { useState, useMemo, useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import AppSidebar from "@/components/layout/AppSidebar";
import DashboardHeader from "@/components/DashboardPage/DashboardHeader";
import DashboardMetrics from "@/components/DashboardPage/DashboardMetrics";
import DashboardFilterBar from "@/components/DashboardPage/DashboardFilterBar";
import ProjectGrid from "@/components/DashboardPage/ProjectGrid";
import { mockProjects, mockWorkspaceMetrics } from "@/lib/mockProjects";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

function DashboardPage() {
  usePageTitle("Dasbor Proyek");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects from backend
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        const data = await fetchApi("/projects");
        if (isMounted && Array.isArray(data)) {
          setProjects(data);
        }
      } catch (err) {
        console.warn("Menggunakan fallback project data:", err.message);
        if (isMounted) {
          setProjects(mockProjects);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate dynamic counts based on user projects
  const counts = useMemo(() => {
    const total = projects.length;
    const selesai = projects.filter((p) => p.status === "selesai").length;
    const draft = projects.filter((p) => p.status === "draft").length;
    return { all: total, selesai, draft };
  }, [projects]);

  // Calculate dynamic metrics for the current user
  const dynamicMetrics = useMemo(() => {
    const total = projects.length;
    // Free tier token limit calculation / estimate per project
    const tokenLimitWords = 50000;
    const tokenUsageWords = Math.min(tokenLimitWords, total * 2500);

    return {
      totalProjects: total,
      monthlyTrend: `${counts.draft} draf aktif`,
      tokenUsageWords,
      tokenLimitWords,
      tokenFormatted: `${(tokenUsageWords / 1000).toFixed(1)}k`,
      tokenLimitFormatted: `${tokenLimitWords / 1000}k`,
    };
  }, [projects, counts]);

  // Filter projects by active status tab and search keyword
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status filter
      const matchesStatus =
        activeFilter === "all" || project.status === activeFilter;

      // Search keyword filter (title, description, or template)
      const q = searchQuery.toLowerCase().trim();
      const title = (project.title || "").toLowerCase();
      const description = (project.description || "").toLowerCase();
      const templateName = (
        project.templateName ||
        project.templateType ||
        ""
      ).toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        description.includes(q) ||
        templateName.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#070C15] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Canva-style narrow icon-rail sidebar */}
      <AppSidebar />

      {/* Main dashboard content workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <DashboardHeader />

          {/* Metrics (Dynamic based on user projects) */}
          <DashboardMetrics metrics={dynamicMetrics} />

          {/* Controls: Filter tabs & Search input */}
          <DashboardFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            counts={counts}
          />

          {/* Project Cards Grid / Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-[#131B2E] border border-slate-800/80">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
              <p className="text-sm text-slate-400">Memuat deck presentasi Anda...</p>
            </div>
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

