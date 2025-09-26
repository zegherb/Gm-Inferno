import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Users, Clock, CheckCircle, Shield } from "lucide-react"

async function isAdmin(email: string): Promise<boolean> {
  // Simple admin check - in production, use proper role management
  return email.includes("admin") || email === "admin@lajarus.com"
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const adminCheck = await isAdmin(data.user.email || "")
  if (!adminCheck) {
    redirect("/dashboard")
  }

  // Get all reports statistics
  const { data: allReports } = await supabase.from("reports").select("status, damage_level")

  const totalReports = allReports?.length || 0
  const pendingReports = allReports?.filter((r) => r.status === "pending").length || 0
  const verifiedReports = allReports?.filter((r) => r.status === "verified").length || 0
  const rejectedReports = allReports?.filter((r) => r.status === "rejected").length || 0

  // Damage level statistics
  const ringanReports = allReports?.filter((r) => r.damage_level === "ringan").length || 0
  const sedangReports = allReports?.filter((r) => r.damage_level === "sedang").length || 0
  const beratReports = allReports?.filter((r) => r.damage_level === "berat").length || 0

  // Get total users
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Get recent pending reports
  const { data: recentReports } = await supabase
    .from("reports")
    .select(`
      *,
      profiles!reports_user_id_fkey(full_name)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LAJARUS Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Admin</Badge>
            <span className="text-sm text-muted-foreground hidden md:block">{data.user.email}</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">Kelola dan verifikasi laporan kerusakan jalan dari masyarakat</p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
              <p className="text-xs text-muted-foreground">Semua laporan</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingReports}</div>
              <p className="text-xs text-muted-foreground">Perlu verifikasi</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terverifikasi</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{verifiedReports}</div>
              <p className="text-xs text-muted-foreground">Laporan valid</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
            </CardContent>
          </Card>
        </div>

        {/* Damage Level Statistics */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Statistik Tingkat Kerusakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{ringanReports}</div>
                <p className="text-sm text-green-700">Kerusakan Ringan</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{sedangReports}</div>
                <p className="text-sm text-yellow-700">Kerusakan Sedang</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{beratReports}</div>
                <p className="text-sm text-red-700">Kerusakan Berat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Verifikasi Laporan</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Tinjau dan verifikasi laporan yang masuk</p>
              <Button asChild className="w-full">
                <Link href="/admin/reports">Kelola Laporan ({pendingReports} pending)</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Users className="h-8 w-8 text-accent mb-2" />
              <h3 className="font-semibold mb-2">Kelola Pengguna</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Lihat dan kelola data pengguna</p>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/users">Lihat Pengguna</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pending Reports */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Laporan Menunggu Verifikasi</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/reports">Lihat Semua</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReports && recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-border rounded-md"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.location_name}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Oleh: {report.profiles?.full_name || "Pengguna"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString("id-ID")}
                        </span>
                        <Badge
                          className={
                            report.damage_level === "ringan"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : report.damage_level === "sedang"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {report.damage_level}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/admin/reports/${report.id}`}>Tinjau</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada laporan yang menunggu verifikasi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
