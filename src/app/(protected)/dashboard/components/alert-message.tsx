import { CircleX, TriangleAlert } from "lucide-react";
import React from "react";

type AlertType = "error" | "warning";

interface AlertMessageProps {
  type: AlertType;
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  const styles = {
    error: {
      icon: <CircleX className="w-5 h-5" />,
      bg: "bg-destructive/10",
      border: "border-destructive",
      text: "text-destructive",
    },
    warning: {
      icon: <TriangleAlert className="w-5 h-5" />,
      bg: "bg-warning/10",
      border: "border-warning",
      text: "text-warning",
    },
  };

  const { icon, bg, border, text } = styles[type];

  return (
    <div className="flex justify-center pt-10">
      <div
        className={`${bg} ${border} ${text} border-2 px-4 py-3 rounded relative flex items-center max-w-2xl w-full`}
        role="alert"
      >
        <div className="flex items-center font-bold mr-2">
          {icon}
          <span className="capitalize ml-2">{type}:</span>
        </div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default AlertMessage;
