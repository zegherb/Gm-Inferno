import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import Link from "next/link"
import { MapPin, Plus, FileText, User, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user reports statistics
  const { data: reports } = await supabase.from("reports").select("status").eq("user_id", data.user.id)

  const totalReports = reports?.length || 0
  const pendingReports = reports?.filter((r) => r.status === "pending").length || 0
  const verifiedReports = reports?.filter((r) => r.status === "verified").length || 0
  const rejectedReports = reports?.filter((r) => r.status === "rejected").length || 0

  // Get recent reports
  const { data: recentReports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Verifikasi"
      case "verified":
        return "Terverifikasi"
      case "rejected":
        return "Ditolak"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LAJARUS</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Halo, {profile?.full_name || data.user.email}
            </span>
            <form action="/auth/logout" method="post">
              <Button variant="outline" size="sm">
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Selamat datang, {profile?.full_name || "Pengguna"}!
          </h1>
          <p className="text-muted-foreground">Kelola laporan kerusakan jalan Anda dan pantau statusnya</p>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <DashboardStats
            totalReports={totalReports}
            pendingReports={pendingReports}
            verifiedReports={verifiedReports}
            rejectedReports={rejectedReports}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Plus className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Buat Laporan Baru</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Laporkan kerusakan jalan yang Anda temukan
              </p>
              <Button asChild className="w-full">
                <Link href="/report/new">Buat Laporan</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <FileText className="h-8 w-8 text-accent mb-2" />
              <h3 className="font-semibold mb-2">Riwayat Laporan</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Lihat semua laporan dan statusnya</p>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/dashboard/reports">Lihat Riwayat</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <User className="h-8 w-8 text-chart-2 mb-2" />
              <h3 className="font-semibold mb-2">Profil Saya</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Kelola informasi profil Anda</p>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/dashboard/profile">Edit Profil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Laporan Terbaru</span>
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/reports">Lihat Semua</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReports && recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.location_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-md border ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada laporan</p>
                <Button asChild className="mt-4">
                  <Link href="/report/new">Buat Laporan Pertama</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
