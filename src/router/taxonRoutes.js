import taxons from '@/components/taxons'
import taxonCreate from '@/components/taxonCreateForm'
import taxonEdit from '@/components/taxonEditForm'
import taxonUploadCsv from '@/components/taxonUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/taxons',
      name: 'taxons',
      component: taxons,
    },
    {
      path: '/taxon/:id',
      name: 'taxonEdit',
      component: taxonEdit,
    },
    {
      path: '/taxon',
      name: 'taxonCreate',
      component: taxonCreate,
    },
    {
      path: '/taxons/upload_csv',
      name: 'taxonUploadCsv',
      component: taxonUploadCsv
    }
  ]
)
