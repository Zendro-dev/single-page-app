import field_plots from '@/components/field_plots'
import field_plotCreate from '@/components/field_plotCreateForm'
import field_plotEdit from '@/components/field_plotEditForm'

routes = routes.concat(
  [
    {
      path: '/field_plots',
      name: 'field_plots',
      component: field_plots,
    },
    {
      path: '/field_plot/:id',
      name: 'field_plotEdit',
      component: field_plotEdit,
    },
    {
      path: '/field_plot',
      name: 'field_plotCreate',
      component: field_plotCreate,
    }
  ]
)
