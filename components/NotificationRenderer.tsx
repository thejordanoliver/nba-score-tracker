// /components/NotificationRenderer.tsx
import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { GameNotificationBanner } from "./GameNotificationBanner";

export default function NotificationRenderer() {
  const { notifications, onDismiss } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <GameNotificationBanner notifications={notifications} onDismiss={onDismiss} />
  );
}
