$(document).ready(function() {

    var table = $('#dataTable').DataTable({
        "processing": true,
        "serverSide": true,
        "stateSave": true,
        "ajax": {
            'url': '/Appointmentmanage/init',
            'type': 'GET',
        },
        "columns": [
            { "data": "MALH" },
            { "data": "XACNHAN",
            "render": function(data, type, row) {
                if (data === 0) {
                    return '<span class="text-warning font-weight-bold">Chờ xác nhận</span>';
                } else if (data === 1) {
                    if (new Date(row.NGAYHEN) < new Date()) {
                        return '<span class="text-success font-weight-bold">Đã hẹn</span>';
                    } else {
                        return '<span class="text-primary font-weight-bold">Đã xác nhận</span>';
                    }
                } else {
                    return ''; // Add your condition for other cases if needed
                }
            }
  
            },
            { "data": "NGAYHEN", 
                "render": function(data, type, row) {
                    var date = new Date(row.NGAYHEN);
                    return date.toLocaleDateString('vi-VN');
                }
            },
            { "data": "GIOHEN", 
            "render": function(data, type, row) {
                var originalTime = new Date(data);
                var utcTime = new Date(originalTime.getTime() + originalTime.getTimezoneOffset() * 60000);
                return utcTime.toLocaleTimeString('vi-VN', {hour12: false});
            }
            },
            { "data": "HOTENBN" },
            { "data": "SDTBN" },
            { "data": "HOTENNS" },
            { "data": "MATAIKHAM",
            "render": function(data, type, row) {
                if (data !== null) {
                    return '<span ">Có</span>';
                } 
                else {
                    return '<span ">Không</span>';
                }
            }
            },
            { 
                "data": null,

                "render": function(data, type, row) {
                    var xacNhanValue = row.XACNHAN;
                    var malichhen = row.MALH;
                    // Dropdown action column
                    return `
                        <td class="dropdown"  >
                            <button class="dropdown-toggle btn btn-light border" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Actions
                            </button>
                            <div class="dropdown-menu">
                                ${(xacNhanValue == '0' )? '<a class="dropdown-item accept-trigger"><i class="fa fa-eye text-primary"></i> Xác Nhận</a>': ''  }
                                ${(xacNhanValue == '0' )? '<a class="dropdown-item deny-trigger"><i class="fa fa-edit text-primary"></i> Từ Chối/Xóa</a>': '' }
                                
                            </div>
                        </td>
                    `;
                }
            },
            { "data": "MANS","visible": false },
            { "data": "MAHSBN","visible": false },
            // Cập nhật các cột mới hoặc xoá các cột không cần thiết
        ],
        "columnDefs": [
            { "width": "9%", "targets": 0 },  // Chỉnh chiều rộng của cột 0 (ví dụ: MALH) là 5%
            { "width": "11%", "targets": 1 },
            { "width": "10%", "targets": 2 },
            { "width": "9%", "targets": 3 },
            { "width": "15%", "targets": 4 },
            { "width": "11%", "targets": 5 },
            { "width": "15%", "targets": 6 },
            { "width": "9%", "targets": 7 },
            { "width": "12%", "targets": 8 },
        ],
        "order": [
            [2, "desc"] 
        ],
        "deferRender": true,
        "search": {
            "return": true,
            "smart": true,
        },
        
        "initComplete": function () {
            var searchTable = this.api();
            var searchValues = [];
            var self = this;
            self.api().rows().every(function () {
                var malichhen = this.data().MALH;
                var manhasi = this.data().MANS;
                var mahsbn = this.data().MAHSBN;
                $(this.node()).find('.dropdown-menu').attr('data-malh', malichhen);
                $(this.node()).find('.dropdown-menu').attr('data-mans', manhasi);
                $(this.node()).find('.dropdown-menu').attr('data-mahsbn', mahsbn);

            });   
            searchTable.on('draw', function () {
                self.api().rows().every(function () {
                    var malichhen = this.data().MALH;
                    var manhasi = this.data().MANS;
                    var mahsbn = this.data().MAHSBN;
                    $(this.node()).find('.dropdown-menu').attr('data-malh', malichhen);
                    $(this.node()).find('.dropdown-menu').attr('data-mans', manhasi);
                    $(this.node()).find('.dropdown-menu').attr('data-mahsbn', mahsbn);
                });
            });
            
            searchTable.columns().every(function (index) {
                var column = this;
                if (column.dataSrc() === 'XACNHAN') {
                    var select = $('<select><option value="">Tất cả</option><option value="1">Đã xác nhận</option><option value="0">Chờ xác nhận</option><option value="2">Đã hẹn</option></select>')
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var value = $(this).val();
                            searchValues[index] = value;
                            search();
                        });
                    }  
                else if ( column.dataSrc() === 'MATAIKHAM') {
                    var select = $('<select><option value="">Tất cả</option><option value="1">Không</option><option value="0">Có</option></select>')
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var value = $(this).val();
                            searchValues[index] = value;
                            search();
                        });
                }    
                else if ( column.dataSrc() != null ) {
                var input = $('<input type="text" placeholder="Tìm kiếm" />')
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
                });}
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
    $('#dataTable').on('click', '.accept-trigger', function() {
        // var hsbn = table.row(this).data()
        var malh = $(this).closest('.dropdown-menu').data('malh');
        //var malh = $(this).data('malh');
        $.ajax({
            type: 'POST',
            url: '/accept-lichhen',
            contentType: 'application/json',
            data: JSON.stringify({ malh: malh }),
            success: function (response) {
                if (response === 'done') {
                    toastr.success('Xác nhận thành công. Chờ 2 giây để reload.');

                    // Reload trang sau 2 giây
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    toastr.error('Đã có lỗi xảy ra.');
                    // Xử lý thêm nếu cần
                }
            },
            error: function (error) {
                console.error('Lỗi:', error);
            }
        });
    });
    $('#dataTable').on('click', '.deny-trigger', function() {
        // var hsbn = table.row(this).data()
        // var malh = $(this).closest('.dropdown').data('malh');
        var malh = $(this).closest('.dropdown-menu').data('malh');
        $.ajax({
            type: 'POST',
            url: '/deny-lichhen',
            contentType: 'application/json',
            data: JSON.stringify({ malh: malh }),
            success: function (response) {
                if (response === 'done') {
                    toastr.success('Xác nhận thành công. Chờ 2 giây để reload.');

                    // Reload trang sau 2 giây
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    toastr.error('Đã có lỗi xảy ra.');
                    // Xử lý thêm nếu cần
                }
            },
            error: function (error) {
                console.error('Lỗi:', error);
            }
        });
    });
    $('#dataTable').on('click', '.edit-trigger', function() {
        var malh = $(this).closest('.dropdown-menu').data('malh');
        var mans = $(this).closest('.dropdown-menu').data('mans');
        var mahsbn = $(this).closest('.dropdown-menu').data('mahsbn');

        var url = `/updateLH?malh=${malh}&mans=${mans}&mahsbn=${mahsbn}`;
        window.open(url, '_blank');
    });
}); 
