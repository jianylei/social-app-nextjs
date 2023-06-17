import { FC } from 'react'
import { PageProps } from '../../../../.next/types/app/layout'
import { getAuthSession } from '@/lib/auth'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params

  const session = await getAuthSession()

  return <div>page</div>
}

export default page
