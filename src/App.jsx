import { useSelector } from "react-redux";
import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import { Box } from "@mui/material";

function App() {
  const { selectedProduct } = useSelector((state) => state.products);

  return (
    <Box sx={{ p: 3 }}>
      {selectedProduct ? <ProductDetails /> : <ProductGrid />}
    </Box>
  );
}

export default App;
