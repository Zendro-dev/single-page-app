import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import cultivars from '@/components/cultivars'
import cultivarCreate from '@/components/cultivarCreateForm'
import cultivarEdit from '@/components/cultivarEditForm'
import cultivarUploadCsv from '@/components/cultivarUploadCsvForm'
import field_plots from '@/components/field_plots'
import field_plotCreate from '@/components/field_plotCreateForm'
import field_plotEdit from '@/components/field_plotEditForm'
import field_plotUploadCsv from '@/components/field_plotUploadCsvForm'
import individuals from '@/components/individuals'
import individualCreate from '@/components/individualCreateForm'
import individualEdit from '@/components/individualEditForm'
import individualUploadCsv from '@/components/individualUploadCsvForm'
import metabolite_measurements from '@/components/metabolite_measurements'
import metabolite_measurementCreate from '@/components/metabolite_measurementCreateForm'
import metabolite_measurementEdit from '@/components/metabolite_measurementEditForm'
import metabolite_measurementUploadCsv from '@/components/metabolite_measurementUploadCsvForm'
import microbiome_otus from '@/components/microbiome_otus'
import microbiome_otuCreate from '@/components/microbiome_otuCreateForm'
import microbiome_otuEdit from '@/components/microbiome_otuEditForm'
import microbiome_otuUploadCsv from '@/components/microbiome_otuUploadCsvForm'
import plant_measurements from '@/components/plant_measurements'
import plant_measurementCreate from '@/components/plant_measurementCreateForm'
import plant_measurementEdit from '@/components/plant_measurementEditForm'
import plant_measurementUploadCsv from '@/components/plant_measurementUploadCsvForm'
import pots from '@/components/pots'
import potCreate from '@/components/potCreateForm'
import potEdit from '@/components/potEditForm'
import potUploadCsv from '@/components/potUploadCsvForm'
import samples from '@/components/samples'
import sampleCreate from '@/components/sampleCreateForm'
import sampleEdit from '@/components/sampleEditForm'
import sampleUploadCsv from '@/components/sampleUploadCsvForm'
import sample_to_metabolite_measurements from '@/components/sample_to_metabolite_measurements'
import sample_to_metabolite_measurementCreate from '@/components/sample_to_metabolite_measurementCreateForm'
import sample_to_metabolite_measurementEdit from '@/components/sample_to_metabolite_measurementEditForm'
import sample_to_metabolite_measurementUploadCsv from '@/components/sample_to_metabolite_measurementUploadCsvForm'
import taxons from '@/components/taxons'
import taxonCreate from '@/components/taxonCreateForm'
import taxonEdit from '@/components/taxonEditForm'
import taxonUploadCsv from '@/components/taxonUploadCsvForm'
import transcript_counts from '@/components/transcript_counts'
import transcript_countCreate from '@/components/transcript_countCreateForm'
import transcript_countEdit from '@/components/transcript_countEditForm'
import transcript_countUploadCsv from '@/components/transcript_countUploadCsvForm'

Vue.use(Router)

var routes = [{
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
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
    path: '/cultivars/upload_csv',
    name: 'cultivarUploadCsv',
    component: cultivarUploadCsv
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
    path: '/field_plots/upload_csv',
    name: 'field_plotUploadCsv',
    component: field_plotUploadCsv
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
    path: '/individuals/upload_csv',
    name: 'individualUploadCsv',
    component: individualUploadCsv
  },
  {
    path: '/individual',
    name: 'individualCreate',
    component: individualCreate,
  },
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
    path: '/metabolite_measurements/upload_csv',
    name: 'metabolite_measurementUploadCsv',
    component: metabolite_measurementUploadCsv
  },
  {
    path: '/metabolite_measurement',
    name: 'metabolite_measurementCreate',
    component: metabolite_measurementCreate,
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
    path: '/microbiome_otus/upload_csv',
    name: 'microbiome_otuUploadCsv',
    component: microbiome_otuUploadCsv
  },
  {
    path: '/microbiome_otu',
    name: 'microbiome_otuCreate',
    component: microbiome_otuCreate,
  },
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
    path: '/plant_measurements/upload_csv',
    name: 'plant_measurementUploadCsv',
    component: plant_measurementUploadCsv
  },
  {
    path: '/plant_measurement',
    name: 'plant_measurementCreate',
    component: plant_measurementCreate,
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
    path: '/pots/upload_csv',
    name: 'potUploadCsv',
    component: potUploadCsv
  },
  {
    path: '/pot',
    name: 'potCreate',
    component: potCreate,
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
    path: '/samples/upload_csv',
    name: 'sampleUploadCsv',
    component: sampleUploadCsv
  },
  {
    path: '/sample',
    name: 'sampleCreate',
    component: sampleCreate,
  },
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
    path: '/sample_to_metabolite_measurements/upload_csv',
    name: 'sample_to_metabolite_measurementUploadCsv',
    component: sample_to_metabolite_measurementUploadCsv
  },
  {
    path: '/sample_to_metabolite_measurement',
    name: 'sample_to_metabolite_measurementCreate',
    component: sample_to_metabolite_measurementCreate,
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
    path: '/taxons/upload_csv',
    name: 'taxonUploadCsv',
    component: taxonUploadCsv
  },
  {
    path: '/taxon',
    name: 'taxonCreate',
    component: taxonCreate,
  },
  {
    path: '/transcript_counts',
    name: 'transcript_counts',
    component: transcript_counts,
  },
  {
    path: '/transcript_count/:id',
    name: 'transcript_countEdit',
    component: transcript_countEdit,
  },
  {
    path: '/transcript_counts/upload_csv',
    name: 'transcript_countUploadCsv',
    component: transcript_countUploadCsv
  },
  {
    path: '/transcript_count',
    name: 'transcript_countCreate',
    component: transcript_countCreate,
  }
];

export default new Router({
  routes: routes
})
