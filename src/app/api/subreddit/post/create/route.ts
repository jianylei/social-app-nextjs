import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { VoteType } from '@prisma/client'
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
      return new Response('Subscribe to post', { status: 400 })
    }

    const { id: postId } = await db.post.create({
        data: {
            title,
            content,
            authorId: session.user.id,
            subredditId
        },
    })

    await db.vote.create({
      data: {
        type: VoteType.UP,
        userId: session.user.id,
        postId
      }
    })

    return new Response('OK')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid POST request data passed', { status: 422 })
    }

    return new Response('Could not post to subreddit at this time, please try again later.', { status: 500 })
  }
}
