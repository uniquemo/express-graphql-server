import axios from 'axios';
import { ApolloError, gql } from 'apollo-server-express';
import { BASE_URL } from 'helpers/api';

export const typeDefs = gql`
  type User {
    userId: String
    userType: Int
    vipType: Int
    avatarUrl: String
    nickname: String
    signature: String
    province: Int
    city: Int
    gender: Int
    birthday: String
    description: String
    backgroundUrl: String
    accountStatus: Int
  }
  type Album {
    id: String
    name: String
    picUrl: String
  }
  type Artist {
    id: String
    name: String
  }
  type Songlist {
    id: String
    name: String
    coverImgUrl: String
    creator: User
    createTime: String
    tags: [String]
    trackCount: Int
    playCount: Int
    description: String
  }
  type Song {
    id: String
    name: String
    fee: Int
    status: Int
    picUrl: String
    artists: [Artist]
    duration: Int
    album: Album
  }
  type GetSonglistDetailResponse {
    songlist: Songlist
    songs: [Song]
  }
  type Query {
    getSonglistDetail(id: String!): GetSonglistDetailResponse
  }
`;

export const resolvers = {
  Query: {
    getSonglistDetail: async (_parent, args: { id: string }, { req }, _info) => {
      try {
        const songlistRes: any = await axios.get(`/playlist/detail`, {
          baseURL: BASE_URL,
          params: {
            id: args.id,
          },
          withCredentials: true,
        });

        const { playlist } = songlistRes.data;
        const songIds = playlist.trackIds.map((track) => track.id);
        const songsRes: any = await axios.get(`/song/detail`, {
          baseURL: BASE_URL,
          params: {
            ids: songIds.join(','),
          },
          withCredentials: true,
        });

        const songs = songsRes.data.songs.map((item) => ({
          id: item.id,
          name: item.name,
          fee: item.fee,
          status: item.st,
          picUrl: item.al.picUrl,
          artists: item.ar,
          duration: item.dt,
          album: item.al,
        }));

        return {
          songlist: playlist,
          songs,
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};
