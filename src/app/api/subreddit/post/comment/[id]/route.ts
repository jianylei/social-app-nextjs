import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
    ) {
    try {
        const id = params.id

        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const topLevelComment = await db.comment.findUnique({
            where: {
                id
            }
        })

        if (!topLevelComment) {
            return new Response('Comment not found', { status: 404 })
        }


        const replyComments = await db.comment.findMany({
            where: {
                replyToId: id
            }
        })

        if (replyComments.length) {
            const commentIds = replyComments.map(c => c.id)

            await db.commentVote.deleteMany({
                where: {
                    commentId: {
                        in: [...commentIds, id]
                    }
                }
            })

            await db.comment.deleteMany({
                where: {
                    id: {
                        in: commentIds
                    }
                }
            })
        } else {
            await db.commentVote.deleteMany({
                where: {
                    commentId: id
                }
            })
        }

        await db.comment.delete({
            where: {
                id
            }
        })

        return new Response('OK')
    } catch (err) {
          return new Response('Could delete comment, please try again later.', { status: 500 })
        }
}