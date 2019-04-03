/* eslint-env jquery, browser */

function calcAmount(rate, amount, currency=true) {
  let result = 0;
  if (currency) {
    result = amount / rate;
    return result;
  } else {
    result = amount * rate;
    return result;
  }
}

$(document).ready(() => {


  // Place JavaScript code here...

  // show/hide form row 2 & 3 based on selection
  expenseType.onchange = function (data, data1) {

    if (expenseType.value === 'Mileage') {
      invoiceCurrency.value = "";
      amount.value = 0;
      rate.value = 0;
      amountConverted.value = 0.00;
      rate.value = parseFloat($('#rate').val()).toFixed(2);
      amount.value = parseFloat($('#amountDistance').val()).toFixed(2);
      $('#row2Mileage').show();
      $('#row2noMileage').hide();

      // console.log(invoiceUnit.selectedIndex);
      if (invoiceUnit.selectedIndex === 0) {
        $('#row3Mileage').hide();
      } else {
        $('#row3Mileage').show();
      }

      document.getElementById('invoiceCurrency').required = false;
      } else {
      amountDistance.value = 0;
      amountDistance2.value = 0;
      amountConverted2.value = 0.00;
      amountDistance.value = parseFloat($('#amountDistance').val()).toFixed(2);
      amountDistance2.value = parseFloat($('#amountDistance2').val()).toFixed(2);
      $('#row2Mileage').hide();
      $('#row3Mileage').hide();
      $('#row2noMileage').show();

      document.getElementById('invoiceCurrency').required = true
    }
  }

  // row 2; expenseType != 'Mileage'
  amount.onfocusout = function () {
    if (amount.value != "") {
      amount.value = parseFloat($('#amount').val()).toFixed(2);
    }
  }

  amount.onchange = function  () {
    if (amount.value != "" && rate.value !="" && rate.value !=0) {
        amountConverted.value = amount.value / rate.value;
        amountConverted.value = parseFloat($('#amountConverted').val()).toFixed(2)
      }
  }

  rate.onfocusout = function () {
    if (rate.value != "") {
      rate.value = parseFloat($('#rate').val()).toFixed(2);
    }
  }

  rate.onchange = function  () {
    if (amount.value != "" && rate.value != "" && rate.value !=0) {
        amountConverted.value = amount.value / rate.value;
        amountConverted.value = parseFloat($('#amountConverted').val()).toFixed(2)
      }
    }

  amountDistance.onfocusout = function () {
    if (amountDistance.value != "") {
      amountDistance.value = parseFloat($('#amountDistance').val()).toFixed(2);
    }
  }

  amountDistance.onchange = function  () {
    if (amountDistance.value != "" && travelPerMileAmount.value != "") {
        amountConverted2.value = amountDistance.value * travelPerMileAmount.value;
        amountConverted2.value = parseFloat($('#amountConverted2').val()).toFixed(2)
      }
  }


  // row 2; expenseType === 'Mileage'
  travelPerMileAmount.onfocusout = function () {
    if (travelPerMileAmount.value != "") {
      travelPerMileAmount.value = parseFloat($('#travelPerMileAmount').val()).toFixed(2);
    }
  }

  travelPerMileAmount.onchange = function  () {
    if (amountDistance.value != "" && travelPerMileAmount.value !="") {
        amountConverted2.value = amountDistance.value * travelPerMileAmount.value;
        amountConverted2.value = parseFloat($('#amountConverted2').val()).toFixed(2)
      }
  }

  amountDistance2.onfocusout = function () {
    if (amountDistance2.value != "") {
      amountDistance2.value = parseFloat($('#amountDistance2').val()).toFixed(2);
    }
  }



});
