import pots from '@/components/pots'
import potCreate from '@/components/potCreateForm'
import potEdit from '@/components/potEditForm'

routes = routes.concat(
  [
    {
      path: '/pots',
      name: 'pots',
      component: pots,
    },
    {
      path: '/pot/:id',
      name: 'potEdit',
      component: potEdit,
    },
    {
      path: '/pot',
      name: 'potCreate',
      component: potCreate,
    }
  ]
)
