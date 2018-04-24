import Vue from 'vue'
import Router from 'vue-router'
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
import pots from '@/components/pots'
import potCreate from '@/components/potCreateForm'
import potEdit from '@/components/potEditForm'
import potUploadCsv from '@/components/potUploadCsvForm'
import reference_sequences from '@/components/reference_sequences'
import reference_sequenceCreate from '@/components/reference_sequenceCreateForm'
import reference_sequenceEdit from '@/components/reference_sequenceEditForm'
import reference_sequenceUploadCsv from '@/components/reference_sequenceUploadCsvForm'
import samples from '@/components/samples'
import sampleCreate from '@/components/sampleCreateForm'
import sampleEdit from '@/components/sampleEditForm'
import sampleUploadCsv from '@/components/sampleUploadCsvForm'
import taxons from '@/components/taxons'
import taxonCreate from '@/components/taxonCreateForm'
import taxonEdit from '@/components/taxonEditForm'
import taxonUploadCsv from '@/components/taxonUploadCsvForm'
import sample_to_metabolite_measurements from '@/components/sample_to_metabolite_measurements'
import sample_to_metabolite_measurementCreate from '@/components/sample_to_metabolite_measurementCreateForm'
import sample_to_metabolite_measurementEdit from '@/components/sample_to_metabolite_measurementEditForm'
import sample_to_metabolite_measurementUploadCsv from '@/components/sample_to_metabolite_measurementUploadCsvForm'

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
      path: '/reference_sequences/upload_csv',
      name: 'reference_sequenceUploadCsv',
      component: reference_sequenceUploadCsv
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
        }
        
      ];

export default new Router({
  routes: routes
})
