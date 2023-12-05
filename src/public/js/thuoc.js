// Display table when fully loaded
window.addEventListener('load', function () {
    document.querySelector('.card-body').removeAttribute('hidden');
});

// Display modal cập nhật
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('.edit-trigger').on('click', function (e) {
        // Extract data from the clicked row
        var thuoc = [];
        var row = $(this).closest('tr');
        row.find('td').each(function () {
            thuoc.push($(this).text());
        });

        // Display the clicked row's data in a modal
        var HSD = thuoc[6];
        var HSDParts = HSD.split('/');
        var HSD = new Date(HSDParts[2], HSDParts[1] - 1, HSDParts[0]);
        console.log()
        HSD = HSD.toISOString().split('T')[0]
        $('#modalMATHUOC').val(thuoc[0]);
        $('#modalTENTHUOC').val(thuoc[1]);
        $('#modalCONGDUNG').val(thuoc[2]);
        $('#modalCHONGCHIDINH').val(thuoc[3]);
        $('#modalTACDUNGPHU').val(thuoc[4]);
        $('#modalHDSD').val(thuoc[5]);
        $('#modalHSD').val(HSD);
        $('#modalNSX').val(thuoc[7]);
        $('#modalDONGIA').val(thuoc[8]);
        
        // Trigger the modal to show
        $('#thuocModal').modal('show');

        var formElements = document.querySelectorAll('#form_Thuoc input, #form_Thuoc textarea');

        // Lặp qua từng phần tử và thêm thuộc tính disabled
        formElements.forEach(function (element) {
            element.removeAttribute('disabled');
        });
        var button = document.querySelector('.modal-footer').removeAttribute('hidden');
    });
});

// Display modal hiển thị thông tin
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('.view-trigger').on('click', function () {
        // Extract data from the clicked row
        var thuoc = [];
        var row = $(this).closest('tr');
        row.find('td').each(function () {
            thuoc.push($(this).text());
        });

        // Display the clicked row's data in a modal
        var HSD = thuoc[6];
        var HSDParts = HSD.split('/');
        var HSD = new Date(HSDParts[2], HSDParts[1] - 1, HSDParts[0]);
        console.log()
        HSD = HSD.toISOString().split('T')[0]
        $('#modalTENTHUOC').val(thuoc[1]);
        $('#modalCONGDUNG').val(thuoc[2]);
        $('#modalCHONGCHIDINH').val(thuoc[3]);
        $('#modalTACDUNGPHU').val(thuoc[4]);
        $('#modalHDSD').val(thuoc[5]);
        $('#modalHSD').val(HSD);
        $('#modalNSX').val(thuoc[7]);
        $('#modalDONGIA').val(thuoc[8]);
        
        // Trigger the modal to show
        $('#thuocModal').modal('show');

        var formElements = document.querySelectorAll('#form_Thuoc input, #form_Thuoc textarea');

        // Lặp qua từng phần tử và thêm thuộc tính disabled
        formElements.forEach(function (element) {
            element.setAttribute('disabled', 'true');
        });

        var button = document.querySelector('.modal-footer').setAttribute('hidden', 'true');
    });
});

$('#submit').on('click', function () {
    $('#form_UpdateThuoc').submit();
});
