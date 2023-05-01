import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWaku } from '../providers/waku/provider'
import { useConfig } from '../providers/config'

import wakuMessage from '../helpers/wakuVote'
import { validateVote } from '../helpers/validateVote'

type InitialVotes = {
  for: number
  against: number
  voted: string[]
}

const initialVotes: InitialVotes = {
  for: 0,
  against: 0,
  voted: [],
}

export function useUnverifiedVotes(room: number | undefined, verificationStartAt: BigNumber, startAt: BigNumber) {
  const { config } = useConfig()

  const { waku } = useWaku()
  const [votesFor, setVotesFor] = useState<number>(initialVotes.for)
  const [votesAgainst, setVotesAgainst] = useState<number>(initialVotes.against)

  useEffect(() => {
    const accumulateVotes = async () => {
      if (waku && room) {
        const messages = await wakuMessage.receive(waku, config.wakuTopic, room)
        const validMessages = messages?.filter((message) => validateVote(message, verificationStartAt, startAt))

        const votes: InitialVotes =
          validMessages?.reduce((acc, message) => {
            if (acc.voted.includes(message.address)) {
              return { for: acc.for, against: acc.against, voted: acc.voted }
            }

            if (message.vote === 'no') {
              return {
                for: acc.for,
                against: acc.against + parseInt(message.sntAmount._hex, 16),
                voted: [...acc.voted, message.address],
              }
            } else if (message.vote === 'yes') {
              return {
                for: acc.for + parseInt(message.sntAmount._hex, 16),
                against: acc.against,
                voted: [...acc.voted, message.address],
              }
            }

            return { for: acc.for, against: acc.against, voted: acc.voted }
          }, initialVotes) ?? initialVotes

        setVotesFor(votes?.for)
        setVotesAgainst(votes?.against)
      }
    }
    accumulateVotes()
  }, [waku, room])

  return { votesFor, votesAgainst }
}
