import plant_measurements from '@/components/plant_measurements'
import plant_measurementCreate from '@/components/plant_measurementCreateForm'
import plant_measurementEdit from '@/components/plant_measurementEditForm'
import plant_measurementUploadCsv from '@/components/plant_measurementUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/plant_measurements',
      name: 'plant_measurements',
      component: plant_measurements,
    },
    {
      path: '/plant_measurement/:id',
      name: 'plant_measurementEdit',
      component: plant_measurementEdit,
    },
    {
      path: '/plant_measurement',
      name: 'plant_measurementCreate',
      component: plant_measurementCreate,
    },
    {
      path: '/plant_measurements/upload_csv',
      name: 'plant_measurementUploadCsv',
      component: plant_measurementUploadCsv
    }
  ]
)
