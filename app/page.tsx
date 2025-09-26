import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Shield, Users, Clock, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LAJARUS</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Cara Kerja
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Daftar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            Lapor Jalan Rusak - Sistem Pelaporan Terpadu
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Laporkan Kerusakan Jalan dengan <span className="text-primary">Mudah & Cepat</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            LAJARUS membantu masyarakat melaporkan kerusakan jalan secara digital. Dengan foto, lokasi GPS, dan
            verifikasi admin untuk tindak lanjut yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth/sign-up">
                Mulai Lapor Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
              <Link href="#how-it-works">Pelajari Cara Kerja</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Fitur Unggulan LAJARUS</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sistem pelaporan yang komprehensif untuk memudahkan masyarakat dan pemerintah
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lokasi GPS Akurat</CardTitle>
                <CardDescription>
                  Otomatis mendeteksi lokasi kerusakan jalan dengan koordinat GPS yang presisi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Verifikasi Admin</CardTitle>
                <CardDescription>
                  Setiap laporan diverifikasi oleh admin untuk memastikan validitas dan tindak lanjut
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-chart-2" />
                </div>
                <CardTitle>Dashboard Pengguna</CardTitle>
                <CardDescription>Pantau status laporan Anda dan riwayat pelaporan dalam satu dashboard</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>Respon Cepat</CardTitle>
                <CardDescription>Sistem notifikasi real-time untuk update status laporan Anda</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Kategori Kerusakan</CardTitle>
                <CardDescription>
                  Klasifikasi tingkat kerusakan: ringan, sedang, dan berat untuk prioritas penanganan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-chart-4" />
                </div>
                <CardTitle>Upload Foto</CardTitle>
                <CardDescription>Dokumentasi visual kerusakan jalan untuk memperkuat laporan Anda</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cara Kerja LAJARUS</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proses pelaporan yang sederhana dalam 4 langkah mudah
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Daftar Akun</h3>
              <p className="text-muted-foreground">Buat akun LAJARUS dengan email dan data diri Anda</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Buat Laporan</h3>
              <p className="text-muted-foreground">Isi form laporan dengan foto, lokasi, dan tingkat kerusakan</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-background">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Verifikasi Admin</h3>
              <p className="text-muted-foreground">Admin memverifikasi dan menindaklanjuti laporan Anda</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-chart-3 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-background">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Pantau Status</h3>
              <p className="text-muted-foreground">Lihat perkembangan laporan di dashboard pengguna</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Tentang LAJARUS</h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              LAJARUS (Lapor Jalan Rusak) adalah platform digital yang memungkinkan masyarakat untuk melaporkan
              kerusakan infrastruktur jalan secara mudah dan terstruktur. Dengan sistem verifikasi admin dan tracking
              status, kami memastikan setiap laporan mendapat perhatian yang layak untuk Indonesia yang lebih baik.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <p className="text-muted-foreground">Laporan Terverifikasi</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <p className="text-muted-foreground">Kota Terjangkau</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-chart-2 mb-2">24/7</div>
                <p className="text-muted-foreground">Layanan Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Siap Berkontribusi untuk Jalan yang Lebih Baik?</CardTitle>
              <CardDescription className="text-lg">
                Bergabunglah dengan ribuan masyarakat yang peduli infrastruktur Indonesia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/auth/sign-up">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">LAJARUS</h3>
              </div>
              <p className="text-muted-foreground">
                Platform pelaporan kerusakan jalan untuk Indonesia yang lebih baik.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Fitur</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Lapor Kerusakan</li>
                <li>Verifikasi Admin</li>
                <li>Dashboard Pengguna</li>
                <li>Tracking Status</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Cara Penggunaan</li>
                <li>FAQ</li>
                <li>Kontak Support</li>
                <li>Panduan</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Kebijakan Privasi</li>
                <li>Syarat & Ketentuan</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 LAJARUS. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
