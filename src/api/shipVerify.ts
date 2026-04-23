import { useQuery } from "@tanstack/react-query";
import { type ShipVerifyResponse, ShipVerifyResponseSchema } from "./shipVerify.schemas";
import { queryKeys } from "./users";

export async function fetchShipVerify(): Promise<ShipVerifyResponse> {
  const res = await fetch("/api/ship-verify");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: unknown = await res.json();
  return ShipVerifyResponseSchema.parse(json);
}

export function useShipVerify() {
  return useQuery({
    queryKey: queryKeys.shipVerify.all(),
    queryFn: fetchShipVerify,
    staleTime: 15_000,
  });
}
