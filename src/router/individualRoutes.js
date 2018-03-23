import individuals from '@/components/individuals'
import individualCreate from '@/components/individualCreateForm'
import individualEdit from '@/components/individualEditForm'
import individualUploadCsv from '@/components/individualUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/individuals',
      name: 'individuals',
      component: individuals,
    },
    {
      path: '/individual/:id',
      name: 'individualEdit',
      component: individualEdit,
    },
    {
      path: '/individual',
      name: 'individualCreate',
      component: individualCreate,
    },
    {
      path: '/individuals/upload_csv',
      name: 'individualUploadCsv',
      component: individualUploadCsv
    }
  ]
)
