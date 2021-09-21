import { gql } from 'graphql-request';

export const name = 'uploadAttachment';

export const query = gql`
  mutation uploadAttachment(
    $file: Upload
    $id: ID!
    $fileName: String!
    $fileURL: String
    $mimeType: String
    $fileSize: Int
    $identifierName: String
  ) {
    addAttachment(
      file: $file
      id: $id
      fileName: $fileName
      fileURL: $fileURL
      mimeType: $mimeType
      fileSize: $fileSize
      identifierName: $identifierName
    ) {
      id
      fileName
      fileURL
      mimeType
      fileSize
      identifierName
    }
  }
`;

export const resolver = 'addAttachment';

export const transform = undefined;

export default {
  name,
  query,
  resolver,
  transform,
};
