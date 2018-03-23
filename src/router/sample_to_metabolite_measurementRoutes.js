import sample_to_metabolite_measurements from '@/components/sample_to_metabolite_measurements'
import sample_to_metabolite_measurementCreate from '@/components/sample_to_metabolite_measurementCreateForm'
import sample_to_metabolite_measurementEdit from '@/components/sample_to_metabolite_measurementEditForm'
import sample_to_metabolite_measurementUploadCsv from '@/components/sample_to_metabolite_measurementUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/sample_to_metabolite_measurements',
      name: 'sample_to_metabolite_measurements',
      component: sample_to_metabolite_measurements,
    },
    {
      path: '/sample_to_metabolite_measurement/:id',
      name: 'sample_to_metabolite_measurementEdit',
      component: sample_to_metabolite_measurementEdit,
    },
    {
      path: '/sample_to_metabolite_measurement',
      name: 'sample_to_metabolite_measurementCreate',
      component: sample_to_metabolite_measurementCreate,
    },
    {
      path: '/sample_to_metabolite_measurements/upload_csv',
      name: 'sample_to_metabolite_measurementUploadCsv',
      component: sample_to_metabolite_measurementUploadCsv
    }
  ]
)
