admin_gui_gen . --baseUrl 'http://localhost:3000' --name taxon --attributes 'name:string, taxonomic_level:string' --belongsTos 'taxon:parent_id:id:name:taxonomic_level:parent'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name field_plot --attributes 'field_name:string, latitude:double, longitude:double, location_code:string, soil_treatment:string'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name pot --attributes 'pot:string, greenhouse:string, climate_chamber:string, conditions:string'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name cultivar --attributes 'description:string, genotype:string' --belongsTos 'taxon:taxon_id:id:name:taxonomic_level'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name individual --attributes 'name:string, sowing_date:date, harvest_date:date' --belongsTos 'cultivar:cultivar_id:id:genotype:description, field_plot:field_plot_id:id:field_name:location_code, pot:pot_id:id:pot:greenhouse'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name sample --attributes 'name:string, material:string, life_cycle_phase:string, barcode_tag:string, description:string, harvest_date:date' --belongsTos 'individual:individual_id:id:name:harvest_date, field_plot:field_plot_id:id:field_name:location_code, pot:pot_id:id:pot:greenhouse, parent:parent_id:id:name:material'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name reference_sequence --attributes 'sequence:string, taxon_id:integer, microbiome_otu_id:integer'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name microbiome_otu --attributes 'sample_desc:string, count:integer, experiment:string, version:integer, kingdom:string' --belongsTos 'reference_sequence:reference_sequence_id:id:id:id, parent:otu_id:id:sample_desc:experiment, sample:sample_id:id:name:material'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name metabolite_measurement --attributes 'metabolite:string, sample_id:integer, amount:double, unit:string, is_average:boolean' --hasManys 'samples:name:material'

admin_gui_gen . --baseUrl 'http://localhost:3000' --name sample_to_metabolite_measurement --belongsTos 'sample:sample_id:id:name:material, metabolite_measurement:metabolite_measurement_id:id:metabolite:amount'
