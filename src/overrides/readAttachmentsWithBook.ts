import { gql } from 'graphql-request';

export const name = 'readAttachmentsWithBook';

export const query = gql`
  query readAttachmentsWithBook(
    $order: [orderAttachmentInput]
    $search: searchAttachmentInput
    $pagination: paginationCursorInput!
    $assocSearch: searchBookInput
  ) {
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
          book(search: $assocSearch) {
            id
          }
        }
      }
    }
  }
`;

export const resolver = 'attachmentsConnection';

export const assocResolver = 'book';

export const transform =
  ' .attachmentsConnection.pageInfo as $pageInfo | .attachmentsConnection.edges | map(.node) as $records | { $pageInfo, $records }';

export default {
  name,
  query,
  resolver,
  assocResolver,
  transform,
};
