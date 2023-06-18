'use client'

import { FC, useState } from 'react'
import { Command, CommandInput } from './ui/Command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as Subreddit & {
        _count: Prisma.SubredditCountOutputType
      }
    },
    queryKey: ['search-query'],
    enabled: false
  })

  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text)
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
    </Command>
  )
}

export default SearchBar
