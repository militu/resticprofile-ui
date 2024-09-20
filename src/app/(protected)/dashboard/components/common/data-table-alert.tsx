import AlertMessage from "../alert-message";
import { DataTableStructure } from "./data-table-structure";

interface DataTableAlertProps {
  message: string;
  type: "error" | "warning";
}

export default function DataTableAlert({ message, type }: DataTableAlertProps) {
  return (
    <DataTableStructure>
      <AlertMessage message={message} type={type} />
    </DataTableStructure>
  );
}
