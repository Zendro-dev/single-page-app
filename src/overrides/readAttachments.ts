import { gql } from 'graphql-request';

export const name = 'readAttachments';

export const query = gql`
  query readAttachments(
    $order: [orderAttachmentInput]
    $search: searchAttachmentInput
    $pagination: paginationCursorInput!
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
        }
      }
    }
  }
`;

export const resolver = 'attachmentsConnection';

export const transform =
  '.attachmentsConnection.pageInfo as $pageInfo | .attachmentsConnection.edges | map(.node) as $records | {  $pageInfo, $records  }';

export default {
  name,
  query,
  resolver,
  transform,
};
