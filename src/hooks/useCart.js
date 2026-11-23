
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import api from "../services/api";

export const useCart = (userId) => {
  const queryClient = useQueryClient();

  const queryKey = ["cart", userId];

  // Fetch the logged-in user's cart
  const cartQuery = useQuery({
    queryKey,
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get("/carts", {
        params: { userId },
      });

      return response.data[0] || null;
    },
    retry: 2,
  });

  // Get the latest cart record from the server
  const getCartRecord = async () => {
    const response = await api.get("/carts", {
      params: { userId },
    });

    return response.data[0] || null;
  };

  // Refresh cart data after a successful change
  const refreshCart = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // Add a product to the cart
  const addItem = useMutation({
    mutationFn: async ({ product, quantity }) => {
      const cart = await getCartRecord();

      const productId = String(product.id);
      const items = cart?.items || [];

      const existingItem = items.find(
        (item) => String(item.productId) === productId
      );

      let updatedItems;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        updatedItems = items.map((item) =>
          String(item.productId) === productId
            ? {
                ...item,
                quantity: Math.min(
                  newQuantity,
                  Number(product.stock)
                ),
              }
            : item
        );
      } else {
        updatedItems = [
          ...items,
          {
            productId,
            quantity: Math.min(
              quantity,
              Number(product.stock)
            ),
          },
        ];
      }

      if (cart) {
        await api.patch(`/carts/${cart.id}`, {
          items: updatedItems,
        });
      } else {
        await api.post("/carts", {
          userId,
          items: updatedItems,
        });
      }

      return {
        productName: product.name,
        alreadyExists: Boolean(existingItem),
      };
    },

    onSuccess: (result) => {
      refreshCart();

      toast.success(
        result.alreadyExists
          ? `${result.productName} quantity updated in cart`
          : `${result.productName} added to cart!`
      );
    },

    onError: () => {
      toast.error("Failed to add product to cart");
    },
  });

  // Update a product's quantity
  const updateItem = useMutation({
    mutationFn: async ({ productId, quantity, stock }) => {
      const cart = await getCartRecord();

      if (!cart) return;

      const updatedItems = cart.items.map((item) =>
        String(item.productId) === String(productId)
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(quantity, Number(stock))
              ),
            }
          : item
      );

      return api.patch(`/carts/${cart.id}`, {
        items: updatedItems,
      });
    },

    onSuccess: () => {
      refreshCart();
      toast.success("Cart quantity updated!");
    },

    onError: () => {
      toast.error("Failed to update cart quantity");
    },
  });

  // Remove a product
  const removeItem = useMutation({
    mutationFn: async (productId) => {
      const cart = await getCartRecord();

      if (!cart) return;

      const updatedItems = cart.items.filter(
        (item) => String(item.productId) !== String(productId)
      );

      return api.patch(`/carts/${cart.id}`, {
        items: updatedItems,
      });
    },

    onSuccess: () => {
      refreshCart();
      toast.success("Product removed from cart!");
    },

    onError: () => {
      toast.error("Failed to remove product from cart");
    },
  });

  // Clear the cart
  const clearCart = useMutation({
    mutationFn: async () => {
      const cart = await getCartRecord();

      if (!cart) return;

      return api.patch(`/carts/${cart.id}`, {
        items: [],
      });
    },

    onSuccess: () => {
      refreshCart();
      toast.success("Cart cleared!");
    },

    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    refetch: cartQuery.refetch,
    isFetching: cartQuery.isFetching,

    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
};
