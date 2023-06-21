import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
    ) {
    try {
        const id = params.id

        const session = await getAuthSession()

        const post = await db.post.findUnique({
            where: {
                id
            }
        })

        if (!session?.user || session.user.id !== post?.authorId) {
            return new Response('Unauthorized', { status: 401 })
        }

        if (!post) {
            return new Response('Post not found', { status: 404 })
        }

        const comments = await db.comment.findMany({
            where: {
                postId: post.id,
                replyToId: null
            }
        })

        const replies = comments ? (
            await db.comment.findMany({
                where: {
                    postId: post.id,
                    replyToId: {
                        not: null
                    }
                }
            })
        ) : []

        const replyIds = replies.map(reply => reply.id)
        const commentIds = comments.map(comment => comment.id)

        if (replies || comments) {
            await db.commentVote.deleteMany({
                where: {
                    commentId: {
                        in: [...replyIds, ...commentIds]
                    }
                }
            })
        }

        if (replies) {
            await db.comment.deleteMany({
                where: {
                    id: {
                        in: replyIds
                    }
                }
            })
        }

        if (comments) {
            await db.comment.deleteMany({
                where: {
                    id: {
                        in: commentIds
                    }
                }
            })
        }

        await db.vote.deleteMany({
            where: {
                postId: post.id
            }
        })

        await db.post.delete({
            where: {
                id: post.id
            }
        })

        return new Response('OK')
    } catch (err) {
          return new Response('Could delete comment, please try again later.', { status: 500 })
        }
}