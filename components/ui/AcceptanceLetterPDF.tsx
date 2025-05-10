import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
  },
  centerText: {
    flex: 1,
    textAlign: "center",
    marginLeft: 20,
    fontSize: 12,
  },
  hr: {
    borderBottom: "1 solid black",
    marginTop: 4,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});

interface Props {
  data: {
    letterNumber: string;
    addressedTo: string;
    studentName: string;
    studentID: string;
    studyProgram: string;
    startDate: string;
    endDate: string;
    academicYear: string;
    createdDate: string;
  };
}

export default function AcceptanceLetterPDF({ data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="/logo.png"
            style={{ width: 60, height: 60, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>
            Pusat Penelitian HUMIC Engineering {"\n"} Universitas Telkom
          </Text>
          <Text>
            Jl. Telekomunikasi Terusan Buah Batu, Bandung 40257, Jawa Barat,
            Indonesia {"\n"}
            Telp/Faks: +622131209736 / +6222-70638683 / +6222-7565931
          </Text>
        </View>

        <View style={styles.section}>
          <Text>Nomor: {data.letterNumber}</Text>
          <Text>Lampiran: -</Text>
          <Text>Perihal: Surat Penerimaan Kerja Praktek</Text>
        </View>

        <View style={styles.section}>
          <Text>Kepada Yth. </Text>
          <Text>{data.addressedTo}</Text>
          <Text>di Tempat</Text>
        </View>

        <View style={styles.section}>
          <Text>Dengan hormat,</Text>
          <Text style={{ marginTop: 5 }}>
            Sehubungan dengan pengajuan kerja praktek di CoE Humic Engineering
            yang telah diajukan oleh mahasiswa atas nama:
          </Text>
          <Text style={{ marginTop: 5 }}>Nama: {data.studentName}</Text>
          <Text>NIM: {data.studentID}</Text>
          <Text>Prodi: {data.studyProgram}</Text>
        </View>

        <View style={styles.section}>
          <Text>
            Dengan ini kami menyatakan bahwa mahasiswa yang bersangkutan{" "}
            <Text style={styles.bold}>DITERIMA</Text> untuk melaksanakan Kerja
            Praktek di CoE Human Centric Engineering, Telkom University.
            Kegiatan ini dihitung pada {data.startDate} s.d. {data.endDate}{" "}
            periode Tahun Ajaran {data.academicYear}.
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            Demikian surat keterangan ini kami buat agar dapat dipergunakan
            sebagaimana mestinya.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Bandung, {data.createdDate}</Text>
          <Text style={{ marginTop: 40 }}>
            <Text>ttd,</Text>
            {"\n"}Assoc. Prof. Dr. Satria Mandala{"\n"}Direktur RC HUMIC
          </Text>
        </View>
      </Page>
    </Document>
  );
}
