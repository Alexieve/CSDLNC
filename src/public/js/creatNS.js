var form = $('#form_NV');
form.submit(function (e) {
    e.preventDefault();
    var data = form.serialize();
    $.ajax({
        type: "POST",
        url: "/createNV",
        data: data,
        success: function (data) {
            $.toast({
                heading: 'Tạo nhân sự thành công.', // Optional heading to be shown on the toast
                icon: 'success', // Type of toast icon
                showHideTransition: 'slide', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                textAlign: 'left',  // Text alignment i.e. left, right or center
                loader: true,  // Whether to show loader or not. True by default
                loaderBg: '#9EC600',  // Background color of the toast loader
                // afterShown: function () { location.reload();}, 
                afterHidden: function () { location.reload();}, 
            });
        },
        error: function (data) {
            $.toast({
                heading: 'Tạo nhân sự thất bại.', // Optional heading to be shown on the toast
                icon: 'error', // Type of toast icon
                showHideTransition: 'slide', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                textAlign: 'left',  // Text alignment i.e. left, right or center
                loader: true,  // Whether to show loader or not. True by default
                loaderBg: '#9EC600',  // Background color of the toast loader
                // afterShown: function () { location.reload();}, 
                afterHidden: function () { location.reload();}, 
            });
        }
    });
});
