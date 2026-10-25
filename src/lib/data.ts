import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  category_slug: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
};

export type Banner = {
  id: string;
  placement: "hero" | "athletes" | "promo";
  title: string;
  subtitle: string | null;
  image_url: string;
  link: string | null;
  sort: number;
  active: boolean;
};

export function useProducts() {
  return useQuery({
    queryKey: ["mo_products"],
    staleTime: 60_000,
    retry: false,
    queryFn: async (): Promise<Product[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("mo_products")
        .select("*")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useBanners(placement: Banner["placement"]) {
  return useQuery({
    queryKey: ["mo_banners", placement],
    staleTime: 60_000,
    retry: false,
    queryFn: async (): Promise<Banner[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("mo_banners")
        .select("*")
        .eq("placement", placement)
        .eq("active", true)
        .order("sort", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });
}

export const formatPrice = (n: number | null | undefined) =>
  n == null ? "Price on request" : `Rs. ${Number(n).toLocaleString("en-PK")}`;
