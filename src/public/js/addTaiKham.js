$(document).ready(function () {

    var form = $('#bookAppointForm');
    function submitForm() {
        const MAHSBN = $('#MAHSBN').val();
        const HOTENBN = $('#HOTENBN').val();
        const SDTBN = $('#SDTBN').val();
        const MANS = $('#MANS').val();
        const HOTENNS = $('#HOTENNS').val();
        const MATAIKHAM = $('#MATAIKHAM').val();
        const NGAYHEN = $('#NGAYHEN').val();
        const GIOHEN = $('#GIOHEN').val();
        const data = { MAHSBN, HOTENBN, SDTBN, MANS, HOTENNS, MATAIKHAM, NGAYHEN, GIOHEN };
        $.ajax({
            type: "POST",
            url: "/addTaiKham",
            data: data,
            success: function (msg) {
                $.toast({
                    heading: 'Đặt lịch tái khám thành công', // Optional heading to be shown on the toast
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
                location.assign('/khdt');
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

    $('#bookAppointForm').submit(function (e) {
        e.preventDefault();
        submitForm();
    });
});
var minDate = new Date();
var maxDate = new Date();
minDate.setDate(minDate.getDate() + 1);
maxDate.setDate(maxDate.getDate() + 30);
document.getElementById("NGAYHEN").setAttribute("min", minDate.toISOString().split('T')[0])
document.getElementById("NGAYHEN").setAttribute("max", maxDate.toISOString().split('T')[0])



