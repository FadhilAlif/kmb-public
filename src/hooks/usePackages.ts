import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SupabasePackage = Tables<"packages">;

/**
 * Fetches active packages from Supabase, ordered by price ascending.
 */
export const usePackages = () => {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async (): Promise<SupabasePackage[]> => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

/**
 * Returns packages grouped by car_type for easy rendering.
 */
export const useGroupedPackages = () => {
  const query = usePackages();

  const mobilKursus =
    query.data?.filter((p) => p.car_type === "mobil_kursus") ?? [];
  const mobilSendiri =
    query.data?.filter((p) => p.car_type === "mobil_sendiri") ?? [];

  return {
    ...query,
    mobilKursus,
    mobilSendiri,
    allPackages: query.data ?? [],
  };
};
