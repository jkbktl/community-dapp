import { receiveWakuFeatureMsg } from './wakuFeature'
import { merge } from 'lodash'
import { BigNumber, utils } from 'ethers'
import { recoverAddress } from './ethMessage'

import type { WakuLight } from 'js-waku/lib/interfaces'
import { FeaturedVoting } from '../models/smartContract'
import { TypedFeature } from '../models/TypedData'
import { WakuFeatureData } from '../models/waku'

type CommunityFeatureVote = {
  [voter: string]: BigNumber
}

type CommunityFeatureVotes = {
  sum: BigNumber
  votes: CommunityFeatureVote
}

type CommunitiesFeatureVotes = {
  [community: string]: CommunityFeatureVotes
}

export function getContractParameters(
  address: string,
  publicKey: string,
  sntAmount: number,
  timestamp: number
): [string, string, BigNumber, BigNumber] {
  return [address, publicKey, BigNumber.from(sntAmount), BigNumber.from(timestamp)]
}

function sumVotes(map: CommunitiesFeatureVotes) {
  for (const [publicKey, community] of Object.entries(map)) {
    map[publicKey]['sum'] = BigNumber.from(0)
    for (const votes of Object.entries(community['votes'])) {
      map[publicKey]['sum'] = map[publicKey]['sum'].add(votes[1])
    }
  }
}

export async function receiveWakuFeature(waku: WakuLight | undefined, topic: string, activeVoting: FeaturedVoting) {
  let messages = await receiveWakuFeatureMsg(waku, topic)
  const featureVotes: CommunitiesFeatureVotes = {}

  if (messages && messages?.length > 0) {
    messages = messages.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    const validatedMessages = []

    for (const message of messages) {
      const messageTimestamp = message.timestamp / 1000

      const validatedMessage =
        messageTimestamp < activeVoting.verificationStartAt.toNumber() &&
        messageTimestamp > activeVoting.startAt.toNumber()

      if (!validatedMessage) {
        break
      } else {
        validatedMessages.push(message)
      }
    }

    validatedMessages?.forEach((message) => {
      merge(featureVotes, { [message.publicKey]: { votes: { [message.voter]: message.sntAmount } } })
    })

    sumVotes(featureVotes)
  }

  return { votes: featureVotes, votesToSend: messages }
}

export async function filterVerifiedFeaturesVotes(
  messages: WakuFeatureData[] | undefined,
  alreadyVoted: string[],
  getTypedData: (data: [string, string, BigNumber, BigNumber]) => TypedFeature
) {
  if (!messages) {
    return []
  }
  const verified: [string, string, BigNumber, BigNumber, string, string][] = []

  messages.forEach((msg) => {
    const params = getContractParameters(msg.voter, msg.publicKey, msg.sntAmount.toNumber(), msg.timestamp)

    if (utils.getAddress(recoverAddress(getTypedData(params), msg.sign)) == msg.voter) {
      console.log('------------------')
      console.log('------------------')
      console.log(msg.sign)
      console.log(recoverAddress(getTypedData(params), msg.sign))
      console.log(utils.getAddress(recoverAddress(getTypedData(params), msg.sign)))
      console.log(msg.voter)

      const addressInVerified = verified.find((el) => el[0] === msg.voter)
      const addressInVoted = alreadyVoted.find((el: string) => el === msg.voter)
      const splitSig = utils.splitSignature(msg.sign)
      if (!addressInVerified && !addressInVoted) {
        verified.push([...params, splitSig.r, splitSig._vs])
      }
    }
  })
  return verified
}
