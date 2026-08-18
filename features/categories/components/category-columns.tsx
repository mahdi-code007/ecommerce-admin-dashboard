"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/features/categories/types";

type CategoryColumnActions = {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  getParentName: (parentId: string) => string;
};

export function getCategoryColumns({
  onEdit,
  onDelete,
  getParentName,
}: CategoryColumnActions): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row }) => (
        <div className="max-w-56">
          <p className="truncate font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.slug}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <p className="max-w-72 truncate text-muted-foreground">
          {row.original.description}
        </p>
      ),
    },
    {
      id: "parent",
      header: "Parent",
      cell: ({ row }) =>
        row.original.parentId
          ? getParentName(row.original.parentId)
          : "Root",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontalIcon />
              <span className="sr-only">Open actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
