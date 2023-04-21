import axios from 'axios';
import cheerio from 'cheerio';

// URL of the webpage to scrape
const url = 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a';

// Make a request to the webpage using axios
axios
  .get(url)
  .then((response) => {
    // Load the HTML content of the response into Cheerio
    const $ = cheerio.load(response.data);

    // Find the table element that contains the data
    const table = $('table#myTable');

    // Create an empty array to store the rows of data
    const data = [] as any;

    // Loop over each row of the table
    $('tr', table).each((i, row) => {
      // Create an empty object to store the data for this row
      const rowObj = {};

      // Loop over each cell in the row
      $('td', row).each((j, cell) => {
        // Extract the text content of the cell and add it to the row object
        const cellText = $(cell).text().trim();
        rowObj[j as keyof typeof rowObj] = cellText as never;
      });

      // Add the row object to the data array
      data.push(rowObj);
    });

    // Log the resulting data object
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
