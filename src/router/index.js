import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Users from '@/components/users'
import UserCreate from '@/components/UserCreateForm'
import UserEdit from '@/components/UserEditForm'
import taxons from '@/components/taxons'
import taxonCreate from '@/components/taxonCreateForm'
import taxonEdit from '@/components/taxonEditForm'
import cultivars from '@/components/cultivars'
import cultivarCreate from '@/components/cultivarCreateForm'
import cultivarEdit from '@/components/cultivarEditForm'
import field_plots from '@/components/field_plots'
import field_plotCreate from '@/components/field_plotCreateForm'
import field_plotEdit from '@/components/field_plotEditForm'
import individuals from '@/components/individuals'
import individualCreate from '@/components/individualCreateForm'
import individualEdit from '@/components/individualEditForm'
import microbiome_profiles from '@/components/microbiome_profiles'
import microbiome_profileCreate from '@/components/microbiome_profileCreateForm'
import microbiome_profileEdit from '@/components/microbiome_profileEditForm'
import microbiome_samples from '@/components/microbiome_samples'
import microbiome_sampleCreate from '@/components/microbiome_sampleCreateForm'
import microbiome_sampleEdit from '@/components/microbiome_sampleEditForm'
import pots from '@/components/pots'
import potCreate from '@/components/potCreateForm'
import potEdit from '@/components/potEditForm'
import soil_samples from '@/components/soil_samples'
import soil_sampleCreate from '@/components/soil_sampleCreateForm'
import soil_sampleEdit from '@/components/soil_sampleEditForm'

Vue.use(Router)

var routes = [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/user/:id',
      name: 'UserEdit',
      component: UserEdit,
    },
    {
      path: '/user',
      name: 'UserCreate',
      component: UserCreate,
    },
    {
      path: '/taxons',
      name: 'taxons',
      component: taxons,
    },
    {
      path: '/taxon/:id',
      name: 'taxonEdit',
      component: taxonEdit,
    },
    {
      path: '/taxon',
      name: 'taxonCreate',
      component: taxonCreate,
    },
    {
      path: '/cultivars',
      name: 'cultivars',
      component: cultivars,
    },
    {
      path: '/cultivar/:id',
      name: 'cultivarEdit',
      component: cultivarEdit,
    },
    {
      path: '/cultivar',
      name: 'cultivarCreate',
      component: cultivarCreate,
    },
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
    },
    {
      path: '/individuals',
      name: 'individuals',
      component: individuals,
    },
    {
      path: '/individual/:id',
      name: 'individualEdit',
      component: individualEdit,
    },
    {
      path: '/individual',
      name: 'individualCreate',
      component: individualCreate,
    },
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
    },
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
    },
    {
      path: '/pots',
      name: 'pots',
      component: pots,
    },
    {
      path: '/pot/:id',
      name: 'potEdit',
      component: potEdit,
    },
    {
      path: '/pot',
      name: 'potCreate',
      component: potCreate,
    },
    {
      path: '/soil_samples',
      name: 'soil_samples',
      component: soil_samples,
    },
    {
      path: '/soil_sample/:id',
      name: 'soil_sampleEdit',
      component: soil_sampleEdit,
    },
    {
      path: '/soil_sample',
      name: 'soil_sampleCreate',
      component: soil_sampleCreate,
    }
  ];


export default new Router({
  routes: routes
})
