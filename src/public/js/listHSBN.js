// Display table when fully loaded
window.addEventListener('load', function () {
    document.getElementById('dataTable').removeAttribute('hidden');
});

// Display modal
$(document).ready(function () {
// Handle click event on table rows
    $('tbody tr').on('click', function () {
        var hsbn = [];

        // Traverse td elements within the clicked row
        $(this).find('td').each(function () {
            // Push the text content of each td to the array
            hsbn.push($(this).text());
        });
        hsbn.push($(this).data('ttsuckhoe'));
        hsbn.push($(this).data('ttdiung'));
        console.log(hsbn);

        // Display the clicked row's data in a modal
        $('#modalMAHSBN').val(hsbn[0]);
        $('#modalHOTENBN').val(hsbn[1]);
        var ngaySinh = hsbn[2];
        var ngaySinhParts = ngaySinh.split('/');
        var ngaySinhDate = new Date(ngaySinhParts[2], ngaySinhParts[1] - 1, ngaySinhParts[0]);
        ngaySinhDate.setDate(ngaySinhDate.getDate() + 1);
        $('#modalNGAYSINH').val(ngaySinhDate.toISOString().split('T')[0]);
        $('#modalGIOITINH').val(hsbn[3]);
        $('#modalSDTBN').val(hsbn[4]);
        $('#modalDIACHIBN').val(hsbn[5]);
        $('#modalTTSUCKHOE').val(hsbn[8]);
        $('#modalTTDIUNG').val(hsbn[9]);

    });
});