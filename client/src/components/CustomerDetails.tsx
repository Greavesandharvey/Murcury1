import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, User, MapPin, Phone, Mail, CreditCard } from "lucide-react";

interface CustomerDetailsProps {
  customer: any;
}

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {customer.type === 'business' ? 
                <Building className="w-5 h-5" /> : 
                <User className="w-5 h-5" />
              }
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {getCustomerDisplayName(customer)}
            </div>
            <div>
              <span className="font-medium">Type:</span>{' '}
              <Badge variant={customer.type === 'business' ? 'default' : 'secondary'}>
                {customer.type === 'business' ? 'Business' : 'Individual'}
              </Badge>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{customer.mobile} (Mobile)</span>
              </div>
            )}
            {customer.vat_number && (
              <div>
                <span className="font-medium">VAT Number:</span> {customer.vat_number}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>{customer.address_line_1}</div>
              {customer.address_line_2 && <div>{customer.address_line_2}</div>}
              <div>{customer.city}</div>
              {customer.county && <div>{customer.county}</div>}
              <div className="font-mono">{customer.postcode}</div>
              <div>{customer.country || 'United Kingdom'}</div>
            </div>
          </CardContent>
        </Card>

        {customer.type === 'business' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Business Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Credit Limit:</span> £{parseFloat(customer.credit_limit || 0).toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Payment Terms:</span> {customer.payment_terms} days
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Marketing Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customer.marketing_preferences?.email && <Badge variant="outline">Email</Badge>}
              {customer.marketing_preferences?.phone && <Badge variant="outline">Phone</Badge>}
              {customer.marketing_preferences?.post && <Badge variant="outline">Post</Badge>}
              {customer.marketing_preferences?.sms && <Badge variant="outline">SMS</Badge>}
              {!customer.marketing_preferences?.email && 
               !customer.marketing_preferences?.phone && 
               !customer.marketing_preferences?.post && 
               !customer.marketing_preferences?.sms && 
                <span className="text-sm text-slate-400">No marketing preferences selected</span>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{customer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
