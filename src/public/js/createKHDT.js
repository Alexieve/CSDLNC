var listHSBN = JSON.parse(document.getElementById('listHSBNjson').dataset.list)
$('#MAHSBN').flexdatalist({
    minLength: 1,
    textProperty: '{MAHSBN} - {HOTENBN} - {SDTBN}',
    valueProperty: 'MAHSBN',
    selectionRequired: true,
    visibleProperties: ["MAHSBN","HOTENBN", "SDTBN"],
    searchIn: 'MAHSBN',
    data: listHSBN
});
var NhaSi = JSON.parse(document.getElementById('NhaSijson').dataset.list)
$('#MANS').flexdatalist({
    minLength: 1,
    textProperty: '{MANS} - {HOTEN}',
    valueProperty: 'MANS',
    selectionRequired: true,
    visibleProperties: ["MACN","HOTEN"],
    searchIn: 'MANS',
    data: NhaSi
});
$('#MANSKP').flexdatalist({
    minLength: 1,
    textProperty: '{MANS} - {HOTEN}',
    valueProperty: 'MANS',
    selectionRequired: true,
    visibleProperties: ["MACN","HOTEN"],
    searchIn: 'MANS',
    data: NhaSi
});
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    submitForm();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}
var room = 1;
function education_fields() {
 
    room++;
    var objTo = document.getElementById('education_fields')
    var divtest = document.createElement("div");
	  divtest.setAttribute("class", "form-group removeclass"+room);
	  var rdiv = 'removeclass'+room;
    divtest.innerHTML = '<div class="row"><div class="col-sm-4 form-group"><label for="RANG">Răng điều trị</label><select id="RANG" name="RANG[]" class="form-control browser-default custom-select"><option value="1">Răng cửa 1 (Răng số 1)</option><option value="2">Răng cửa 2 (Răng số 2)</option><option value="3">Răng nanh (Răng số 3)</option><option value="4">Răng hàm nhỏ 1 (Răng số 4)</option><option value="5">Răng hàm nhỏ 2 (Răng số 5)</option><option value="6">Răng hàm lớn (Răng số 6)</option><option value="7">Răng hàm lớn (Răng số 7)</option><option value="8">Răng hàm lớn (Răng số 8)</option></select></div><div class="col-sm-4 form-group"><label for="BEMATRANG">Bề mặt điều trị</label><select id="BEMATRANG" name="BEMATRANG[]" class="form-control browser-default custom-select"><option value="1">Mặt trong (Lingual - L)</option><option value="2">Mặt ngoài (Facial - F)</option><option value="3">Mặt xa (Distal - D)</option><option value="4">Mặt gần (Mesial - M)</option><option value="5">Mặt đỉnh (Top - T)</option><option value="6">Mặt chân răng (Root - R)</option></select></div><div class="input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_education_fields('+ room +');"> <span class="fa fa-times" aria-hidden="true"></span></button></div></div></div><div class="clear"></div>';
    
    objTo.appendChild(divtest)
}
   function remove_education_fields(rid) {
	   $('.removeclass'+rid).remove();
   }
   var form = $('#regForm');
   function submitForm() {
       var data = form.serialize();
       $.ajax({
           type: "POST",
           url: "/createKHDT",
           data: data,
           success: function (msg) {
               // console.log(msg);
               $.toast({
                   heading: 'Tạo kế hoạch điều trị thành công', // Optional heading to be shown on the toast
                   icon: 'success', // Type of toast icon
                   showHideTransition: 'slide', // fade, slide or plain
                   allowToastClose: true, // Boolean value true or false
                   hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                   stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                   position: 'top-left', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                   textAlign: 'left',  // Text alignment i.e. left, right or center
                   loader: true,  // Whether to show loader or not. True by default
                   loaderBg: '#9EC600',  // Background color of the toast loader
               });
               location.reload();
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
               currentTab = 1;
               showTab(currentTab);
               document.getElementById("all-steps").style.display = "block";
               document.getElementById("nextprevious").style.display = "block";
           }
       });
   }
   