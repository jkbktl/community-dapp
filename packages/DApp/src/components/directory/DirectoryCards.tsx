import React, { useState } from 'react'
import { Card, CardCommunity, CardCommunityWrap, CardVoteWrap } from '../Card'
import { CardFeature } from '../card/CardFeature'
import styled from 'styled-components'
import { CommunityDetail, DirectorySortingEnum } from '../../models/community'
import { useCommunities } from '../../hooks/useCommunities'
import { getCommunitiesInDirectory } from '../../helpers/apiMock'
import { FilterList } from '../Filter'
import { Search } from '../Input'
import { PageBar } from '../PageBar'
import { DirectorySortingOptions } from '../../constants/SortingOptions'
import { useConfig } from '../../providers/config'
import { Colors } from '../../constants/styles'
import { WeeklyFeature } from '../WeeklyFeature'
import { DirectoryCardSkeleton } from './DirectoryCardSkeleton'
interface DirectoryCardProps {
  community: CommunityDetail
}

function DirectoryCard({ community }: DirectoryCardProps) {
  if (!community.directoryInfo) {
    return <div />
  }
  let timeLeft: string | undefined = undefined
  if (community.directoryInfo.untilNextFeature) {
    timeLeft = `${community.directoryInfo.untilNextFeature / (3600 * 24 * 7)} weeks left`
  }

  return (
    <Card>
      <CardCommunityWrap>
        &nbsp;
        <CardCommunity community={community} showRemoveButton={true} />
      </CardCommunityWrap>
      <CardVoteWrap style={{ backgroundColor: `${Colors.GrayLight}` }}>
        <CardFeature
          community={community}
          heading={timeLeft ? 'This community has to wait until it can be featured again' : 'Weekly Feature vote'}
          icon={timeLeft ? '⏳' : '⭐'}
          sum={community.directoryInfo.featureVotes?.toNumber()}
          timeLeft={timeLeft}
        />
      </CardVoteWrap>
    </Card>
  )
}

export function DirectoryCards() {
  const { config } = useConfig()
  const [filterKeyword, setFilterKeyword] = useState('')
  const [sortedBy, setSortedBy] = useState(DirectorySortingEnum.IncludedRecently)
  const { communities, loading } = useCommunities(getCommunitiesInDirectory, {
    numberPerPage: config.numberPerPage,
    sortedBy,
    filterKeyword,
  })

  return (
    <>
      <PageBar>
        <Search
          type="text"
          placeholder="Search communities..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.currentTarget.value)}
        />
        <FilterList value={sortedBy} setValue={setSortedBy} options={DirectorySortingOptions} />
      </PageBar>
      <WeeklyFeature endDate={new Date('07/26/2021')} />
      <Voting>
        {communities.map((community) => (
          <DirectoryCard key={community.publicKey} community={community} />
        ))}
      </Voting>
      {loading && (
        <>
          <DirectoryCardSkeleton />
          <DirectoryCardSkeleton />
          <DirectoryCardSkeleton />
        </>
      )}
    </>
  )
}

const Voting = styled.div`
  display: flex;
  flex-direction: column;
`
