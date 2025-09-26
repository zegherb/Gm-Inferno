"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import GoogleMap from "@/components/google-map"
import Link from "next/link"
import { MapPin, Upload, Camera, ArrowLeft, Loader2 } from "lucide-react"

interface LocationData {
  latitude: number
  longitude: number
  address: string
}

export default function NewReportPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [damageLevel, setDamageLevel] = useState("")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationName, setLocationName] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [router, supabase])

  const handleLocationSelect = (locationData: LocationData) => {
    setLocation(locationData)
    setLocationName(locationData.address)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Ukuran foto maksimal 5MB")
        return
      }

      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      console.log("[v0] Uploading photo with filename:", fileName)
      console.log("[v0] User ID:", user.id)
      console.log("[v0] File size:", file.size)

      const { data, error } = await supabase.storage.from("report-photos").upload(fileName, file)

      if (error) {
        console.log("[v0] Upload error:", error)
        throw error
      }

      console.log("[v0] Upload successful:", data)

      const {
        data: { publicUrl },
      } = supabase.storage.from("report-photos").getPublicUrl(fileName)

      console.log("[v0] Public URL:", publicUrl)
      return publicUrl
    } catch (error) {
      console.error("Error uploading photo:", error)
      if (error instanceof Error) {
        console.log("[v0] Error message:", error.message)
        setError(`Error uploading photo: ${error.message}`)
      }
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!title.trim() || !description.trim() || !damageLevel || !location) {
        throw new Error("Semua field wajib diisi")
      }

      let photoUrl = null
      if (photo) {
        photoUrl = await uploadPhoto(photo)
        if (!photoUrl) {
          throw new Error("Gagal mengupload foto")
        }
      }

      console.log("[v0] Inserting report with data:", {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        location_name: locationName.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        damage_level: damageLevel,
        photo_url: photoUrl,
        status: "pending",
      })

      // Insert report to database
      const { data: insertData, error: insertError } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          location_name: locationName.trim(),
          latitude: location.latitude,
          longitude: location.longitude,
          damage_level: damageLevel,
          photo_url: photoUrl,
          status: "pending",
        })
        .select()

      if (insertError) {
        console.log("[v0] Insert error:", insertError)
        throw insertError
      }

      console.log("[v0] Report inserted successfully:", insertData)
      router.push("/dashboard/reports?success=true")
    } catch (error: any) {
      console.log("[v0] Submit error:", error)
      setError(error.message || "Terjadi kesalahan saat menyimpan laporan")
    } finally {
      setIsLoading(false)
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
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
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">LAJARUS</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buat Laporan Baru</h1>
          <p className="text-muted-foreground">Laporkan kerusakan jalan yang Anda temukan</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Form Laporan Kerusakan Jalan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Laporan *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Jalan Berlubang di Depan Sekolah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Kerusakan *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan kondisi kerusakan jalan secara detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Damage Level */}
              <div className="space-y-2">
                <Label>Tingkat Kerusakan *</Label>
                <Select value={damageLevel} onValueChange={setDamageLevel} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat kerusakan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ringan">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDamageLevelColor("ringan")}>Ringan</Badge>
                        <span className="text-sm text-muted-foreground">- Lubang kecil, retak minor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sedang">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDamageLevelColor("sedang")}>Sedang</Badge>
                        <span className="text-sm text-muted-foreground">- Lubang sedang, retak lebar</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="berat">
                      <div className="flex items-center space-x-2">
                        <Badge className={getDamageLevelColor("berat")}>Berat</Badge>
                        <span className="text-sm text-muted-foreground">- Lubang besar, jalan rusak parah</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location with Google Map */}
              <div className="space-y-2">
                <Label>Lokasi Kerusakan *</Label>
                <div className="space-y-3">
                  <GoogleMap onLocationSelect={handleLocationSelect} selectedLocation={location} />

                  <Input
                    placeholder="Atau masukkan nama lokasi manual"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Foto Kerusakan</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {photoPreview ? (
                          <img
                            src={photoPreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        ) : (
                          <>
                            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Klik untuk upload foto</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG maksimal 5MB</p>
                          </>
                        )}
                      </div>
                      <input id="photo" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                  </div>
                  {photo && <p className="text-sm text-muted-foreground">File terpilih: {photo.name}</p>}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/dashboard">Batal</Link>
                </Button>
                <Button type="submit" disabled={isLoading || !location} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Kirim Laporan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
