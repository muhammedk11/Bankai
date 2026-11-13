
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useWishlist = (userId) => {
  const queryClient = useQueryClient();

  const queryKey = ["wishlist", userId];

  // Fetch the logged-in user's wishlist
  const wishlistQuery = useQuery({
    queryKey,
    enabled: Boolean(userId),
    queryFn: async () => {
      const response = await api.get("/wishlists", {
        params: { userId },
      });

      return response.data[0] || null;
    },
  });

  // Get the latest wishlist record
  const getWishlistRecord = async () => {
    const response = await api.get("/wishlists", {
      params: { userId },
    });

    return response.data[0] || null;
  };

  const refreshWishlist = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // Add a product
  const addItem = useMutation({
    mutationFn: async (productId) => {
      const wishlist = await getWishlistRecord();

      const productIds = wishlist?.productIds || [];
      const id = String(productId);

      // Prevent duplicate products
      if (productIds.some((item) => String(item) === id)) {
        return wishlist;
      }

      const updatedProductIds = [...productIds, id];

      if (wishlist) {
        return api.patch(`/wishlists/${wishlist.id}`, {
          productIds: updatedProductIds,
        });
      }

      return api.post("/wishlists", {
        userId,
        productIds: updatedProductIds,
      });
    },
    onSuccess: refreshWishlist,
  });

  // Remove a product
  const removeItem = useMutation({
    mutationFn: async (productId) => {
      const wishlist = await getWishlistRecord();

      if (!wishlist) return;

      const updatedProductIds = wishlist.productIds.filter(
        (id) => String(id) !== String(productId)
      );

      return api.patch(`/wishlists/${wishlist.id}`, {
        productIds: updatedProductIds,
      });
    },
    onSuccess: refreshWishlist,
  });

  // Clear the wishlist
  const clearWishlist = useMutation({
    mutationFn: async () => {
      const wishlist = await getWishlistRecord();

      if (!wishlist) return;

      return api.patch(`/wishlists/${wishlist.id}`, {
        productIds: [],
      });
    },
    onSuccess: refreshWishlist,
  });

  return {
    wishlist: wishlistQuery.data,
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    addItem,
    removeItem,
    clearWishlist,
  };
};

