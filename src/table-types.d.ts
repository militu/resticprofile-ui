import "@tanstack/react-table";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    className?: string;
    toggleable?: boolean;
    defaultToggle?: boolean;
  }
}
