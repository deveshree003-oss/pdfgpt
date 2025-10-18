import { db } from '@/db'
import { chats } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import ChatSidebar from './chat-sidebar'
import PDFViewer from './PDFViewer'
import ChatComponent from './chat-component'

// interface Props {
//   params: {
//     chatId: string
//   }
// }

const ChatPage = async ({ params }) => {
  const { chatId } = await params // params is async
  const { userId } = await auth()
  if (!userId) return redirect('/sign-in')

  console.log("chatId", chatId, userId);
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId))


  if (!_chats) return redirect('/')
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) return redirect('/')

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId))

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>

        <div className="max-h-screen overflow-scroll flex-[5]">
          <PDFViewer pdfUrl={currentChat?.pdfUrl || ''} />
        </div>

        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
