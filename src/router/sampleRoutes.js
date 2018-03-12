import samples from '@/components/samples'
import sampleCreate from '@/components/sampleCreateForm'
import sampleEdit from '@/components/sampleEditForm'

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
    }
  ]
)
