import { defaultTheme, Provider } from "@adobe/react-spectrum";
import type { ReactNode } from "react";

export function SpectrumProvider({
  children,
  colorScheme = "light",
  locale = "en-US",
}: {
  children: ReactNode;
  colorScheme?: "light" | "dark";
  locale?: string;
}) {
  return (
    <Provider
      theme={defaultTheme}
      colorScheme={colorScheme}
      locale={locale}
      height="100%"
    >
      {children}
    </Provider>
  );
}
