import { useSelector } from "react-redux";

export const useProducts = () => useSelector((state) => state.products);
export const useFilters = () => useSelector((state) => state.filters);
export const useCart = () => useSelector((state) => state.cart);
