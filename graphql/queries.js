import { gql } from '@apollo/client';

const programsQuery = gql`
  query Programs {
    programs {
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
  query Activities($program: String) {
    activities(program: $program) {
      title
      _id
      program
      duration_indicator
      video_url
      poster_image
      order
    }
  }
`;


export { programsQuery, activitiesQuery };
