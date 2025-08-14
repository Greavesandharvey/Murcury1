import React, { useState, useEffect } from "react";
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '/api/customers';
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching customers: ${response.status}`);
      }
      
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setError('Failed to load customers. Please try again later.');
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load customers on component mount and when filters change
  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, selectedType]);

  const getCustomerDisplayName = (customer: any) => {
    if (customer.type === 'business' && customer.company_name) {
      return customer.company_name;
    }
    const parts = [];
    if (customer.title) parts.push(customer.title);
    if (customer.first_name) parts.push(customer.first_name);
    if (customer.last_name) parts.push(customer.last_name);
    return parts.join(' ') || 'Unnamed Customer';
  };

  const handleCreateCustomer = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Creating customer with data:', data);
      
      // Fix any potential issues with data types
      const formattedData = {
        ...data,
        creditLimit: parseFloat(data.creditLimit?.toString() || '0'),
        paymentTerms: parseInt(data.paymentTerms?.toString() || '30'),
      };
      
      console.log('Formatted data:', formattedData);
      
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to create customer';
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Only try to parse as JSON if we have content
      if (responseText) {
        try {
          JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Response is not valid JSON:', parseError);
        }
      }
      
      setIsAddDialogOpen(false);
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error('Error creating customer:', error);
      alert(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating customer with data:', data);
      
      // Fix any potential issues with data types
      const formattedData = {
        ...data,
        creditLimit: parseFloat(data.creditLimit?.toString() || '0'),
        paymentTerms: parseInt(data.paymentTerms?.toString() || '30'),
      };
      
      console.log('Formatted data:', formattedData);
      
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to update customer';
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Only try to parse as JSON if we have content
      if (responseText) {
        try {
          JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Response is not valid JSON:', parseError);
        }
      }
      
      setEditingCustomer(null);
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(`Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading customers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button className="mt-4" onClick={fetchCustomers}>Try Again</Button>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <p>No customers found. Add your first customer to get started.</p>
            </div>
          ) : (
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
                        {customer.type === 'business' && customer.first_name && customer.last_name && (
                          <div className="text-sm text-muted-foreground">
                            Contact: {customer.first_name} {customer.last_name}
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
                        £{parseFloat(customer.credit_limit || 0).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>{customer.payment_terms || 30} days</TableCell>
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
          )}
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
                firstName: editingCustomer.first_name || '',
                lastName: editingCustomer.last_name || '',
                companyName: editingCustomer.company_name || '',
                email: editingCustomer.email || '',
                phone: editingCustomer.phone || '',
                mobile: editingCustomer.mobile || '',
                addressLine1: editingCustomer.address_line_1 || '',
                addressLine2: editingCustomer.address_line_2 || '',
                city: editingCustomer.city || '',
                county: editingCustomer.county || '',
                postcode: editingCustomer.postcode || '',
                country: editingCustomer.country || 'United Kingdom',
                dateOfBirth: editingCustomer.date_of_birth ? new Date(editingCustomer.date_of_birth).toISOString().split('T')[0] : '',
                notes: editingCustomer.notes || '',
                creditLimit: parseFloat(editingCustomer.credit_limit) || 0,
                paymentTerms: editingCustomer.payment_terms || 30,
                vatNumber: editingCustomer.vat_number || '',
                marketingEmail: editingCustomer.marketing_preferences?.email || false,
                marketingPhone: editingCustomer.marketing_preferences?.phone || false,
                marketingPost: editingCustomer.marketing_preferences?.post || false,
                marketingSMS: editingCustomer.marketing_preferences?.sms || false,
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
