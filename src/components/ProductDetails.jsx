import { useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Grid,
  Divider,
  Drawer,
  Badge,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  ShoppingCart,
  Add,
  Remove,
  ArrowBack,
  Clear,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";
import { setSelectedProduct } from "../store/slices/productSlice";
import { useState } from "react";
import { useTheme } from "@mui/material";

function ProductDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!selectedProduct) {
    return null;
  }

  const cartColumns = [
    {
      field: "image",
      headerName: "Product",
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            sx={{
              height: 50,
              width: 50,
              objectFit: "cover",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
            src={params.row.images?.front || "https://via.placeholder.com/50"}
            alt={params.row.name}
          />
          <Typography variant="body2">{params.row.name}</Typography>
        </Box>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(params.row, -1);
            }}
          >
            <Remove />
          </IconButton>
          <Typography>{params.row.quantity}</Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(params.row, 1);
            }}
          >
            <Add />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="primary.main">
          ₹
          {((params.row.mrp?.mrp || 0) * (params.row.quantity || 0)).toFixed(2)}
        </Typography>
      ),
    },
  ];

  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems.find(
      (item) =>
        item.sku_code === productId ||
        item.gtin === productId ||
        item.cartId === productId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...selectedProduct,
      cartId:
        selectedProduct.sku_code || selectedProduct.gtin || selectedProduct.id,
    };
    dispatch(addToCart(cartItem));
  };

  const handleUpdateQuantity = (product, delta) => {
    const cartId = product.sku_code || product.gtin || product.id;
    const currentQuantity = getCartItemQuantity(cartId);
    const newQuantity = currentQuantity + delta;

    if (newQuantity <= 0) {
      dispatch(removeFromCart(cartId));
    } else {
      dispatch(
        updateQuantity({
          cartId,
          quantity: newQuantity,
        })
      );
    }
  };

  const quantity = getCartItemQuantity(
    selectedProduct.sku_code || selectedProduct.gtin || selectedProduct.id
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.mrp?.mrp || 0) * item.quantity,
    0
  );

  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={() => dispatch(setSelectedProduct(null))}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              component="h2"
              sx={{ flexGrow: 1, fontWeight: 600 }}
            >
              Product Details
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
              <IconButton color="primary" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart />
              </IconButton>
            </Badge>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={
                  selectedProduct.images?.front ||
                  "https://via.placeholder.com/300"
                }
                alt={selectedProduct.name}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  mb: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {selectedProduct.name}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Chip label={selectedProduct.brand || "Unknown Brand"} />
                <Chip label={selectedProduct.main_category} color="primary" />
              </Box>

              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ₹{selectedProduct.mrp?.mrp?.toFixed(2) || 0}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}
              >
                {quantity > 0 ? (
                  <>
                    <IconButton
                      onClick={() => handleUpdateQuantity(selectedProduct, -1)}
                      color="primary"
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: "40px", textAlign: "center" }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleUpdateQuantity(selectedProduct, 1)}
                      color="primary"
                    >
                      <Add />
                    </IconButton>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                )}
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Product Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">SKU Code</Typography>
                    <Typography>{selectedProduct.sku_code}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">GTIN</Typography>
                    <Typography>{selectedProduct.gtin}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
                  hideFooter
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
    </Box>
  );
}

export default ProductDetails;
