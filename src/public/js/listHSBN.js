$(document).ready(function() {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            'url': '/hsbn/init',
            'type': 'GET',
        },
        "columns": [
            { "data": "MAHSBN" },
            { "data": "HOTENBN" },
            { "data": "NGAYSINH", 
                "render": function(data, type, row) {
                    var date = new Date(data);
                    return date.toLocaleDateString('vi-VN'); // Example format
                }
            },
            { "data": "GIOITINH" },
            { "data": "SDTBN" },
            { "data": "DIACHIBN" },
            { "data": "TONGTIENDIEUTRI" },
            { "data": "DATHANHTOAN" },
            { "data": "TTSUCKHOE", "visible": false },
            { "data": "TTDIUNG","visible": false },
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

    $('tbody').on('click', 'tr', function () {
        var hsbn = table.row(this).data();
        console.log('Dòng được click:', hsbn);

        // Display the clicked row's data in a modal
        $('#modalMAHSBN').val(hsbn.MAHSBN);
        $('#modalHOTENBN').val(hsbn.HOTENBN);
        var ngaySinh = new Date(hsbn.NGAYSINH).toLocaleDateString('vi-VN');
        var ngaySinhDate = new Date(hsbn.NGAYSINH);
        var formattedDate = ngaySinhDate.toISOString().split('T')[0];
        $('#modalNGAYSINH').val(formattedDate);
        $('#modalGIOITINH').val(hsbn.GIOITINH);
        $('#modalSDTBN').val(hsbn.SDTBN);
        $('#modalDIACHIBN').val(hsbn.DIACHIBN);
        $('#modalTTSUCKHOE').val(hsbn.TTSUCKHOE);
        $('#modalTTDIUNG').val(hsbn.TTDIUNG);
        $('#hsbnModal').modal('show');

    });
}); 