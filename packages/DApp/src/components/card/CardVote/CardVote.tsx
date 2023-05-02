import React, { useState } from 'react'
import { VoteModal } from './../VoteModal'
import { VoteChart } from './../../votes/VoteChart'
import { voteTypes } from './../../../constants/voteTypes'
import { useEthers } from '@usedapp/core'
import { useContractFunction } from '@usedapp/core'
import { useContracts } from '../../../hooks/useContracts'
import { getVotingWinner } from '../../../helpers/voting'
import { VoteAnimatedModal } from './../VoteAnimatedModal'
import voting from '../../../helpers/voting'
import { DetailedVotingRoom } from '../../../models/smartContract'
import { useRoomAggregateVotes } from '../../../hooks/useRoomAggregateVotes'
import styled from 'styled-components'
import { Modal } from './../../Modal'
import { VoteBtn, VotesBtns } from '../../Button'
import { CardHeading, CardVoteBlock } from '../../Card'
import { useVotesAggregate } from '../../../hooks/useVotesAggregate'

interface CardVoteProps {
  room: DetailedVotingRoom
  hideModalFunction?: (val: boolean) => void
}

export const CardVote = ({ room, hideModalFunction }: CardVoteProps) => {
  const { account } = useEthers()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(voteTypes['Add'].for)

  const { votingContract } = useContracts()
  const vote = voting.fromRoom(room)
  const voteConstants = voteTypes[vote.type]
  const { votes } = useVotesAggregate(vote.ID, room.verificationStartAt, room.startAt)
  const castVotes = useContractFunction(votingContract, 'castVotes')

  room = useRoomAggregateVotes(room, showConfirmModal)

  console.log('room')
  console.log(room)

  const finalizeVoting = useContractFunction(votingContract, 'finalizeVotingRoom')

  const setNext = (val: boolean) => {
    setShowConfirmModal(val)
    setShowVoteModal(false)
  }

  const hideConfirm = (val: boolean) => {
    if (hideModalFunction) {
      hideModalFunction(false)
    }
    setShowConfirmModal(val)
  }

  const verificationPeriod =
    room.verificationStartAt.toNumber() * 1000 - Date.now() < 0 && room.endAt.toNumber() * 1000 - Date.now() > 0

  const winner = verificationPeriod ? 0 : getVotingWinner(vote)

  if (!vote) {
    return <CardVoteBlock />
  }
  return (
    <CardVoteBlock>
      {showVoteModal && (
        <Modal heading={`${vote?.type} ${room.details.name}?`} setShowModal={setShowVoteModal}>
          <VoteModal
            vote={vote}
            room={room.roomNumber}
            selectedVote={selectedVoted}
            proposingAmount={proposingAmount}
            setShowConfirmModal={setNext}
            setProposingAmount={setProposingAmount}
            fullRoom={room}
          />{' '}
        </Modal>
      )}
      {showConfirmModal && (
        <Modal setShowModal={hideConfirm}>
          <VoteAnimatedModal
            vote={vote}
            community={room.details}
            selectedVote={selectedVoted}
            setShowModal={hideConfirm}
            proposingAmount={proposingAmount}
            room={room}
          />
        </Modal>
      )}

      {verificationPeriod && (
        <CardHeadingEndedVote>Verification period in progress, please verify your vote.</CardHeadingEndedVote>
      )}

      {winner ? (
        <CardHeadingEndedVote>
          SNT holders have decided <b>{winner == 1 ? voteConstants.against.verb : voteConstants.for.verb}</b> this
          community to the directory!
        </CardHeadingEndedVote>
      ) : hideModalFunction || window.innerWidth < 769 ? (
        <CardHeading />
      ) : (
        !verificationPeriod && <CardHeading>{voteConstants.question}</CardHeading>
      )}

      <div>
        <VoteChart vote={vote} voteWinner={winner} tabletMode={hideModalFunction} room={room} />
        {verificationPeriod && (
          <VoteBtnFinal onClick={() => castVotes.send(votes)} disabled={!account}>
            Verify votes
          </VoteBtnFinal>
        )}
        {Boolean(winner) && (
          <VoteBtnFinal onClick={() => finalizeVoting.send(room.roomNumber)} disabled={!account}>
            Finalize the vote <span>✍️</span>
          </VoteBtnFinal>
        )}

        {!verificationPeriod && !winner && (
          <VotesBtns>
            <VoteBtn
              disabled={!account}
              onClick={() => {
                setSelectedVoted(voteConstants.against)
                setShowVoteModal(true)
              }}
            >
              {voteConstants.against.text} <span>{voteConstants.against.icon}</span>
            </VoteBtn>
            <VoteBtn
              disabled={!account}
              onClick={() => {
                setSelectedVoted(voteConstants.for)
                setShowVoteModal(true)
              }}
            >
              {voteConstants.for.text} <span>{voteConstants.for.icon}</span>
            </VoteBtn>
          </VotesBtns>
        )}
      </div>
    </CardVoteBlock>
  )
}

export const CardHeadingEndedVote = styled.p`
  max-width: 290px;
  align-self: center;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 18px;
  text-align: center;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 24px;
  }
`

const VoteBtnFinal = styled(VoteBtn)`
  width: 100%;

  @media (max-width: 600px) {
    margin-top: 24px;
  }
`
