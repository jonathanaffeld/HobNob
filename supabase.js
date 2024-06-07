import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const { supabaseUrl, supabaseKey } = Constants.expoConfig.extra;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
