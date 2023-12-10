var form = $('#form_NS');
form.submit(function (e) {
    e.preventDefault();
    var data = form.serialize();
    $.ajax({
        type: "POST",
        url: "/createNS",
        data: data,
        success: function (data) {
            $.toast({
                heading: 'Tạo nha sĩ thành công.', 
                icon: 'success', 
                showHideTransition: 'slide', 
                allowToastClose: true, 
                hideAfter: 3000, 
                stack: false, 
                position: 'top-left', 
                textAlign: 'left',  
                loader: true,  
                loaderBg: '#9EC600',  
                
                afterHidden: function () { location.reload();}, 
            });
        },
        error: function (data) {
            $.toast({
                heading: 'Tạo nha sĩ thất bại.', 
                icon: 'error', 
                showHideTransition: 'slide', 
                allowToastClose: true, 
                hideAfter: 3000, 
                stack: false, 
                position: 'top-left', 
                textAlign: 'left',  
                loader: true,  
                loaderBg: '#9EC600', 
                
                afterHidden: function () { location.reload();}, 
            });
        }
    });
});
