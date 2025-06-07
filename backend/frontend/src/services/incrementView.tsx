// utils/incrementView.ts

export const incrementView = async (productId: string, currentView: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products/${productId}/view`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ view: currentView + 1 }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to increment view count");
    }
  } catch (error) {
    console.error("Error incrementing view:", error);
  }
};
