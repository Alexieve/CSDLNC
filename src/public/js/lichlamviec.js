var dimensions = [7,24];

var dayList = [
    {name:"Thứ Hai"}, {name:"Thứ Ba"}, {name:"Thứ Tư"}, {name:"Thứ Năm"}, {name:"Thứ Sáu"}, {name:"Thứ Bảy"}, {name:"Chủ Nhật"},
];



var hourList = [
    {name:"00",title:"00:00-01:00"},{name:"01",title:"01:00-02:00"},{name:"02",title:"02:00-03:00"},{name:"03",title:"03:00-04:00"},
    {name:"04",title:"04:00-05:00"},{name:"05",title:"05:00-06:00"},{name:"06",title:"06:00-07:00"},{name:"07",title:"07:00-08:00"},
    {name:"08",title:"08:00-09:00"},{name:"09",title:"09:00-10:00"},{name:"10",title:"10:00-11:00"},{name:"11",title:"11:00-12:00"},
    {name:"12",title:"12:00-13:00"},{name:"13",title:"13:00-14:00"},{name:"14",title:"14:00-15:00"},{name:"15",title:"15:00-16:00"},
    {name:"16",title:"16:00-17:00"},{name:"17",title:"17:00-18:00"},{name:"18",title:"18:00-19:00"},{name:"19",title:"19:00-20:00"},
    {name:"20",title:"20:00-21:00"},{name:"21",title:"21:00-22:00"},{name:"22",title:"22:00-23:00"},{name:"23",title:"23:00-00:00"}
];

var sheetData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

var sheet = $("#LichLamViec").TimeSheet({
    data: {
        dimensions : dimensions,
        colHead : hourList,
        rowHead : dayList,
        sheetHead : {name:"Ngày\\Giờ"},
        sheetData : sheetData
    },
    remarks : null,
});

var currentId = 0;
var currentMode = 'change';

var currentDate = new Date();
var currentMonth = currentDate.getMonth() + 1; // 
var startDate = new Date(currentDate.getFullYear(), 0, 1);
let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
 
let currentWeek = Math.ceil(days / 7); //


var minDate = new Date();
var maxDate = new Date();
minDate.setDate(minDate.getDate() + 1);
maxDate.setDate(maxDate.getDate() + 30);
document.getElementById("NGAYNGHI").setAttribute("min", minDate.toISOString().split('T')[0])
document.getElementById("NGAYNGHI").setAttribute("max", maxDate.toISOString().split('T')[0])


function nextPrevBtnClick(x) {
    if (currentMode === 'weekly') {
        currentWeek += x;
        if (currentWeek < 1) {
            currentWeek = 52;
            currentDate.setFullYear(currentDate.getFullYear() - 1);
        }
        else if (currentWeek > 52) {
            currentWeek = 1;
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
        sendGetRequest(currentMode, currentId);
    }
    else if (currentMode === 'monthly') {
        currentMonth += x;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentDate.setFullYear(currentDate.getFullYear() - 1);
        }
        else if (currentMonth > 12) {
            currentMonth = 1;
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
        sendGetRequest(currentMode, currentId);
    }
}

async function sendGetRequest(mode, id) {
    let url = `/lichlamviec/${mode}/${id}`;
    if (mode === 'weekly') {
        url += `?week=${currentWeek}&year=${currentDate.getFullYear()}}`;
        $('#title').text(`Tuần ${currentWeek} năm ${currentDate.getFullYear()}`);
    }
    else if (mode === 'monthly') {
        url += `?month=${currentMonth}&year=${currentDate.getFullYear()}`;
        $('#title').text(`Tháng ${currentMonth} năm ${currentDate.getFullYear()}`);
    }
    else {
        $('#title').text(`Lịch làm việc định kỳ hằng tuần`);
    }
    $.ajax({
        url: url,
        method: 'GET',
        success: function(res) {
            sheet = $("#LichLamViec").TimeSheet({
                data: {
                    dimensions : res.dimensions,
                    colHead : hourList,
                    rowHead : res.dayList,
                    sheetHead : {name:"Ngày\\Giờ"},
                    sheetData : res.sheetData
                },
                remarks : null,
            });
        },
        error: function(error) {
            console.error(error);
        }
    });
}


$('#NHASI').change(async function() {
    var isDatalistSelected = $(this).val().trim() !== '';
    if (!isDatalistSelected) {
        currentId = 0;
        $('#saveBtn').prop('disabled', true);
        $('#addNgayNghi').prop('disabled', true);
    }
    else {
        $('#addNgayNghi').prop('disabled', false);
        currentId = JSON.parse($(this).val()).MANS;
        if (currentMode === 'change') {
            $('#saveBtn').prop('disabled', false);
        }
        else {
            $('#prevBtn').prop('disabled', false);
            $('#nextBtn').prop('disabled', false);
        }
    }
    await sendGetRequest(currentMode, currentId);
});

$('#mode').change(async function() {
    currentMode = $(this).val();
    await sendGetRequest(currentMode, currentId);
    if (currentMode === 'change') {
        $('#prevBtn').prop('disabled', true);
        $('#nextBtn').prop('disabled', true);
        if (currentId !== 0) {
            $('#saveBtn').prop('disabled', false);
        }
        else {
            $('#saveBtn').prop('disabled', true);
        }
        sheet.enable();
    } else {
        $('#prevBtn').prop('disabled', false);
        $('#nextBtn').prop('disabled', false);
        $('#saveBtn').prop('disabled', true);
        sheet.disable();
    }
});

$('#saveBtn').on('click', function() {
    let data = {
        sheetData: sheet.getSheetStates(),
    };
    // console.log(data);
    $.ajax({
        url: `/lichlamviec/update/${currentId}`,
        method: 'POST',
        data: data,
        success: function(res) {
            $.toast({
                heading: 'Cập nhật thành công', // Optional heading to be shown on the toast
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
        error: function(error) {
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
            sendGetRequest(currentMode, currentId)
        }
    });
})

$(document).ready(function() {
    
    $('#NHASI').flexdatalist({
        searchContain: true,
        minLength: 1,
        textProperty: '{MANS} - {HOTEN}',
        valueProperty:  ["MANS","HOTEN"],
        selectionRequired: true,
        visibleProperties: ["MANS","HOTEN"],
        searchDelay: 300,
        cache: false,
        searchIn: ["MANS","HOTEN"],
        url: `/lichlamviec/search/nhasi`,
        // relatives: '#relative'
    });


});


$('#addBtn').on('click', function() {
    const NGAYNGHI = $('#NGAYNGHI').val()
    if (NGAYNGHI != '') {
        $.ajax({
            url: `/lichlamviec/addNgayNghi/${currentId}`,
            method: 'POST',
            data: {NGAYNGHI: NGAYNGHI},
            success: function(res) {
                $.toast({
                    heading: 'Thêm Thành Công', // Optional heading to be shown on the toast
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
                sendGetRequest(currentMode, currentId)
            },
            error: function(error) {
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
            heading: `Vui lòng chọn ngày!`, // Optional heading to be shown on the toast
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
})
