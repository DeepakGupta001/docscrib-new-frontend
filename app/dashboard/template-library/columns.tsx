"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Star } from "lucide-react"

export type Template = {
  id?: number
  name: string
  type: string
  uses: number
  lastUsed: string
  creator: string
  visibility: string
  favorite: boolean
  content?: string
  pdfUrl?: string
  isDefault?: boolean
  highlightContribution?: boolean
}

interface ColumnsProps {
  onEdit?: (template: Template) => void
  onFavorite?: (template: Template) => void
  onDelete?: (template: Template) => void
  onChangeVisibility?: (template: Template) => void
}

export const createColumns = ({ onEdit, onFavorite, onDelete, onChangeVisibility }: ColumnsProps): ColumnDef<Template>[] => [
  {
    accessorKey: "name",
    header: "Template name",
    cell: ({ row }) => {
      const template = row.original
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{template.name}</span>
          <Badge 
            variant={template.type === "PDF" ? "destructive" : template.type === "Document" ? "default" : "secondary"}
            className="text-xs"
          >
            {template.type}
          </Badge>
          <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
            <Badge variant="outline" className="text-xs">
              Uses: {template.uses}
            </Badge>
            {template.lastUsed !== "-" && (
              <Badge variant="outline" className="text-xs">
                Used: {template.lastUsed}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              By: {template.creator}
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "uses",
    header: "Uses",
    cell: ({ row }) => <div className="hidden sm:table-cell">{row.getValue("uses")}</div>,
  },
  {
    accessorKey: "lastUsed",
    header: "Last used",
    cell: ({ row }) => <div className="hidden md:table-cell">{row.getValue("lastUsed")}</div>,
  },
  {
    accessorKey: "creator",
    header: "Creator",
    cell: ({ row }) => <div className="hidden lg:table-cell">{row.getValue("creator")}</div>,
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => <div className="hidden lg:table-cell">{row.getValue("visibility")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const template = row.original

      return (
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onEdit?.(template)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${template.favorite ? "text-amber-500" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFavorite?.(template)
            }}
          >
            <Star className={`h-4 w-4 ${template.favorite ? "fill-amber-500" : ""}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem   onClick={() => onEdit?.(template)}>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              {/* <DropdownMenuItem>Rename</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => onChangeVisibility?.(template)}>Change visibility</DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete?.(template)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
