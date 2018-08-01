admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name taxon --attributes 'name:string, taxonomic_level:string' --belongsTos 'taxon:parent_id:id:name:taxonomic_level:parent'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name field_plot --attributes 'field_name:string, latitude:double, longitude:double, location_code:string, soil_treatment:string'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name pot --attributes 'pot:string, greenhouse:string, climate_chamber:string, conditions:string'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name cultivar --attributes 'description:string, genotype:string' --belongsTos 'taxon:taxon_id:id:name:taxonomic_level'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name individual --attributes 'name:string, sowing_date:date, harvest_date:date' --belongsTos 'cultivar:cultivar_id:id:genotype:description, field_plot:field_plot_id:id:field_name:location_code, pot:pot_id:id:pot:greenhouse'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name sample --attributes 'name:string, material:string, life_cycle_phase:string, description:string, harvest_date:date, library:string, barcode_number:integer, barcode_sequence:string' --belongsTos 'individual:individual_id:id:name:harvest_date, field_plot:field_plot_id:id:field_name:location_code, pot:pot_id:id:pot:greenhouse, parent:parent_id:id:name:material'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name microbiome_otu --attributes 'otu_id:string, sample_desc:string, count:integer, experiment:string, version:integer, kingdom:string, createdAt:date, updatedAt:date, reference_sequence:string' --belongsTos 'parent:parent_id:id:sample_desc:experiment, sample:sample_id:id:name:material, taxon:taxon_id:id:name:taxonomic_level'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name sample_measurement --attributes 'variable:string, value:numeric, unit:string, is_average:boolean' --hasManys 'samples:sample:name:material'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name sample_to_sample_measurement --belongsTos 'sample:sample_id:id:name:material, sample_measurement:sample_measurement_id:id:variable:value'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name plant_measurement --belongsTos 'individual:individual_id:id:name:sowing_date' --attributes 'variable:string, value:numeric, unit:string'

admin_gui_gen . --baseUrl 'http://213.136.88.239:3000' --name transcript_count --attributes 'gene:string, variable:string, count:numeric, tissue_or_condition:string'
