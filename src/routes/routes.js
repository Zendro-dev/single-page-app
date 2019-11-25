
export default () => ({
  models: [
    {
      id: 0,
      name: 'aminoacidsequence',
      title: 'Aminoacidsequence',
      url: '/main/model/aminoacidsequence',
    },
    {
      id: 1,
      name: 'individual',
      title: 'Individual',
      url: '/main/model/individual',
    },
    {
      id: 2,
      name: 'sequencingExperiment',
      title: 'SequencingExperiment',
      url: '/main/model/sequencingExperiment',
    },
    {
      id: 3,
      name: 'transcript_count',
      title: 'Transcript_count',
      url: '/main/model/transcript_count',
    },
  ],
  adminModels: [
    {
      id: 4,
      name: 'role',
      title: 'Role',
      url: '/main/admin/role',
    },
    {
      id: 5,
      name: 'user',
      title: 'User',
      url: '/main/admin/user',
    },
  ]
})