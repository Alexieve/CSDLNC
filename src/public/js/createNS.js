var form = $('#form_NV');
function submitForm() {
    var isValid = true;
    form.find('input, select,textarea').each(function() {
        var fieldValue = $(this).val();
        if (fieldValue.trim() === '') {
            isValid = false;
            return false;
        }
    });

    if (isValid) {
        var data = form.serialize();
        $.ajax({
            type: "POST",
            url: "/createNS",
            data: data,
            success: function(msg) {
                $.toast({
                    heading: 'Thêm Nha Sĩ thành công',
                    icon: 'success',
                    showHideTransition: 'slide',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: false,
                    position: 'top-left',
                    textAlign: 'left',
                    loader: true,
                    loaderBg: '#9EC600',
                });
            },
            error: function(error) {
                $.toast({
                    heading: `${error.responseJSON.error}`,
                    icon: 'error',
                    showHideTransition: 'slide',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: false,
                    position: 'top-left',
                    textAlign: 'left',
                    loader: true,
                    loaderBg: '#9EC600',
                });
            }
        });
    } else {
        $.toast({
            heading: 'Vui lòng điền đầy đủ thông tin',
            icon: 'warning',
            showHideTransition: 'slide',
            allowToastClose: true,
            hideAfter: 3000,
            stack: false,
            position: 'top-left',
            textAlign: 'left',
            loader: true,
            loaderBg: '#9EC600',
        });
    }
    return false;
}