import React from "react";

type Action<T> = {
  label: string;
  onClick: (row: T) => void;
};

type Column<T> = {
  key?: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type ReusableTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
};

export function ReusableTable<T extends { _id?: number | string }>({
  data,
  columns,
  actions,
}: ReusableTableProps<T>) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="border p-2 bg-gray-100">
              {col.header}
            </th>
          ))}
          {actions && actions.length > 0 && (
            <th className="border p-2">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id}>
            {columns.map((col) => (
              <td
                key={col.key ? String(col.key) : col.header}
                className="border p-2"
              >
                {col.render
                  ? col.render(col.key ? row[col.key] : undefined, row)
                  : col.key
                    ? (row[col.key] as React.ReactNode)
                    : null}
              </td>
            ))}
            {actions && actions.length > 0 && (
              <td className="border p-2 flex gap-2">
                {actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => action.onClick(row)}
                    className="px-2 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
