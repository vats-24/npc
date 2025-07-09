import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => (
  <div
    className={`bg-neutral-800 border border-neutral-500 rounded-lg shadow-lg p-4 md:p-6 flex flex-col ${className}`}
  >
    <h2 className="text-lg font-semibold text-neutral-200 border-b border-neutral-700 pb-3 mb-4">
      {title}
    </h2>
    <div className="flex-grow">{children}</div>
  </div>
);

export default Card;
