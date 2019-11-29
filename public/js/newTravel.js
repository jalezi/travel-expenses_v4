/* eslint-disable no-undef */
/* eslint-env jquery, browser */


$(document).ready(() => {
  dateFrom.onfocusout = () => {
    if (document.getElementById('dateFrom').value > document.getElementById('dateTo').value) {
      document.getElementById('dateTo').value = document.getElementById('dateFrom').value;
    }
    document.getElementById('dateTo').min = document.getElementById('dateFrom').value;
  };
  dateTo.onfocusout = () => {
    if (document.getElementById('dateFrom').value > document.getElementById('dateTo').value) {
      document.getElementById('dateFrom').value = document.getElementById('dateTo').value;
    }
  };
  document.getElementById('dateTo').min = document.getElementById('dateFrom').value;
});
