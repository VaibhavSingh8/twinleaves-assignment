import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchProducts,
  setSelectedProduct,
} from "../store/slices/productSlice";
import {
  setPage,
  setPageSize,
  setSearchTerm,
  setCategory,
  setSortModel,
  clearFilters,
} from "../store/slices/filterSlice";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  CardContent,
  Card,
  IconButton,
  Tooltip,
  Button,
  Chip,
  useTheme,
  Badge,
  Drawer,
} from "@mui/material";
import {
  ShoppingCart,
  FilterList,
  Search,
  Clear,
  Add,
  Remove,
} from "@mui/icons-material";

const ProductGrid = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { items, loading, totalCount } = useSelector((state) => state.products);
  const { page, pageSize, searchTerm, category, sortModel } = useSelector(
    (state) => state.filters
  );
  const { items: cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (page > 0 && pageSize > 0) {
      dispatch(
        fetchProducts({
          page,
          pageSize,
          searchTerm: searchTerm || "",
          category: category || "all",
          sortModel: sortModel || [],
        })
      );
    }
  }, [dispatch, page, pageSize, searchTerm, category, sortModel]);

  const styleConstants = {
    colors: {
      headerBg: theme.palette.primary.main + "08",
      chipBorder: theme.palette.primary.light,
      hoverBg: theme.palette.primary.main + "0A",
      gridBorder: theme.palette.divider,
    },
    transitions: {
      default: "all 0.2s ease-in-out",
    },
  };

  const [searchValue, setSearchValue] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(searchValue));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems.find(
      (item) =>
        item.sku_code === productId ||
        item.gtin === productId ||
        item.cartId === productId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      ...product,
      cartId: product.sku_code || product.gtin || product.id,
    };
    dispatch(addToCart(cartItem));
  };

  const handleUpdateQuantity = (product, delta) => {
    const currentQuantity = getCartItemQuantity(
      product.sku_code || product.gtin || product.id
    );
    const newQuantity = currentQuantity + delta;

    if (newQuantity <= 0) {
      dispatch(removeFromCart(product.sku_code || product.gtin || product.id));
    } else {
      dispatch(
        updateQuantity({
          cartId: product.sku_code || product.gtin || product.id,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const columns = [
    {
      field: "image",
      headerName: "Product",
      flex: 2,
      minWidth: 300,
      headerAlign: "left",
      renderCell: (params) => (
        <Box
          onClick={() => dispatch(setSelectedProduct(params.row))}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pl: 2,
            cursor: "pointer",
            transition: styleConstants.transitions.default,
            "&:hover img": {
              transform: "scale(1.05)",
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Box
            component="img"
            sx={{
              height: 60,
              width: 60,
              objectFit: "cover",
              borderRadius: 1,
              border: `1px solid ${styleConstants.colors.gridBorder}`,
              transition: styleConstants.transitions.default,
            }}
            src={params.row.images?.front || "https://via.placeholder.com/60"}
            alt={params.row.name}
          />
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                mt: -0.5,
              }}
            >
              {params.row.name}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "mrp",
      headerName: "Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "#4caf50",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: 1,
            }}
          >
            ₹{params.row.mrp?.mrp?.toFixed(2) || 0}
          </Typography>
        </Box>
      ),
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Chip
          label={params.row.brand || "Unknown"}
          size="small"
          sx={{
            borderColor: styleConstants.colors.chipBorder,
            "&:hover": {
              backgroundColor: styleConstants.colors.hoverBg,
            },
            transition: styleConstants.transitions.default,
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const quantity = getCartItemQuantity(
          params.row.sku_code || params.row.gtin || params.row.id
        );

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.5,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {quantity > 0 ? (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateQuantity(params.row, -1);
                  }}
                  color="primary"
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ minWidth: "30px", textAlign: "center" }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateQuantity(params.row, 1);
                  }}
                  color="primary"
                >
                  <Add />
                </IconButton>
              </>
            ) : (
              <Tooltip title="Add to Cart">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(params.row);
                  }}
                  color="primary"
                  size="small"
                >
                  <ShoppingCart />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  const [allCategories, setAllCategories] = useState(["all"]);

  useEffect(() => {
    const newCategories = [
      "all",
      ...new Set(
        items
          .map((product) => product.main_category)
          .filter(Boolean)
          .sort()
      ),
    ];

    setAllCategories((prev) => {
      const combinedCategories = [...new Set([...prev, ...newCategories])];
      return combinedCategories.sort();
    });
  }, [items]);

  const categories = allCategories;

  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const cartColumns = [
    {
      field: "name",
      headerName: "Product",
      flex: 2,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "mrp",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => `₹${params.row.mrp?.mrp?.toFixed(2) || 0}`,
    },
  ];

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.mrp?.mrp || 0),
    0
  );

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        "& .MuiCardContent-root": {
          padding: theme.spacing(3),
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Product Catalog
          </Typography>
          <Badge
            badgeContent={totalCartItems}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                right: 2,
                top: 2,
                border: `2px solid ${theme.palette.background.paper}`,
                padding: "0 4px",
              },
            }}
          >
            <IconButton
              color="primary"
              onClick={() => setIsCartOpen(true)}
              sx={{
                "&:hover": {
                  backgroundColor: styleConstants.colors.hoverBg,
                },
              }}
            >
              <ShoppingCart />
            </IconButton>
          </Badge>
        </Box>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Search Products"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              endAdornment: searchValue && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchValue("");
                    dispatch(setSearchTerm(""));
                  }}
                >
                  <Clear />
                </IconButton>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label="Category"
              onChange={(e) => {
                dispatch(setCategory(e.target.value));
                dispatch(setPage(1));
              }}
              startAdornment={<FilterList color="action" sx={{ mr: 1 }} />}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(searchValue || category !== "all" || sortModel.length > 0) && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            height:
              items.length > 0
                ? `${Math.min(800, 100 + items.length * 54)}px`
                : "400px",
          }}
        >
          <DataGrid
            rows={items || []}
            columns={columns}
            loading={loading}
            rowCount={totalCount}
            paginationMode="server"
            sortingMode="server"
            onSortModelChange={(model) => {
              dispatch(setSortModel(model));
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pageSize,
                  page: page - 1,
                },
              },
            }}
            onPaginationModelChange={(model) => {
              dispatch(setPage(model.page + 1));
              if (model.pageSize !== pageSize) {
                dispatch(setPageSize(model.pageSize));
              }
            }}
            checkboxSelection
            disableRowSelectionOnClick={false}
            getRowId={(row) => row.sku_code || row.gtin || row.id}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: styleConstants.colors.headerBg,
                borderBottom: `1px solid ${styleConstants.colors.gridBorder}`,
              },
              "& .MuiDataGrid-row": {
                cursor: "default",
              },
            }}
          />
        </Box>
      </CardContent>
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            padding: 2,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Shopping Cart</Typography>
            <IconButton onClick={() => setIsCartOpen(false)}>
              <Clear />
            </IconButton>
          </Box>

          {cartItems.length > 0 ? (
            <>
              <Box sx={{ height: "calc(100vh - 280px)", width: "100%" }}>
                <DataGrid
                  rows={cartItems}
                  columns={cartColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  getRowId={(row) => row.cartId || row.sku_code || row.gtin}
                />
              </Box>

              <Box
                sx={{
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  mt: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Total: ₹{totalAmount.toFixed(2)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    dispatch(clearCart());
                    setIsCartOpen(false);
                  }}
                >
                  Place Order
                </Button>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography>Your cart is empty</Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Card>
  );
};

export default ProductGrid;
