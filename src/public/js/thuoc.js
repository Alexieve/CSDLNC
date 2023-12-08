
// Display table when fully loaded
window.addEventListener('load', function () {
    document.querySelector('.card-body').removeAttribute('hidden');
});

// Display modal hiển thị thông tin
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('table tbody').on('click', '.view-trigger', function() {
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
        console.log(thuoc)
        HSD = HSD.toISOString().split('T')[0]
        $('#modalTENTHUOC').val(thuoc[1]);
        $('#modalCONGDUNG').val(thuoc[2]);
        $('#modalCHONGCHIDINH').val(thuoc[3]);
        $('#modalTACDUNGPHU').val(thuoc[4]);
        $('#modalHDSD').val(thuoc[5]);
        $('#modalHSD').val(HSD);
        $('#modalNSX').val(thuoc[7]);
        $('#modalDONGIA').val(thuoc[8]);
        $('#modalSL').val(thuoc[9]);
        
        // Trigger the modal to show
        $('#thuocModal').modal('show');

        var formElements = document.querySelectorAll('#form_UpdateThuoc input, #form_UpdateThuoc textarea');

        // Lặp qua từng phần tử và thêm thuộc tính disabled
        formElements.forEach(function (element) {
            element.setAttribute('disabled', 'true');
        });

        var button = document.querySelector('.modal-footer').setAttribute('hidden', 'true');
    });
});

// Display modal cập nhật
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('table tbody').on('click', '.edit-trigger', function() {
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
        $('#modalSL').val(thuoc[9]);
        
        // Trigger the modal to show
        $('#thuocModal').modal('show');

        var formElements = document.querySelectorAll('#form_UpdateThuoc input, #form_UpdateThuoc textarea');

        // Lặp qua từng phần tử và thêm thuộc tính disabled
        formElements.forEach(function (element) {
            element.removeAttribute('disabled');
        });
        var button = document.querySelector('.modal-footer').removeAttribute('hidden');
    });
});

var form = $('#form_UpdateThuoc');
function submitForm() {
    var isValid = true;
    // Lặp qua tất cả các trường của form
    form.find('input, select, textarea').each(function() {
        var fieldValue = $(this).val();
        // Kiểm tra nếu giá trị là trống
        if (fieldValue.trim() === '') {
            // Hiển thị thông báo hoặc thực hiện các hành động khác nếu cần
            isValid = false; // Đặt biến isValid thành false
            return false; // Dừng lặp nếu có ít nhất một trường trống
        }
    });
    if (isValid) {
        var data = form.serialize();
        $.ajax({
            type: "POST",
            url: "/updateThuoc",
            data: data,
            success: function (msg) {
                $.toast({
                    heading: 'Cập nhật thuốc thành công', // Optional heading to be shown on the toast
                    icon: 'success', // Type of toast icon
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: true,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                });
                setTimeout(() => {
                    location.reload();
                },1000)
            },
            error: function (error) {
                // console.log(error);
                $.toast({
                    heading: `${error.responseJSON.error}`, // Optional heading to be shown on the toast
                    icon: 'error', // Type of toast icon
                    showHideTransition: 'slide', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loader: true,  // Whether to show loader or not. True by default
                    loaderBg: '#9EC600',  // Background color of the toast loader
                });
            }
        });
    }
    else {
        $.toast({
            heading: 'Vui lòng điền đầy đủ thông tin', // Optional heading to be shown on the toast
            icon: 'warning', // Type of toast icon
            showHideTransition: 'slide', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: true,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
        });
    }
}
