import samples from '@/components/samples'
import sampleCreate from '@/components/sampleCreateForm'
import sampleEdit from '@/components/sampleEditForm'
import sampleUploadCsv from '@/components/sampleUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/samples',
      name: 'samples',
      component: samples,
    },
    {
      path: '/sample/:id',
      name: 'sampleEdit',
      component: sampleEdit,
    },
    {
      path: '/sample',
      name: 'sampleCreate',
      component: sampleCreate,
    },
    {
      path: '/samples/upload_csv',
      name: 'sampleUploadCsv',
      component: sampleUploadCsv
    }
  ]
)
