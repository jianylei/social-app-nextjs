'use client'

import { toast } from '@/hooks/use-toast'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { MoreHorizontal } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'
import { Button, buttonVariants } from './ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/DropdownMenu'

interface PostMoreOptionsProps {
  postId: string
}

const PostMoreOptions: FC<PostMoreOptionsProps> = ({ postId }) => {
  const router = useRouter()
  const pathname = usePathname()

  const {
    mutate: deletePost,
    isLoading,
    isSuccess
  } = useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await axios.delete(`/api/subreddit/post/${postId}`)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'Unauthorized',
            description: 'You can only delete posts that you have created.',
            variant: 'destructive'
          })
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Could not delete your post, please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -2).join('/')
      router.push(newPathname)
      router.refresh()
      return toast({
        description: 'Your post has been deleted.'
      })
    }
  })

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({
            variant: 'ghost',
            size: 'xs'
          })}>
          <MoreHorizontal className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger
              disabled={isLoading || isSuccess}
              className="w-full text-left">
              Delete
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DropdownMenuSeparator />
          <DialogDescription className="py-3">
            Are you sure you want to delete your post? You can{"'"}t undo this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild className="mt-2 sm:mt-0">
            <Button isLoading={isLoading} variant="subtle">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              isLoading={isLoading}
              onClick={() => {
                deletePost(postId)
              }}>
              Delete Post
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PostMoreOptions
