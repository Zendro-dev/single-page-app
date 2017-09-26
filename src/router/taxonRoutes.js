import taxons from '@/components/taxons'
import taxonCreate from '@/components/taxonCreateForm'
import taxonEdit from '@/components/taxonEditForm'

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
    }
  ]
)
