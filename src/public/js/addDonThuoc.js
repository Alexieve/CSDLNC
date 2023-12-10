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
	divtest.setAttribute("class", "form-group removeclass"+room);
	var rdiv = 'removeclass'+room;
    divtest.innerHTML = '<div class="col-sm-12 row"><div class="col-sm-5 form-group"><label for="MATHUOC">Chọn thuốc</label><input type="text" class="form-control flexdatalist" name="MATHUOC[]" id="MATHUOC' + room + '" placeholder="Chọn thuốc" required></div><div class="col-sm-5 form-group"><label for="SOLUONG">Số lượng</label><input type="number" class="form-control flexdatalist" id="SOLUONG' + room + '" name="SOLUONG[]" min="1" max="1000" required></div><div class="col-sm-2 input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_education_fields(' + room + ');"> <span class="fa fa-times" aria-hidden="true"></span></button></div></div></div><div class="clear"></div>';

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