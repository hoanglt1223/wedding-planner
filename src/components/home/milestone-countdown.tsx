import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import type { WeddingState } from "@/types/wedding"

interface Milestone {
  id: string
  labelVi: string
  labelEn: string
  dateKey: keyof WeddingState["info"]
  icon: string
}

const milestones: Milestone[] = [
  {
    id: "engagement",
    labelVi: "Lễ Đính Hôn",
    labelEn: "Engagement Ceremony",
    dateKey: "engagementDate",
    icon: "💍"
  },
  {
    id: "betrothal",
    labelVi: "Lễ Ăn Hỏi / Đám Hỏi",
    labelEn: "Betrothal Ceremony",
    dateKey: "betrothalDate",
    icon: "🏮"
  },
  {
    id: "wedding",
    labelVi: "Lễ Cưới",
    labelEn: "Wedding Day",
    dateKey: "date",
    icon: "💒"
  }
]

interface MilestoneCountdownProps {
  lang: "vi" | "en"
  info: WeddingState["info"]
}

function calculateDaysRemaining(targetDate: string): number {
  if (!targetDate) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getUrgencyLevel(daysRemaining: number): "urgent" | "approaching" | "plenty" | "past" {
  if (daysRemaining < 0) return "past"
  if (daysRemaining <= 30) return "urgent"
  if (daysRemaining <= 90) return "approaching"
  return "plenty"
}

function getUrgencyColor(level: ReturnType<typeof getUrgencyLevel>): string {
  switch (level) {
    case "urgent": return "text-red-600 bg-red-50 border-red-200"
    case "approaching": return "text-amber-600 bg-amber-50 border-amber-200"
    case "plenty": return "text-green-600 bg-green-50 border-green-200"
    case "past": return "text-slate-600 bg-slate-50 border-slate-200"
  }
}

function getUrgencyIcon(level: ReturnType<typeof getUrgencyLevel>) {
  switch (level) {
    case "urgent": return <AlertCircle className="h-4 w-4" />
    case "approaching": return <Clock className="h-4 w-4" />
    case "plenty": return <Calendar className="h-4 w-4" />
    case "past": return <CheckCircle2 className="h-4 w-4" />
  }
}

export function MilestoneCountdown({ lang, info }: MilestoneCountdownProps) {
  const isVietnamese = lang === "vi"

  const milestoneData = milestones
    .filter(m => info[m.dateKey])
    .map(m => {
      const daysRemaining = calculateDaysRemaining(info[m.dateKey] as string)
      const urgencyLevel = getUrgencyLevel(daysRemaining)
      const label = isVietnamese ? m.labelVi : m.labelEn
      const isPast = daysRemaining < 0

      return {
        ...m,
        daysRemaining,
        urgencyLevel,
        label,
        isPast,
        formattedDate: new Date(info[m.dateKey] as string).toLocaleDateString(
          isVietnamese ? "vi-VN" : "en-US",
          { year: "numeric", month: "long", day: "numeric" }
        )
      }
    })
    .sort((a, b) => {
      const dateA = new Date(info[a.dateKey] as string).getTime()
      const dateB = new Date(info[b.dateKey] as string).getTime()
      return dateA - dateB
    })

  if (milestoneData.length === 0) {
    return null
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          {isVietnamese ? "Đếm Ngày Quan Trọng" : "Milestone Countdown"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestoneData.map((milestone, index) => {
          const urgencyColor = getUrgencyColor(milestone.urgencyLevel)
          const urgencyIcon = getUrgencyIcon(milestone.urgencyLevel)

          return (
            <div key={milestone.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0" role="img" aria-label="milestone-icon">
                    {milestone.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{milestone.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {milestone.formattedDate}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`${urgencyColor} font-semibold px-2.5 py-0.5 border`}
                  >
                    <span className="flex items-center gap-1.5">
                      {urgencyIcon}
                      {milestone.isPast ? (
                        isVietnamese ? "Đã qua" : "Past"
                      ) : (
                        <>
                          {milestone.daysRemaining} {isVietnamese ? "ngày" : "days"}
                        </>
                      )}
                    </span>
                  </Badge>
                </div>
              </div>

              {index < milestoneData.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
