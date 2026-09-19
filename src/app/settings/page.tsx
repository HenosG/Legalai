"use client";

import React from "react";
import Link from "next/link";
import { User, CreditCard, Users, Building, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { title: "Account Settings", desc: "Manage your personal profile name, email, and password.", href: "/settings/account", icon: User },
    { title: "Billing & Subscription", desc: "Manage your subscription plan, invoices, and Stripe billing portal.", href: "/settings/billing", icon: CreditCard },
    { title: "Team Management", desc: "Invite team members, assign permissions, and manage roles.", href: "/settings/team", icon: Users },
    { title: "Workspace Settings", desc: "Configure your agency branding, name, and workspace preferences.", href: "/settings/workspace", icon: Building },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences, workspace configurations, and billing.</p>
      </div>

      <div className="grid gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className="flex items-center justify-between p-5 bg-card border rounded-xl shadow-sm hover:border-primary/50 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{sec.title}</h2>
                  <p className="text-sm text-muted-foreground">{sec.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}