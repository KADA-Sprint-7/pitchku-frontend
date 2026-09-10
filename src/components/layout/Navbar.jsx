import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANCHOR_LINKS = [
  { label: "Keunggulan", id: "keunggulan" },
  { label: "Cara Kerja", id: "cara-kerja" },
  { label: "Pilihan Templat", id: "pilihan-templat" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const isLandingPage = location.pathname === "/";

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const sections = ANCHOR_LINKS.map(({ id }) =>
      document.getElementById(id),
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Logo: scroll to top if already on landing page, otherwise navigate home.
  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isLandingPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Anchors: smooth-scroll directly if on landing page, otherwise navigate
  // home and pass the target section id so LandingPage can scroll to it
  // after mount.
  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isLandingPage) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 font-semibold"
        >
          <div className="flex flex-col leading-tight">
            <p className="font-bold">
              Pitch<span className="text-pitchku-amber">Ku</span>
            </p>

            <p className="mt-1 text-xs font-normal text-muted-foreground">
              Slide Bisnis UMKM
            </p>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {ANCHOR_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleAnchorClick(e, link.id)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/faq"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            FAQ
          </Link>
        </div>

        <Button className="hidden font-semibold p-5 md:inline-flex">
          <Link to="/register">Mulai Buat Slide</Link>
        </Button>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <aside
            className="
        absolute right-0 top-0
        flex h-full w-[82%] max-w-sm
        flex-col
        border-l border-border
        bg-background/95
        shadow-2xl
        backdrop-blur-xl
        animate-in slide-in-from-right
        duration-300
      "
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-semibold text-foreground">Menu</span>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="
            rounded-lg p-2
            text-muted-foreground
            transition-colors
            hover:bg-muted
            hover:text-foreground
          "
                aria-label="Tutup menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col px-6 py-6">
              <nav className="flex flex-col gap-1">
                {ANCHOR_LINKS.map((link) => {
                  const isActive = activeSection === link.id;

                  return (
                    <a
                      key={link.id}
                      href={`/#${link.id}`}
                      onClick={(e) => handleAnchorClick(e, link.id)}
                      className={`
                  group flex items-center justify-between
                  rounded-lg px-3 py-3
                  text-sm
                  transition-all duration-200
                  ${isActive
                          ? "font-semibold"
                          : "text-muted-foreground"
                        }
                `}
                    >
                      <span>{link.label}</span>

                      <span
                        className={`
                    text-lg leading-none
                    transition-all duration-200
                    ${isActive
                            ? "translate-x-0 opacity-100"
                            : "translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }
                  `}
                      >
                        →
                      </span>
                    </a>
                  );
                })}

                {/* FAQ */}
                <Link
                  to="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className={`
              group flex items-center justify-between
              rounded-lg px-3 py-3
              text-sm
              transition-all duration-200
              ${location.pathname === "/faq"
                      ? "font-semibold"
                      : "text-muted-foreground"
                    }
            `}
                >
                  <span>FAQ</span>

                  <span
                    className={`
                text-lg leading-none
                transition-all duration-200
                ${location.pathname === "/faq"
                        ? "translate-x-0 opacity-100"
                        : "translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }
              `}
                  >
                    →
                  </span>
                </Link>
              </nav>

              {/* CTA */}
              <div className="mt-auto pt-6">
                <Button
                  asChild
                  className="w-full font-semibold text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">Mulai Buat Slide</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

export default Navbar;
