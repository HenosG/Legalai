"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, UserPlus, Trash2, Shield } from "lucide-react";
import Link from "next/link";

export default function TeamSettingsPage() {
  const [team, setTeam] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeam(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (res.ok) {
        setInviteEmail("");
        fetchTeam();
        alert("Invitation sent successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(userId: string) {
    if (!confirm("Remove this team member?")) return;
    try {
      await fetch(`/api/team/${userId}`, { method: "DELETE" });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground text-sm">Invite colleagues and assign roles to your workspace.</p>
      </div>

      <form onSubmit={handleInvite} className="bg-card border rounded-xl p-6 shadow-sm flex gap-3">
        <input
          type="email"
          placeholder="colleague@agency.com"
          required
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="flex-1 border rounded-lg p-2.5 text-sm bg-background"
        />
        <button
          type="submit"
          disabled={inviting}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite
        </button>
      </form>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground text-xs font-semibold uppercase">
              <th className="p-4">Member</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {team.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-muted-foreground">No other team members yet.</td>
              </tr>
            ) : (
              team.map((member: any) => (
                <tr key={member.id} className="hover:bg-muted/35">
                  <td className="p-4 font-medium">{member.email || member.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-semibold">
                      <Shield className="w-3 h-3" /> {member.role || "ADMIN"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-destructive hover:opacity-80 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}