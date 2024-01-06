$(document).ready(function() {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "stateSave": true,
        "ajax": {
            'url': '/listNS/init',
            'type': 'GET',
        },
        "columns": [
            { "data": "MANS" },
            { "data": "HOTEN" },
            { "data": "NGAYSINH", 
                "render": function(data, type, row) {
                    var date = new Date(data);
                    return date.toLocaleDateString('vi-VN'); // Example format
                }
            },
            { "data": "GIOITINH" },
            { "data": "SDT" },
            { "data": "DIACHI" },
            { "data": "EMAIL" },
            { "data": "MACN" },
            // Add more columns as needed
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
        }         
    });

    $('tbody').on('click', 'tr', function () {
        var nhasi = table.row(this).data();
        nhasi.MATKHAU = nhasi.MATKHAU.replace(/\s+/g, '');
        console.log('Dòng được click:', nhasi);

        // Display the clicked row's data in a modal
        // Adjust the following code based on your modal structure
        $('#modalMANS').val(nhasi.MANS);
        $('#modalHOTEN').val(nhasi.HOTEN);
        var ngaySinh = new Date(nhasi.NGAYSINH).toLocaleDateString('vi-VN');
        var ngaySinhDate = new Date(nhasi.NGAYSINH);
        var formattedDate = ngaySinhDate.toISOString().split('T')[0];
        $('#modalNGAYSINH').val(formattedDate);
        $('#modal.GIOITINH').val(nhasi.GIOITINH);
        $('#modalSDT').val(nhasi.SDT);
        $('#modalDIACHI').val(nhasi.DIACHI);
        $('#modalEMAIL').val(nhasi.EMAIL);
        $('#modalMACN').val(nhasi.MACN);
        $('#modalMATKHAU').val(nhasi.MATKHAU);
        // Add more lines to set other modal fields
        $('#listNSModal').modal('show');
    });
});

var formUpdateNV = $('#form_update_NS');

formUpdateNV.submit(function (e) {
    e.preventDefault();

    var dataUpdateNV = formUpdateNV.serialize();

    $.ajax({
        type: "POST",
        url: "/updateNV",
        data: dataUpdateNV,
        success: function (data) {
            $.toast({
                heading: 'Cập nhật Nha Sĩ thành công',
                icon: 'success',
                showHideTransition: 'slide',
                allowToastClose: true,
                hideAfter: 3000,
                stack: false,
                position: 'top-left',
                textAlign: 'left',
                loader: true,
                loaderBg: '#9EC600',
                afterHidden: function () { location.reload(); },
            });
        },
        error: function (data) {
            $.toast({
                heading: 'Cập nhật Nha Sĩ thất bại',
                icon: 'error',
                showHideTransition: 'slide',
                allowToastClose: true,
                hideAfter: 3000,
                stack: false,
                position: 'top-left',
                textAlign: 'left',
                loader: true,
                loaderBg: '#9EC600',
                afterHidden: function () { location.reload(); },
            });
        }
    });
});


