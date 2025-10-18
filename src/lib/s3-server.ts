import { S3 } from 'aws-sdk'
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const streamToBuffer = async (readableStream: any): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of readableStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};
export async function downloadFromS3AndParse(fileKey: string) {
  const s3 = new S3({
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
    endpoint: 'play.min.io:9000',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    region: 'us-east-1',
  })

  const obj = await s3
    .getObject({
      Bucket: 'uploads',
      Key: fileKey,
    })
    .promise()
  if (!obj.Body) {
    throw new Error("File not found or empty in S3.");
  }

  const fileBuffer =
    obj.Body instanceof Buffer ? obj.Body : await streamToBuffer(obj.Body);

  // ✅ Use LangChain PDFLoader directly on buffer
  const loader = new PDFLoader(new Blob([fileBuffer]), {
    splitPages: true
  });

  const docs = await loader.load();

  return docs;
}

