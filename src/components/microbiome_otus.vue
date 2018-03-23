<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'microbiome_otu'"><button class="ui primary button">Add microbiome_otu</button></router-link>
      <a :href="this.$baseUrl() + '/microbiome_otus/example_csv'"><button class="ui primary button">CSV Example Table</button></a>
      <router-link v-bind:to="'/microbiome_otus/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl() + '/microbiome_otus/vue_table'"
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

import axios from 'axios'

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
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
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
    },
    onDelete () {
      if (window.confirm("Do you really want to delete microbiome_otus of ids '" + this.$refs.vuetable.selectedTo.join("; ") + "'?")) {
        var t = this;
        var url = this.$baseUrl()() + '/microbiome_otu/' + this.$refs.vuetable.selectedTo.join("/")
        axios.delete(url).then(function (response) {
          t.$refs.vuetable.refresh()
        }).catch(function (error) {
          t.error = error
        })
      }
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/microbiome_otus/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'
      
      axios.get(url).then(function (response) {

        var a = document.createElement("a");        
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'microbiome_otu' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    }
  },
  mounted() {
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  }
}
</script>
