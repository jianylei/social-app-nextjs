import { ExtendedComment } from '@/types/db'
import { FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/DropdownMenu'
import { MoreHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/Dialog'
import { Button, buttonVariants } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { RemoveCommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { DialogClose } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'

interface CommentMoreOptionsProps {
  commentId: string
}

const CommentMoreOptions: FC<CommentMoreOptionsProps> = ({ commentId }) => {
  const router = useRouter()

  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async ({ commentId }: RemoveCommentRequest) => {
      const payload: RemoveCommentRequest = {
        commentId
      }

      const { data } = await axios.delete('/api/subreddit/post/comment', {
        data: payload
      })
      return data
    },
    onError: (err) => {
      console.log('errr')
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem',
        description: 'Could not delete your comment, please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
    }
  })

  return (
    <div>
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
              <DialogTrigger className="w-full text-left">Delete</DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete comment</DialogTitle>
            <DropdownMenuSeparator />
            <DialogDescription className="py-3">
              Are you sure you want to delete your comment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button isLoading={isLoading} variant="subtle">
                Keep
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  deleteComment({ commentId })
                }}>
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentMoreOptions
function loginToast(): unknown {
  throw new Error('Function not implemented.')
}
