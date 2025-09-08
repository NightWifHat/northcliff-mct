import { createClient } from "@supabase/supabase-js";

// Get secrets from environment (not exposed to browser!)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { booking_date, status, name, email, phone, notes } = req.body;

    // Insert booking into Supabase
    const { data, error } = await supabase.from("bookings").insert([
      {
        booking_date,
        status,
        name,
        email,
        phone,
        notes,
      },
    ]);

    if (error) throw error;

    res.status(200).json({ success: true, booking: data[0] });
  } catch (err) {
    console.error("Error inserting booking:", err);
    res.status(500).json({ error: err.message });
  }
}
