"use client";

import { useRoommateConnections, useRoommateRequests } from "@/hooks";

export type ConnectionState = "none" | "sent" | "received" | "connected";

// Where the tenant stands with each other tenant (by user id), so cards show the right action
export function useConnectionState() {
  const sent = useRoommateRequests({
    type: "sent",
    status: "PENDING",
    limit: 100,
  });
  const received = useRoommateRequests({
    type: "received",
    status: "PENDING",
    limit: 100,
  });
  const connections = useRoommateConnections({ limit: 100 });

  const states = new Map<string, ConnectionState>();
  for (const request of sent.data?.data ?? []) {
    states.set(request.receiverId, "sent");
  }
  for (const request of received.data?.data ?? []) {
    states.set(request.senderId, "received");
  }
  for (const connection of connections.data?.data ?? []) {
    states.set(connection.user.id, "connected");
  }

  return (userId: string): ConnectionState => states.get(userId) ?? "none";
}
