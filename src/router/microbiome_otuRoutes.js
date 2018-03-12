import microbiome_otus from '@/components/microbiome_otus'
import microbiome_otuCreate from '@/components/microbiome_otuCreateForm'
import microbiome_otuEdit from '@/components/microbiome_otuEditForm'

routes = routes.concat(
  [
    {
      path: '/microbiome_otus',
      name: 'microbiome_otus',
      component: microbiome_otus,
    },
    {
      path: '/microbiome_otu/:id',
      name: 'microbiome_otuEdit',
      component: microbiome_otuEdit,
    },
    {
      path: '/microbiome_otu',
      name: 'microbiome_otuCreate',
      component: microbiome_otuCreate,
    }
  ]
)
