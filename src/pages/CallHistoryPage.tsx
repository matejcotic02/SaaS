import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CallHistoryView } from "@/components/dashboard/CallHistoryView";

export function CallHistoryPage() {
  return (
    <DashboardLayout>
      <CallHistoryView />
    </DashboardLayout>
  );
}
