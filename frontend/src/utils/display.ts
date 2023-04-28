import type { IpGeoRecord } from "@/types/ipGeoRecord";

export function displayedClientLocation(recordGeo: IpGeoRecord) {
  return [recordGeo?.city, recordGeo?.countryCode].filter((v) => v).join(", ");
}
