/**
 * ACL configuration for PublicShare plugin
 * Creates a read-only role for anonymous public access
 */

export const publicShareACL = {
  // Define the PublicShare role with minimal permissions
  roles: {
    'public-share': {
      strategy: {
        actions: ['list', 'get'], // Only read operations
      },
      snippets: [
        'pm.public-share.pages', // Access to shared pages only
      ],
    },
  },

  // Resource-specific permissions
  resources: {
    pages: {
      'public-share': {
        // Only allow reading pages that are marked as public
        filter: {
          isPublic: true,
        },
        actions: ['list', 'get'],
      },
    },
  },
};
