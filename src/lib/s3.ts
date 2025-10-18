import { S3 } from 'aws-sdk'

export async function uploadToS3(file: File) {
  const s3 = new S3({
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
    endpoint: 'play.min.io:9000',
    s3ForcePathStyle: true, // Required for MinIO
    signatureVersion: 'v4',
    region: 'us-east-1',
  })

  const fileKey = `${Date.now()}-${file.name.replace(' ', '-')}`



  await s3
    .putObject({
      Bucket: 'uploads',
      Key: fileKey,
      Body: file,
      ContentType: file.type,
    })
    .promise()


  return fileKey
}
