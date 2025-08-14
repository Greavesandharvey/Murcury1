import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, User, MapPin, Phone, Mail, CreditCard, Plus, Search, Filter, Pencil, Eye } from "lucide-react";
import CustomerForm, { CustomerFormData } from "@/components/CustomerForm";
import CustomerDetails from "@/components/CustomerDetails";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for now - will be replaced with API calls
  const customers = [
    {
      id: 1,
      type: 'individual',
      title: 'Mr',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '01234 567890',
      addressLine1: '123 High Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      creditLimit: 0,
      paymentTerms: 30,
      active: true
    },
    {
      id: 2,
      type: 'business',
      companyName: 'Acme Furniture Ltd',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@acmefurniture.com',
      phone: '01234 987654',
      addressLine1: '456 Business Park',
      city: 'Manchester',
      postcode: 'M1 1AA',
      creditLimit: 5000,
      paymentTerms: 60,
      vatNumber: 'GB123456789',
      active: true
    }
  ];

  const getCustomerDisplayName = (customer: any) => {
    if (customer.type === 'business' && customer.companyName) {
      return customer.companyName;
    }
    const parts = [];
    if (customer.title) parts.push(customer.title);
    if (customer.firstName) parts.push(customer.firstName);
    if (customer.lastName) parts.push(customer.lastName);
    return parts.join(' ') || 'Unnamed Customer';
  };

  const handleCreateCustomer = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would be an API call
      console.log('Creating customer:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsAddDialogOpen(false);
      // Would refresh customer list here
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would be an API call
      console.log('Updating customer:', editingCustomer.id, data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditingCustomer(null);
      // Would refresh customer list here
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (data: CustomerFormData) => {
    if (editingCustomer) {
      handleUpdateCustomer(data);
    } else {
      handleCreateCustomer(data);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold divine-gradient-text">Customers</h1>
          <p className="text-slate-400">Manage individual and business customer relationships</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm 
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers, company, email, postcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="p-2 rounded-md bg-slate-800 border border-slate-700"
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Customer Types</option>
              <option value="individual">Individual Customers</option>
              <option value="business">Business Customers</option>
            </select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {customer.type === 'business' ? 
                          <Building className="w-4 h-4" /> : 
                          <User className="w-4 h-4" />
                        }
                        {getCustomerDisplayName(customer)}
                      </div>
                      {customer.type === 'business' && customer.firstName && customer.lastName && (
                        <div className="text-sm text-muted-foreground">
                          Contact: {customer.firstName} {customer.lastName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.type === 'business' ? 'default' : 'secondary'}>
                      {customer.type === 'business' ? 'Business' : 'Individual'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1 text-sm">
                      <MapPin className="w-3 h-3 mt-0.5" />
                      <div>
                        {customer.city}
                        {customer.postcode && <div className="font-mono">{customer.postcode}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      £{parseFloat(customer.creditLimit || 0).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>{customer.paymentTerms} days</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCustomer(customer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setViewingCustomer(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm 
              defaultValues={{
                type: editingCustomer.type,
                title: editingCustomer.title || '',
                firstName: editingCustomer.firstName || '',
                lastName: editingCustomer.lastName || '',
                companyName: editingCustomer.companyName || '',
                email: editingCustomer.email || '',
                phone: editingCustomer.phone || '',
                mobile: editingCustomer.mobile || '',
                addressLine1: editingCustomer.addressLine1 || '',
                addressLine2: editingCustomer.addressLine2 || '',
                city: editingCustomer.city || '',
                county: editingCustomer.county || '',
                postcode: editingCustomer.postcode || '',
                country: editingCustomer.country || 'United Kingdom',
                dateOfBirth: editingCustomer.dateOfBirth || '',
                notes: editingCustomer.notes || '',
                creditLimit: parseFloat(editingCustomer.creditLimit) || 0,
                paymentTerms: editingCustomer.paymentTerms || 30,
                vatNumber: editingCustomer.vatNumber || '',
                marketingEmail: editingCustomer.marketingPreferences?.email || false,
                marketingPhone: editingCustomer.marketingPreferences?.phone || false,
                marketingPost: editingCustomer.marketingPreferences?.post || false,
                marketingSMS: editingCustomer.marketingPreferences?.sms || false,
              }}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingCustomer} onOpenChange={(open) => !open && setViewingCustomer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && <CustomerDetails customer={viewingCustomer} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
