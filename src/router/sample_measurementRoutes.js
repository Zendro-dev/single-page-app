import sample_measurements from '@/components/sample_measurements'
import sample_measurementCreate from '@/components/sample_measurementCreateForm'
import sample_measurementEdit from '@/components/sample_measurementEditForm'
import sample_measurementUploadCsv from '@/components/sample_measurementUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/sample_measurements',
      name: 'sample_measurements',
      component: sample_measurements,
    },
    {
      path: '/sample_measurement/:id',
      name: 'sample_measurementEdit',
      component: sample_measurementEdit,
    },
    {
      path: '/sample_measurement',
      name: 'sample_measurementCreate',
      component: sample_measurementCreate,
    },
    {
      path: '/sample_measurements/upload_csv',
      name: 'sample_measurementUploadCsv',
      component: sample_measurementUploadCsv
    }
  ]
)
