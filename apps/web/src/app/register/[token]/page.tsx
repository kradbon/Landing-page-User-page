"use client";

import { useEffect, useState } from "react";
import { env } from "@/shared/config/env";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { Tenant } from "@/shared/types/landing";

export default function RegisterPage({ params }: { params: { token: string } }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${env.apiBaseUrl}/public/invite/validate?token=${params.token}`);
      if (!res.ok) {
        setStatus("Invite invalid or expired");
        return;
      }
      const json = (await res.json()) as { tenant: Tenant; email: string };
      setTenant(json.tenant);
      setEmail(json.email || "");
    }
    load();
  }, [params.token]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      first_name: String(form.get("first_name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      confirm_password: String(form.get("confirm_password") || ""),
      domain: tenant?.domain || tenant?._id || ""
    };

    try {
      const res = await fetch(`${env.authApiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      if (env.userPageBaseUrl) {
        window.location.href = env.userPageBaseUrl;
      } else {
        setStatus("Registered. Configure USER_PAGE_BASE_URL to redirect.");
      }
    } catch (_err) {
      setStatus("Registration failed");
    }
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-600">
        {status || "Loading..."}
      </div>
    );
  }

  return (
    <ThemeProvider theme={tenant.theme}>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="w-full max-w-[450px] space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            {tenant.logo?.url ? (
              <img src={tenant.logo.url} alt={tenant.name} className="mx-auto h-12 w-auto object-contain" />
            ) : (
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white font-bold text-xl">
                {tenant.name.slice(0, 1)}
              </div>
            )}
            <h1 className="text-2xl font-normal text-slate-900">Create your Account</h1>
            <p className="text-base text-slate-600">to continue to {tenant.name}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input 
                name="first_name" 
                placeholder="First name" 
                required 
                className="h-12 rounded-lg border-slate-300 px-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Input 
                name="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
                required 
                className="h-12 rounded-lg border-slate-300 px-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className="h-12 rounded-lg border-slate-300 px-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Input 
                  name="confirm_password" 
                  type="password" 
                  placeholder="Confirm" 
                  required 
                  className="h-12 rounded-lg border-slate-300 px-4 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-full bg-blue-600 text-base font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Next
              </Button>
              {status ? <p className="text-center text-sm text-red-500">{status}</p> : null}
            </div>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}
