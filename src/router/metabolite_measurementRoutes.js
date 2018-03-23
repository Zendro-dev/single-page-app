import metabolite_measurements from '@/components/metabolite_measurements'
import metabolite_measurementCreate from '@/components/metabolite_measurementCreateForm'
import metabolite_measurementEdit from '@/components/metabolite_measurementEditForm'
import metabolite_measurementUploadCsv from '@/components/metabolite_measurementUploadCsvForm'

routes = routes.concat(
  [
    {
      path: '/metabolite_measurements',
      name: 'metabolite_measurements',
      component: metabolite_measurements,
    },
    {
      path: '/metabolite_measurement/:id',
      name: 'metabolite_measurementEdit',
      component: metabolite_measurementEdit,
    },
    {
      path: '/metabolite_measurement',
      name: 'metabolite_measurementCreate',
      component: metabolite_measurementCreate,
    },
    {
      path: '/metabolite_measurements/upload_csv',
      name: 'metabolite_measurementUploadCsv',
      component: metabolite_measurementUploadCsv
    }
  ]
)
