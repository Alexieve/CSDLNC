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
        if (y[i].id == "MAHSBN") {
            let indexTmp = parseInt(y[i].value)
            // if (listHSBN[indexTmp - 1] == undefined) {
            selectedHSBN = listHSBN.find(hsbn => hsbn.MAHSBN === indexTmp)
            if (selectedHSBN == undefined) {
            // if (hsbn = listHSBN.find(hsbn => hsbn.MAHSBN === indexTmp) == undefined) {
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
        }
        if (y[i].id == "MACN") {
            let indexTmp = parseInt(y[i].value)
            // selectedCHINHANH = listMACN.find(macn => macn.MACN === indexTmp)
            // if (selectedCHINHANH == undefined) {
            if (listMANS[indexTmp - 1] == undefined) {
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
            else {
                let strCN = $(`#listCN option[value="${indexTmp}"]`).text();
                let partsCN = strCN.split('-').map(part => part.trim());
                partsCN[0] = partsCN[0].replace('[', '').replace(']', '')
                selectedCHINHANH = {MACN: parseInt(partsCN[0]), TENCN: partsCN[1], DIACHICN: partsCN[2], SDTCN: partsCN[3]}
            }
        }
        if (y[i].id == "MANS") {
            if (y[i].value == "") {
                selectedNHASI = {MANS: 'Hệ thống tự chọn', HOTEN: 'Hệ thống tự chọn'}
                continue;
            }
            let indexTmp = parseInt(y[i].value)
            let macn = document.getElementById('MACN').value
            selectedNHASI = listMANS[macn - 1].find(mans => mans.MANS === indexTmp)
            if (selectedNHASI == undefined) {
                $.toast({
                    text: "Vui lòng chọn nha sĩ phù hợp!", // Text that is to be shown in the toast
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
        }
        if ((y[i].id == "NGAYHEN" || y[i].id == "GIOHEN") && y[i].value == "") {
            y[i].className += " invalid";
            valid = false;
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


// datalist for HSBN
var listHSBN = JSON.parse(document.getElementById('listHSBNjson').dataset.list)
var selectedHSBN = null;
function filterListMAHSBN() {
    var listHSBNoption = listHSBN.map(hsbn => `${hsbn.MAHSBN} - ${hsbn.HOTENBN} - ${new Date(hsbn.NGAYSINH).toLocaleDateString('vi-VN')} - ${hsbn.GIOITINH} - ${hsbn.SDTBN}`);
    const input = document.getElementById('MAHSBN');
    const datalist = document.getElementById('listHSBN');
    // Clear existing options
    datalist.innerHTML = '';

    // Filter and add options based on user input
    const inputValue = input.value.toLowerCase();
    const filteredHSBN = listHSBNoption.filter(hsbn => hsbn.toLowerCase().includes(inputValue));

    // Limit the number of displayed options (e.g., first 5 options)
    const limitedListHSBN = filteredHSBN.slice(0, 5);

    // Add options to datalist
    limitedListHSBN.forEach(hsbn => {
        const parts = hsbn.split('-').map(part => part.trim());
        const option = document.createElement('option');
        option.value = parts[0];
        option.innerHTML = hsbn;
        datalist.appendChild(option);
    });
}


// datalist for NHASI
var listMANS = JSON.parse(document.getElementById('listMANSjson').dataset.list)
var selectedNHASI = null;
var selectedCHINHANH = null;
function filterListMANS() {
    var indexMACN = document.getElementById('MACN').value;
    var listMANSoption = listMANS[indexMACN - 1].map(mans => `${mans.MANS} - ${mans.HOTEN}`);
    const input = document.getElementById('MANS');
    const datalist = document.getElementById('listMANS');
    // Clear existing options
    datalist.innerHTML = '';

    // Filter and add options based on user input
    const inputValue = input.value.toLowerCase();
    const filteredMANS = listMANSoption.filter(mans => mans.toLowerCase().includes(inputValue));

    // Limit the number of displayed options (e.g., first 5 options)
    const limitedListMANS = filteredMANS.slice(0, 5);

    // Add options to datalist
    limitedListMANS.forEach(mans => {
        const parts = mans.split('-').map(part => part.trim());
        const option = document.createElement('option');
        option.value = parts[0];
        option.innerHTML = mans;
        datalist.appendChild(option);
    });
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
            });
            location.reload();
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
// form.submit(function (e) {
//     e.preventDefault();
//     var data = form.serialize();
//     $.ajax({
//         type: "POST",
//         url: "/createLH",
//         data: data,
//         success: function (data) {
//             console.log(data);
//             document.getElementById("nextprevious").style.display = "none";
//         },
//         error: function (data) {
//             console.log(data);
//         }
//     });
// })

var minDate = new Date();
var maxDate = new Date();
minDate.setDate(minDate.getDate() + 1);
maxDate.setDate(maxDate.getDate() + 30);
document.getElementById("NGAYHEN").setAttribute("min", minDate.toISOString().split('T')[0])
document.getElementById("NGAYHEN").setAttribute("max", maxDate.toISOString().split('T')[0])



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
