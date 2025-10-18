import { NextRequest, NextResponse } from 'next/server'
import { Message, StreamingTextResponse } from 'ai'
import { db } from '@/db'
import { chats } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getContext } from '@/lib/context'
import { messages as _messages } from '@/db/schema'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      messages,
      chatId,
    }: {
      messages: Message[]
      chatId: number
    } = await request.json()

    await getFileKeyByChatId(chatId, () => {
      return NextResponse.json({ error: 'Chat not found' })
    })

    const lastMessage = messages[messages.length - 1]
    const context = await getContext(lastMessage.content, chatId)
    console.log("context", context);
    const prompt = {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      
      IMPORTANT: Respond in plain text only.
      Do not use Markdown, bullet points, numbering, headings, bold, italics, or special formatting.
      `,
    }
    const contents = [
      { type: 'text', text: prompt.content, metadata: { role: 'system' } },
      ...messages
        .filter((msg) => msg.role === 'user')
        .map((msg) => ({ type: 'text', text: msg.content, metadata: { role: 'user' } })),
    ];
    const response = await genAI.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents,
    });
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: 'user',
    })


    const encoder = new TextEncoder();
    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text
            if (text) {
              fullText += text;

              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          await db.insert(_messages).values({
            chatId,
            content: fullText,
            role: 'system',
          });
          controller.close();
        }
      },
    });
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Something is going wrong ...' },
      { status: 500 }
    )
  }
}

async function getFileKeyByChatId(chatId: number, onError: Function) {
  const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
  if (_chats.length !== 1) onError()
  return _chats[0].fileKey
}
