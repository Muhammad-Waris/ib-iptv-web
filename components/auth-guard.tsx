"use client";

import { useAuth } from "@/hooks/useAuth";
import SectionWrapper from "@/components/section-wrapper";
import Spinner from "@/components/spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth(true);

  if (!isAuthenticated) {
    return (
      <SectionWrapper>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  return <>{children}</>;
}
