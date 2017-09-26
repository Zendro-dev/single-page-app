import microbiome_profiles from '@/components/microbiome_profiles'
import microbiome_profileCreate from '@/components/microbiome_profileCreateForm'
import microbiome_profileEdit from '@/components/microbiome_profileEditForm'

routes = routes.concat(
  [
    {
      path: '/microbiome_profiles',
      name: 'microbiome_profiles',
      component: microbiome_profiles,
    },
    {
      path: '/microbiome_profile/:id',
      name: 'microbiome_profileEdit',
      component: microbiome_profileEdit,
    },
    {
      path: '/microbiome_profile',
      name: 'microbiome_profileCreate',
      component: microbiome_profileCreate,
    }
  ]
)
