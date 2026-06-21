// /components/shop/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  // Support both your new layout naming and the search page properties
  current?: number;
  currentPage?: number;
  total?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ 
  current, 
  currentPage, 
  total, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  
  // Consolidate the naming internally so the component logic stays completely clean
  const activePage = current ?? currentPage ?? 1;
  const maxPages = total ?? totalPages ?? 1;

  if (maxPages <= 1) return null;

  const handlePageSelect = (pageNumber: number) => {
    onPageChange(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (maxPages <= maxVisible) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (activePage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, activePage - 1);
      const end = Math.min(maxPages - 1, activePage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (activePage < maxPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(maxPages)) {
        pages.push(maxPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-10 border-t border-zinc-200/60">
      
      {/* PREVIOUS PAGE TRIGGER */}
      <button
        disabled={activePage === 1}
        onClick={() => handlePageSelect(activePage - 1)}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-400 cursor-pointer disabled:cursor-not-allowed shadow-sm"
        aria-label="Go to previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* RENDERED NUMBER BLOCK MATRIX */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-10 h-10 flex items-center justify-center text-xs text-zinc-400 select-none font-medium"
              >
                &bull;&bull;&bull;
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === activePage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => handlePageSelect(pageNum)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm ${
                isActive
                  ? "bg-[#121316] text-white font-bold border border-[#121316]"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* NEXT PAGE TRIGGER */}
      <button
        disabled={activePage === maxPages}
        onClick={() => handlePageSelect(activePage + 1)}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-zinc-400 cursor-pointer disabled:cursor-not-allowed shadow-sm"
        aria-label="Go to next page"
      >
        <ChevronRight size={16} />
      </button>
      
    </div>
  );
}