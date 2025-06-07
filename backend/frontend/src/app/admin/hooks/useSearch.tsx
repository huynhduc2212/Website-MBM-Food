import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseSearchProps<T> {
  items: T[];
  searchProperty: keyof T;
  initialPage?: number;
}

export function useSearch<T>({ 
  items, 
  searchProperty, 
  initialPage = 1 
}: UseSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const router = useRouter();

  useEffect(() => {
    // Filter items based on search term
    const filtered = items.filter((item) => {
      const propertyValue = String(item[searchProperty]).toLowerCase();
      return propertyValue.includes(searchTerm.toLowerCase());
    });
    
    setFilteredItems(filtered);
    
    // Reset to page 1 when searching changes results
    if (searchTerm) {
      router.push(`${window.location.pathname}?page=1`);
    }
  }, [items, searchTerm, searchProperty, router]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    handleSearchChange
  };
}

export default useSearch;