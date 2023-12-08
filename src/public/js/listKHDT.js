
$(document).ready(function() {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            'url': '/khdt/init',
            'type': 'GET',
        },
        "columns": [
            { "data": "MAKHDT" },
            { "data": "MAHSBN" },
            { "data": "HOTENBN" },
            { "data": "MOTAKH" },
            { "data": "NGAYDIEUTRI", 
                "render": function(data, type, row) {
                    var date = new Date(data);
                    return date.toLocaleDateString('vi-VN'); // Example format
                }
            },
            { "data": "KHAMCHINH" },
            { "data": "NS1" },
            { "data": "TROKHAM" },
            { "data": "NS2" },
            { "data": "TRANGTHAI" },
            { "data": "TRANGTHAI_TIEN" },
            { "data": "MOTAKH", "visible": false },
            { "data": "GHICHU","visible": false },
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
                    // if (e.keyCode === 13) {
                        var value = this.value.trim();
                        searchValues[index] = value;
                    // }
                    
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
    // $('tbody tr').on('click', function () {
    //     var khdt = [];

    //     // Traverse td elements within the clicked row
    //     $(this).find('td').each(function () {

    //         // Push the text content of each td to the array
    //         khdt.push($(this).text());
    //     });
    //     // Display the clicked row's data in a modal
    //     $('#modalMAKHDIEUTRI').val(khdt[0]);
    //     var ngayKham = khdt[4];
    //     var ngayKhamParts = ngayKham.split('/');
    //     console.log(ngayKhamParts);
    //     var ngayKhamDate = new Date(ngayKhamParts[2], ngayKhamParts[1] - 1, ngayKhamParts[0]);
    //     ngayKhamDate.setDate(ngayKhamDate.getDate() + 1);
    //     $('#modalNGAYDIEUTRI').val(ngayKhamDate.toISOString().split('T')[0]);
    //     $('#modalMAHSBN').val(khdt[1]);
    //     $('#modalMOTAKH').val(khdt[2]);
    //     $('#modalMADIEUTRI').val(khdt[3]);
    //     $('#modalKHAMCHINH').val(khdt[5]);
    //     $('#modalKHAMPHU').val(khdt[6]);
    //     $('#modalGHICHU').val(khdt[7]);
    //     $('#modalTRANGTHAI').val(khdt[8]);
    //     $('#modalMAHDTT').val(khdt[9]);
    // });
});