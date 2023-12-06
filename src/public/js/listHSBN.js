var listHSBN = $('.table-responsive').data("list");

$(document).ready(function() {
    var table = $('#dataTable').DataTable({
        "data": listHSBN, // Use the embedded data
        "columns": [
            { "data": "MAHSBN" },
            { "data": "HOTENBN" },
            { "data": "NGAYSINH", 
                "render": function(data, type, row) {
                    // Format date using JavaScript Date object (adjust the format as needed)
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
            "smart": true,
            "regex": true,
        },
        "scrollX": true,
        "stateSave": true,            
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