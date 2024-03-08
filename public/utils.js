
/**
 * Retrieve the selected currency and redirects user to dynamically generated URL.
 */
const redirectToCotTable = () => {
    // Get the selected currency from the dropdown menu
    const selectedCurrency = document.getElementById('currency-selector').value;

    // Redirect to the dynamic route /cot-table/:currency
    window.location.href = `/cot-table/${selectedCurrency}`;
}