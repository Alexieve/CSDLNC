// datalist
var selectedHSBN = null;
var selectedCHINHANH = null;
var selectedNHASI = null;


$('#MAHSBN').flexdatalist({
    searchContain: true,
    minLength: 1,
    textProperty: '{MAHSBN} - {HOTENBN} - {SDTBN}',
    valueProperty: ["MAHSBN","HOTENBN", "SDTBN"],
    selectionRequired: true,
    visibleProperties: ["MAHSBN","HOTENBN", "SDTBN"],
    searchDelay: 300,
    cache: false,
    searchIn: ["MAHSBN","HOTENBN", "SDTBN"],
    url: '/createLH/search/patients',
    relatives: '#relative'
});

$('#MACN').flexdatalist({
    searchContain: true,
    minLength: 1,
    textProperty: '{MACN} - {TENCN}',
    valueProperty: ["MACN","TENCN", "DIACHICN", "SDTCN"],
    selectionRequired: true,
    visibleProperties: ["MACN","TENCN", "DIACHICN", "SDTCN"],
    searchDelay: 300,
    cache: false,
    searchIn: ["MACN","TENCN", "DIACHICN", "SDTCN"],
    url: '/createLH/search/chinhanh',
    relatives: '#relative'
});

// MULTI STEP FORM
var currentTab = 0;
document.addEventListener("DOMContentLoaded", function(event) {
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
        document.getElementById("nextBtn").innerHTML = "Đặt lịch";
        setConfirmTab();

    } else {
        document.getElementById("nextBtn").innerHTML = "Tiếp theo";
        document.getElementById("nextBtn").type = "button";
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

function validateForm() {
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    for (i = 0; i < y.length; i++) {
        let inputValue = y[i].value;
        if (y[i].id == "MAHSBN") {
            if (inputValue != "") {
                selectedHSBN = JSON.parse(inputValue)
                continue;
            }
            $.toast({
                text: "Vui lòng chọn hồ sơ bệnh nhân phù hợp!", // Text that is to be shown in the toast
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
            return false;
        }
        if (y[i].id == "MACN") {
            if (inputValue != "" ) {
                const tmp = JSON.parse(inputValue)
                if (selectedCHINHANH == null || selectedCHINHANH.MACN != tmp.MACN) {
                    selectedCHINHANH = JSON.parse(inputValue)
                }
                continue;
            }
            $.toast({
                text: "Vui lòng chọn chi nhánh phù hợp!", // Text that is to be shown in the toast
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
            return false;
        }
        if (y[i].id == "MANS") {
            if (inputValue == "") {
                selectedNHASI = {MANS: 'Hệ thống tự chọn', HOTEN: 'Hệ thống tự chọn'}
                $('#MANSselected').val('')
                continue;
            }
            selectedNHASI = JSON.parse(inputValue)
            $('#MANSselected').val(selectedNHASI.MANS)
        }
        if (y[i].id == "NGAYHEN" || y[i].id == "GIOHEN") {
            if (inputValue == "") {
                y[i].className += " invalid";
                valid = false;
            }
            else  y[i].classList.remove("invalid")
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

function setConfirmTab() {
    // Set hidden value with jquery
    $("#HOTENBN").val(selectedHSBN.HOTENBN)
    $("#SDTBN").val(selectedHSBN.SDTBN)
    $("#HOTENNS").val(selectedNHASI.HOTEN)


    // Set text for confirm tab
    $("#confirmMAHSBN").text(selectedHSBN.MAHSBN)
    $("#confirmHOTENBN").text(selectedHSBN.HOTENBN)
    $("#confirmSDTBN").text(selectedHSBN.SDTBN)
    $("#confirmTENCN").text(selectedCHINHANH.TENCN)
    $("#confirmSDTCN").text(selectedCHINHANH.SDTCN)
    $("#confirmDIACHICN").text(selectedCHINHANH.DIACHICN)
    $("#confirmMANS").text(selectedNHASI.MANS)
    $("#confirmHOTENNS").text(selectedNHASI.HOTEN)
    $("#confirmNGAYHEN").text(document.getElementById("NGAYHEN").value)
    $("#confirmGIOHEN").text(document.getElementById("GIOHEN").value)

}

//POST FORM
var form = $('#regForm');
function submitForm() {
    var data = form.serialize();
    $.ajax({
        type: "POST",
        url: "/createLH",
        data: data,
        success: function (msg) {
            // console.log(msg);
            $.toast({
                heading: 'Đặt lịch thành công', // Optional heading to be shown on the toast
                icon: 'success', // Type of toast icon
                showHideTransition: 'slide', // fade, slide or plain
                allowToastClose: true, // Boolean value true or false
                hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                textAlign: 'left',  // Text alignment i.e. left, right or center
                loader: true,  // Whether to show loader or not. True by default
                loaderBg: '#9EC600',  // Background color of the toast loader
                afterHidden: function () {
                    location.reload();
                }
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


var minDate = new Date();
var maxDate = new Date();
minDate.setDate(minDate.getDate() + 1);
maxDate.setDate(maxDate.getDate() + 30);
document.getElementById("NGAYHEN").setAttribute("min", minDate.toISOString().split('T')[0])
document.getElementById("NGAYHEN").setAttribute("max", maxDate.toISOString().split('T')[0])


function checkDateTime() {
    var dateValue = $("#NGAYHEN").val();
    var timeValue = $("#GIOHEN").val();

    if (dateValue !== "" && timeValue !== "") {
        $('#MANS').flexdatalist({
            searchContain: true,
            minLength: 1,
            textProperty: '{MANS} - {HOTEN}',
            valueProperty:  ["MANS","HOTEN"],
            selectionRequired: true,
            visibleProperties: ["MANS","HOTEN"],
            searchDelay: 300,
            cache: false,
            searchIn: ["MANS","HOTEN"],
            url: `/createLH/search/nhasi/${selectedCHINHANH.MACN}?date=${dateValue}&time=${timeValue}`,
            relatives: '#relative'
        });
        $("#MANS-flexdatalist").prop("disabled", false);
    } else {
        $("#MANS-flexdatalist").prop("disabled", true);
    }
}

$("#NGAYHEN, #GIOHEN").on("change", function() {
    checkDateTime();
});