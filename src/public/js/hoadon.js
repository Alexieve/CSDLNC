// Display table when fully loaded
window.addEventListener('load', function () {
    document.getElementById('dataTable').removeAttribute('hidden');
});

// Display modal
$(document).ready(function () {
// Handle click event on table rows
    $('table tbody').on('click', 'tr', function() {  
        var hoadon = [];

        // Traverse td elements within the clicked row
        $(this).find('td').each(function () {
            // Push the text content of each td to the array
            hoadon.push($(this).text());
        });

        // Display the clicked row's data in a modal
        $('#modalMAHOADON').val(hoadon[0]);
        $('#modalMAHSBN').val(hoadon[1]);
        $('#modalNGAYTT').val(hoadon[2]);
        $('#modalNGUOITT').val(hoadon[3]);
        $('#modalTONGTIENCANTT').val(hoadon[4]);
        $('#modalSOTIENNHAN').val(hoadon[5]);
        $('#modalSOTIENTHOI').val(hoadon[6]);
        $('#modalLOAITT').val(hoadon[7]);
        $('#modalNVTHANHTOAN').val(hoadon[8]);

    });
});