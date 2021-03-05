export function downloadFile(data, name) {
  let file = data.join('\n');
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
}

export function createSearch(value, attributes) {
  const search_attributes = attributes.map((a) => {
    const search_attribute = {
      field: a.name,
      value: value,
      operator: 'eq',
    };

    switch (a.type) {
      case 'Int':
        if (!isNaN(value) && Number.isInteger(parseFloat(value))) {
          return search_attribute;
        }
        break;
      case 'Float':
        if (!isNaN(parseFloat(value))) {
          return search_attribute;
        }
        break;
      case 'Boolean':
        if (value === 'true' || value === 'false') {
          return search_attribute;
        }
        break;
      case 'String':
        return search_attribute;
      default:
        return undefined;
    }
  });

  return search_attributes.filter((x) => x !== undefined);
}
