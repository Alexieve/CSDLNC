$('#MATHUOC').flexdatalist({
    minLength: 1,
    textProperty: '{MATHUOC} - {TENTHUOC}',
    valueProperty: ["MATHUOC","TENTHUOC"],
    selectionRequired: true,
    visibleProperties: ["MATHUOC","TENTHUOC"],
    searchIn: 'MATHUOC',
    url: '/addDonThuoc/search/thuoc',
    relatives: '#relative'
});

var room = 0;
function education_fields() {
 
    room++;
    var objTo = document.getElementById('education_fields')
    var divtest = document.createElement("div");
	divtest.setAttribute("class", "form-group removeclass" + room);
	var rdiv = 'removeclass'+room;
    divtest.innerHTML = '<div class="col-sm-12 row"><div class="col-sm-5 form-group"><label for="MATHUOC">Chọn thuốc</label><input type="text" class="form-control" name="MATHUOC[]" id="MATHUOC' + room + '" placeholder="Chọn thuốc" required></div><div class="col-sm-5 form-group"><label for="SOLUONG">Số lượng</label><input type="number" class="form-control flexdatalist" id="SOLUONG' + room + '" name="SOLUONG[]" min="1" max="1000" required></div><div class="col-sm-2 input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_education_fields(' + room + ');"> <span class="fa fa-times" aria-hidden="true"></span></button></div></div></div><div class="clear"></div>';
    // divtest.innerHTML = '<div class="col-sm-12 row"><div class="col-sm-5 form-group"><label for="MATHUOC">Chọn thuốc</label><input type="text" class="form-control flexdatalist" name="MATHUOC[]" id="MATHUOC' + room + '"placeholder="Chọn thuốc" required></div><div class="col-sm-5 form-group"><label for="SOLUONG">Số lượng</label><input type="number" class="form-control" id="SOLUONG' + room +'"name="SOLUONG[]" min="1" max="100" required></div><div class="col-sm-2 input-group-btn"><button class="btn btn-danger" type="button" onclick="remove_education_fields('+ room +');"> <span class="fa fa-times" aria-hidden="true"></span></button></div><div class="clear"></div></div>';

    objTo.appendChild(divtest);
    $('#MATHUOC' + room).flexdatalist({
        minLength: 1,
        textProperty: '{MATHUOC} - {TENTHUOC}',
        valueProperty: ['MATHUOC', 'TENTHUOC'],
        selectionRequired: true,
        visibleProperties: ['MATHUOC', 'TENTHUOC'],
        searchIn: 'MATHUOC',
        url: '/addDonThuoc/search/thuoc',
        relatives: '#relative',
    });
}
   function remove_education_fields(rid) {
	   $('.removeclass'+rid).remove();
   } 

   var form = $('#form_DonThuoc');
   function submitForm(event) {
       event.preventDefault();
       var data = form.serialize();
       $.ajax({
           type: "POST",
           url: "/addDonThuoc",
           data: data,
           success: function (msg) {
               // console.log(msg);
               $.toast({
                   heading: 'Thêm đơn thuốc thành công', // Optional heading to be shown on the toast
                   icon: 'success', // Type of toast icon
                   showHideTransition: 'slide', // fade, slide or plain
                   allowToastClose: true, // Boolean value true or false
                   hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                   stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                   position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                   textAlign: 'left',  // Text alignment i.e. left, right or center
                   loader: true,  // Whether to show loader or not. True by default
                   loaderBg: '#9EC600',  // Background color of the toast loader
                   afterShown: function () { window.location.href = "/khdt";},
               });
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

