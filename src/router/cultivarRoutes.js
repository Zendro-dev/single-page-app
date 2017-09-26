import cultivars from '@/components/cultivars'
import cultivarCreate from '@/components/cultivarCreateForm'
import cultivarEdit from '@/components/cultivarEditForm'

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
    }
  ]
)
