"use client";
import { SessionModalProvider } from "@/components/providers/SessionModalProviders";
import AuthProvider from "@/hooks/contexts/authContext";
import AgenceProvider from "@/hooks/contexts/useAgenceContext";
import ContratProvider from "@/hooks/contexts/useContratContext";
import UserProvider from "@/hooks/contexts/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionModalProvider>
        <AuthProvider>
          <UserProvider>
            <ContratProvider>
              <AgenceProvider>{children}</AgenceProvider>
            </ContratProvider>
          </UserProvider>
        </AuthProvider>
      </SessionModalProvider>
    </QueryClientProvider>
  );
}
