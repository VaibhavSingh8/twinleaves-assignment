import localProductsData from "../data/data.json";

const API_URL = "/api/cms/products";

export const fetchProducts = async (
  page = 1,
  pageSize = 5,
  searchTerm = "",
  category = "all",
  sortModel = []
) => {
  try {
    const response = await fetch(
      `${API_URL}?page=${page}&limit=${pageSize}${
        searchTerm ? `&search=${searchTerm}` : ""
      }${category !== "all" ? `&category=${category}` : ""}${
        sortModel.length > 0
          ? `&sort=${sortModel[0].field}&order=${sortModel[0].sort}`
          : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`API failed with status ${response.status}`);
    }

    const data = await response.json();
    const transformedData = {
      ...data,
      products: data.products.map((product) => ({
        ...product,
        id:
          product.id ||
          product.sku_code ||
          product.gtin ||
          Math.random().toString(36).substr(2, 9),
      })),
    };

    return {
      success: true,
      data: transformedData,
      source: "api",
    };
  } catch (error) {
    console.log("API fetch failed, falling back to local data:", error);

    try {
      let filteredData = localProductsData.products.map((product) => ({
        ...product,
        id:
          product.id ||
          product.sku_code ||
          product.gtin ||
          Math.random().toString(36).substr(2, 9),
      }));

      if (searchTerm) {
        filteredData = filteredData.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (category && category !== "all") {
        filteredData = filteredData.filter(
          (product) => product.main_category === category
        );
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);

      return {
        success: true,
        data: {
          products: paginatedData,
          total: filteredData.length,
        },
        source: "local",
      };
    } catch (localError) {
      return {
        success: false,
        error: localError.message,
        source: "none",
      };
    }
  }
};
