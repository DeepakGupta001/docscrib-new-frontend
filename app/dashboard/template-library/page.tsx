import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Pencil, Star, Plus, Search, Filter, Globe, Heart } from "lucide-react"
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Dashboard - DocScrib",
    description: "Session note-taking and transcription page.",
    canonical: "/dashboard/template-library",
  })
}

export default function TemplatesPage() {
  const templates = [
    { name: "Accident and Emergency Nurse's note", type: "Note", uses: 0, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "ED admission note", type: "Document", uses: 0, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: true },
    { name: "ED discharge summary", type: "Document", uses: 0, lastUsed: "-", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "H & P", type: "Note", uses: 12, lastUsed: "Sep 15, 2025", creator: "Heidi", visibility: "Just me", favorite: true },
    { name: "H & P (Issues)", type: "Note", uses: 5, lastUsed: "Sep 10, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "Issues List", type: "Note", uses: 8, lastUsed: "Sep 12, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "Patient explainer letter", type: "Document", uses: 3, lastUsed: "Sep 5, 2025", creator: "Heidi", visibility: "Just me", favorite: true },
    { name: "Referral letter", type: "Document", uses: 7, lastUsed: "Sep 8, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "SMART goals", type: "Document", uses: 9, lastUsed: "Sep 14, 2025", creator: "Heidi", visibility: "Just me", favorite: false },
    { name: "SOAP", type: "Note", uses: 15, lastUsed: "Sep 16, 2025", creator: "Heidi", visibility: "Just me", favorite: true },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Templates</h1>
          <p className="text-muted-foreground">Manage your templates and create new ones</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            Browse community
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create template
          </Button>
        </div>
      </div>

      {/* Favourites */}
      <div>
        <h2 className="text-lg font-medium mb-3">Favourites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.filter(t => t.favorite).map((t, i) => (
            <Card key={i} className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium line-clamp-1">{t.name}</CardTitle>
                  <Badge variant="secondary">{t.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{t.uses} uses</span>
                  <span>{t.lastUsed}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="flex items-center justify-center text-muted-foreground cursor-pointer border-dashed h-full min-h-[132px]">
            <CardContent className="text-center p-4">
              <Plus className="h-6 w-6 mx-auto mb-1" />
              <p className="text-sm">Add to favourites</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Library */}
      <div>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for a template" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="recent">Recently used</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Creator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All creators</SelectItem>
                <SelectItem value="me">Just me</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Template name</TableHead>
                <TableHead className="hidden sm:table-cell">Uses</TableHead>
                <TableHead className="hidden md:table-cell">Last used</TableHead>
                <TableHead className="hidden lg:table-cell">Creator</TableHead>
                <TableHead className="hidden lg:table-cell">Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t, i) => (
                <TableRow key={i} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.name}</span>
                      <Badge variant="secondary" className="hidden xs:inline-flex">{t.type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                      <Badge variant="outline" className="text-xs">Uses: {t.uses}</Badge>
                      {t.lastUsed !== "-" && <Badge variant="outline" className="text-xs">Used: {t.lastUsed}</Badge>}
                      <Badge variant="outline" className="text-xs">By: {t.creator}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{t.uses}</TableCell>
                  <TableCell className="hidden md:table-cell">{t.lastUsed}</TableCell>
                  <TableCell className="hidden lg:table-cell">{t.creator}</TableCell>
                  <TableCell className="hidden lg:table-cell">{t.visibility}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${t.favorite ? "text-amber-500" : ""}`}
                      >
                        <Star className={`h-4 w-4 ${t.favorite ? "fill-amber-500" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Change visibility</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}