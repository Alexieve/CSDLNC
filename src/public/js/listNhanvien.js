$(document).ready(function () {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            'url': '/listNV/init',
            'type': 'GET',
        },
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
        console.log('Dòng được click:', nhanvien);

        // Display the clicked row's data in a modal
        // Adjust the following code based on your modal structure
        $('#modalMANV').val(nhanvien.MANV);
        $('#modalHOTEN').val(nhanvien.HOTEN);
        // Add more lines to set other modal fields
        $('#nhanvienModal').modal('show');
    });
});
