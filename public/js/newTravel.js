/* eslint-env jquery, browser */
$(document).ready(() => {

  // Place JavaScript code here...
  dateFrom.onchange = () => {
    if ( document.getElementById('dateFrom').value >  document.getElementById('dateFrom').max) {
      document.getElementById('dateFrom').value = document.getElementById('dateFrom').max;
      document.getElementById('dateTo').min = document.getElementById('dateFrom').value;
      document.getElementById('dateTo').value = document.getElementById('dateFrom').value;
    } else {
      document.getElementById('dateTo').min = document.getElementById('dateFrom').value;
      document.getElementById('dateTo').value = document.getElementById('dateFrom').value;
    }
  }

  dateTo.onchange = () => {
    if (document.getElementById('dateTo').value > document.getElementById('dateTo').max) {
      document.getElementById('dateTo').value = document.getElementById('dateTo').max;
    }
   else if (document.getElementById('dateTo').value < document.getElementById('dateTo').min) {
    document.getElementById('dateTo').value = document.getElementById('dateTo').min;
  }
}
});
