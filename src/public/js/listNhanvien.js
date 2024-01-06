$(document).ready(function () {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            'url': '/listNV/init',
            'type': 'GET',
        },
        "stateSave": true,
        "columns": [
            { "data": "MANV" },
            { "data": "HOTEN" },
            {
                "data": "NGAYSINH",
                "render": function (data, type, row) {
                    var date = new Date(data);
                    return date.toLocaleDateString('vi-VN');
                }
            },
            { "data": "GIOITINH" },
            { "data": "DIACHI" },
            { "data": "SDT" },
            { "data": "EMAIL" },
            {
                "data": "LOAINV",
                "render": function (data, type, row) {
                    return data ? "QTV" : "NV";
                }
            },
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
        var nhanvien = table.row(this).data();
        nhanvien.MATKHAU = nhanvien.MATKHAU.replace(/\s+/g, '');
        console.log('Dòng được click:', nhanvien);

        
        $('#modalMANV').val(nhanvien.MANV);
        $('#modalHOTEN').val(nhanvien.HOTEN);
        var ngaySinh = new Date(nhanvien.NGAYSINH).toLocaleDateString('vi-VN');
        var ngaySinhDate = new Date(nhanvien.NGAYSINH);
        var formattedDate = ngaySinhDate.toISOString().split('T')[0];
        $('#modalNGAYSINH').val(formattedDate);
        $('#modalGIOITINH').val(nhanvien.GIOITINH);
        $('#modalDIACHI').val(nhanvien.DIACHI);
        //$('#modalSDT').val(nhanvien.SDT);
        $('#modalSDT').val(nhanvien.SDT).prop('readonly', true);
        $('#modalEMAIL').val(nhanvien.EMAIL);
        var loaiNVText = nhanvien.LOAINV == true ? 1 : 0;
        console.log(loaiNVText);
        $('#modalLOAINV').val(loaiNVText);
        $('#modalMATKHAU').val(nhanvien.MATKHAU);
        $('#listNVModal').modal('show');
    });
});

var formUpdateNV = $('#form_update_NV');

formUpdateNV.submit(function (e) {
    e.preventDefault();

    var dataUpdateNV = formUpdateNV.serialize();

    $.ajax({
        type: "POST",
        url: "/updateNV",
        data: dataUpdateNV,
        success: function (data) {
            $.toast({
                heading: 'Cập nhật Nhân Viên thành công',
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
                heading: 'Cập nhật Nhân Viên thất bại',
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


