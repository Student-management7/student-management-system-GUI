import React from "react";

interface NotificationCardProps {
  category: string;
  description: string;
  className?: string[];
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  category,
  description,
  className = [],
}) => {
  return (
    <div className={`notification-card ${category.toLowerCase()}`}>
      <h6 className="fw-bold text-capitalize">{category}</h6>
      <p className="m-0">{description}</p>
      {className.length > 0 && (
        <small>Classes: {className.join(", ")}</small>
      )}
    </div>
  );
};

export default NotificationCard;


