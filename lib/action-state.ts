/** Shared shape returned by form server actions used with `useFormState`. */
export type ActionState = {
  ok: boolean;
  message?: string;
  reference?: string;
};

export const initialActionState: ActionState = { ok: false };

/** Lighter state used by the admin create forms. */
export type AdminActionState = { ok: boolean; message?: string };

export const initialAdminActionState: AdminActionState = { ok: false };
