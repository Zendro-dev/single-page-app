import sample_to_sample_measurements from '@/components/sample_to_sample_measurements'
import sample_to_sample_measurementCreate from '@/components/sample_to_sample_measurementCreateForm'
import sample_to_sample_measurementEdit from '@/components/sample_to_sample_measurementEditForm'
import sample_to_sample_measurementUploadCsv from '@/components/sample_to_sample_measurementUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/sample_to_sample_measurements',
      name: 'sample_to_sample_measurements',
      component: sample_to_sample_measurements,
    },
    {
      path: '/sample_to_sample_measurement/:id',
      name: 'sample_to_sample_measurementEdit',
      component: sample_to_sample_measurementEdit,
    },
    {
      path: '/sample_to_sample_measurement',
      name: 'sample_to_sample_measurementCreate',
      component: sample_to_sample_measurementCreate,
    },
    {
      path: '/sample_to_sample_measurements/upload_csv',
      name: 'sample_to_sample_measurementUploadCsv',
      component: sample_to_sample_measurementUploadCsv
    }
  ]
)
