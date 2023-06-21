import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return notFound()
}

export default page
