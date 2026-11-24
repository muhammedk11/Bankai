import { useQuery, useMutation,useQueryClient,} from "@tanstack/react-query";
import api from "../../services/api";

// Fetch orders
const fetchOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchOrders,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/orders/${id}`, {
        status,
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminOrders"],
      });
    },
  });
};
