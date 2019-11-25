export default function getSearchAttributes(filterName) {
  switch(filterName) {
    case 'aminoacidsequence':
      return {
        "id": "Int",
        "accession": "String",
        "sequence": "String",
      };
    case 'individual':
      return {
        "id": "Int",
        "name": "String",
      };
    case 'sequencingExperiment':
      return {
        "id": "Int",
        "name": "String",
        "start_date": "Date",
        "end_date": "Date",
        "description": "String",
        "float": "Float",
        "date_time": "DateTime",
        "time": "Time",
        "i": "Int",
        "bool": "Boolean",
      };
    case 'transcript_count':
      return {
        "id": "Int",
        "gene": "String",
        "variable": "String",
        "count": "Float",
        "tissue_or_condition": "String",
        "individual_id": "Int",
        "aminoacidsequence_id": "Int",
      };
    case 'role':
      return {
        "id": "Int",
        "name": "String",
        "description": "String",
    };
    case 'user':
      return {
        "id": "Int",
        "email": "String",
        "password": "String",
    };

    default:
      return {};
  }
}