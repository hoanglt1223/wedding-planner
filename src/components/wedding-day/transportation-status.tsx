/**
 * Transportation Status
 * Display pickup/dropoff times and transportation info
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Bus, Users, Clock, MapPin } from "lucide-react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

interface TransportationStatusProps {
  lang: string;
}

export function TransportationStatus({ lang }: TransportationStatusProps) {
  const { state } = useWeddingStoreContext();

  const title = lang === "en" ? "Transportation Status" : "Tình Trạng Vận Chuyển";
  const noTransportText = lang === "en"
    ? "No transportation arranged yet"
    : "Chưa sắp xếp vận chuyển";

  // Get transportation data from state if available
  const transportGroups = state.transportationGroups || [];

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "bus":
        return <Bus className="w-5 h-5" />;
      case "shuttle":
        return <Users className="w-5 h-5" />;
      case "car":
        return <Car className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (transportGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Car className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{noTransportText}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Car className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transportGroups.map(group => (
            <div key={group.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTransportIcon(group.transportType)}
                  <div>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {group.vehicleInfo}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {group.guestIds.length} {lang === "en" ? "guests" : "khách"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {lang === "en" ? "Pickup:" : "Đón:"}
                  </span>
                  <span className="font-medium">{formatTime(group.pickupTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {lang === "en" ? "Dropoff:" : "Trả:"}
                  </span>
                  <span className="font-medium">{formatTime(group.dropoffTime)}</span>
                </div>
              </div>

              <div className="flex items-start gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mt-0.5" />
                <div>
                  <div>{group.pickupLocation}</div>
                  <div>→ {group.dropoffLocation}</div>
                </div>
              </div>

              {group.driverName && (
                <div className="text-xs border-t pt-2">
                  <span className="text-muted-foreground">
                    {lang === "en" ? "Driver:" : "Tài xế:"}
                  </span>
                  <span className="font-medium ml-1">{group.driverName}</span>
                  {group.driverPhone && (
                    <a
                      href={`tel:${group.driverPhone}`}
                      className="ml-2 text-primary hover:underline"
                    >
                      {group.driverPhone}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
