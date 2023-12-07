// Display table when fully loaded
window.addEventListener('load', function () {
    document.querySelector('.card-body').removeAttribute('hidden');
});
//var index = 10002;
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
        index = $(this).data('mahsbn');
        hsbn.push($(this).data('ttsuckhoe'));
        hsbn.push($(this).data('ttdiung'));
        // Display the clicked row's data in a modal
        $('#modalHOTENBN').val(hsbn[1]);
        var ngaySinh = hsbn[2];
        var ngaySinhParts = ngaySinh.split('/');
        console.log(ngaySinhParts);
        var ngaySinhDate = new Date(ngaySinhParts[2], ngaySinhParts[1] - 1, ngaySinhParts[0]);
        ngaySinhDate.setDate(ngaySinhDate.getDate() + 1);
        $('#modalNGAYSINH').val(ngaySinhDate.toISOString().split('T')[0]);
        $('#modalGIOITINH').val(hsbn[3]);
        $('#modalSDTBN').val(hsbn[4]);
        $('#modalDIACHIBN').val(hsbn[5]);
        $('#modalTTSUCKHOE').val(hsbn[8]);
        $('#modalTTDIUNG').val(hsbn[9]);
        $('#hiddenInput').val(index);
    });
});
$(document).ready(function () {
    $('#xemKHTDButton').on('click', function () {
        console.log(index);
        const href = `/khdt/${index}`;
        window.location.href = href; // Chuyển hướng đến route /khdt/:MAKH
    });
});
$(document).ready(function () {
    $('#taoKHTDButton').on('click', function () {
        console.log(index);
        const href = `/createKHDT/${index}`;
        window.location.href = href; // Chuyển hướng đến route /khdt/:MAKH
    });
});
