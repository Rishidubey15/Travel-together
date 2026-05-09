import { useNotifications } from "../contexts/NotificationContext";

const NOTIFICATION_TYPES = {
  RIDE_REQUEST: "join_request",
  VERIFICATION: "verification",
};

export default function NotificationCard({ notification }) {
  const { markAsRead } = useNotifications();

  switch (notification.type) {
    case NOTIFICATION_TYPES.RIDE_REQUEST:
      return (
        <div
          onClick={() => {
            if (!notification.read) {
              markAsRead(notification._id);
            }
          }}
          className={`px-4 py-3 cursor-pointer transition-colors ${
            notification.read
              ? "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30"
              : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                New join request from {notification.requesterName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Route: {notification.routeLabel}
              </p>
              {notification.pickupPoint && (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pickup: {notification.pickupPoint}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            {!notification.read && (
              <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-teal-500" />
            )}
          </div>
        </div>
      );
    default:
      return null;
  }
}