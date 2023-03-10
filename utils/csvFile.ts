export function csvFile(arr: any) {
  const csvContent = 'data:text/csv;charset=utf-8,' + arr.map((e: any) => e).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'load_profile.csv');
  document.body.appendChild(link);

  return link.click();
}
