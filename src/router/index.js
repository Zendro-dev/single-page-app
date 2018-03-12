import Vue from 'vue'
import Router from 'vue-router'
import cultivars from '@/components/cultivars'
import cultivarCreate from '@/components/cultivarCreateForm'
import cultivarEdit from '@/components/cultivarEditForm'
import field_plots from '@/components/field_plots'
import field_plotCreate from '@/components/field_plotCreateForm'
import field_plotEdit from '@/components/field_plotEditForm'
import individuals from '@/components/individuals'
import individualCreate from '@/components/individualCreateForm'
import individualEdit from '@/components/individualEditForm'
import microbiome_otus from '@/components/microbiome_otus'
import microbiome_otuCreate from '@/components/microbiome_otuCreateForm'
import microbiome_otuEdit from '@/components/microbiome_otuEditForm'
import pots from '@/components/pots'
import potCreate from '@/components/potCreateForm'
import potEdit from '@/components/potEditForm'
import samples from '@/components/samples'
import sampleCreate from '@/components/sampleCreateForm'
import sampleEdit from '@/components/sampleEditForm'
import taxons from '@/components/taxons'
import taxonCreate from '@/components/taxonCreateForm'
import taxonEdit from '@/components/taxonEditForm'
import reference_sequences from '@/components/reference_sequences'
import reference_sequenceCreate from '@/components/reference_sequenceCreateForm'
import reference_sequenceEdit from '@/components/reference_sequenceEditForm'

Vue.use(Router)

var routes = [
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
    path: '/reference_sequences',
    name: 'reference_sequences',
    component: reference_sequences,
  },
  {
    path: '/reference_sequence/:id',
    name: 'reference_sequenceEdit',
    component: reference_sequenceEdit,
  },
  {
    path: '/reference_sequence',
    name: 'reference_sequenceCreate',
    component: reference_sequenceCreate,
  },
  {
    path: '/samples',
    name: 'samples',
    component: samples,
  },
  {
    path: '/sample/:id',
    name: 'sampleEdit',
    component: sampleEdit,
  },
  {
    path: '/sample',
    name: 'sampleCreate',
    component: sampleCreate,
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
    path: '/reference_sequences',
    name: 'reference_sequences',
    component: reference_sequences,
  },
  {
    path: '/reference_sequence/:id',
    name: 'reference_sequenceEdit',
    component: reference_sequenceEdit,
  },
  {
    path: '/reference_sequence',
    name: 'reference_sequenceCreate',
    component: reference_sequenceCreate,
  }
];

export default new Router({
  routes: routes
})
