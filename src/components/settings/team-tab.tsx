"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, MoreHorizontal, Mail } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  avatar?: string
  status: "active" | "pending"
}

const initialMembers: TeamMember[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@brandforge.co", role: "Owner", avatar: "", status: "active" },
  { id: "2", name: "Marcus Johnson", email: "marcus@brandforge.co", role: "Admin", avatar: "", status: "active" },
  { id: "3", name: "Emily Rodriguez", email: "emily@brandforge.co", role: "Member", avatar: "", status: "active" },
  { id: "4", name: "David Kim", email: "david@brandforge.co", role: "Member", avatar: "", status: "pending" },
]

export function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Member")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInvite = () => {
    if (!inviteEmail) return
    const newMember: TeamMember = {
      id: String(Date.now()),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
    }
    setMembers([...members, newMember])
    setInviteEmail("")
    setInviteRole("Member")
    setDialogOpen(false)
  }

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-primary/10 text-primary"
      case "Admin":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage who has access to your AgencyRecap workspace
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "Admin" | "Member")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
          <div className="col-span-5">Member</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-border">
          {members.map((member) => (
            <div key={member.id} className="grid grid-cols-12 items-center gap-4 px-4 py-3">
              <div className="col-span-5 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="col-span-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeStyles(member.role)}`}>
                  {member.role}
                </span>
              </div>
              <div className="col-span-3">
                {member.status === "active" ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending
                  </span>
                )}
              </div>
              <div className="col-span-1 flex justify-end">
                {member.role !== "Owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemove(member.id)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
