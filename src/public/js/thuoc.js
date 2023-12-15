// Display modal hiển thị thông tin
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('table tbody').on('click', '.view-trigger', function() {
        // Extract data from the clicked row
        var thuoc = [];
        var row = $(this).closest('tr');
        row.find('td').each(function () {
            thuoc.push($(this).text());
        });

        // Display the clicked row's data in a modal
        var HSD = thuoc[6];
        var HSDParts = HSD.split('/');
        var HSD = new Date(HSDParts[2], HSDParts[1] - 1, HSDParts[0]);
        console.log(thuoc)
        HSD = HSD.toISOString().split('T')[0]
        $('#modalTENTHUOC').val(thuoc[1]);
        $('#modalCONGDUNG').val(thuoc[2]);
        $('#modalCHONGCHIDINH').val(thuoc[3]);
        $('#modalTACDUNGPHU').val(thuoc[4]);
        $('#modalHDSD').val(thuoc[5]);
        $('#modalHSD').val(HSD);
        $('#modalNSX').val(thuoc[7]);
        $('#modalDONGIA').val(thuoc[8]);
        $('#modalSL').val(thuoc[9]);
        
        // Trigger the modal to show
        $('#thuocModal').modal('show');

        var formElements = document.querySelectorAll('#form_UpdateThuoc input, #form_UpdateThuoc textarea');

        // Lặp qua từng phần tử và thêm thuộc tính disabled
        formElements.forEach(function (element) {
            element.setAttribute('disabled', 'true');
        });

        var button = document.querySelector('.modal-footer').setAttribute('hidden', 'true');
    });
});

// Display modal cập nhật
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('table tbody').on('click', '.edit-trigger', function() {
        // Extract data from the clicked row
        var thuoc = [];
        var row = $(this).closest('tr');
        row.find('td').each(function () {
            thuoc.push($(this).text());
        });

        // Display the clicked row's data in a modal
        var HSD = thuoc[6];
        var HSDParts = HSD.split('/');
        var HSD = new Date(HSDParts[2], HSDParts[1] - 1, HSDParts[0]);
        console.log()
        HSD = HSD.toISOString().split('T')[0]
        $('#modalMATHUOC').val(thuoc[0]);
        $('#modalTENTHUOC').val(thuoc[1]);
        $('#modalCONGDUNG').val(thuoc[2]);
        $('#modalCHONGCHIDINH').val(thuoc[3]);
        $('#modalTACDUNGPHU').val(thuoc[4]);
        $('#modalHDSD').val(thuoc[5]);
        $('#modalHSD').val(HSD);
        $('#modalNSX').val(thuoc[7]);
        $('#modalDONGIA').val(thuoc[8]);
        $('#modalSL').val(thuoc[9]);
        
        // Trigger the modal to show
        $('#thuocModal').modal('show');

        var formElements = document.querySelectorAll('#form_UpdateThuoc input, #form_UpdateThuoc textarea');

        // Lặp qua từng phần tử và thêm thuộc tính disabled
        formElements.forEach(function (element) {
            element.removeAttribute('disabled');
        });
        var button = document.querySelector('.modal-footer').removeAttribute('hidden');
    });
});

var form = $('#form_UpdateThuoc');
function submitForm() {
    var isValid = true;
    // Lặp qua tất cả các trường của form
    form.find('input, select, textarea').each(function() {
        var fieldValue = $(this).val();
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
            url: "/updateThuoc",
            data: data,
            success: function (msg) {
                $.toast({
                    heading: 'Cập nhật thuốc thành công', // Optional heading to be shown on the toast
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
                setTimeout(() => {
                    location.reload();
                },1000)
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

$(document).ready(function () {
    var dataTable = $('#dataTable_Thuoc').DataTable({
        'processing': true,
        'serverSide': true,
        'serverMethod': 'get',
        'ajax' : {
            'url' : '/list_Thuoc_dataTable'
        },
        'aaSorting' : [],
        'columns' : [
            { data : 'MATHUOC'},
            { data : 'TENTHUOC'},
            { data : 'CONGDUNG'},
            { data : 'CHONGCHIDINH'},
            { data : 'TACDUNGPHU'},
            { data : 'HDSD'},
            { data : 'HSD', 
            "render": function(data, type, row) {
                var date = new Date(data);
                return date.toLocaleDateString('vi-VN'); // Example format
            }},
            { data : 'NSX'},
            { data : 'DONGIA'},
            { data : 'SL'},
            { data : null}
        ],
        "deferRender": true,
        "search": {
            "return": true,
            "smart": true,
        },
        "initComplete": function () {
            var searchTable = this.api();
            var searchValues = [];

            searchTable.columns().every(function (index) {
                var column = this;
                var isLastColumn = searchTable.columns().indexes().indexOf(index) === (searchTable.columns().indexes().length - 1);
                if(!isLastColumn) {
                    var input = $('<input type="text" placeholder="Tìm kiếm..." />')
                    .appendTo($(column.footer()).empty())
                    .on('keydown', function (e) {
                            var value = this.value.trim();
                            searchValues[index] = value;
                    });
                    input.blur(function () {
                        var value = this.value.trim();
                        searchValues[index] = value;
                        search();
                    });
                }
            });
            function search() {
                searchTable.columns().every(function (index) {
                    var column = this;
                    var value = searchValues[index] || '';
                    
                    if (column.search() !== value) {
                        searchTable.column(index).search(value);
                    }
                });
                searchTable.draw();
            }
        },
        'drawCallback': function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
    
            // Iterate over each row
            api.column(-1, { page: 'current' }).data().each(function (value, i) {
                // Your custom content for column e
                var customContent = '<td class="dropdown" style="cursor: pointer;">' +
                    '<button class="dropdown-toggle btn btn-light border" ' +
                    'type="button" data-toggle="dropdown" ' +
                    'aria-haspopup="true" aria-expanded="false">' +
                    'Actions' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                    '<a class="dropdown-item view-trigger"><i class="fa fa-eye text-primary"></i> Xem thông tin chi tiết</a>' +
                    '<a class="dropdown-item edit-trigger"><i class="fa fa-edit text-primary"></i> Cập Nhật</a>' +
                    '</div>' +
                    '</td>';
    
                // Append the custom content to the last cell of the current row
                $(rows).eq(i).find('td:last').remove();
                $(rows).eq(i).append(customContent);
            });
            if($('#LOAINV').val() != 'true')
                $('.dropdown-item.edit-trigger').prop('hidden', true);
        }
    });
});