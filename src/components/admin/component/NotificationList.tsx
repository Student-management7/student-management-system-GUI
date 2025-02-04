import React, { useState } from 'react';

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
  { id: 4, type: 'expiry', message: 'Hogwarts School subscription expires in 1 week', read: true },
  { id: 5, type: 'payment', message: 'Payment received from Xavier\'s School for Gifted Youngsters', read: true },
];

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'expiry' | 'payment' | 'system'>('all');

  const filteredNotifications = notifications.filter(
    notification => filter === 'all' || notification.type === filter
  );

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

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
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Alerts and Notifications</h1>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All</option>
          <option value="expiry">Expiry Reminders</option>
          <option value="payment">Payment Reminders</option>
          <option value="system">System Alerts</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <li key={notification.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${getNotificationColor(notification.type)} rounded-full px-2 py-1`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="text-sm text-gray-500">{notification.message}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationList;

