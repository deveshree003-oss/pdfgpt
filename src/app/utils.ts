export async function createChat(
  fileKey: string
): Promise<string> {   // 👈 ye chatId return karega
const res = await fetch('/api/create-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fileKey }),
})


  const data = await res.json()
  if (data.error) throw new Error('Error creating chat')

  return data.chatId   // 👈 ab TypeScript bhi khush, router bhi chalega
}
