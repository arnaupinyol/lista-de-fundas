import 'dotenv/config';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) throw new Error("Falta SUPABASE_URL en tu archivo .env");

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseKey) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY");

const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

const catalog = JSON.parse(fs.readFileSync('./data/catalog.json', 'utf8'));
const designs = JSON.parse(fs.readFileSync('./data/designs.json', 'utf8'));

async function importData() {
  try {
    for (const marca of catalog) {
      // 1. Insertar marca
      const { data: marcaData, error: marcaError } = await supabase
        .from('marcas')
        .insert({ nombre: marca.marca, logo: marca.logo })
        .select()
        .single();

      if (marcaError) throw marcaError;
      const marcaId = marcaData.id;

      // 2. Insertar modelos (sin fundas)
      for (const modelo of marca.modelos) {
        const { error: modeloError } = await supabase
          .from('modelos')
          .insert({
            marca_id: marcaId,
            nombre: modelo.nombre,
            fundas: modelo.fundas
          });

        if (modeloError) throw modeloError;
      }

      // 3. Insertar fundas UNA sola vez por marca
      const tiposFundas = [...new Set(marca.modelos.flatMap(m => m.fundas))];
      for (const tipoFunda of tiposFundas) {
        const variaciones = designs[marca.marca]?.[tipoFunda] || [];
        const { error: fundaError } = await supabase
          .from('fundas')
          .insert({
            marca_id: marcaId,
            tipo_funda: tipoFunda,
            variaciones
          });

        if (fundaError) throw fundaError;
      }
    }

    console.log('✅ Importación completada con éxito');
  } catch (err) {
    console.error('❌ Error en la importación:', err);
  }
}

importData();
