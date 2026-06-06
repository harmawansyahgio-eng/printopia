const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Make bucket public and exist
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('documents', 'documents', true) 
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    // Enable all access to the documents bucket
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow All" ON storage.objects FOR ALL USING (bucket_id = 'documents');
    `);
    
    console.log('Successfully configured Supabase Storage RLS!');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Policy already exists, it is fine.');
    } else {
      console.error(err);
    }
  }
}

main().finally(() => prisma.$disconnect());
