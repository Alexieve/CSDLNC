// Display modal
$(document).ready(function () {

    var dataTable = $('#dataTable_Hoadon').DataTable({
        'processing': true,
        'serverSide': true,
        'serverMethod': 'get',
        'ajax' : {
            'url' : '/list_Hoadon_dataTable'
        },
        'aaSorting' : [],
        'columns' : [
            { data : 'MAHOADON'},
            { data : 'MAKH'},
            { data : 'NGAYTT', 
            "render": function(data, type, row) {
                var date = new Date(data);
                return date.toLocaleDateString('vi-VN'); // Example format
            }},
            { data : 'NGUOITT'},
            { data : 'TONGTIENCANTT'},
            { data : 'SOTIENNHAN'},
            { data : 'SOTIENTHOI'},
            { data : 'LOAITT'},
            { data : 'NVTHANHTOAN'}
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
        },
    });

    // Handle click event on table rows
    
    $('table tbody').on('click', 'tr', function() {
        $('#hoadonModal').modal('show');
        var hoadon = [];

        // Traverse td elements within the clicked row
        $(this).find('td').each(function () {
            // Push the text content of each td to the array
            hoadon.push($(this).text());
        });

        // Display the clicked row's data in a modal
        $('#modalMAHOADON').val(hoadon[0]);
        $('#modalMAHSBN').val(hoadon[1]);
        $('#modalNGAYTT').val(hoadon[2]);
        $('#modalNGUOITT').val(hoadon[3]);
        $('#modalTONGTIENCANTT').val(hoadon[4]);
        $('#modalSOTIENNHAN').val(hoadon[5]);
        $('#modalSOTIENTHOI').val(hoadon[6]);
        $('#modalLOAITT').val(hoadon[7]);
        $('#modalNVTHANHTOAN').val(hoadon[8]);

    });
});