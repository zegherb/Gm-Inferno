"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Shield, ArrowLeft, CheckCircle, XCircle, Loader2, MapPin, Calendar, User } from "lucide-react"

interface Report {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
  damage_level: string
  photo_url: string | null
  status: string
  admin_notes: string | null
  created_at: string
  user_id: string
  profiles: {
    full_name: string | null
    phone: string | null
  } | null
}

export default function AdminReportDetailPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getReport = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        // Check if user is admin
        const isAdmin = user.email?.includes("admin") || user.email === "admin@lajarus.com"
        if (!isAdmin) {
          router.push("/dashboard")
          return
        }

        setUser(user)

        // Get report details
        const { data: reportData, error } = await supabase
          .from("reports")
          .select(`
            *,
            profiles!reports_user_id_fkey(full_name, phone)
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error

        setReport(reportData)
        setAdminNotes(reportData.admin_notes || "")
      } catch (error: any) {
        setError(error.message || "Gagal memuat laporan")
      } finally {
        setIsLoading(false)
      }
    }

    getReport()
  }, [router, params.id, supabase])

  const updateReportStatus = async (status: "verified" | "rejected") => {
    if (!report || !user) return

    setIsUpdating(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("reports")
        .update({
          status,
          admin_notes: adminNotes.trim() || null,
        })
        .eq("id", report.id)

      if (error) throw error

      setReport({
        ...report,
        status,
        admin_notes: adminNotes.trim() || null,
      })

      // Redirect back to reports list after successful update
      setTimeout(() => {
        router.push("/admin/reports")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Gagal memperbarui status laporan")
    } finally {
      setIsUpdating(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error || "Laporan tidak ditemukan"}</p>
            <Button asChild>
              <Link href="/admin/reports">Kembali ke Daftar Laporan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/reports">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Daftar Laporan
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Detail Laporan</h1>
          <p className="text-muted-foreground">Verifikasi dan kelola laporan kerusakan jalan</p>
        </div>

        {/* Report Details */}
        <Card className="border-border/50 mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{report.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(report.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{report.profiles?.full_name || "Pengguna"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge className={getStatusColor(report.status)}>
                  {report.status === "pending"
                    ? "Menunggu"
                    : report.status === "verified"
                      ? "Terverifikasi"
                      : "Ditolak"}
                </Badge>
                <Badge className={getDamageLevelColor(report.damage_level)}>
                  {report.damage_level === "ringan" ? "Ringan" : report.damage_level === "sedang" ? "Sedang" : "Berat"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Deskripsi Kerusakan</h3>
              <p className="text-muted-foreground">{report.description}</p>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold mb-2">Lokasi</h3>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{report.location_name}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Koordinat: {report.latitude}, {report.longitude}
              </p>
            </div>

            {/* Photo */}
            {report.photo_url && (
              <div>
                <h3 className="font-semibold mb-2">Foto Kerusakan</h3>
                <img
                  src={report.photo_url || "/placeholder.svg"}
                  alt="Foto kerusakan"
                  className="w-full max-w-2xl h-64 object-cover rounded-md border"
                />
              </div>
            )}

            {/* User Info */}
            <div>
              <h3 className="font-semibold mb-2">Informasi Pelapor</h3>
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Nama:</span> {report.profiles?.full_name || "Tidak tersedia"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Telepon:</span> {report.profiles?.phone || "Tidak tersedia"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">ID Pengguna:</span> {report.user_id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Verifikasi Laporan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes">Catatan Admin</Label>
              <Textarea
                id="adminNotes"
                placeholder="Tambahkan catatan untuk laporan ini..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Current Admin Notes */}
            {report.admin_notes && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm font-medium mb-1">Catatan Saat Ini:</p>
                <p className="text-sm text-muted-foreground">{report.admin_notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            {report.status === "pending" ? (
              <div className="flex gap-4">
                <Button
                  onClick={() => updateReportStatus("verified")}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Verifikasi Laporan
                </Button>
                <Button
                  onClick={() => updateReportStatus("rejected")}
                  disabled={isUpdating}
                  variant="destructive"
                  className="flex-1"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Tolak Laporan
                </Button>
              </div>
            ) : (
              <div className="text-center p-4 bg-muted/30 rounded-md">
                <p className="text-muted-foreground">
                  Laporan ini sudah {report.status === "verified" ? "diverifikasi" : "ditolak"}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
