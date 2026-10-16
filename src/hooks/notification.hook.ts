import {
  type QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api";
import type {
  ApiResponse,
  Notification,
  NotificationQueryParams,
} from "@/types";

const LIST_KEY = ["notifications"];
const COUNT_KEY = ["notifications", "unread-count"];

export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: [...LIST_KEY, params],
    queryFn: () => getNotifications(params),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: COUNT_KEY,
    queryFn: getUnreadNotificationCount,
    // Keep the bell fresh while the dashboard is open
    refetchInterval: 60_000,
  });
}

type ListSnapshot = [QueryKey, ApiResponse<Notification[]> | undefined][];
type CountData = ApiResponse<{ unreadCount: number }>;

// Optimistic update shared by "mark read" and "mark all read": change the cache now, roll back on error
function useOptimisticRead<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  apply: (notification: Notification, variables: TVariables) => boolean,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey: LIST_KEY });
      const lists: ListSnapshot = queryClient.getQueriesData<
        ApiResponse<Notification[]>
      >({ queryKey: LIST_KEY });
      const count = queryClient.getQueryData<CountData>(COUNT_KEY);

      let newlyRead = 0;
      const readIds = new Set<string>();
      for (const [key, data] of lists) {
        if (!data || !Array.isArray(data.data)) continue;
        queryClient.setQueryData<ApiResponse<Notification[]>>(key, {
          ...data,
          data: data.data.map((notification) => {
            if (notification.isRead || !apply(notification, variables)) {
              return notification;
            }
            if (!readIds.has(notification.id)) {
              readIds.add(notification.id);
              newlyRead += 1;
            }
            return {
              ...notification,
              isRead: true,
              readAt: new Date().toISOString(),
            };
          }),
        });
      }

      if (count) {
        queryClient.setQueryData<CountData>(COUNT_KEY, {
          ...count,
          data: {
            unreadCount: Math.max(0, count.data.unreadCount - newlyRead),
          },
        });
      }

      return { lists, count };
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.lists ?? []) {
        queryClient.setQueryData(key, data);
      }
      if (context?.count) queryClient.setQueryData(COUNT_KEY, context.count);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
    },
  });
}

export function useMarkNotificationRead() {
  return useOptimisticRead(
    markNotificationRead,
    (notification, id: string) => notification.id === id,
  );
}

export function useMarkAllNotificationsRead() {
  return useOptimisticRead(
    (_: undefined) => markAllNotificationsRead(),
    () => true,
  );
}
