import { useState, useMemo, useEffect, useCallback } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import AppSidebar from "@/components/layout/AppSidebar";
import DashboardHeader from "@/components/DashboardPage/DashboardHeader";
import DashboardMetrics from "@/components/DashboardPage/DashboardMetrics";
import DashboardFilterBar from "@/components/DashboardPage/DashboardFilterBar";
import ProjectGrid from "@/components/DashboardPage/ProjectGrid";
import { fetchApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { projectStore } from "@/lib/projectStore";
import { deleteProjectByIdApi, syncProjectToBackendApi } from "@/lib/aiService";
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

        // 0. Direct Supabase Query (jika user logged in)
        let supabaseProjects = [];
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            const { data, error } = await supabase
              .from("projects")
              .select("*")
              .order("updated_at", { ascending: false });
            if (!error && Array.isArray(data)) {
              supabaseProjects = data;
            }
          }
        } catch (e) {
          console.warn("Supabase fetch projects error:", e.message);
        }

        // 1. Ambil dari backend API
        let backendProjects = [];
        try {
          const res = await fetchApi("/projects");
          if (Array.isArray(res)) {
            backendProjects = res;
          } else if (res && Array.isArray(res.data)) {
            backendProjects = res.data;
          } else if (res && Array.isArray(res.projects)) {
            backendProjects = res.projects;
          } else if (res && res.data && Array.isArray(res.data.projects)) {
            backendProjects = res.data.projects;
          }
        } catch (err) {
          console.warn("Backend /api/projects belum merespon:", err.message);
        }

        // Ambil dari projectStore (local drafts)
        const localDrafts = projectStore.getAllProjectsList();

        // Auto-sync proyek lokal ke backend jika belum ada di server
        localDrafts.forEach((localProj) => {
          const isServerKnown = backendProjects.some(
            (bp) => (bp.id || bp.deckId || bp.project_id) === localProj.id
          );
          if (!isServerKnown && localProj.id) {
            syncProjectToBackendApi(localProj).catch(() => {});
          }
        });

        // Gabungkan berdasarkan ID unik (prioritaskan data terbaru)
        const projectMap = new Map();

        // 1. Masukkan data lokal terlebih dahulu
        localDrafts.forEach((p) => {
          const hasPayload = !!p.deckPayload && Array.isArray(p.deckPayload.slides) && p.deckPayload.slides.length > 0;
          projectMap.set(p.id, {
            id: p.id,
            title: p.title || p.deckPayload?.businessName || p.structuredData?.companyName || p.structuredData?.productName || "Presentasi Tanpa Judul",
            templateType: p.template,
            status: p.status === "selesai" ? "selesai" : "draft",
            hasDeckPayload: hasPayload,
            updatedAt: p.updatedAt || p.createdAt || new Date().toISOString(),
            slideCount: hasPayload ? p.deckPayload.slides.length : (p.outlines?.length || 0),
          });
        });

        // 2. Tambahkan data dari Supabase DB jika ada
        supabaseProjects.forEach((p) => {
          if (!p.id) return;
          projectMap.set(p.id, {
            id: p.id,
            title: p.title || "Presentasi Tanpa Judul",
            templateType: p.template_type || p.template || "company_profile",
            status: p.status === "selesai" ? "selesai" : "draft",
            hasDeckPayload: true,
            updatedAt: p.updated_at || p.created_at || new Date().toISOString(),
            slideCount: 8,
          });
        });

        // 3. Timpa / tambahkan dari backend jika pengguna sedang terhubung dengan server
        backendProjects.forEach((p) => {
          const id = p.id || p.deckId || p.project_id;
          if (!id) return;

          const existingLocal = projectMap.get(id);
          const slides = p.slides || p.deck_payload?.slides || p.deckPayload?.slides || [];
          const hasPayload = slides.length > 0 || existingLocal?.hasDeckPayload || true;
          const slideCount = slides.length || p.slideCount || p.slide_count || existingLocal?.slideCount || 8;
          const title =
            p.title ||
            p.businessName ||
            p.business_name ||
            p.name ||
            p.structuredData?.companyName ||
            existingLocal?.title ||
            "Presentasi Tanpa Judul";
          const templateType = p.templateType || p.template_type || p.template || existingLocal?.templateType || "company_profile";
          const status = p.status === "selesai" ? "selesai" : "draft";
          const updatedAt = p.updatedAt || p.updated_at || p.createdAt || p.created_at || existingLocal?.updatedAt || new Date().toISOString();

          // Simpan ringkasan proyek ke local storage jika belum ada
          if (!projectStore.getProject(id, false)) {
            projectStore.saveProjectDirect({
              id,
              title,
              template: templateType,
              status,
              updatedAt,
            });
          }

          projectMap.set(id, {
            ...p,
            id,
            title,
            templateType,
            status,
            hasDeckPayload: hasPayload,
            updatedAt,
            slideCount,
          });

          // Simpan payload ke projectStore lokal jika backend mengembalikan slides
          if (slides.length > 0) {
            projectStore.saveDeckPayload(id, {
              deckId: id,
              businessName: title,
              template: templateType,
              brandKit: p.brandKit || p.brand_kit || { primaryColor: "#0F4C81", accentColor: "#F2A007", fontFamily: "Inter" },
              slides,
            });
          }
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

