import { useState } from "react";
import { User, CreditCard, Users, Settings as SettingsIcon, Shield } from "lucide-react";

export default function Account() {
  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "team" | "workspace">("profile");

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 font-medium">Manage your account preferences, billing, team access, and workspace configurations.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-zinc-200 gap-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "profile" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "billing" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <CreditCard size={16} /> Billing
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "team" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <Users size={16} /> Team
        </button>
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "workspace" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <SettingsIcon size={16} /> Workspace Settings
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900">Profile Information</h2>
            <p className="text-sm text-zinc-500">Manage your personal details and business emails associated with RelunoOS.</p>
            {/* Add profile form elements here */}
          </div>
        )}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900">Billing & Invoices</h2>
            <p className="text-sm text-zinc-500">Manage your subscription plan, payment methods, and invoice history via Stripe.</p>
          </div>
        )}
        {activeTab === "team" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900">Team Members</h2>
            <p className="text-sm text-zinc-500">Invite colleagues or assign permissions for your agency workspace.</p>
          </div>
        )}
        {activeTab === "workspace" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900">Workspace Settings</h2>
            <p className="text-sm text-zinc-500">Configure global agency defaults, custom branding, and integrations.</p>
          </div>
        )}
      </div>
    </div>
  );
}