import { gql } from 'graphql-request';

export const name = 'readOneAttachment';

export const query = gql`
  query readOneAttachment($id: ID!) {
    readOneAttachment(id: $id) {
      id
      fileName
      fileURL
      mimeType
      fileSize
      identifierName
      urlThumbnail(width: 180, height: 180, format: "png")
    }
  }
`;

export const resolver = 'readOneAttachment';

export const transform = undefined;

export default {
  name,
  query,
  resolver,
  transform,
};
