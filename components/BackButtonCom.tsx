// components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButtonCom() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/letter/completionletter")}
      className="bg-white text-black border border-gray-300 flex items-center gap-2"
    >
      <ArrowLeft size={16} /> Back
    </Button>
  );
}
