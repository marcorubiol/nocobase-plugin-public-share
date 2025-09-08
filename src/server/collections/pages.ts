export default {
  name: 'pages',
  fields: [
    // Existing page fields are handled by NocoBase core
    // We're adding public sharing fields
    {
      type: 'boolean',
      name: 'isPublic',
      defaultValue: false,
    },
    {
      type: 'string',
      name: 'publicSlug',
      unique: true,
      allowNull: true,
    },
    {
      type: 'string',
      name: 'passwordHash',
      allowNull: true,
    },
    {
      type: 'boolean',
      name: 'noindex',
      defaultValue: true,
    },
  ],
};
