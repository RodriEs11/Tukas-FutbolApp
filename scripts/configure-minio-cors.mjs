import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

// Leer .env.local manualmente para no requerir dependencias extra
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    }
  }
}

loadEnv();

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT || 'http://192.168.100.174:9000',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'minioadmin',
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

const BUCKET = process.env.S3_BUCKET_NAME || 'tukas-media';

async function configureCors() {
  console.log(`Configurando CORS para el bucket "${BUCKET}" en ${process.env.S3_ENDPOINT}...`);

  const corsRules = {
    Bucket: BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
          AllowedOrigins: ['*'],
          ExposeHeaders: ['ETag', 'Content-Type', 'Content-Length'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };

  try {
    const putCommand = new PutBucketCorsCommand(corsRules);
    await s3Client.send(putCommand);
    console.log('✅ CORS configurado exitosamente en MinIO.');

    const getCommand = new GetBucketCorsCommand({ Bucket: BUCKET });
    const response = await s3Client.send(getCommand);
    console.log('📋 Reglas de CORS actuales:');
    console.log(JSON.stringify(response.CORSRules, null, 2));
  } catch (error) {
    console.error('❌ Error configurando CORS:', error);
  }
}

configureCors();
