import { documents } from '@/db/schema';
import { getEmbeddings } from './embeddings'
import { ContentEmbedding } from '@google/genai'
import { db } from '@/db';
import { and, asc, eq, gt, sql } from 'drizzle-orm';

export async function getContext(query: string, chatId: number) {
  const contentEmbeddings = await getEmbeddings(query)
  if (!contentEmbeddings) throw new Error("No query embeddings found");

  const matches = await getMatchesFromEmbeddings(contentEmbeddings, chatId)
  console.log("matches", matches);
  return matches.join('\n').substring(0, 3000)
}

async function getMatchesFromEmbeddings(contentEmbeddings: ContentEmbedding[], chatId: number) {
  try {
    const embeddings = contentEmbeddings[0].values;
    if (!embeddings) throw new Error("No embeddings found");
    const vectorString = `[${embeddings.join(',')}]`;

    let matches = await db
      .select({
        id: documents.id,
        content: documents.content,
        similarity: sql`1 - (documents.embedding <=> ${vectorString}::vector)`.as('similarity'),
      })
      .from(documents).
      where(and(
        eq(documents.chatId, chatId),
        gt(sql`1 - (documents.embedding <=> ${vectorString}::vector)`, 0.7)
      ))
      .orderBy(asc(sql`1 - (documents.embedding <=> ${vectorString}::vector)`))
      .limit(5)
    if (matches.length === 0) {
      matches = await db
        .select({
          id: documents.id,
          content: documents.content,
          similarity: sql`1 - (documents.embedding <=> ${vectorString}::vector)`.as('similarity'),
        })
        .from(documents)
        .where(eq(documents.chatId, chatId))
        .orderBy(sql`1 - (documents.embedding <=> ${vectorString}::vector) DESC`)
        .limit(5);
    }
    return matches.map((match) => match.content)
  } catch (error) {
    console.log('Error querying from embeddings')
    console.log((error as TypeError).stack)
    throw error
  }
}




//  select
//     id,
//     content,
//     1 - (documents.embedding <=> query_embedding) as similarity
//   from documents
//   where 1 - (documents.embedding <=> query_embedding) > match_threshold
//   order by documents.embedding <=> query_embedding
//   limit match_count;




// SELECT
//   id,
//   content,
//   1 - (embedding <=> '[YOUR_QUERY_EMBEDDING]') AS similarity
// FROM
//   documents
// WHERE
//   1 - (embedding <=> '[YOUR_QUERY_EMBEDDING]') > 0.7
// ORDER BY
//   embedding <=> '[YOUR_QUERY_EMBEDDING]'
// LIMIT 5;