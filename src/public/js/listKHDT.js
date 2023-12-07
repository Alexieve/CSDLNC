// Display table when fully loaded
window.addEventListener('load', function () {
    document.querySelector('.card-body').removeAttribute('hidden');
});

// Display modal
$(document).ready(function () {
// Handle click event on table rows
    $('tbody tr').on('click', function () {
        var khdt = [];

        // Traverse td elements within the clicked row
        $(this).find('td').each(function () {

            // Push the text content of each td to the array
            khdt.push($(this).text());
        });
        // Display the clicked row's data in a modal
        $('#modalMAKHDIEUTRI').val(khdt[0]);
        var ngayKham = khdt[4];
        var ngayKhamParts = ngayKham.split('/');
        console.log(ngayKhamParts);
        var ngayKhamDate = new Date(ngayKhamParts[2], ngayKhamParts[1] - 1, ngayKhamParts[0]);
        ngayKhamDate.setDate(ngayKhamDate.getDate() + 1);
        $('#modalNGAYDIEUTRI').val(ngayKhamDate.toISOString().split('T')[0]);
        $('#modalMAHSBN').val(khdt[1]);
        $('#modalMOTAKH').val(khdt[2]);
        $('#modalMADIEUTRI').val(khdt[3]);
        $('#modalKHAMCHINH').val(khdt[5]);
        $('#modalKHAMPHU').val(khdt[6]);
        $('#modalGHICHU').val(khdt[7]);
        $('#modalTRANGTHAI').val(khdt[8]);
        $('#modalMAHDTT').val(khdt[9]);
    });
});