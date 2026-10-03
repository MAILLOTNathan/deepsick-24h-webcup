import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/roles";

/** Inline status control for taxi / restauration orders. */
export function OrderStatusForm({ orderId, status }: { orderId: string; status: string }) {
  return (
    <form action={updateOrderStatusAction} className="flex items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <Select name="status" defaultValue={status} className="h-8 w-auto text-xs">
        {ORDER_STATUSES.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABELS[value]}
          </option>
        ))}
      </Select>
      <Button type="submit" variant="secondary" size="sm">
        Maj
      </Button>
    </form>
  );
}
