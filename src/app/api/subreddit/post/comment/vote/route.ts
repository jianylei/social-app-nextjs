import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator, PostVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const {commentId, voteType} = CommentVoteValidator.parse(body)

        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const alreadyExist = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        })

        if (alreadyExist) {
            if (alreadyExist.type === voteType) {
               await db.commentVote.delete({
                where: {
                    userId_commentId: {
                        commentId,
                        userId: session.user.id
                    }
                }
               })

               return new Response('OK')
            } else {
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    },
                    data : {
                        type: voteType
                    }
                })
                return new Response('OK')
            }  
        }

        await db.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                commentId
            }
        })

        return new Response('OK')
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response('Invalid POST request data passed', { status: 422 })
        }

        return new Response(
            'Could not register your vote, please try again.',
            { status: 500 }
        )
    }
}