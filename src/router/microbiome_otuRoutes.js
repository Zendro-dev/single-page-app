import microbiome_otus from '@/components/microbiome_otus'
import microbiome_otuCreate from '@/components/microbiome_otuCreateForm'
import microbiome_otuEdit from '@/components/microbiome_otuEditForm'
import microbiome_otuUploadCsv from '@/components/microbiome_otuUploadCsvForm'

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
    },
    {
      path: '/microbiome_otus/upload_csv',
      name: 'microbiome_otuUploadCsv',
      component: microbiome_otuUploadCsv
    }
  ]
)
