import soil_samples from '@/components/soil_samples'
import soil_sampleCreate from '@/components/soil_sampleCreateForm'
import soil_sampleEdit from '@/components/soil_sampleEditForm'

routes = routes.concat(
  [
    {
      path: '/soil_samples',
      name: 'soil_samples',
      component: soil_samples,
    },
    {
      path: '/soil_sample/:id',
      name: 'soil_sampleEdit',
      component: soil_sampleEdit,
    },
    {
      path: '/soil_sample',
      name: 'soil_sampleCreate',
      component: soil_sampleCreate,
    }
  ]
)
