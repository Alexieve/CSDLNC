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
                alert("Vui lòng chọn hồ sơ bệnh nhân phù hợp!")
                return false;
            }
        }
        if (y[i].id == "MACN") {
            let indexTmp = parseInt(y[i].value)
            // selectedCHINHANH = listMACN.find(macn => macn.MACN === indexTmp)
            // if (selectedCHINHANH == undefined) {
            if (listMANS[indexTmp - 1] == undefined) {
                alert("Vui lòng chọn chi nhánh phù hợp!")
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
                alert("Vui lòng chọn nha sĩ phù hợp!")
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
    // console.log(listHSBN)
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
    console.log(indexMACN);
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
        success: function (data) {
            console.log(data);
            alert("Đặt lịch thành công!")
            location.reload();
        },
        error: function (data) {
            console.log(data);
            alert("Đặt lịch thất bại!")
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
    // console.log(selectedHSBN)
    // console.log(selectedCHINHANH)
    // console.log(selectedNHASI)

    // Set hidden value with jquery
    // $("#confirmMAHSBN").val(document.getElementById("MAHSBN").value)
    $("#HOTENBN").val(selectedHSBN.HOTENBN)
    $("#SDTBN").val(selectedHSBN.SDTBN)
    // $("#confirmMACN").val(document.getElementById("MACN").value)
    // $("#SDTCN").val(selectedCHINHANH.SDTCN)
    $("#DIACHICN").val(selectedCHINHANH.DIACHICN)
    // $("#confirmMANS").val(document.getElementById("MANS").value)
    $("#HOTENNS").val(selectedNHASI.HOTEN)
    // $("#confirmNGAYHEN").val(document.getElementById("NGAYHEN").value)
    // $("#confirmGIOHEN").val(document.getElementById("GIOHEN").value)

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
