import { gql } from '@apollo/client';

const createUser = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      email
      _id
    }
  }
`;

export { createUser };
