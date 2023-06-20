import { z } from "zod";

export const CommentValidator = z.object({
    postId: z.string(),
    text: z.string(),
    replyToId: z.string().optional()
})

export const RemoveCommentValidator = z.object({
    commentId: z.string()
})

export type CommentRequest = z.infer<typeof CommentValidator>
export type RemoveCommentRequest = z.infer<typeof RemoveCommentValidator>