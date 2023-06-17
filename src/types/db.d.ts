import { Subreddit, User, Vote } from "@prisma/client"

export type ExtendedPost = post & {
    subreddit: Subreddit,
    votes: Vote[],
    author: User,
    comments: Comment
}