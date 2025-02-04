import React, { useState, useEffect } from 'react';
import { BellIcon } from 'lucide-react';

interface Notification {
  id: number;
  type: 'expiry' | 'payment' | 'system';
  message: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'expiry', message: 'Springfield Elementary subscription expires in 3 days', read: false },
  { id: 2, type: 'payment', message: 'Payment due for Riverdale High', read: false },
  { id: 3, type: 'system', message: 'Scheduled maintenance in 2 hours', read: false },
];

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'expiry':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment':
        return 'bg-red-100 text-red-800';
      case 'system':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-2 text-sm ${getNotificationColor(notification.type)} ${
                  notification.read ? 'opacity-50' : ''
                }`}
                role="menuitem"
              >
                {notification.message}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-700" role="menuitem">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

