import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SupabasePackage = Tables<"packages">;

export const usePackages = () => {
  const [data, setData] = useState<SupabasePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPackages = async (): Promise<void> => {
      setIsLoading(true);
      setIsError(false);

      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (!active) return;

      if (error) {
        setIsError(true);
        setData([]);
      } else {
        setData(data ?? []);
      }

      setIsLoading(false);
    };

    void fetchPackages();

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, isError };
};

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
