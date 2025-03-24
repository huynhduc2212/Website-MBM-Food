import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export function usePagination<T>({ 
  items, 
  itemsPerPage 
}: UsePaginationProps<T>) {
  const [totalPages, setTotalPages] = useState(1);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    // Calculate total pages
    setTotalPages(Math.ceil(items.length / itemsPerPage));
    
    // If current page is out of bounds after filtering, redirect to page 1
    if (currentPage > Math.ceil(items.length / itemsPerPage) && items.length > 0) {
      router.push(`${window.location.pathname}?page=1`);
    }
  }, [items, itemsPerPage, currentPage, router]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    // Preserve existing query parameters
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageNumber.toString());
    router.push(url.pathname + url.search);
  };

  const handleItemRemoval = (remainingItemsCount: number) => {
    // If after deleting, current page is empty and not first page, go to previous page
    if (remainingItemsCount > 0 && 
        currentPage > 1 && 
        remainingItemsCount <= (currentPage - 1) * itemsPerPage) {
      router.push(`${window.location.pathname}?page=${currentPage - 1}`);
    }
  };

  return {
    currentPage,
    totalPages,
    getCurrentPageData,
    handlePageChange,
    handleItemRemoval
  };
}

export default usePagination;