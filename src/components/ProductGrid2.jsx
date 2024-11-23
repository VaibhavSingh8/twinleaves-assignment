// import { DataGrid } from "@mui/x-data-grid";
// import { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Typography,
//   CardContent,
//   Card,
//   IconButton,
//   Tooltip,
//   Button,
//   Chip,
//   useTheme,
// } from "@mui/material";
// import { ShoppingCart, FilterList, Search, Clear } from "@mui/icons-material";
// import productsData from "../data/data.json";

const ProductGrid2 = () => {
  //   const theme = useTheme();
  //   const [products, setProducts] = useState([]);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [category, setCategory] = useState("all");
  //   const [sortModel, setSortModel] = useState([]);
  //   const [cartItems, setCartItems] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     try {
  //       const transformedProducts = productsData.products.map(
  //         (product, index) => ({
  //           id: product.id || index,
  //           name: product.name,
  //           brand: product.brand,
  //           mrp: product.mrp,
  //           image: product.image || "/placeholder.png",
  //           category: product.main_category,
  //           description: product.description,
  //         })
  //       );
  //       setProducts(transformedProducts);
  //     } catch (error) {
  //       console.error("Error loading products:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, []);
  //   const styleConstants = {
  //     colors: {
  //       headerBg: theme.palette.primary.main + "08",
  //       chipBorder: theme.palette.primary.light,
  //       hoverBg: theme.palette.primary.main + "0A",
  //       gridBorder: theme.palette.divider,
  //     },
  //     transitions: {
  //       default: "all 0.2s ease-in-out",
  //     },
  //   };
  //   const handleAddToCart = (product) => {
  //     setCartItems((prev) => [...prev, product]);
  //   };
  //   const columns = [
  //     {
  //       field: "image",
  //       headerName: "Product",
  //       flex: 2,
  //       minWidth: 300,
  //       renderCell: (params) => (
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             gap: 2,
  //             transition: styleConstants.transitions.default,
  //             "&:hover img": {
  //               transform: "scale(1.05)",
  //               boxShadow: theme.shadows[4],
  //             },
  //           }}
  //         >
  //           <Box
  //             component="img"
  //             sx={{
  //               height: 60,
  //               width: 60,
  //               objectFit: "cover",
  //               borderRadius: 1,
  //               border: `1px solid ${styleConstants.colors.gridBorder}`,
  //               transition: styleConstants.transitions.default,
  //             }}
  //             src={params.row.image}
  //             alt={params.row.name}
  //           />
  //           <Box>
  //             <Typography
  //               variant="subtitle2"
  //               sx={{
  //                 fontWeight: 500,
  //                 color: theme.palette.text.primary,
  //               }}
  //             >
  //               {params.row.name}
  //             </Typography>
  //           </Box>
  //         </Box>
  //       ),
  //     },
  //     {
  //       field: "mrp",
  //       headerName: "Price",
  //       flex: 1,
  //       minWidth: 120,
  //       renderCell: (params) => (
  //         <Box
  //           sx={{
  //             width: "100%",
  //             height: "100%",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "flex-start",
  //           }}
  //         >
  //           <Typography
  //             variant="subtitle2"
  //             sx={{
  //               color: "#4caf50",
  //               fontWeight: 600,
  //               padding: "4px 8px",
  //               borderRadius: 1,
  //               display: "flex",
  //               alignItems: "center",
  //             }}
  //           >
  //             ₹{params.row.mrp?.mrp.toFixed(2) || 0}
  //           </Typography>
  //         </Box>
  //       ),
  //     },
  //     {
  //       field: "brand",
  //       headerName: "Brand",
  //       flex: 1,
  //       minWidth: 150,
  //       sortable: false,
  //       disableColumnMenu: true,
  //       renderCell: (params) => (
  //         <Chip
  //           label={params.row.brand || "Unknown"}
  //           size="small"
  //           sx={{
  //             borderColor: styleConstants.colors.chipBorder,
  //             "&:hover": {
  //               backgroundColor: styleConstants.colors.hoverBg,
  //             },
  //             transition: styleConstants.transitions.default,
  //           }}
  //         />
  //       ),
  //     },
  //     {
  //       field: "actions",
  //       headerName: "Actions",
  //       flex: 0.5,
  //       minWidth: 100,
  //       sortable: false,
  //       disableColumnMenu: true,
  //       renderCell: (params) => (
  //         <Tooltip title="Add to Cart">
  //           <IconButton
  //             onClick={() => handleAddToCart(params.row)}
  //             color="primary"
  //             size="small"
  //           >
  //             <ShoppingCart />
  //           </IconButton>
  //         </Tooltip>
  //       ),
  //     },
  //   ];
  //   const categories = [
  //     "all",
  //     ...new Set(products.map((product) => product.category).filter(Boolean)),
  //   ];
  //   const filteredProducts = products
  //     .filter((product) =>
  //       product.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //     .filter((product) =>
  //       category === "all" ? true : product.category === category
  //     );
  //   const handleClearFilters = () => {
  //     setSearchTerm("");
  //     setCategory("all");
  //     setSortModel([]);
  //   };
  //   return (
  //     <Card
  //       elevation={3}
  //       sx={{
  //         borderRadius: 2,
  //         overflow: "hidden",
  //         "& .MuiCardContent-root": {
  //           padding: theme.spacing(3),
  //         },
  //       }}
  //     >
  //       <CardContent>
  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             mb: 3,
  //             borderBottom: `1px solid ${theme.palette.divider}`,
  //             pb: 2,
  //           }}
  //         >
  //           <Typography
  //             variant="h5"
  //             component="h2"
  //             sx={{
  //               fontWeight: 600,
  //               color: theme.palette.text.primary,
  //             }}
  //           >
  //             Product Catalog
  //           </Typography>
  //           <Tooltip title={`Cart Items: ${cartItems.length}`}>
  //             <IconButton
  //               color="primary"
  //               sx={{
  //                 "&:hover": {
  //                   backgroundColor: styleConstants.colors.hoverBg,
  //                 },
  //               }}
  //             >
  //               <ShoppingCart />
  //               {cartItems.length > 0 && (
  //                 <Chip
  //                   label={cartItems.length}
  //                   size="small"
  //                   color="primary"
  //                   sx={{
  //                     position: "absolute",
  //                     top: -5,
  //                     right: -5,
  //                     minWidth: 20,
  //                     height: 20,
  //                   }}
  //                 />
  //               )}
  //             </IconButton>
  //           </Tooltip>
  //         </Box>
  //         <Box
  //           sx={{
  //             mb: 3,
  //             display: "flex",
  //             gap: 2,
  //             alignItems: "flex-end",
  //             flexWrap: "wrap",
  //           }}
  //         >
  //           <TextField
  //             label="Search Products"
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //             variant="outlined"
  //             size="small"
  //             sx={{ flexGrow: 1, minWidth: 200 }}
  //             inputProps={{
  //               startAdornment: <Search color="action" sx={{ mr: 1 }} />,
  //               endAdornment: searchTerm && (
  //                 <IconButton size="small" onClick={() => setSearchTerm("")}>
  //                   <Clear />
  //                 </IconButton>
  //               ),
  //             }}
  //           />
  //           <FormControl sx={{ minWidth: 200 }} size="small">
  //             <InputLabel id="category-select-label">Category</InputLabel>
  //             <Select
  //               labelId="category-select-label"
  //               value={category}
  //               label="Category"
  //               onChange={(e) => setCategory(e.target.value)}
  //               startAdornment={<FilterList color="action" sx={{ mr: 1 }} />}
  //             >
  //               {categories.map((cat) => (
  //                 <MenuItem key={cat} value={cat}>
  //                   {cat === "all" ? "All Categories" : cat}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //           </FormControl>
  //           {(searchTerm || category !== "all" || sortModel.length > 0) && (
  //             <Button
  //               variant="outlined"
  //               size="small"
  //               onClick={handleClearFilters}
  //               startIcon={<Clear />}
  //             >
  //               Clear Filters
  //             </Button>
  //           )}
  //         </Box>
  //         <Box sx={{ height: 600, width: "100%" }}>
  //           <DataGrid
  //             rows={filteredProducts}
  //             columns={columns}
  //             pageSize={10}
  //             rowsPerPageOptions={[5, 10, 20]}
  //             checkboxSelection
  //             disableRowSelectionOnClick
  //             sortModel={sortModel}
  //             onSortModelChange={(model) => setSortModel(model)}
  //             loading={loading}
  //             sx={{
  //               border: "none",
  //               "& .MuiDataGrid-cell:focus": {
  //                 outline: "none",
  //               },
  //               "& .MuiDataGrid-row:hover": {
  //                 backgroundColor: styleConstants.colors.hoverBg,
  //                 cursor: "pointer",
  //               },
  //               "& .MuiDataGrid-columnHeaders": {
  //                 backgroundColor: styleConstants.colors.headerBg,
  //                 borderBottom: `1px solid ${styleConstants.colors.gridBorder}`,
  //               },
  //               "& .MuiDataGrid-cell": {
  //                 borderBottom: `1px solid ${styleConstants.colors.gridBorder}`,
  //               },
  //               "& .MuiDataGrid-footerContainer": {
  //                 borderTop: `1px solid ${styleConstants.colors.gridBorder}`,
  //               },
  //               "& .MuiCheckbox-root": {
  //                 color: theme.palette.primary.main,
  //               },
  //             }}
  //           />
  //         </Box>
  //       </CardContent>
  //     </Card>
  //   );
};

export default ProductGrid2;
