import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Shield, ArrowLeft, Calendar, MapPin, User } from "lucide-react"

async function isAdmin(email: string): Promise<boolean> {
  return email.includes("admin") || email === "admin@lajarus.com"
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; damage_level?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const adminCheck = await isAdmin(data.user.email || "")
  if (!adminCheck) {
    redirect("/dashboard")
  }

  // Build query with filters
  let query = supabase
    .from("reports")
    .select(`
      *,
      profiles!reports_user_id_fkey(full_name, phone)
    `)
    .order("created_at", { ascending: false })

  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.damage_level) {
    query = query.eq("damage_level", params.damage_level)
  }

  const { data: reports } = await query

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

  const getDamageLevelColor = (level: string) => {
    switch (level) {
      case "ringan":
        return "bg-green-100 text-green-800 border-green-200"
      case "sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "berat":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu"
      case "verified":
        return "Terverifikasi"
      case "rejected":
        return "Ditolak"
      default:
        return status
    }
  }

  const getDamageLevelText = (level: string) => {
    switch (level) {
      case "ringan":
        return "Ringan"
      case "sedang":
        return "Sedang"
      case "berat":
        return "Berat"
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">LAJARUS Admin</h1>
            </div>
          </div>
          <Badge variant="secondary">Admin</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Kelola Laporan</h1>
          <p className="text-muted-foreground">Verifikasi dan kelola semua laporan kerusakan jalan</p>
        </div>

        {/* Filters */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Status:</label>
                <Select defaultValue={params.status || "all"}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="verified">Terverifikasi</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Tingkat:</label>
                <Select defaultValue={params.damage_level || "all"}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tingkat</SelectItem>
                    <SelectItem value="ringan">Ringan</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="berat">Berat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        {reports && reports.length > 0 ? (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.id} className="border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{report.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(report.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{report.location_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{report.profiles?.full_name || "Pengguna"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(report.status)}>{getStatusText(report.status)}</Badge>
                      <Badge className={getDamageLevelColor(report.damage_level)}>
                        {getDamageLevelText(report.damage_level)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{report.description}</p>

                    {report.photo_url && (
                      <div>
                        <img
                          src={report.photo_url || "/placeholder.svg"}
                          alt="Foto kerusakan"
                          className="w-full max-w-md h-48 object-cover rounded-md border"
                        />
                      </div>
                    )}

                    {report.admin_notes && (
                      <div className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm font-medium mb-1">Catatan Admin:</p>
                        <p className="text-sm text-muted-foreground">{report.admin_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">ID: {report.id.slice(0, 8)}...</div>
                      <Button asChild>
                        <Link href={`/admin/reports/${report.id}`}>
                          {report.status === "pending" ? "Verifikasi" : "Lihat Detail"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Laporan</h3>
              <p className="text-muted-foreground text-center">
                Tidak ada laporan yang sesuai dengan filter yang dipilih.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
