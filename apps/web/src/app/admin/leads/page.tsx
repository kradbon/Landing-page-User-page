"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Lead } from "@/shared/types/landing";
import { Button } from "@/shared/ui/button";
import { getLeads, setLeadStatus } from "@/shared/api/landing-repo";
import { useLandingEditorStore } from "@/features/landing-editor/model/editor-store";

const copy = {
  en: {
    title: "Applications",
    subtitle: "Track applicants and send invites.",
    empty: "No leads here.",
    details: "Lead details",
    close: "Close",
    phone: "Phone",
    status: "Status",
    accept: "Accept",
    decline: "Decline",
    invite: "Invite link",
    copy: "Copy",
    copied: "Invite link copied",
    updated: "Lead updated",
    failed: "Update failed",
    statusLabels: {
      PENDING: "Pending",
      ACCEPTED: "Accepted",
      DECLINED: "Declined"
    }
  },
  ru: {
    title: "Заявки",
    subtitle: "Отслеживайте кандидатов и отправляйте приглашения.",
    empty: "Здесь пока нет заявок.",
    details: "Детали заявки",
    close: "Закрыть",
    phone: "Телефон",
    status: "Статус",
    accept: "Принять",
    decline: "Отклонить",
    invite: "Ссылка приглашения",
    copy: "Копировать",
    copied: "Ссылка приглашения скопирована",
    updated: "Заявка обновлена",
    failed: "Не удалось обновить",
    statusLabels: {
      PENDING: "В ожидании",
      ACCEPTED: "Принята",
      DECLINED: "Отклонена"
    }
  },
  tj: {
    title: "Дархостҳо",
    subtitle: "Довталабонро пайгирӣ кунед ва даъватнома фиристед.",
    empty: "Ҳоло дархост нест.",
    details: "Тафсилоти дархост",
    close: "Пӯшидан",
    phone: "Телефон",
    status: "Ҳолат",
    accept: "Қабул кардан",
    decline: "Рад кардан",
    invite: "Пайванди даъват",
    copy: "Нусха",
    copied: "Пайванд нусха шуд",
    updated: "Дархост нав шуд",
    failed: "Навсозӣ ноком шуд",
    statusLabels: {
      PENDING: "Дар интизорӣ",
      ACCEPTED: "Қабул шуд",
      DECLINED: "Рад шуд"
    }
  }
};

const statusFilters: Lead["status"][] = ["PENDING", "ACCEPTED", "DECLINED"];

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const { language } = useLandingEditorStore();
  const t = copy[language] || copy.en;
  const [activeStatus, setActiveStatus] = useState<Lead["status"]>("PENDING");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: getLeads });

  const filtered = useMemo(() => leads.filter((lead) => lead.status === activeStatus), [leads, activeStatus]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead["status"] }) => setLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success(t.updated);
    },
    onError: () => toast.error(t.failed)
  });

  const inviteLink =
    selectedLead?.status === "ACCEPTED" && selectedLead.invite?.token
      ? `https://invite.brooklynlms.example/${selectedLead.invite.token}`
      : "";

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border admin-surface px-5 py-4 admin-shadow">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">Leads</p>
        <h1 className="font-display text-2xl">{t.title}</h1>
        <p className="text-xs admin-muted">{t.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <Button
            key={status}
            variant="ghost"
            className={`text-xs ${activeStatus === status ? "bg-[rgb(var(--admin-card))]" : "admin-muted"}`}
            onClick={() => setActiveStatus(status)}
          >
            {t.statusLabels[status]}
          </Button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((lead) => (
          <button
            key={lead._id}
            type="button"
            onClick={() => setSelectedLead(lead)}
            className="flex w-full items-center justify-between rounded-[14px] border admin-card px-5 py-4 text-left transition hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
          >
            <div>
              <p className="text-sm font-semibold">
                {lead.applicant.firstName} {lead.applicant.lastName}
              </p>
              <p className="text-xs admin-muted">
                {lead.applicant.email} - {lead.applicant.phone}
              </p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] admin-muted">
              {new Date(lead.submittedAt).toLocaleDateString()}
            </span>
          </button>
        ))}
        {filtered.length === 0 ? <p className="text-sm admin-muted">{t.empty}</p> : null}
      </div>

      {selectedLead ? (
        <div className="rounded-[16px] border admin-surface p-6 admin-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] admin-muted">{t.details}</p>
              <h2 className="font-display text-xl">
                {selectedLead.applicant.firstName} {selectedLead.applicant.lastName}
              </h2>
              <p className="text-sm admin-muted">{selectedLead.applicant.email}</p>
            </div>
            <Button variant="ghost" className="text-xs" onClick={() => setSelectedLead(null)}>
              {t.close}
            </Button>
          </div>
          <div className="mt-4 grid gap-2 text-sm admin-muted">
            <p>{t.phone}: {selectedLead.applicant.phone}</p>
            <p>{t.status}: {t.statusLabels[selectedLead.status]}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="text-xs"
              onClick={() => statusMutation.mutate({ id: selectedLead._id, status: "ACCEPTED" })}
            >
              {t.accept}
            </Button>
            <Button
              variant="ghost"
              className="text-xs"
              onClick={() => statusMutation.mutate({ id: selectedLead._id, status: "DECLINED" })}
            >
              {t.decline}
            </Button>
          </div>
          {inviteLink ? (
            <div className="mt-4 rounded-[12px] border admin-card p-4 text-xs admin-muted">
              <p className="font-semibold">{t.invite}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="break-all">{inviteLink}</span>
                <Button
                  variant="ghost"
                  className="text-[11px]"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    toast.success(t.copied);
                  }}
                >
                  {t.copy}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
