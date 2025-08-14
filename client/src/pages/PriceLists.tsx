import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  Eye, 
  Download, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Calculator,
  Filter
} from "lucide-react";

const SUPPLIER_FORMATS = {
  'gplan': 'G-Plan Furniture',
  'parker-knoll': 'Parker Knoll',
  'alstons': 'Alstons Upholstery',
  'duresta': 'Duresta Upholstery'
};

export default function PriceLists() {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [viewingImport, setViewingImport] = useState<any>(null);

  // Mock data for now - will be replaced with API calls
  const imports = [
    {
      id: 1,
      supplierId: 1,
      supplierName: 'G-Plan Furniture',
      fileName: 'gplan_prices_july2025.csv',
      importDate: '2025-07-15T10:30:00',
      status: 'review',
      totalRows: 245,
      validRows: 240,
      errorRows: 5,
      reviewDate: null,
      appliedDate: null
    },
    {
      id: 2,
      supplierId: 2,
      supplierName: 'Parker Knoll',
      fileName: 'pk_wholesale_q3.csv',
      importDate: '2025-07-10T14:15:00',
      status: 'applied',
      totalRows: 182,
      validRows: 180,
      errorRows: 2,
      reviewDate: '2025-07-11T09:20:00',
      appliedDate: '2025-07-11T09:25:00'
    },
    {
      id: 3,
      supplierId: 3,
      supplierName: 'Alstons Upholstery',
      fileName: 'alstons_august_update.csv',
      importDate: '2025-07-05T11:45:00',
      status: 'processing',
      totalRows: 310,
      validRows: 150,
      errorRows: 0,
      reviewDate: null,
      appliedDate: null
    }
  ];

  // Mock data for suppliers
  const suppliers = [
    { id: 1, name: 'G-Plan Furniture' },
    { id: 2, name: 'Parker Knoll' },
    { id: 3, name: 'Alstons Upholstery' },
    { id: 4, name: 'Duresta Upholstery' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold divine-gradient-text">Price Lists</h1>
          <p className="text-slate-400">Manage supplier price list imports and reviews</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Import Price List
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import Supplier Price List</DialogTitle>
            </DialogHeader>
            <PriceListUpload 
              suppliers={suppliers}
              onSuccess={() => {
                setIsUploadDialogOpen(false);
                // In a real app, we would refresh the data here
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers?.map((supplier: any) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="review">Review Required</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedSupplier("all");
                setSelectedStatus("all");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {imports?.filter((imp: any) => imp.status === 'review').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {imports?.filter((imp: any) => imp.status === 'processing').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {imports?.filter((imp: any) => 
                new Date(imp.importDate).getMonth() === new Date().getMonth()
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {imports?.filter((imp: any) => imp.status === 'applied').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Imports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price List Imports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Import Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Valid/Errors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports?.map((importRecord: any) => (
                <TableRow key={importRecord.id}>
                  <TableCell>{importRecord.supplierName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{importRecord.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(importRecord.importDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ImportStatusBadge status={importRecord.status} />
                  </TableCell>
                  <TableCell>{importRecord.totalRows}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">{importRecord.validRows}</span>
                      <span>/</span>
                      <span className="text-red-600">{importRecord.errorRows}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingImport(importRecord)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {importRecord.status === 'review' && (
                        <ReviewButtons importRecord={importRecord} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Import Dialog */}
      <Dialog open={!!viewingImport} onOpenChange={(open) => !open && setViewingImport(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Price List Import Details</DialogTitle>
          </DialogHeader>
          {viewingImport && <ImportDetails importRecord={viewingImport} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Import Status Badge Component
function ImportStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string, icon: React.ElementType }> = {
    pending: { color: 'bg-slate-700 text-slate-100', icon: Minus },
    processing: { color: 'bg-blue-700 text-blue-100', icon: Upload },
    review: { color: 'bg-yellow-700 text-yellow-100', icon: AlertTriangle },
    approved: { color: 'bg-green-700 text-green-100', icon: Check },
    applied: { color: 'bg-green-700 text-green-100', icon: Check },
    rejected: { color: 'bg-red-700 text-red-100', icon: X },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// Price List Upload Component
function PriceListUpload({ suppliers, onSuccess }: { suppliers: any[]; onSuccess: () => void }) {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert("Please select a valid CSV file");
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSupplier || !selectedFormat) {
      alert("Please select supplier, format and file");
      return;
    }

    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Supplier</label>
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map((supplier: any) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPLIER_FORMATS).map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">CSV File</label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-slate-700 hover:border-slate-500">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="hidden" 
            id="csv-upload" 
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            {file ? (
              <p className="text-sm text-slate-400">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            ) : (
              <div>
                <p className="text-sm text-slate-400">
                  Drag and drop a CSV file here, or click to select
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setFile(null)}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!file || !selectedSupplier || !selectedFormat || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Price List"}
        </Button>
      </div>
    </div>
  );
}

// Review Buttons Component
function ReviewButtons({ importRecord }: { importRecord: any }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = () => {
    setIsApproving(true);
    // Simulate API call
    setTimeout(() => {
      setIsApproving(false);
      alert("Price list approved");
      // In a real app, we would refresh the data here
    }, 1000);
  };

  const handleReject = () => {
    setIsRejecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false);
      alert("Price list rejected");
      // In a real app, we would refresh the data here
    }, 1000);
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="default"
        className="bg-green-600 hover:bg-green-700"
        onClick={handleApprove}
        disabled={isApproving}
      >
        <Check className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleReject}
        disabled={isRejecting}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Import Details Component
function ImportDetails({ importRecord }: { importRecord: any }) {
  // Mock data for price list items
  const items = [
    {
      id: 1,
      model: 'Valencia',
      type: 'Sofa',
      material: 'Leather',
      supplierSku: 'VAL-S-L',
      currentCostPrice: 450.00,
      newCostPrice: 475.00,
      marginPercent: 25.5,
      matchConfidence: 100,
      matchMethod: 'exact_sku',
      status: 'matched'
    },
    {
      id: 2,
      model: 'Madrid',
      type: 'Armchair',
      material: 'Fabric',
      supplierSku: 'MAD-A-F',
      currentCostPrice: 280.00,
      newCostPrice: 290.00,
      marginPercent: 22.0,
      matchConfidence: 90,
      matchMethod: 'model_type_material',
      status: 'matched'
    },
    {
      id: 3,
      model: 'Oslo',
      type: 'Footstool',
      material: 'Fabric',
      supplierSku: 'OSL-F-F',
      currentCostPrice: 120.00,
      newCostPrice: 130.00,
      marginPercent: 18.5,
      matchConfidence: 70,
      matchMethod: 'fuzzy_description',
      status: 'matched'
    }
  ];

  const calculatePriceChange = (current: number, newPrice: number) => {
    if (!current || current === 0) return { amount: 0, percent: 0, direction: 'same' };
    
    const amount = newPrice - current;
    const percent = (amount / current) * 100;
    const direction = amount > 0 ? 'up' : amount < 0 ? 'down' : 'same';
    
    return { amount, percent, direction };
  };

  return (
    <div className="space-y-6">
      {/* Import Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Import Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ImportStatusBadge status={importRecord.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rows Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{importRecord.totalRows}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid:</span>
                <span className="text-green-600">{importRecord.validRows}</span>
              </div>
              <div className="flex justify-between">
                <span>Errors:</span>
                <span className="text-red-600">{importRecord.errorRows}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={(importRecord.validRows / importRecord.totalRows) * 100} 
              className="h-2"
            />
            <p className="text-xs text-slate-400 mt-1">
              {Math.round((importRecord.validRows / importRecord.totalRows) * 100)}% processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Price List Items */}
      <Card>
        <CardHeader>
          <CardTitle>Price Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Current Cost</TableHead>
                <TableHead>New Cost</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any) => {
                const priceChange = calculatePriceChange(item.currentCostPrice, item.newCostPrice);
                const margin = item.marginPercent || 0;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {item.model} {item.type}
                        </div>
                        <div className="text-sm text-slate-400">
                          {item.material} | {item.supplierSku}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant={item.matchConfidence > 80 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.matchConfidence}%
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {item.matchMethod}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>£{item.currentCostPrice?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell>£{item.newCostPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {priceChange.direction === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {priceChange.direction === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                        {priceChange.direction === 'same' && <Minus className="w-4 h-4 text-slate-400" />}
                        <span className={
                          priceChange.direction === 'up' ? 'text-red-600' : 
                          priceChange.direction === 'down' ? 'text-green-600' : 
                          'text-slate-400'
                        }>
                          {priceChange.percent.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={margin >= 20 ? 'default' : 'destructive'}
                      >
                        {margin.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'matched' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
