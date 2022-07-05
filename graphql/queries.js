import { gql } from '@apollo/client';

const programsQuery = gql`
  query Programs($sort: Sort) {
    programs(sort: $sort) {
      _id
      name
      level
      description
      poster_image
      background
      titlePosition
      icon
    }
  }
`;

const activitiesQuery = gql`
  query Activities($program: String, $order: Sort) {
    activities(program: $program, order: $order) {
      _id
      title
      video_url
      poster_image
      duration_indicator
      order
      program
    }
  }
`;

const activityQuery = gql`
  query Activity($id: ObjectId) {
    activity(id: $id) {
      _id
      title
      video_url
      poster_image
      duration_indicator
      order
      program
    }
  }
`;

const getPrevNextQuery = gql`
  query GetPrevNext($program: String, $order: Int) {
    getPrevNext(program: $program, order: $order) {
      _id
      title
      video_url
      poster_image
      duration_indicator
      order
      program
    }
  }
`;

const userQuery = gql`
query GetUser($input: UserInput!) {
  user(input: $input) {
    email
    _id
    token
  }
}`;

const CHECK_TOKEN = gql`
  query CheckToken($token: String!) {
  checkToken(token: $token) {
    _id
    email
    token
  }
}
`;

export { programsQuery, activitiesQuery, activityQuery, getPrevNextQuery, userQuery, CHECK_TOKEN };
