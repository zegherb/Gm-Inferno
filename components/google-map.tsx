"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"

interface LocationData {
  latitude: number
  longitude: number
  address: string
}

interface GoogleMapProps {
  onLocationSelect: (location: LocationData) => void
  selectedLocation: LocationData | null
}

export default function GoogleMap({ onLocationSelect, selectedLocation }: GoogleMapProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Use reverse geocoding to get a more readable address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`,
          )

          let address = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`

          if (response.ok) {
            const data = await response.json()
            if (data.locality || data.city) {
              address = `${data.locality || data.city}, ${data.principalSubdivision || data.countryName}`
            }
          }

          const locationData = { latitude, longitude, address }
          onLocationSelect(locationData)
        } catch (error) {
          console.error("Error getting address:", error)
          const locationData = {
            latitude,
            longitude,
            address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
          }
          onLocationSelect(locationData)
        }

        setIsLoading(false)
      },
      (error) => {
        setError("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.")
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }, [onLocationSelect])

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full bg-transparent"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Mendapatkan Lokasi...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-2" />
            Gunakan Lokasi Saat Ini
          </>
        )}
      </Button>

      {error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {selectedLocation && (
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-sm font-medium">Lokasi Terdeteksi:</p>
          <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Koordinat: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}
