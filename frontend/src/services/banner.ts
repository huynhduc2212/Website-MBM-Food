export const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/banners");
      if (!res.ok) throw new Error("Failed to fetch banners");
      
      const result = await res.json();
      return result.data; // API trả về { data: banners }
    } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
  };
  