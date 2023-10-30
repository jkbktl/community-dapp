import { BigNumber } from 'ethers'
import { CommunityDetail } from '../models/community'

export const communities: Array<CommunityDetail> = [
  {
    publicKey: '0x0d9cb350e1dc415303e2816a21b0a439530725b4b2b42d2948e967cb211eab89d5',
    ens: 'CryptoPunks',
    name: 'CryptoPunks',
    link: 'cryptopunks.com',
    icon: 'https://static.coindesk.com/wp-content/uploads/2021/01/cryptopunk.jpg',
    tags: ['nfts', 'collectables', 'cryptopunks', 'quite long', 'funny', 'very long tag', 'short'],
    description: 'Owners of CryptoPunks, marketplace. Nullam mattis mattis mattis fermentum libero.',
    numberOfMembers: 4,
    validForAddition: false,
    votingHistory: [
      {
        type: 'Add',
        date: new Date('2021-03-16'),
        result: 'Failed',
        ID: 0,
      },
      {
        type: 'Add',
        date: new Date('2021-04-02'),
        result: 'Passed',
        ID: 1,
      },
      {
        type: 'Feature',
        date: new Date('2021-04-17'),
        result: 'Failed',
        ID: 2,
      },
      {
        type: 'Remove',
        date: new Date('2021-05-07'),
        result: 'Passed',
        ID: 3,
      },
    ],
    currentVoting: {
      timeLeft: 172800,
      timeLeftVerification: 174800,
      type: 'Remove',
      voteFor: BigNumber.from(16740235),
      voteAgainst: BigNumber.from(6740235),
      votingEndAt: 10000,
      verificationEndAt: 10000,
    },
    featureVotes: BigNumber.from(62142321),
    directoryInfo: {
      additionDate: new Date(1622802882000),
    },
  },
  {
    publicKey: '0x9ac2b2e23eb62fa70fc7f31c0895ac46230c241e',
    ens: 'MakerDAO Community',
    name: 'MakerDAO Community',
    link: 'MakerDAOCommunity.com',
    icon: 'https://positiveblockchain.io/wp-content/uploads/2019/07/maker-lrg-510x510-1.png',
    tags: ['nfts', 'collectables', 'cats', 'quite long', 'funny', 'very long tag', 'short'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat.',
    numberOfMembers: 250,
    validForAddition: true,
    votingHistory: [],
    currentVoting: undefined,
    directoryInfo: {
      additionDate: new Date(1622716482000),
      untilNextFeature: 1814400,
    },
  },
  {
    publicKey: '0x04bbb77ea11ee6dc4585efa2617ec90b8ee4051ade4fcf7261ae6cd4cdf33e54e3',
    ens: 'DDEX',
    name: 'DDEX',
    link: 'ddex.com',
    icon: 'https://pbs.twimg.com/profile_images/1225147341549625344/Cd-ILEu6.png',
    tags: ['nfts', 'collectables', 'ddex', 'quite long', 'funny', 'very long tag', 'short'],
    description: 'Owners of CryptoPunks, marketplace. Nullam mattis mattis mattis fermentum libero.',
    numberOfMembers: 150,
    validForAddition: true,
    votingHistory: [],
    currentVoting: undefined,
    featureVotes: BigNumber.from(5214321),
    directoryInfo: {
      additionDate: new Date(1622630082000),
    },
  },
  {
    publicKey: '0xadfcf42e083e71d8c755da07a2b1bad754d7ca97c35fbd407da6bde9844580ad55',
    ens: 'Name Baazar',
    name: 'Name Baazar',
    link: 'NameBaazar.com',
    icon: 'https://pbs.twimg.com/profile_images/893709814341148672/i5gj6FaU_400x400.jpg',
    tags: ['nfts', 'collectables', 'name', 'quite long', 'funny', 'very long tag', 'short'],
    description: 'Owners of Name Baazar, marketplace. Nullam mattis mattis mattis fermentum libero.',
    numberOfMembers: 150,
    validForAddition: true,
    votingHistory: [],
    currentVoting: undefined,
    featureVotes: BigNumber.from(314321),
    directoryInfo: {
      additionDate: new Date(1622543682000),
    },
  },
  {
    publicKey: '0xec62724b6828954a705eb3b531c30a69503d3561d4283fb8b60835ff34205c64d8',
    ens: 'CryptoKitties',
    name: 'CryptoKitties',
    link: 'CryptoKitties.com',
    icon: 'https://www.cryptokitties.co/icons/logo.svg',
    tags: ['nfts', 'collectables', 'cats', 'quite long', 'funny', 'very long tag', 'short'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat.',
    numberOfMembers: 50,
    validForAddition: true,
    votingHistory: [
      {
        type: 'Add',
        date: new Date('2021-03-16'),
        result: 'Failed',
        ID: 0,
      },
      {
        type: 'Add',
        date: new Date('2021-04-02'),
        result: 'Passed',
        ID: 1,
      },
      {
        type: 'Feature',
        date: new Date('2021-04-17'),
        result: 'Failed',
        ID: 2,
      },
      {
        type: 'Remove',
        date: new Date('2021-05-07'),
        result: 'Passed',
        ID: 3,
      },
    ],
    currentVoting: {
      timeLeft: 28800,
      timeLeftVerification: 30800,
      type: 'Add',
      voteFor: BigNumber.from(16740235),
      voteAgainst: BigNumber.from(126740235),
      votingEndAt: 10000,
      verificationEndAt: 10000,
    },
  },
  {
    publicKey: '0xb8def1f5e7160e5e1a6440912b7e633ad923030352f23abb54226020bff781b7e6',
    ens: 'Awesome Community',
    name: 'Awesome Community',
    link: 'Awesome Community.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/LetterA.svg/1200px-LetterA.svg.png',
    tags: ['nfts', 'collectables', 'cats', 'quite long', 'funny', 'very long tag', 'short'],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat.',
    numberOfMembers: 50,
    validForAddition: true,
    votingHistory: [],
    currentVoting: {
      timeLeft: 0,
      timeLeftVerification: 0,
      type: 'Add',
      voteFor: BigNumber.from(16740235),
      voteAgainst: BigNumber.from(126740235),
      votingEndAt: 10000,
      verificationEndAt: 10000,
    },
  },
]
