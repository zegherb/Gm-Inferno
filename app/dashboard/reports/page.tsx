import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Plus, ArrowLeft, Calendar, MapPinIcon } from "lucide-react"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  console.log("[v0] Reports query result:", { reports, reportsError, userId: data.user.id })

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
        return "Menunggu Verifikasi"
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
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">LAJARUS</h1>
            </div>
          </div>
          <Button asChild>
            <Link href="/report/new">
              <Plus className="w-4 h-4 mr-2" />
              Laporan Baru
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Riwayat Laporan</h1>
          <p className="text-muted-foreground">Semua laporan yang pernah Anda buat</p>
        </div>

        {/* Success Message */}
        {params.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              Laporan berhasil dibuat! Admin akan memverifikasi laporan Anda dalam 1-2 hari kerja.
            </p>
          </div>
        )}

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
                          <MapPinIcon className="w-4 h-4" />
                          <span>{report.location_name}</span>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Laporan</h3>
              <p className="text-muted-foreground text-center mb-6">
                Anda belum membuat laporan kerusakan jalan. Mulai berkontribusi dengan membuat laporan pertama Anda.
              </p>
              <Button asChild>
                <Link href="/report/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Laporan Pertama
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
