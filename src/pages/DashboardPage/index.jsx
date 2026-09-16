import { useState, useMemo, useEffect, useCallback } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import AppSidebar from "@/components/layout/AppSidebar";
import DashboardHeader from "@/components/DashboardPage/DashboardHeader";
import DashboardMetrics from "@/components/DashboardPage/DashboardMetrics";
import DashboardFilterBar from "@/components/DashboardPage/DashboardFilterBar";
import ProjectGrid from "@/components/DashboardPage/ProjectGrid";
import { fetchApi } from "@/lib/api";
import { projectStore } from "@/lib/projectStore";
import { deleteProjectByIdApi } from "@/lib/aiService";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function DashboardPage() {
  usePageTitle("Dasbor Proyek");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects from backend & combine with local drafts
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        // Ambil dari backend
        let backendProjects = [];
        try {
          const res = await fetchApi("/projects");
          if (Array.isArray(res)) {
            backendProjects = res;
          } else if (res && Array.isArray(res.data)) {
            backendProjects = res.data;
          } else if (res && Array.isArray(res.projects)) {
            backendProjects = res.projects;
          }
        } catch (err) {
          console.warn("Backend /api/projects belum merespon:", err.message);
        }

        // Ambil dari projectStore (local drafts)
        const localDrafts = projectStore.getAllProjectsList();

        // Gabungkan berdasarkan ID unik (prioritaskan data terbaru)
        const projectMap = new Map();

        // 1. Masukkan data lokal
        localDrafts.forEach((p) => {
          const hasPayload = !!p.deckPayload && Array.isArray(p.deckPayload.slides) && p.deckPayload.slides.length > 0;
          projectMap.set(p.id, {
            id: p.id,
            title: p.title || p.deckPayload?.businessName || p.structuredData?.companyName || p.structuredData?.productName || "Presentasi Tanpa Judul",
            templateType: p.template,
            status: p.status === "selesai" ? "selesai" : "draft",
            hasDeckPayload: hasPayload,
            updatedAt: p.updatedAt || new Date().toISOString(),
            slideCount: hasPayload ? p.deckPayload.slides.length : (p.outlines?.length || 0),
          });
        });

        // 2. Timpa / tambahkan dari backend jika ada
        backendProjects.forEach((p) => {
          projectMap.set(p.id, {
            ...p,
            slideCount: p.slides?.length || p.slideCount || 8,
          });
        });

        if (isMounted) {
          setProjects(Array.from(projectMap.values()));
        }
      } catch (err) {
        console.error("Gagal memuat proyek:", err);
        if (isMounted) {
          setProjects(projectStore.getAllProjectsList());
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

  // Delete project: remove from local store + call backend, then update UI
  const handleDeleteProject = useCallback(async (projectId) => {
    // Optimistic UI remove
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Remove from local store
    projectStore.deleteProject(projectId);
    // Also attempt backend delete (fail silently)
    try {
      await deleteProjectByIdApi(projectId);
    } catch (err) {
      console.warn('[Delete Project] Backend tidak merespon:', err.message);
    }
    toast.success('Proyek berhasil dihapus');
  }, []);

  // Toggle project status (draft <-> selesai)
  const handleStatusChange = useCallback((projectId, newStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
    projectStore.updateProjectStatus(projectId, newStatus);
    toast.success(
      newStatus === 'selesai'
        ? 'Proyek ditandai sebagai Selesai!'
        : 'Status proyek diubah kembali ke Draf'
    );
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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0">
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
            <ProjectGrid
              projects={filteredProjects}
              onDelete={handleDeleteProject}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

