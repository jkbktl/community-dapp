import { useContractFunction, useEthers } from '@usedapp/core'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { VotesBtns, VoteBtn } from '../components/Button'
import { CardVoteBlock, CardHeading } from '../components/Card'
import {
  VoteHistoryTableCell,
  VoteHistoryTableColumnCell,
  VoteHistoryTableColumnCellDate,
} from '../components/card/CardCommunity'
import { VoteHistoryTable } from '../components/card/CardCommunity'
import { CardHeadingEndedVote } from '../components/card/CardVote/CardVote'
import { VoteSubmitButton } from '../components/card/VoteSubmitButton'
import { LinkInternal } from '../components/Link'
import { VoteChart } from '../components/votes/VoteChart'
import { VotePropose } from '../components/votes/VotePropose'
import { voteTypes } from '../constants/voteTypes'
import voting, { getVotingWinner } from '../helpers/voting'
import { useContracts } from '../hooks/useContracts'
import { DetailedVotingRoom } from '../models/smartContract'
import arrowDown from '../assets/images/arrowDown.svg'
import { useSendWakuVote } from '../hooks/useSendWakuVote'
import { WrapperBottom, WrapperTop } from '../constants/styles'
import { useRoomAggregateVotes } from '../hooks/useRoomAggregateVotes'

interface CardVoteMobileProps {
  room: DetailedVotingRoom
}

export const CardVoteMobile = ({ room }: CardVoteMobileProps) => {
  const [vote, setVote] = useState(voting.fromRoom(room))
  const { account } = useEthers()

  const selectedVoted = voteTypes['Add'].for

  const { votingContract } = useContracts()

  const finalizeVoting = useContractFunction(votingContract, 'finalizeVotingRoom')
  room = useRoomAggregateVotes(room, false)

  const voteConstants = voteTypes[vote.type]

  const winner = getVotingWinner(vote)
  const [proposingAmount, setProposingAmount] = useState(0)

  const [showHistory, setShowHistory] = useState(false)
  const isDisabled = room.details.votingHistory.length === 0
  const sendWakuVote = useSendWakuVote()

  useEffect(() => {
    setVote(voting.fromRoom(room))
  }, [JSON.stringify(room)])

  if (!vote) {
    return <CardVoteBlock />
  }
  return (
    <CardVoteBlock>
      {winner ? (
        <CardHeadingEndedVote>
          SNT holders have decided <b>{winner == 1 ? voteConstants.against.verb : voteConstants.for.verb}</b> this
          community to the directory!
        </CardHeadingEndedVote>
      ) : (
        <CardHeadingMobile>{voteConstants.question}</CardHeadingMobile>
      )}
      <div>
        <WrapperBottom>
          <VoteChart vote={vote} voteWinner={winner} isAnimation={true} />
        </WrapperBottom>
        {!winner && (
          <WrapperTop>
            <VotePropose
              vote={vote}
              selectedVote={selectedVoted}
              proposingAmount={proposingAmount}
              setProposingAmount={setProposingAmount}
            />
          </WrapperTop>
        )}

        {winner ? (
          <VoteBtnFinal onClick={() => finalizeVoting.send(room.roomNumber)} disabled={!account}>
            Finalize the vote <span>✍️</span>
          </VoteBtnFinal>
        ) : (
          <VotesBtns>
            <VoteBtn
              disabled={!account}
              onClick={async () => {
                await sendWakuVote(proposingAmount, room.roomNumber, 0)
                setVote((vote) => {
                  return { ...vote, voteAgainst: vote.voteAgainst.add(proposingAmount) }
                })
              }}
            >
              {voteConstants.against.text} <span>{voteConstants.against.icon}</span>
            </VoteBtn>
            <VoteBtn
              disabled={!account}
              onClick={async () => {
                await sendWakuVote(proposingAmount, room.roomNumber, 1)
                setVote((vote) => {
                  return { ...vote, voteFor: vote.voteFor.add(proposingAmount) }
                })
              }}
            >
              {voteConstants.for.text} <span>{voteConstants.for.icon}</span>
            </VoteBtn>
          </VotesBtns>
        )}

        <CardVoteBottom>{vote && vote.timeLeft > 0 && <VoteSubmitButton vote={vote} />}</CardVoteBottom>
      </div>
      {!isDisabled && (
        <HistoryLink
          className={showHistory ? 'opened' : ''}
          onClick={() => setShowHistory(!showHistory)}
          disabled={isDisabled}
        >
          Voting history
        </HistoryLink>
      )}

      {showHistory && (
        <VoteHistoryTable>
          <tbody>
            <tr>
              <VoteHistoryTableColumnCellDate>Date</VoteHistoryTableColumnCellDate>
              <VoteHistoryTableColumnCell>Type</VoteHistoryTableColumnCell>
              <VoteHistoryTableColumnCell>Result</VoteHistoryTableColumnCell>
            </tr>
            {room.details.votingHistory.map((vote) => {
              return (
                <tr key={vote.ID}>
                  <VoteHistoryTableCell>{vote.date.toLocaleDateString()}</VoteHistoryTableCell>
                  <VoteHistoryTableCell>{vote.type}</VoteHistoryTableCell>
                  <VoteHistoryTableCell>{vote.result}</VoteHistoryTableCell>
                </tr>
              )
            })}
          </tbody>
        </VoteHistoryTable>
      )}
    </CardVoteBlock>
  )
}

const CardHeadingMobile = styled(CardHeading)`
  margin-bottom: 24px;
`
const VoteBtnFinal = styled(VoteBtn)`
  width: 100%;
`

const CardVoteBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const HistoryLink = styled(LinkInternal)`
  width: 120px;
  position: relative;
  margin: 24px 0;
  text-align: start;
  padding: 0;

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-image: url(${arrowDown});
    background-size: contain;
    background-repeat: no-repeat;
  }

  &.opened {
    &::after {
      content: '';
      width: 24px;
      height: 24px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%) rotate(180deg);
      background-image: url(${arrowDown});
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
`
