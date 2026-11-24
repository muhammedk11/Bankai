
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../../services/api";

const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Fetch users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers,
  });
};

// Block or unblock a user
export const useToggleUserBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isBlocked }) => {
      const response = await api.patch(`/users/${id}`, {
        isBlocked,
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });
};
