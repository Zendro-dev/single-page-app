<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <vuetable ref="vuetable"
      api-url="http://localhost:3000/microbiome_otus/vue_table"
      :fields="fields"
      pagination-path=""
      :per-page="20"
      detail-row-component="microbiome_otu-detail-row"
      :appendParams="moreParams"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import microbiome_otuCustomActions from './microbiome_otuCustomActions.vue'
import microbiome_otuDetailRow from './microbiome_otuDetailRow.vue'
import FilterBar from './FilterBar.vue'

import Vue from 'vue'
import VueEvents from 'vue-events'
Vue.use(VueEvents)

Vue.component('microbiome_otu-custom-actions', microbiome_otuCustomActions)
Vue.component('microbiome_otu-detail-row', microbiome_otuDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    microbiome_otuDetailRow
  },
  data() {
    return {
      fields: [{
          name: '__sequence',
          title: '#',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        {
          name: '__checkbox',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        },
                  {
            name: 'reference_sequence_id',
            sortField: 'reference_sequence_id'
          },
                  {
            name: 'otu_id',
            sortField: 'otu_id'
          },
                  {
            name: 'sample_id',
            sortField: 'sample_id'
          },
                  {
            name: 'sample_desc',
            sortField: 'sample_desc'
          },
                  {
            name: 'count',
            sortField: 'count'
          },
                  {
            name: 'experiment',
            sortField: 'experiment'
          },
                  {
            name: 'version',
            sortField: 'version'
          },
                  {
            name: 'kingdom',
            sortField: 'kingdom'
          },
                {
          name: '__component:microbiome_otu-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {}
    }
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams = {
        'filter': filterText.trim()
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {}
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>
