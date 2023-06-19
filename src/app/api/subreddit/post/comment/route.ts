import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"
import { VoteType } from "@prisma/client"
import { z } from "zod"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const { postId, text, replyToId } = CommentValidator.parse(body)

        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { id: commentId } = await db.comment.create({
            data: {
                text,
                postId,
                authorId: session.user.id,
                replyToId
            }
        })

        await db.commentVote.create({
            data: {
                type: VoteType.UP,
                userId: session.user.id,
                commentId
            }
        })

        return new Response('OK')
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response('Invalid request data passed', { status: 422 })
          }
      
          return new Response('Could not create comment, please try again later.', { status: 500 })
        }
}