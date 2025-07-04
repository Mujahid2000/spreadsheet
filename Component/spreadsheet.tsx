"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import {
  Search,
  Bell,
  ChevronRight,
  MoreHorizontal,
  EyeOff,
  ArrowUpDown,
  Filter,
  Grid3X3,
  Download,
  Upload,
  Share,
  Plus,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler } from "react-hook-form"

interface Cell {
  value: string
  style?: {
    backgroundColor?: string
    textColor?: string
    fontWeight?: string
    textAlign?: string
  }
}

interface CellPosition {
  row: number
  col: number
}

type Inputs = {
  column: string
}



// Initial column headers
const initialColumnHeaders = [
  "", // Row numbers column
  "Job Request",
  "Submitted",
  "Status",
  "Submitter",
  "URL",
  "Priority",
  "Due Date",
  "Est Value",
  "ADD",
]
const ROWS = 50

// Initial project data - empty
const initialProjectData: { [key: string]: Cell } = {}

export default function Spreadsheet() {
  const [cells, setCells] = useState<{ [key: string]: Cell }>(initialProjectData)
  const [selectedCell, setSelectedCell] = useState<CellPosition>({ row: 1, col: 1 })
  const [formulaBarValue, setFormulaBarValue] = useState("")
  const [activeTab, setActiveTab] = useState("All Orders")
  const [columnHeaders, setColumnHeaders] = useState(initialColumnHeaders) // Now a state variable
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State to control dialog
  const cellRefs = useRef<{ [key: string]: HTMLInputElement }>({})
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.column) {
      // Remove "ADD", add new column, then append "ADD"
      setColumnHeaders((prev) => {
        const newHeaders = prev.filter((header) => header !== "ADD")
        newHeaders.push(data.column, "ADD")
        return newHeaders
      })
      
      setIsDialogOpen(false) // Close the modal
      reset() // Reset the form
    }
  }

  const getCellKey = (row: number, col: number) => `${row}-${col}`

  const getAutoStyle = (value: string): Cell["style"] | undefined => {
    const lowerValue = value.toLowerCase().trim()
    if (lowerValue === "in-progress") {
      return { backgroundColor: "#fef3c7", textColor: "#92400e" }
    }
    if (lowerValue === "need to start") {
      return { backgroundColor: "#dbeafe", textColor: "#1e40af" }
    }
    if (lowerValue === "complete") {
      return { backgroundColor: "#dcfce7", textColor: "#166534" }
    }
    if (lowerValue === "blocked") {
      return { backgroundColor: "#fee2e2", textColor: "#dc2626" }
    }
    if (lowerValue === "high") {
      return { backgroundColor: "#fee2e2", textColor: "#dc2626" }
    }
    if (lowerValue === "medium") {
      return { backgroundColor: "#fef3c7", textColor: "#92400e" }
    }
    if (lowerValue === "low") {
      return { backgroundColor: "#dbeafe", textColor: "#1e40af" }
    }
    return undefined
  }

  const getColumnLabel = (col: number) => {
    if (col === 0) return ""
    return columnHeaders[col] || String.fromCharCode(65 + col - 9)
  }

  useEffect(() => {
    const key = getCellKey(selectedCell.row, selectedCell.col)
    const cell = cells[key]
    setFormulaBarValue(cell?.value || "")
  }, [selectedCell, cells])

  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    const key = getCellKey(row, col)
    const autoStyle = getAutoStyle(value)
    setCells((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: value,
        style: autoStyle || prev[key]?.style,
      },
    }))
  }, [])

  const handleFormulaBarChange = useCallback(
    (value: string) => {
      setFormulaBarValue(value)
      handleCellChange(selectedCell.row, selectedCell.col, value)
    },
    [selectedCell, handleCellChange],
  )

  const tabs = ["All Orders", "Pending", "Reviewed", "Arrived"]

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span>Folder 2</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Spreadsheet 3</span>
            <MoreHorizontal className="w-4 h-4 ml-2" />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search within sheet" className="pl-10 w-64 h-8 text-sm" />
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                1
              </div>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700">John Doe</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm">
                  Tool bar
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Show all tools</DropdownMenuItem>
                <DropdownMenuItem>Customize toolbar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="text-sm">
              <EyeOff className="w-4 h-4 mr-1" />
              Hide fields
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <ArrowUpDown className="w-4 h-4 mr-1" />
              Sort
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Grid3X3 className="w-4 h-4 mr-1" />
              Cell view
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-sm">
              <Download className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Upload className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
              <Plus className="w-4 h-4 mr-1" />
              New Action
            </Button>
          </div>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="border-b border-gray-200 px-2 py-2">
        <div className="flex items-center gap-3">
          <div className="w-18 text-sm text-wrap font-medium text-gray-600 text-center">
            {selectedCell.col > 0 ? `${getColumnLabel(selectedCell.col)}${selectedCell.row}` : ""}
          </div>
          <Input
            value={formulaBarValue}
            onChange={(e) => handleFormulaBarChange(e.target.value)}
            className="flex-1 h-8"
            placeholder="Enter formula or value"
          />
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/* Column Headers */}
          <div className="flex sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            {columnHeaders.map((header, col) => (
              <div
                key={col}
                className={`${
                  col === 0 ? "w-12" : columnHeaders[col] === "ADD" ? "w-32" : "w-54"
                } h-8 border-r border-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-50 px-2`}
              >
                {header === "ADD" ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="text-sm">
                        +
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Column</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="column">Column Name</Label>
                          <Input
                            id="column"
                            {...register("column", { required: "Column name is required" })}
                            placeholder="Enter column name"
                          />
                          {errors.column && (
                            <p className="text-sm text-red-500">{errors.column.message}</p>
                          )}
                        </div>
                        <Button type="submit">Add Column</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <p>{col === 0 ? "" : header}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="inline-block min-w-full">
            {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: columnHeaders.length }, (_, col) => {
              const key = getCellKey(row + 1, col)
              const cell = cells[key] || { value: "", style: {} }
              const cellStyle = {
                backgroundColor: cell.style?.backgroundColor || "white",
                color: cell.style?.textColor || "black",
                fontWeight: cell.style?.fontWeight || "normal",
                textAlign: (cell.style?.textAlign as React.CSSProperties["textAlign"]) || "left",
              }

              if (col === 0) {
                // Show serial number in the first column
                return (
                <div
                  key={key}
                  className="w-12 h-8 border border-gray-200 px-2 text-sm flex items-center justify-center bg-gray-50"
                  style={cellStyle}
                >
                  {row + 1}
                </div>
                )
              }

              return (
                <input
                key={key}
                ref={(el) => { cellRefs.current[key] = el!; }}
                type="text"
                value={cell.value}
                onChange={(e) => handleCellChange(row + 1, col, e.target.value)}
                onFocus={() => setSelectedCell({ row: row + 1, col })}
                className={`${
                  columnHeaders[col] === "ADD" ? "w-32" : "w-54"
                } h-8 border border-gray-200 px-2 text-sm`}
                style={cellStyle}
                />
              )
              })}
            </div>
            ))}
      </div>
      {/* Bottom Tabs */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="flex items-center px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600 bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
          <Button variant="ghost" size="sm" className="ml-2">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}