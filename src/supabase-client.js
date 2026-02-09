import { createClient } from '@supabase/supabase-js';

// ✓ .from('TableName').select() to read
// ✓ .insert() to add
// ✓ .update() to edit
// ✓ .delete() to remove

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

//Create a single reuasable client

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
