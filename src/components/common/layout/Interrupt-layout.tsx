import { MaterialUiProvider } from "@/providers/material-ui-provider";

type InterruptLayoutProps = {
  children: React.ReactNode;
};

export function InterruptLayout({ children }: InterruptLayoutProps) {
  return <MaterialUiProvider>{children}</MaterialUiProvider>;
}
