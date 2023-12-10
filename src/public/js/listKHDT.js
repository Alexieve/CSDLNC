
$(document).ready(function() {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            'url': '/khdt/init',
            'type': 'GET',
        },
        "columns": [
            { "data": "MAKHDIEUTRI" },
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
            { "data": "TENNSKHAMCHINH" },
            { "data": "TROKHAM" },
            { "data": "TENNSTROKHAM" },
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
    $('tbody').on('click','tr',function () {
        var khdt = table.row(this).data();

        // Display the clicked row's data in a modal
        $('#modalMAKHDIEUTRI').val(khdt.MAKHDIEUTRI);
        var ngayKham = new Date(khdt.NGAYDIEUTRI).toLocaleDateString('vi-VN');
        var ngayKhamDate = new Date(khdt.NGAYDIEUTRI);
        formattedDate = ngayKhamDate.toISOString().split('T')[0];
        $('#modalNGAYDIEUTRI').val(formattedDate);
        $('#modalMAHSBN').val(khdt.MAHSBN);
        $('#modalMOTAKH').val(khdt.MOTAKH);
        $('#modalMADIEUTRI').val(khdt.MADIEUTRI);
        $('#modalKHAMCHINH').val(khdt.KHAMCHINH);
        $('#modalKHAMPHU').val(khdt.KHAMPHU);
        $('#modalGHICHU').val(khdt.GHICHU);
        $('#modalTRANGTHAI').val(khdt.TRANGTHAI);
        $('#modalMAHDTT').val(khdt.MAHDTT);
        $('#KHDTModal').modal('show');
    });
    
});
function DonThuoc() {
    var data = $('#modalMAKHDIEUTRI').val();
  
    // Mã hóa giá trị MAKHDIEUTRI và tạo URL mới
    var newURL = '/addDonThuoc?MAKHDIEUTRI=' + encodeURIComponent(data);
    // Thực hiện chuyển hướng bằng phương thức GET
    window.location.href = newURL;
}