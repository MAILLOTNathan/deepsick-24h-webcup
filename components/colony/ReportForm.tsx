"use client";

import { useFormState, useFormStatus } from "react-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { initialActionState } from "@/lib/action-state";
import { createReportAction } from "@/lib/actions/reports";
import {
  COLONY_SECTORS,
  REPORT_PRIORITIES,
  REPORT_PRIORITY_LABELS,
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
} from "@/lib/roles";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Transmission…" : "Transmettre le signalement"}
    </Button>
  );
}

export function ReportForm({ defaultType = "SECURITY" }: { defaultType?: string }) {
  const [state, formAction] = useFormState(createReportAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <fieldset className="space-y-2">
        <legend className="font-mono text-xs uppercase tracking-wide text-foreground">
          Service concerné
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {REPORT_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 transition has-[:checked]:border-primary has-[:checked]:bg-primary/10"
            >
              <input
                type="radio"
                name="type"
                value={type}
                defaultChecked={type === defaultType}
                className="accent-primary"
              />
              <span className="font-mono text-xs uppercase tracking-wide text-foreground">
                {REPORT_TYPE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Objet" htmlFor="title">
        <Input id="title" name="title" required maxLength={120} placeholder="Ex. Alerte intrusion airlock" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Priorité" htmlFor="priority">
          <Select id="priority" name="priority" defaultValue="NORMAL">
            {REPORT_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {REPORT_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Secteur" htmlFor="sector">
          <Select id="sector" name="sector" defaultValue="">
            <option value="">— Localisation inconnue —</option>
            {COLONY_SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          required
          minLength={10}
          placeholder="Décrivez la situation, le lieu précis et les personnes impliquées."
        />
      </Field>

      <SubmitButton />
    </form>
  );
}
