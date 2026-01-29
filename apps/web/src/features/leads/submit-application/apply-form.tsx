"use client";

import { useState } from "react";
import { Input, TextArea } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { createLeadSubmission } from "@/shared/api/landing-repo";

export function ApplyForm({
  tenantId,
  slug,
  submitLabel,
  fields,
  inputClassName,
  textAreaClassName,
  showMessage,
  messageLabel,
  messagePlaceholder,
  submitClassName,
  showNameFields = true,
  showPhoneField = true,
  emailLabel,
  formClassName,
  labelClassName
}: {
  tenantId: string;
  slug: string;
  submitLabel?: string;
  fields?: { firstName?: string; lastName?: string; phone?: string; email?: string };
  inputClassName?: string;
  textAreaClassName?: string;
  showMessage?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitClassName?: string;
  showNameFields?: boolean;
  showPhoneField?: boolean;
  emailLabel?: string;
  formClassName?: string;
  labelClassName?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);

    const payload = {
      tenant: tenantId,
      slug,
      applicant: {
        firstName: String(form.get("firstName") || ""),
        lastName: String(form.get("lastName") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || "")
      },
      company: String(form.get("company") || "")
    };

    try {
      await createLeadSubmission(payload);

      setStatus("success");
      event.currentTarget.reset();
    } catch (_err) {
      setStatus("error");
    }
  }

  const labelClasses = labelClassName || "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500";

  return (
    <form onSubmit={onSubmit} className={formClassName || "space-y-4"}>
      {showMessage ? (
        <div className="space-y-2">
          {messageLabel ? <p className={labelClasses}>{messageLabel}</p> : null}
          <TextArea
            name="message"
            aria-label={messageLabel || "Message"}
            placeholder={messagePlaceholder || "Tell us a bit about what you're looking for..."}
            className={textAreaClassName}
          />
        </div>
      ) : null}
      {showNameFields ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="firstName" aria-label="First name" placeholder={fields?.firstName || "First name"} required className={inputClassName} />
          <Input name="lastName" aria-label="Last name" placeholder={fields?.lastName || "Last name"} required className={inputClassName} />
        </div>
      ) : null}
      {showPhoneField ? <Input name="phone" aria-label="Phone number" placeholder={fields?.phone || "Phone number"} required className={inputClassName} /> : null}
      {emailLabel ? <p className={labelClasses}>{emailLabel}</p> : null}
      <Input name="email" type="email" aria-label="Email" placeholder={fields?.email || "Email"} required className={inputClassName} />
      
      {/* Honeypot field */}
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      
      <Button type="submit" className={submitClassName || "w-full"} disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : submitLabel || "Apply Now"}
      </Button>
      {status === "success" ? <p className="text-sm text-emerald-500">Application received. We will contact you shortly.</p> : null}
      {status === "error" ? <p className="text-sm text-red-500">Something went wrong. Please try again.</p> : null}
    </form>
  );
}
