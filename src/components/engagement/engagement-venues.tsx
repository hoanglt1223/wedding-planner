/**
 * Engagement Venues Component
 * Venue selection and planning for engagement ceremony
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, Home, Building } from "lucide-react";
import { useState } from "react";

interface EngagementVenuesProps {
  venue: string;
  onSetVenue: (venue: string) => void;
  engagementDate: string;
  lang: "vi" | "en";
}

export function EngagementVenues({ venue, onSetVenue, engagementDate, lang }: EngagementVenuesProps) {
  const en = lang === "en";

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: venue || "",
    address: "",
    contact: "",
    notes: "",
  });

  const handleSaveVenue = () => {
    if (newVenue.name.trim()) {
      onSetVenue(newVenue.name);
      setShowAddForm(false);
    }
  };

  // Common venue suggestions
  const venueSuggestions = en ? [
    { name: "Bride's Family Home", icon: "home", hint: "Traditional venue at bride's house" },
    { name: "Groom's Family Home", icon: "home", hint: "Alternate venue at groom's house" },
    { name: "Restaurant", icon: "building", hint: "Restaurant with private dining room" },
    { name: "Community Hall", icon: "building", hint: "Local community event space" },
    { name: "Hotel", icon: "building", hint: "Hotel with ceremony facilities" },
  ] : [
    { name: "Nhà cô dâu", icon: "home", hint: "Địa điểm truyền thống tại nhà cô dâu" },
    { name: "Nhà chú rể", icon: "home", hint: "Địa điểm thay thế tại nhà chú rể" },
    { name: "Nhà hàng", icon: "building", hint: "Nhà hàng có phòng riêng" },
    { name: "Hội trường", icon: "building", hint: "Không gian sự kiện cộng đồng" },
    { name: "Khách sạn", icon: "building", hint: "Khách sạn có cơ sở tổ chức lễ" },
  ];

  return (
    <div className="space-y-4">
      {/* Current Venue */}
      {venue && !showAddForm && (
        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--theme-primary)]" />
              {en ? "Current Venue" : "Địa điểm hiện tại"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {en ? "Venue" : "Địa điểm"}
                </p>
                <p className="text-lg font-semibold">{venue}</p>
              </div>
              {engagementDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{engagementDate}</span>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setShowAddForm(true)}
                className="w-full"
              >
                {en ? "Change Venue" : "Thay đổi địa điểm"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Venue Form */}
      {(!venue || showAddForm) && (
        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardHeader>
            <CardTitle className="text-lg">
              {venue ? (en ? "Edit Venue" : "Chỉnh sửa địa điểm") : (en ? "Select Venue" : "Chọn địa điểm")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{en ? "Venue Name" : "Tên địa điểm"}</Label>
              <Input
                value={newVenue.name}
                onChange={(e) => setNewVenue(prev => ({ ...prev, name: e.target.value }))}
                placeholder={en ? "e.g., Bride's Family Home" : "ví dụ: Nhà cô dâu"}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{en ? "Address (optional)" : "Địa chỉ (tùy chọn)"}</Label>
              <Input
                value={newVenue.address}
                onChange={(e) => setNewVenue(prev => ({ ...prev, address: e.target.value }))}
                placeholder={en ? "e.g., 123 Wedding Street" : "ví dụ: 123 Đường Đám Cưới"}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{en ? "Contact Phone (optional)" : "Số điện thoại (tùy chọn)"}</Label>
              <Input
                value={newVenue.contact}
                onChange={(e) => setNewVenue(prev => ({ ...prev, contact: e.target.value }))}
                placeholder={en ? "e.g., 0909 123 456" : "ví dụ: 0909 123 456"}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{en ? "Notes (optional)" : "Ghi chú (tùy chọn)"}</Label>
              <Textarea
                value={newVenue.notes}
                onChange={(e) => setNewVenue(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={en ? "Any special arrangements or requirements..." : "Bất kỳ sắp xếp hoặc yêu cầu đặc biệt..."}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveVenue} className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]">
                {en ? "Save Venue" : "Lưu địa điểm"}
              </Button>
              {venue && (
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  {en ? "Cancel" : "Hủy"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Venue Suggestions */}
      {!showAddForm && (
        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardHeader>
            <CardTitle className="text-base">
              {en ? "Popular Venues" : "Địa điểm phổ biến"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {venueSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSetVenue(suggestion.name);
                    setShowAddForm(true);
                    setNewVenue(prev => ({ ...prev, name: suggestion.name }));
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--theme-border)] hover:bg-[var(--theme-surface-hover)] transition-colors text-left"
                >
                  {suggestion.icon === "home" ? (
                    <Home className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Building className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{suggestion.name}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Venue Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900">
                {en ? "Venue Tips" : "Mẹo địa điểm"}
              </p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• {en ? "Traditional: Hold at bride's family home" : "Truyền thống: Tổ chức tại nhà cô dâu"}</li>
                <li>• {en ? "Ensure enough space for both families" : "Đảm bảo đủ không gian cho cả hai gia đình"}</li>
                <li>• {en ? "Consider parking availability for guests" : "Cân nhắc chỗ đỗ xe cho khách"}</li>
                <li>• {en ? "Have backup plan for outdoor ceremonies" : "Có phương án dự phòng cho lễ ngoài trời"}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}