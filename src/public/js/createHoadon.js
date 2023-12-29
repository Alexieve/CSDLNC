$(document).ready(function () {
    $("#LOAITT").change(function () {
        var selectedValue = $(this).val();
        var inputMAKHdiv = $('#MAKHdiv');
        var inputNGUOITTdiv = $('#NGUOITTdiv');
        // Thực hiện hành động tương ứng với giá trị được chọn
        switch (selectedValue) {
            case "Tiền mặt":
                inputMAKHdiv.prop('hidden', true);
                inputNGUOITTdiv.prop('hidden', false);
                break;
            case "Ví điện tử":
            case "Chuyển khoản":
                inputMAKHdiv.prop('hidden', false);
                inputNGUOITTdiv.prop('hidden', true);
                break;
        }
    });
    $('#MAKH').flexdatalist({
        searchContain: true,
        minLength: 1,
        textProperty: '{MAKH} - {HOTEN} - {SDT}',
        valueProperty: "MAKH",
        selectionRequired: true,
        visibleProperties: ["MAKH","HOTEN", "SDT"],
        searchDelay: 300,
        cache: false,
        searchIn: ["MAKH","HOTEN", "SDT"],
        url: '/makh_get',
        relatives: '#relative'
    }).on("change:flexdatalist", function(event, set, options) {
        if (set && set.value) {
            const textParts = set.text.split(' - ');
            $('#NGUOITT').val(textParts[1]);
        } else {
            $('#NGUOITT').val('');
        }
    });
    $('#SOTIENNHAN').on('input', function () {
        // Hàm xử lý sau khi giá trị thay đổi
        var SOTIENNHAN = $(this).val();
        var TONGTIEN = $('#TONGTIENCANTT').val();
        $('#SOTIENTHOI').val(SOTIENNHAN - TONGTIEN)
    });
});

var currentTab = 0;
document.addEventListener("DOMContentLoaded", function (event) {
    showTab(currentTab);
});

function showTab(n) {
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Tạo Hóa Đơn";
        setConfirmTab();
    } else {
        document.getElementById("nextBtn").innerHTML = "Tiếp theo";
    }
    fixStepIndicator(n)
}

function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    if (n == 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;
    if (currentTab >= x.length) {
        document.getElementById("nextprevious").style.display = "none";
        submitForm();
        return false;
    }
    showTab(currentTab);
}

var lastMAKH = null;
function validateForm() {
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    if (currentTab == 0) {
        var selectElement = document.getElementById("LOAITT");
        var selectedOption = selectElement.options[selectElement.selectedIndex].value;
        if (!selectedOption) {
            valid = false;
            $.toast({
                text: "Vui lòng chọn loại thanh toán!", // Text that is to be shown in the toast
                heading: 'Thiếu Thông Tin', // Optional heading to be shown on the toast
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
    }
    if (currentTab == 1) {
        var inputNGUOITT_value = $('#NGUOITT').val()
        var inputMAKH_value = $('#MAKH').val()
        var inputLOAITT_value = $('#LOAITT').val()
        if (((inputLOAITT_value == 'Ví điện tử' || inputLOAITT_value == 'Chuyển khoản') && inputMAKH_value == '') || (inputLOAITT_value == 'Tiền mặt' && inputNGUOITT_value == '')) {
            valid = false;
            $.toast({
                text: "Vui lòng điền thông tin đầy đủ!", // Text that is to be shown in the toast
                heading: 'Thiếu Thông Tin', // Optional heading to be shown on the toast
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
        else {
            var MAKH = null;
            var check = false;
            var text = null;
            var visible = null;
            var search = null;
            if (inputLOAITT_value == 'Tiền mặt') {
                MAKH = -1;
                check = true;
                text = 'KHĐT: {MAKHDIEUTRI} - HSBN: {MAHSBN} - NGÀY: {NGAYDIEUTRI}'
                visible = ["MAKHDIEUTRI", "MAHSBN", "NGAYDIEUTRI"]
                search = ["MAKHDIEUTRI", "MAHSBN", "NGAYDIEUTRI"]
            }
            else {
                if (lastMAKH != inputMAKH_value) {
                    lastMAKH = inputMAKH_value;
                    MAKH = inputMAKH_value;
                    check = true;
                    text = 'KHĐT: {MAKHDIEUTRI} - NGÀY: {NGAYDIEUTRI}'
                    visible = ["MAKHDIEUTRI", "NGAYDIEUTRI"]
                    search = ["MAKHDIEUTRI", "NGAYDIEUTRI"]
                }
            }
            if (check) {
                $.ajax({
                    url: '/khdt_get', // Replace with your actual server endpoint
                    method: 'GET',
                    data: { value: MAKH },
                    dataType: 'json',
                    success: function (data) {
                        data.forEach(item => {
                            var date = new Date(item.NGAYDIEUTRI);
                            item.NGAYDIEUTRI = date.toLocaleDateString('vi-VN')
                        })
                        // Populate data into input2
                        $('#MAKHDIEUTRI').flexdatalist({
                            data: data,
                            minLength: 1,
                            textProperty: text,
                            valueProperty: 'MAKHDIEUTRI',
                            selectionRequired: true,
                            visibleProperties: visible,
                            searchIn: search,
                            searchContain: true,
                            multiple: true,
                            hideSelected: true
                            // Other options if needed
                        });
                    },
                    error: function (error) {
                        console.error('Error fetching data:', error);
                    }
                });
            }
        }
    }
    if (currentTab == 2) {
        var inputMAKH_valueDIEUTRI = document.getElementById('MAKHDIEUTRI')
        if (inputMAKH_valueDIEUTRI.value == "") {
            valid = false;
            $.toast({
                text: "Vui lòng điền thông tin đầy đủ!", // Text that is to be shown in the toast
                heading: 'Thiếu Thông Tin', // Optional heading to be shown on the toast
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
        else {
            var selectedValue = $('#MAKHDIEUTRI').flexdatalist('value');

            // Tìm kiếm giá trị hiển thị tương ứng trong data
            var dataList = $('#MAKHDIEUTRI').flexdatalist('data');

            var tongtien = selectedValue.reduce(function (total, value) {
                var item = dataList.find(function (item) {
                    return item.MAKHDIEUTRI == value;
                });
                return total + (item ? item.TONGTIEN : 0);
            }, 0);

            $('#TONGTIENCANTT').val(tongtien)

        }
    }
    if (currentTab == 3) {
        var inputSOTIENNHAN = document.getElementById('SOTIENNHAN').value
        var inputTONGTIENCANTT = document.getElementById('TONGTIENCANTT').value
        if (inputSOTIENNHAN == "") {
            valid = false;
            $.toast({
                text: "Vui lòng điền số tiền nhận!", // Text that is to be shown in the toast
                heading: 'Thiếu Thông Tin', // Optional heading to be shown on the toast
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
        if (parseInt(inputSOTIENNHAN, 10) < parseInt(inputTONGTIENCANTT, 10)) {
            valid = false;
            $.toast({
                text: "Vui lòng điền số tiền nhận lớn hơn hoặc bằng tổng tiền!", // Text that is to be shown in the toast
                heading: 'Thiếu Thông Tin', // Optional heading to be shown on the toast
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
    }
    if (valid) { document.getElementsByClassName("step")[currentTab].className += " finish"; }
    return valid;
}

function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) { x[i].className = x[i].className.replace(" active", ""); }
    x[n].className += " active";
}

var form = $('#regForm');
function submitForm() {
    var data = form.serialize();
    $.ajax({
        type: "POST",
        url: "/createHoadon",
        data: data,
        success: function (msg) {
            // console.log(msg);
            $.toast({
                heading: 'Tạo hóa đơn thanh toán thành công', // Optional heading to be shown on the toast
                icon: 'success', // Type of toast icon
                showHideTransition: 'slide', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                textAlign: 'left',  // Text alignment i.e. left, right or center
                loader: true,  // Whether to show loader or not. True by default
                loaderBg: '#9EC600',  // Background color of the toast loader
                afterHidden: function () { window.location.href = "/createHoadon";},
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
            currentTab--;
            showTab(currentTab);
            document.getElementById("all-steps").style.display = "block";
            document.getElementById("nextprevious").style.display = "block";
        }
    });
}

function setConfirmTab() {
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().split('T')[0];
    $('#NVTHANHTOAN').val($('#confirmNVTHANHTOAN').text())
    $('#NGAYTT').val(formattedDate)

    $('#confirmMAKH').text($('#MAKH').val());
    $('#confirmNGAYTT').text(formattedDate);
    $('#confirmNGUOITT').text($('#NGUOITT').val());
    $('#confirmMAKHDIEUTRI').text($('#MAKHDIEUTRI').val());
    $('#confirmTONGTIENCANTT').text($('#TONGTIENCANTT').val());
    $('#confirmSOTIENNHAN').text($('#SOTIENNHAN').val());
    $('#confirmSOTIENTHOI').text($('#SOTIENTHOI').val());
    $('#confirmLOAITT').text($('#LOAITT').val());
}
