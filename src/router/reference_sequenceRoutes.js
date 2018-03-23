import reference_sequences from '@/components/reference_sequences'
import reference_sequenceCreate from '@/components/reference_sequenceCreateForm'
import reference_sequenceEdit from '@/components/reference_sequenceEditForm'
import reference_sequenceUploadCsv from '@/components/reference_sequenceUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/reference_sequences',
      name: 'reference_sequences',
      component: reference_sequences,
    },
    {
      path: '/reference_sequence/:id',
      name: 'reference_sequenceEdit',
      component: reference_sequenceEdit,
    },
    {
      path: '/reference_sequence',
      name: 'reference_sequenceCreate',
      component: reference_sequenceCreate,
    },
    {
      path: '/reference_sequences/upload_csv',
      name: 'reference_sequenceUploadCsv',
      component: reference_sequenceUploadCsv
    }
  ]
)
