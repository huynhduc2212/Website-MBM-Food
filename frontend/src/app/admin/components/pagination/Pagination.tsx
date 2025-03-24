import React from "react";
import { IconLeftArrow, IconRightArrow } from "../icons"; // Điều chỉnh import cho đúng

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-8 h-8 rounded-md ${
          currentPage === 1 
            ? "text-gray-400 cursor-not-allowed" 
            : "text-primary hover:bg-primary/10"
        }`}
      >
        <IconLeftArrow />
      </button>
      
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        // Show current page, first, last, and 1 page on each side of current
        const showPageButton = 
          pageNumber === 1 || 
          pageNumber === totalPages || 
          Math.abs(pageNumber - currentPage) <= 1;
        
        // Show ellipsis if there's a gap
        if (!showPageButton) {
          // Only show ellipsis once on each side
          if (pageNumber === 2 || pageNumber === totalPages - 1) {
            return (
              <span key={`ellipsis-${pageNumber}`} className="w-8 h-8 flex items-center justify-center">
                ...
              </span>
            );
          }
          return null;
        }
        
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`w-8 h-8 rounded-md ${
              currentPage === pageNumber
                ? "bg-primary text-white"
                : "hover:bg-primary/10"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-8 h-8 rounded-md ${
          currentPage === totalPages 
            ? "text-gray-400 cursor-not-allowed" 
            : "text-primary hover:bg-primary/10"
        }`}
      >
        <IconRightArrow />
      </button>
    </div>
  );
};

export default Pagination;