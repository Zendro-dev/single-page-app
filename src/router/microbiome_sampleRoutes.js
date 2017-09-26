import microbiome_samples from '@/components/microbiome_samples'
import microbiome_sampleCreate from '@/components/microbiome_sampleCreateForm'
import microbiome_sampleEdit from '@/components/microbiome_sampleEditForm'

routes = routes.concat(
  [
    {
      path: '/microbiome_samples',
      name: 'microbiome_samples',
      component: microbiome_samples,
    },
    {
      path: '/microbiome_sample/:id',
      name: 'microbiome_sampleEdit',
      component: microbiome_sampleEdit,
    },
    {
      path: '/microbiome_sample',
      name: 'microbiome_sampleCreate',
      component: microbiome_sampleCreate,
    }
  ]
)
