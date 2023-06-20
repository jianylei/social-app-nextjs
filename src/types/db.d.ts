import { Comment, CommentVote, Subreddit, User, Vote } from "@prisma/client"

export type ExtendedPost = post & {
    subreddit: Subreddit,
    votes: Vote[],
    author: User,
    comments: Comment
}

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}