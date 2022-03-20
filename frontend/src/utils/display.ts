import type { IpRecord } from "@/types/ipRecord";

export function displayedClientLocation(recordGeo: IpRecord["geo"]) {
  return [recordGeo?.city, recordGeo?.countryCode].filter((v) => v).join(", ");
}
