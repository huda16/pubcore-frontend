import { DashboardLayout } from "@/components/common/layout/dashboard-layout";

type AppRoutesLayoutProps = {
  children: React.ReactNode;
};

export default function AppRoutesLayout({ children }: AppRoutesLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
