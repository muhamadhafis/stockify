const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const config = require('.');

const pool = new Pool(config.postgres);

const supabase = createClient(config.supabase.url, config.supabase.ServiceKey);

module.exports = { supabase, pool };
