import cultivars from '@/components/cultivars'
import cultivarCreate from '@/components/cultivarCreateForm'
import cultivarEdit from '@/components/cultivarEditForm'
import cultivarUploadCsv from '@/components/cultivarUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/cultivars',
      name: 'cultivars',
      component: cultivars,
    },
    {
      path: '/cultivar/:id',
      name: 'cultivarEdit',
      component: cultivarEdit,
    },
    {
      path: '/cultivar',
      name: 'cultivarCreate',
      component: cultivarCreate,
    },
    {
      path: '/cultivars/upload_csv',
      name: 'cultivarUploadCsv',
      component: cultivarUploadCsv
    }
  ]
)
