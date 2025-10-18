import { NextRequest, NextResponse } from 'next/server'
import { loadS3IntoVectorDB } from '@/lib/vectors'
import { db } from '@/db'
import { chats } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const postBodySchema = z.object({
  fileKey: z.string(),
})



export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const postBody = await request.json()
    console.log(postBody)
    const validation = postBodySchema.safeParse(postBody)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    console.log(postBody);
    const { fileKey } = validation.data

    // Clean the fileKey and construct the URL properly
    const cleanFileKey = fileKey.replace('uploads/', '')
    const pdfUrl = `https://play.min.io:9000/uploads/${cleanFileKey}`;
    console.log('Inserting with values:', {
      fileKey,
      pdfName: fileKey,
      pdfUrl,
      userId
    });
    const returns = await db
      .insert(chats)
      .values({
        fileKey: fileKey,
        pdfName: fileKey, // or extract actual filename if needed
        pdfUrl: pdfUrl,
        userId: userId,
      })
      .returning({
        insertedId: chats.id,
      })
    await loadS3IntoVectorDB(fileKey, returns[0].insertedId)


    console.log("returns", returns);
    return NextResponse.json({ error: false, chatId: returns[0].insertedId })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
