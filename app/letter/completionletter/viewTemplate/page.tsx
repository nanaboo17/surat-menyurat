"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

export default function ViewTemplatePage() {
  const router = useRouter();

  const handleDownload = () => {
    window.open(
      "/assets/public/assets/public/assets/[TEMPLATE] SURAT SELESAI KP.pdf",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => router.back()}
          className="bg-white text-black border border-gray-300 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <Button
          onClick={handleDownload}
          className="bg-red-600 text-white flex items-center gap-2"
        >
          <Download size={16} /> Download PDF
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-md p-4">
        <iframe
          src="/assets/completion letter template.pdf"
          className="w-full h-[80vh] rounded"
        />
      </div>
    </div>
  );
}
