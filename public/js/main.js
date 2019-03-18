/* eslint-env jquery, browser */
$(document).ready(() => {

  // Place JavaScript code here...

  const expenseType = $("#expenseType")[0];
  expenseType.addEventListener('change', function() {
    console.log(expenseType.value);
    if (expenseType.value === "Mileage") {
      $("input.amount-options").replaceWith(`<select class="form-control amount-options" id="invoiceCurrency" name="invoiceCurrency" autofocus="autofocus" autocomplete="invoiceCurrency" required="required">
        <option class='distance' {{{setOption user.homeDistance "mi"}}}>mi</option>
        <option class='distance' {{{setOption user.homeDistance "km"}}}>km</option>
        </select>`);

    } else {
      $("select.amount-options").replaceWith(`
        <input class="form-control amount-options text-to-upper" type="text" list="currencies" id="invoiceCurrency" placeholder="Currency" name="invoiceCurrency" autofocus="autofocus" autocomplete="invoiceCurrency" required="required">
          <datalist class="currencies" value="" id="currencies">
            <option class="currenncy">USD</option>
            <option class="currenncy">EUR</option>
            <option class="currenncy">RSD</option>
            <option class="currenncy">HRK</option>
            <option class="currenncy">BAM</option>
          </datalist>
        `)
    }

  });
});
