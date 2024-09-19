import { ActionResponse } from "@/types";
import { ReactNode } from "react";
import AlertMessage from "../alert-message";

interface DataTableContainerProps<T> {
  title?: string;
  isLoading: boolean;
  actionResponse: ActionResponse<T>;
  emptyMessage: string;
  children: (data: T) => ReactNode;
}

export function DataTableContainer<T>({
  title,
  actionResponse,
  emptyMessage,
  children,
}: DataTableContainerProps<T>) {
  if (!actionResponse.success) {
    return (
      <AlertMessage
        message={actionResponse.error || "Unexpected error"}
        type="error"
      />
    );
  }

  if (
    !actionResponse.data ||
    (Array.isArray(actionResponse.data) && actionResponse.data.length === 0)
  ) {
    return <AlertMessage message={emptyMessage} type="warning" />;
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {children(actionResponse.data)}
    </div>
  );
}
