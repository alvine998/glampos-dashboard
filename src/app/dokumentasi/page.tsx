import {
  BookOpen,
  Check,
  Code2,
  Layers3,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/PageHeader";

const MODULE_STEPS = [
  "Daftarkan ID, label, rute, dan ikon modul pada registry navigasi aplikasi.",
  "Tambahkan modul tersebut ke daftar modul yang digunakan permission matrix.",
  "Tentukan izin awal setiap role. Gunakan akses minimum yang dibutuhkan.",
  "Hubungkan rute ke modul agar navigasi dan pemeriksaan akses mencakup halaman turunan seperti halaman detail dan edit.",
  "Periksa tampilan setiap role, termasuk kondisi tanpa izin, lalu jalankan lint dan build.",
];

const ROLE_GUIDANCE = [
  { role: "Owner", access: "Akses penuh ke semua modul dan pengaturan properti." },
  { role: "Front Office", access: "Fokus pada kalender dan booking; akses data operasional yang diperlukan." },
  { role: "Finance", access: "Fokus pada keuangan dan laporan; batasi perubahan pada modul operasional." },
  { role: "Housekeeping & Maintenance", access: "Akses terbatas pada informasi kalender dan unit yang relevan." },
  { role: "Super Admin", access: "Akses penuh untuk pengelolaan sistem dan konfigurasi role." },
];

export default function DokumentasiPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="PANDUAN GLAMPOS"
        title="Dokumentasi"
        description="Panduan mengelola pengguna, role, izin akses, dan penambahan modul aplikasi."
      />

      <div className="docs-layout">
        <aside className="card docs-index">
          <span className="card-kicker">DI HALAMAN INI</span>
          <a href="#pengguna">Manajemen pengguna</a>
          <a href="#rbac">Role & hak akses</a>
          <a href="#modul-baru">Menambahkan modul</a>
          <a href="#catatan">Catatan penyimpanan</a>
        </aside>

        <div className="docs-content">
          <section className="card docs-section" id="pengguna">
            <div className="docs-section-heading">
              <div className="docs-icon"><UserRoundCog size={19} /></div>
              <div>
                <span className="card-kicker">PENGGUNA</span>
                <h2>Manajemen pengguna</h2>
              </div>
            </div>
            <p>
              Buka <strong>Pengaturan → Pengguna & akses</strong> untuk mengelola akun staf.
              Tambahkan pengguna melalui nama, email, dan role. Menu aksi pada setiap pengguna
              dapat digunakan untuk mengubah data, mengaktifkan atau menonaktifkan akses, serta
              menghapus pengguna.
            </p>
            <div className="docs-callout">
              <BookOpen size={16} />
              <span>Nonaktifkan pengguna untuk menghentikan akses tanpa menghapus catatan penggunanya.</span>
            </div>
          </section>

          <section className="card docs-section" id="rbac">
            <div className="docs-section-heading">
              <div className="docs-icon"><ShieldCheck size={19} /></div>
              <div>
                <span className="card-kicker">ROLE-BASED ACCESS CONTROL</span>
                <h2>Role & hak akses</h2>
              </div>
            </div>
            <p>
              Pilih role pada bagian <strong>Role & hak akses</strong>, lalu atur izin per modul.
              Izin <strong>lihat</strong> mengendalikan visibilitas modul dan akses halaman;
              izin <strong>buat</strong>, <strong>ubah</strong>, dan <strong>hapus</strong> menunjukkan
              hak tindakan yang ditetapkan untuk role tersebut.
            </p>
            <div className="docs-role-list">
              {ROLE_GUIDANCE.map((item) => (
                <div key={item.role}>
                  <strong>{item.role}</strong>
                  <span>{item.access}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card docs-section" id="modul-baru">
            <div className="docs-section-heading">
              <div className="docs-icon"><Layers3 size={19} /></div>
              <div>
                <span className="card-kicker">PENGEMBANGAN APLIKASI</span>
                <h2>Menambahkan modul baru</h2>
              </div>
            </div>
            <p>
              Modul adalah bagian produk yang memiliki halaman dan perilaku aplikasi. Karena itu,
              modul baru ditambahkan melalui kode aplikasi dan registry modul sebagai sumber
              kebenaran. Pengaturan role menentukan siapa yang dapat melihat atau mengelolanya;
              pengaturan role tidak membuat fitur atau rute baru dengan sendirinya.
            </p>
            <ol className="docs-checklist">
              {MODULE_STEPS.map((step) => (
                <li key={step}>
                  <span><Check size={14} /></span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="docs-callout">
              <Code2 size={16} />
              <span>
                Saat modul ditambahkan, gabungkan permission yang tersimpan dengan daftar modul
                terbaru agar role yang sudah ada memperoleh nilai akses awal yang aman.
              </span>
            </div>
          </section>

          <section className="card docs-section" id="catatan">
            <div className="docs-section-heading">
              <div className="docs-icon"><BookOpen size={19} /></div>
              <div>
                <span className="card-kicker">PENYIMPANAN</span>
                <h2>Catatan penyimpanan saat ini</h2>
              </div>
            </div>
            <p>
              Data pengguna dan permission saat ini disimpan di browser pada perangkat yang
              digunakan. Data belum dibagikan antarperangkat atau antar pengguna. Untuk penggunaan
              multi-staf secara nyata, simpan role dan permission pada layanan backend bersama,
              lalu validasi izin pada setiap operasi yang dilindungi.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
