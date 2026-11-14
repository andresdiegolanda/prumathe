import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import type { Env } from "./env";

/**
 * A return that waits for a person: register it, wait for the approval event, refund and notify.
 * Each step.do is retried on its own and its result is stored, so after a failure the workflow
 * resumes from the step that failed and never repeats one that already finished.
 */
export class ReturnFlow extends WorkflowEntrypoint<Env, { shipment: string; reason: string }> {
  async run(event: WorkflowEvent<{ shipment: string; reason: string }>, step: WorkflowStep) {
    const registered = await step.do("register the return", async () => ({
      shipment: event.payload.shipment,
      reason: event.payload.reason,
      at: new Date().toISOString(),
    }));

    const approval = await step.waitForEvent<{ by: string }>("wait for approval", {
      type: "approved",
      timeout: "1 hour",
    });

    // The refund service fails the first time on purpose: the step is retried, not the workflow.
    const refund = await step.do(
      "refund",
      { retries: { limit: 3, delay: "1 second", backoff: "constant" } },
      async () => {
        const key = `refund-attempts:${event.instanceId}`;
        const attempts = Number((await this.env.FLAGS.get(key)) ?? 0) + 1;
        await this.env.FLAGS.put(key, String(attempts));
        if (attempts === 1) throw new Error("refund service unavailable (attempt 1)");
        return { refunded: true, attempts, by: approval.payload.by };
      },
    );

    const notified = await step.do("notify the customer", async () => ({ sent: true, shipment: registered.shipment }));
    return { registered, refund, notified };
  }
}
