/**
 * Engagement Family Roles Component
 * Assigns family members to ceremonial roles
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, CheckCircle } from "lucide-react";
import { useState } from "react";

interface EngagementRole {
  id: string;
  roleVi: string;
  roleEn: string;
  side: "bride" | "groom";
  required: boolean;
  assignedTo?: string;
}

interface EngagementFamilyRolesProps {
  roles: EngagementRole[];
  onAssignRole: (roleId: string, personName: string) => void;
  lang: "vi" | "en";
}

export function EngagementFamilyRoles({ roles, onAssignRole, lang }: EngagementFamilyRolesProps) {
  const en = lang === "en";

  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [personName, setPersonName] = useState("");

  const brideRoles = roles.filter(role => role.side === "bride");
  const groomRoles = roles.filter(role => role.side === "groom");

  const handleAssign = (roleId: string) => {
    if (personName.trim()) {
      onAssignRole(roleId, personName);
      setPersonName("");
      setEditingRole(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bride's Family */}
      <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            {en ? "Bride's Family" : "Gia đình cô dâu"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {brideRoles.map(role => (
              <RoleItem
                key={role.id}
                role={role}
                isEditing={editingRole === role.id}
                personName={personName}
                onSetPersonName={setPersonName}
                onStartEdit={() => setEditingRole(role.id)}
                onAssign={() => handleAssign(role.id)}
                onCancelEdit={() => {
                  setEditingRole(null);
                  setPersonName("");
                }}
                lang={lang}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Groom's Family */}
      <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            {en ? "Groom's Family" : "Gia đình chú rể"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {groomRoles.map(role => (
              <RoleItem
                key={role.id}
                role={role}
                isEditing={editingRole === role.id}
                personName={personName}
                onSetPersonName={setPersonName}
                onStartEdit={() => setEditingRole(role.id)}
                onAssign={() => handleAssign(role.id)}
                onCancelEdit={() => {
                  setEditingRole(null);
                  setPersonName("");
                }}
                lang={lang}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface RoleItemProps {
  role: EngagementRole;
  isEditing: boolean;
  personName: string;
  onSetPersonName: (name: string) => void;
  onStartEdit: () => void;
  onAssign: () => void;
  onCancelEdit: () => void;
  lang: "vi" | "en";
}

function RoleItem({ role, isEditing, personName, onSetPersonName, onStartEdit, onAssign, onCancelEdit, lang }: RoleItemProps) {
  const en = lang === "en";

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)]">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${role.assignedTo ? "" : "text-muted-foreground"}`}>
            {en ? role.roleEn : role.roleVi}
          </span>
          {role.required && (
            <Badge variant="destructive" className="text-xs">
              {en ? "Required" : "Bắt buộc"}
            </Badge>
          )}
        </div>
        {role.assignedTo ? (
          <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>{role.assignedTo}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            {en ? "Not assigned" : "Chưa phân công"}
          </p>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={personName}
            onChange={(e) => onSetPersonName(e.target.value)}
            placeholder={en ? "Enter name..." : "Nhập tên..."}
            className="w-40"
          />
          <Button size="sm" onClick={onAssign} className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]">
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancelEdit}>
            {en ? "Cancel" : "Hủy"}
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant={role.assignedTo ? "outline" : "default"}
          onClick={onStartEdit}
          className={role.assignedTo ? "" : "bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]"}
        >
          {role.assignedTo ? (
            <>{en ? "Change" : "Thay đổi"}</>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" />
              {en ? "Assign" : "Phân công"}
            </>
          )}
        </Button>
      )}
    </div>
  );
}