import { gql } from 'graphql-request';

export const name = 'readOneBookWithAttachments';

export const query = gql`
  query readOneBook(
    $id: ID!
    $order: [orderAttachmentInput]
    $search: searchAttachmentInput
    $pagination: paginationCursorInput!
  ) {
    readOneBook(id: $id) {
      attachmentsConnection(
        order: $order
        search: $search
        pagination: $pagination
      ) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
            fileName
            fileURL
            mimeType
            fileSize
            identifierName
            urlThumbnail(width: 50, height: 50, format: "png")
          }
        }
      }
    }
  }
`;

export const resolver = 'readOneBook';

export const assocResolver = 'attachmentsConnection';

export const transform =
  '.readOneBook.attachmentsConnection.pageInfo as $pageInfo | .readOneBook.attachmentsConnection.edges | map(.node) as $records | { $pageInfo, $records }';

export default {
  name,
  query,
  resolver,
  assocResolver,
  transform,
};
