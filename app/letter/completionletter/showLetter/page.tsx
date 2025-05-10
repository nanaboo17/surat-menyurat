"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState, useEffect, use } from "react";
import { format } from "date-fns"; // Import Locale from date-fns
import { id as indonesianLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Font } from "@react-pdf/renderer";
import BackButtonCom from "@/components/BackButtonCom";
import { ArrowLeft, Bold, Download } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const { pdf } = require("@react-pdf/renderer");

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Calibri",
  },
  bold: {
    fontFamily: "Calibri",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Calibri",
  },
  section: {
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 6,
    lineHeight: 1.6,
    fontSize: 11,
    fontFamily: "Calibri",
  },
  right: {
    textAlign: "right",
  },
  line: {
    flexDirection: "row",
    marginBottom: 2,
  },
  label: {
    width: 100,
  },
});

Font.register({
  family: "Calibri",
  fonts: [
    { src: "/fonts/CALIBRI.ttf" },
    { src: "/fonts/CALIBRIB.ttf", fontWeight: "bold" },
  ],
});

Font.register({
  family: "Times-Roman",
  fonts: [
    {
      src: "https://example.com/fonts/times-new-roman.ttf", // or use a hosted version
    },
    {
      src: "https://example.com/fonts/times-new-roman-bold.ttf",
      fontWeight: "bold",
    },
  ],
});

function CompletionLetterPDF({
  nomor_surat_completion,
  address_to,
  nama_mahasiswa,
  nomor_induk_mahasiswa,
  program_studi_mahasiswa,
  start_date,
  completion_date,
  tahun_ajaran,
  created_at,
}: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Kop Surat */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            src="/assets/logo-humic-surat.jpg"
            style={{ width: 90, height: 90 }}
          />
          <View style={{ marginLeft: 10, flex: 1, marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: "Times-Roman",
                textAlign: "center",
              }}
            >
              Pusat Penelitian HUMIC Engineering{"\n"}
              Universitas Telkom
            </Text>
            <Text
              style={{
                fontSize: 10,
                textAlign: "center",
                marginTop: 7,
                fontFamily: "Times-Roman",
              }}
            >
              Jl. Telekomunikasi Terusan Buah Batu, Bandung 40257, Jawa Barat,
              Indonesia{"\n"}
              Telp/Faks: +6281321397936 / +6222-70658638 / +6222-7565931
            </Text>
          </View>
        </View>

        {/* Garis pemisah */}
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: "#000",
            marginBottom: 10,
            width: "100%",
          }}
        />

        <View style={styles.section}>
          <View style={styles.line}>
            <Text style={styles.label}>Nomor</Text>
            <Text>: {nomor_surat_completion}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>Lampiran</Text>
            <Text>: -</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>Perihal</Text>
            <Text>: Surat Penerimaan Kerja Praktek</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>Kepada Yth.</Text>
          <Text>{address_to}</Text>
          <Text>di Tempat</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>Dengan hormat,</Text>
          <Text style={styles.paragraph}>
            Sehubungan dengan telah selesainya kerja praktek di CoE Humic
            Engineering yang telah dilaksanakan oleh mahasiswa atas nama:
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.line}>
            <Text style={styles.label}>Nama</Text>
            <Text>: {nama_mahasiswa}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>NIM</Text>
            <Text>: {nomor_induk_mahasiswa}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.label}>Prodi</Text>
            <Text>: {program_studi_mahasiswa}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.paragraph, { marginTop: 20 }]}>
            Dengan ini kami menyatakan bahwa mahasiswa yang bersangkutan{" "}
            <Text style={styles.bold}>TELAH MENYELESAIKAN</Text> Kerja Praktek
            di CoE Human Centric Engineering, Telkom University. Kegiatan ini
            telah dilaksanakan pada {start_date} s.d. {completion_date} periode
            Tahun Ajaran {tahun_ajaran}.
          </Text>
          <Text style={styles.paragraph}>
            Demikian surat keterangan ini kami buat agar dapat dipergunakan
            sebagaimana mestinya.
          </Text>
        </View>

        <View style={[styles.section]}>
          <Text>Bandung, {created_at}</Text>
          <Image src={"/assets/ttd.png"} style={{ width: 100, height: 50 }} />
          <Text style={{ textDecoration: "underline" }}>
            Assoc. Prof. Dr. Satria Mandal
          </Text>
          <Text>Direktur CoE HUMIC Engineering</Text>
        </View>

        <View style={styles.footer}>
          <Image src={"/assets/footer.jpg"} style={{ width: "100%" }} />
        </View>
      </Page>
    </Document>
  );
}

export default function ShowLetterPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [letterData, setLetterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetterData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `https://cetaksuratkp-api.humicprototyping.com/api/letter/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `API Error ${response.status}: ${
              errorData.message || response.statusText
            }`
          );
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setLetterData(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("API Error:", err);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLetterData();
    }
  }, [id]);

  const formatIndonesianDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!letterData) {
    return <div>No letter data found</div>;
  }

  console.log("Completion Letter Data:", {
    nomor_surat_completion: letterData.nomor_surat_completion || "-",
    address_to: letterData.address_to || "-",
    nama_mahasiswa: letterData.nama_mahasiswa || "-",
    nomor_induk_mahasiswa: letterData.nomor_induk_mahasiswa || "-",
    program_studi_mahasiswa: letterData.program_studi_mahasiswa || "-",
    start_date: letterData.start_date
      ? formatIndonesianDate(letterData.start_date)
      : "-",
    completion_date: letterData.completion_date
      ? formatIndonesianDate(letterData.completion_date)
      : "-",
    tahun_ajaran: letterData.tahun_ajaran || "-",
    created_at: letterData.created_at
      ? formatIndonesianDate(letterData.created_at)
      : "-",
  });

  const handleDownload = async () => {
    const blob = await pdf(
      <CompletionLetterPDF
        nomor_surat_completion={letterData.nomor_surat_completion || "-"}
        address_to={letterData.address_to || "-"}
        nama_mahasiswa={letterData.nama_mahasiswa || "-"}
        nomor_induk_mahasiswa={letterData.nomor_induk_mahasiswa || "-"}
        program_studi_mahasiswa={letterData.program_studi_mahasiswa || "-"}
        start_date={
          letterData.start_date
            ? formatIndonesianDate(letterData.start_date)
            : "-"
        }
        completion_date={
          letterData.completion_date
            ? formatIndonesianDate(letterData.completion_date)
            : "-"
        }
        tahun_ajaran={letterData.tahun_ajaran || "-"}
        tanggalSurat={
          letterData.created_at
            ? formatIndonesianDate(letterData.created_at)
            : "-"
        }
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Surat-Penerimaan-${
      letterData.nama_mahasiswa || "unknown"
    }.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-6">
      <div className="flex justify-between items-center mb-6">
        <BackButtonCom />

        <Button
          onClick={handleDownload}
          className="bg-red-600 text-white flex items-center gap-2"
        >
          <Download size={16} /> Download PDF
        </Button>
      </div>
      <PDFViewer width="100%" height="1000">
        <CompletionLetterPDF
          nomor_surat_completion={letterData.nomor_surat_completion || "-"}
          address_to={letterData.address_to || "-"}
          nama_mahasiswa={letterData.nama_mahasiswa || "-"}
          nomor_induk_mahasiswa={letterData.nomor_induk_mahasiswa || "-"}
          program_studi_mahasiswa={letterData.program_studi_mahasiswa || "-"}
          start_date={
            letterData.start_date
              ? formatIndonesianDate(letterData.start_date)
              : "-"
          }
          completion_date={
            letterData.completion_date
              ? formatIndonesianDate(letterData.completion_date)
              : "-"
          }
          tahun_ajaran={letterData.tahun_ajaran || "-"}
          created_at={
            letterData.created_at
              ? formatIndonesianDate(letterData.created_at)
              : "-"
          }
        />
      </PDFViewer>
    </div>
  );
}
