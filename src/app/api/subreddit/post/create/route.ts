import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { subredditId, title, content } = PostValidator.parse(body)

    const alreadyExist = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id
      }
    })

    if (!alreadyExist) {
      return new Response('Subreddit to post', { status: 400 })
    }

    await db.post.create({
        data: {
            title,
            content,
            authorId: session.user.id,
            subredditId
        },
    })

    return new Response('OK')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid POST request data passed', { status: 422 })
    }

    return new Response('Could not post to subreddit at this time, please try again later.', { status: 500 })
  }
}
