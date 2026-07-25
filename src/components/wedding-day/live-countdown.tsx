/**
 * Live Countdown
 * Real-time countdown to key wedding moments
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveCountdownProps {
  weddingDate: string;
  lang: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function LiveCountdown({ weddingDate, lang }: LiveCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    if (!weddingDate) return;

    const calculateTime = () => {
      const now = new Date();
      const wedding = new Date(weddingDate);

      // Reset wedding date to today if comparing dates
      const weddingDay = new Date(wedding);
      weddingDay.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      const diff = weddingDay.getTime() - now.getTime();

      // Check if wedding is today
      const today = now.toDateString() === wedding.toDateString();
      setIsToday(today);

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    const initialTime = calculateTime();
    setTimeRemaining(initialTime);

    const interval = setInterval(() => {
      setTimeRemaining(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  if (!weddingDate) {
    return null;
  }

  const title = lang === "en" ? "Live Countdown" : "Đếm Ngược Trực Tiếp";
  const weddingDayText = lang === "en" ? "Wedding Day" : "Ngày Cưới";
  const daysText = lang === "en" ? "Days" : "Ngày";
  const hoursText = lang === "en" ? "Hours" : "Giờ";
  const minutesText = lang === "en" ? "Minutes" : "Phút";
  const secondsText = lang === "en" ? "Seconds" : "Giây";
  const todayText = lang === "en" ? "TODAY!" : "HÔM NAY!";

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          {isToday && (
            <Badge variant="destructive" className="text-lg px-3 py-1">
              {todayText}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-1">{weddingDayText}</p>
          <p className="text-lg font-semibold">
            {new Date(weddingDate).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-primary">{timeRemaining.days}</div>
            <div className="text-xs text-muted-foreground mt-1">{daysText}</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-primary">{timeRemaining.hours}</div>
            <div className="text-xs text-muted-foreground mt-1">{hoursText}</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-primary">{timeRemaining.minutes}</div>
            <div className="text-xs text-muted-foreground mt-1">{minutesText}</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-primary">{timeRemaining.seconds}</div>
            <div className="text-xs text-muted-foreground mt-1">{secondsText}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
