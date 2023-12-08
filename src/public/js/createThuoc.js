var form = $('#form_Thuoc');
function submitForm() {
    var isValid = true;
    // Lặp qua tất cả các trường của form
    form.find('input, select, textarea').each(function() {
        var fieldValue = $(this).val();
        console.log(fieldValue)
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
            url: "/createThuoc",
            data: data,
            success: function (msg) {
                $.toast({
                    heading: 'Thêm thuốc thành công', // Optional heading to be shown on the toast
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