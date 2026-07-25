/**
 * Quick Vendor Dial
 * One-tap call buttons for all vendors and important contacts
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import type { Vendor, WeddingContact } from "@/types/wedding";

interface QuickVendorDialProps {
  vendors: Vendor[];
  contacts: WeddingContact[];
  lang: string;
}

export function QuickVendorDial({ vendors, contacts, lang }: QuickVendorDialProps) {
  const title = lang === "en" ? "Quick Vendor Dial" : "Gọi Nhà Cung Cấp";
  const callText = lang === "en" ? "Call" : "Gọi";
  const noVendorsText = lang === "en" ? "No vendors added yet" : "Chưa thêm nhà cung cấp";

  // Filter vendors that have phone numbers
  const vendorsWithPhone = vendors.filter(v => v.phone && v.phone.trim() !== "");

  // Filter contacts for wedding party and important categories
  const importantContacts = contacts.filter(
    c => c.phone && c.phone.trim() !== "" &&
    (c.category === "wedding-party" || c.category === "family" || c.category === "venue")
  );

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Phone className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vendors Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">
            {lang === "en" ? "Vendors" : "Nhà Cung Cấp"}
          </h3>
          {vendorsWithPhone.length === 0 ? (
            <p className="text-sm text-muted-foreground">{noVendorsText}</p>
          ) : (
            <div className="grid gap-2">
              {vendorsWithPhone.map(vendor => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {vendor.category}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCall(vendor.phone)}
                    className="ml-2"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {callText}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Important Contacts Section */}
        {importantContacts.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">
              {lang === "en" ? "Important Contacts" : "Liên Hệ Quan Trọng"}
            </h3>
            <div className="grid gap-2">
              {importantContacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{contact.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {contact.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCall(contact.phone)}
                    className="ml-2"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {callText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
