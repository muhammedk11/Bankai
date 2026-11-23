import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

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
    retry: 2,
  });

  // Get the latest wishlist record
  const getWishlistRecord = async () => {
    const response = await api.get("/wishlists", {
      params: { userId },
    });

    return response.data[0] || null;
  };

  // Refresh wishlist after a successful change
  const refreshWishlist = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  // Add a product
 // Add a product
const addItem = useMutation({
  mutationFn: async (productId) => {
    const wishlist = await getWishlistRecord();

    const productIds = wishlist?.productIds || [];
    const id = String(productId);

    // Prevent duplicate products
    if (productIds.some((item) => String(item) === id)) {
      return { alreadyExists: true };
    }

    const updatedProductIds = [...productIds, id];

    if (wishlist) {
      await api.patch(`/wishlists/${wishlist.id}`, {
        productIds: updatedProductIds,
      });
    } else {
      await api.post("/wishlists", {
        userId,
        productIds: updatedProductIds,
      });
    }

    return { alreadyExists: false };
  },

  onSuccess: (result) => {
    refreshWishlist();

    if (result.alreadyExists) {
      toast("Product is already in your wishlist");
    } else {
      toast.success("Added to wishlist!");
    }
  },

  onError: () => {
    toast.error("Failed to add product to wishlist");
  },
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

  onSuccess: () => {
    refreshWishlist();
    toast.success("Removed from wishlist!");
  },

  onError: () => {
    toast.error("Failed to remove product from wishlist");
  },
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
    refetch: wishlistQuery.refetch,
    isFetching: wishlistQuery.isFetching,

    addItem,
    removeItem,
    clearWishlist,
  };
};