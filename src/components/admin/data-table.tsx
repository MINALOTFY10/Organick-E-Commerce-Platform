"use client";

import { ReactNode, useRef, useEffect } from "react";

export interface Column<T> {
  header: string;
  className?: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyState?: ReactNode;
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Return a stable unique string id for each row (required when selectable=true) */
  getRowId?: (item: T) => string;
  /** Controlled set of selected ids */
  selectedIds?: Set<string>;
  /** Called with the new set whenever selection changes */
  onSelectionChange?: (ids: Set<string>) => void;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  emptyState,
  selectable,
  getRowId,
  selectedIds,
  onSelectionChange,
}: DataTableProps<T>) {
  const headerCheckRef = useRef<HTMLInputElement>(null);
  const allSelected = selectable && data.length > 0 && selectedIds?.size === data.length;
  const someSelected = selectable && !!selectedIds && selectedIds.size > 0 && selectedIds.size < data.length;

  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = !!someSelected;
    }
  }, [someSelected]);

  const toggleRow = (id: string) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (!onSelectionChange || !selectedIds || !getRowId) return;
    onSelectionChange(
      selectedIds.size === data.length ? new Set() : new Set(data.map(getRowId)),
    );
  };

  return (
    <div className="bg-[#1a3d32] rounded-xl border border-[#2a4d42] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0d2820] border-b border-[#2a4d42]">
            <tr>
              {selectable && (
                <th className="px-4 py-4 w-10">
                  <input
                    ref={headerCheckRef}
                    type="checkbox"
                    checked={!!allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded cursor-pointer accent-[#00ff7f]"
                  />
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a4d42]">
            {data.map((item, rowIndex) => {
              const id = getRowId ? getRowId(item) : String(rowIndex);
              const isSelected = !!selectedIds?.has(id);
              return (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors hover:bg-[#0d2820]/50 ${onRowClick ? "cursor-pointer" : ""} ${isSelected ? "bg-[#00ff7f]/5" : ""}`}
                >
                  {selectable && (
                    <td className="px-4 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        className="w-4 h-4 rounded cursor-pointer accent-[#00ff7f]"
                      />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 ${col.className || ""}`}>
                      {col.cell
                        ? col.cell(item)
                        : (item[col.accessorKey as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {data.length === 0 && emptyState && (
          <div className="text-center py-12">{emptyState}</div>
        )}
      </div>
    </div>
  );
}