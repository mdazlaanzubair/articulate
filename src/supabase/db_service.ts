import { supabase } from "./client";

/**
 * Represents a single user AI configuration entry.
 */
export interface DBInterface {
  id: string;
  created_at: string;
  user_id: string;
  provider: string;
  model: string;
  gemini_api_key?: string;
  openai_api_key?: string;
}

const TABLE = "User Config";

/**
 * 🔹 Create a new AI configuration record.
 * @param data - Configuration data without id/created_at
 * @returns Newly created configuration
 */
export async function createAIConfig(
  data: Omit<DBInterface, "id" | "created_at">
): Promise<DBInterface> {
  const { error, data: result } = await supabase
    .from(TABLE)
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating AI config:", error.message);
    throw new Error("Failed to create configuration. Please try again.");
  }

  return result;
}

/**
 * 🔹 Get all AI configuration records for a given user.
 * @param user_id - User identifier
 * @returns Array of user configurations
 */
export async function getAIConfigsByUser(
  user_id: string
): Promise<DBInterface[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching configs for user:", error.message);
    throw new Error("Unable to fetch configurations for this user.");
  }

  return data as DBInterface[];
}

/**
 * 🔹 Get a specific configuration by its ID.
 * @param id - Configuration UUID
 * @returns The matched configuration
 */
export async function getAIConfigById(id: string): Promise<DBInterface> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching config by ID:", error.message);
    throw new Error("Configuration not found.");
  }

  return data as DBInterface;
}

/**
 * 🔹 Update an existing configuration.
 * @param id - Configuration UUID
 * @param updates - Partial object with fields to update
 * @returns The updated configuration
 */
export async function updateAIConfig(
  id: string,
  updates: Partial<DBInterface>
): Promise<DBInterface> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating config:", error.message);
    throw new Error("Failed to update configuration.");
  }

  return data as DBInterface;
}

/**
 * 🔹 Delete a configuration by ID.
 * @param id - Configuration UUID
 * @returns Boolean status of deletion
 */
export async function deleteAIConfig(id: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    console.error("Error deleting config:", error.message);
    throw new Error("Failed to delete configuration.");
  }

  return true;
}

/**
 * 🔁 Create or Update AI configuration based on (user_id + provider) uniqueness.
 * - If config exists → update it
 * - If not → create new
 * 
 * @param config - New config data (without `id` and `created_at`)
 * @returns The upserted (created or updated) configuration
 */
export async function upsertAIConfig(
  config: Omit<DBInterface, "id" | "created_at">
): Promise<DBInterface> {
  // Check for existing record (based on user_id + provider)
  const { data: existing, error: fetchError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", config.user_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116: "Results contain 0 rows" — which is fine, we want to create in that case
    console.error("Error checking existing config:", fetchError.message);
    throw new Error("Failed to check existing configuration.");
  }

  if (existing) {
    // Update existing
    const { data: updated, error: updateError } = await supabase
      .from(TABLE)
      .update(config)
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating config:", updateError.message);
      throw new Error("Failed to update configuration.");
    }

    return updated as DBInterface;
  } else {
    // Insert new
    const { data: created, error: insertError } = await supabase
      .from(TABLE)
      .insert(config)
      .select()
      .single();

    if (insertError) {
      console.error("Error creating config:", insertError.message);
      throw new Error("Failed to create configuration.");
    }

    return created as DBInterface;
  }
}
