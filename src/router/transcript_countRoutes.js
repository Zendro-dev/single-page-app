import transcript_counts from '@/components/transcript_counts'
import transcript_countCreate from '@/components/transcript_countCreateForm'
import transcript_countEdit from '@/components/transcript_countEditForm'
import transcript_countUploadCsv from '@/components/transcript_countUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/transcript_counts',
      name: 'transcript_counts',
      component: transcript_counts,
    },
    {
      path: '/transcript_count/:id',
      name: 'transcript_countEdit',
      component: transcript_countEdit,
    },
    {
      path: '/transcript_count',
      name: 'transcript_countCreate',
      component: transcript_countCreate,
    },
    {
      path: '/transcript_counts/upload_csv',
      name: 'transcript_countUploadCsv',
      component: transcript_countUploadCsv
    }
  ]
)
