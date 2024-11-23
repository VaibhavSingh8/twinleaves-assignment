import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { fetchProducts } from "../store/slices/productSlice";
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

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage + 1));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPageSize(newPageSize));
    dispatch(setPage(1));
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
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {quantity > 0 ? (
              <>
                <IconButton
                  size="small"
                  onClick={() => handleUpdateQuantity(params.row, -1)}
                  color="primary"
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ minWidth: "30px", textAlign: "center" }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleUpdateQuantity(params.row, 1)}
                  color="primary"
                >
                  <Add />
                </IconButton>
              </>
            ) : (
              <Tooltip title="Add to Cart">
                <IconButton
                  onClick={() => handleAddToCart(params.row)}
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

  const categories = [
    "all",
    ...new Set(
      items
        .map((product) => product.main_category)
        .filter(Boolean)
        .sort()
    ),
  ];

  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
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
          <Tooltip title={`Cart Items: ${totalCartItems}`}>
            <IconButton
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: styleConstants.colors.hoverBg,
                },
              }}
            >
              <ShoppingCart />
              {totalCartItems > 0 && (
                <Chip
                  label={totalCartItems}
                  size="small"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    minWidth: 20,
                    height: 20,
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
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

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={items || []}
            columns={columns}
            loading={loading}
            rowCount={totalCount}
            paginationMode="server"
            page={page - 1}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            rowsPerPageOptions={[5, 10, 20, 50]}
            pagination
            checkboxSelection
            disableRowSelectionOnClick
            sortModel={sortModel}
            onSortModelChange={(model) => {
              dispatch(setSortModel(model));
              dispatch(setPage(1));
            }}
            getRowId={(row) => row.sku_code || row.gtin || row.id}
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography>No products found</Typography>
                </Box>
              ),
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: styleConstants.colors.hoverBg,
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: styleConstants.colors.headerBg,
                borderBottom: `1px solid ${styleConstants.colors.gridBorder}`,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${styleConstants.colors.gridBorder}`,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${styleConstants.colors.gridBorder}`,
              },
              "& .MuiCheckbox-root": {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductGrid;
