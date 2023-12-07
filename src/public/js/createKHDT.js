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
    document.getElementById("regForm").submit();
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
// Function to create RANG and BEMATRANG fields
// function createDynamicFields() {
//     // Create elements for RANG
//     const rangDiv = document.createElement('div');
//     rangDiv.classList.add('col-sm-4', 'form-group');
  
//     const rangLabel = document.createElement('label');
//     rangLabel.setAttribute('for', 'RANG');
//     rangLabel.textContent = 'Loại điều trị';
  
//     const rangSelect = document.createElement('select');
//     rangSelect.setAttribute('id', 'RANG');
//     rangSelect.setAttribute('name', 'RANG');
//     rangSelect.classList.add('form-control', 'browser-default', 'custom-select');
  
//     // Replace 'RangOptions' with the array containing options for RANG
//     const RangOptions = [
//       { MARANG: '1', TENRANG: 'Răng cửa 1 (Răng số 1)' },
//       { MARANG: '2', TENRANG: 'Răng cửa 2 (Răng số 2)' },
//       { MARANG: '3', TENRANG: 'Răng nanh (Răng số 3)' },
//       { MARANG: '4', TENRANG: 'Răng hàm nhỏ 1 (Răng số 4)' },
//       { MARANG: '5', TENRANG: 'Răng hàm nhỏ 2 (Răng số 5)' },
//       { MARANG: '6', TENRANG: 'Răng hàm lớn (Răng số 6)' },
//       { MARANG: '7', TENRANG: 'Răng hàm lớn (Răng số 7)' },
//       { MARANG: '8', TENRANG: 'Răng hàm lớn (Răng số 8)' }
//       // Add more options as needed
//     ];
  
//     RangOptions.forEach((option) => {
//       const opt = document.createElement('option');
//       opt.value = option.MARANG;
//       opt.textContent = option.TENRANG;
//       rangSelect.appendChild(opt);
//     });
  
//     rangDiv.appendChild(rangLabel);
//     rangDiv.appendChild(rangSelect);
  
//     // Create elements for BEMATRANG (similar to RANG)
//     const bematRangDiv = document.createElement('div');
//     bematRangDiv.classList.add('col-sm-4', 'form-group');
  
//     const bematRangLabel = document.createElement('label');
//     bematRangLabel.setAttribute('for', 'BEMATRANG');
//     bematRangLabel.textContent = 'Loại điều trị';
  
//     const bematRangSelect = document.createElement('select');
//     bematRangSelect.setAttribute('id', 'BEMATRANG');
//     bematRangSelect.setAttribute('name', 'BEMATRANG');
//     bematRangSelect.classList.add('form-control', 'browser-default', 'custom-select');
  
//     // Replace 'BematRangOptions' with the array containing options for BEMATRANG
//     const BematRangOptions = [
//       { MABEMATRANG: '1', TENBEMATRANG: 'Mặt trong (Lingual - L):' },
//       { MABEMATRANG: '2', TENBEMATRANG: 'Mặt ngoài (Facial - F)' },
//       { MABEMATRANG: '3', TENBEMATRANG: 'Mặt xa (Distal - D)' },
//       { MABEMATRANG: '4', TENBEMATRANG: 'Mặt gần (Mesial - M)' },
//       { MABEMATRANG: '5', TENBEMATRANG: 'Mặt đỉnh (Top - T)' },
//       { MABEMATRANG: '6', TENBEMATRANG: 'Mặt chân răng (Root - R)' },
//       // Add more options as needed
//     ];
  
//     BematRangOptions.forEach((option) => {
//       const opt = document.createElement('option');
//       opt.value = option.MABEMATRANG;
//       opt.textContent = option.TENBEMATRANG;
//       bematRangSelect.appendChild(opt);
//     });
  
//     bematRangDiv.appendChild(bematRangLabel);
//     bematRangDiv.appendChild(bematRangSelect);
  
//     // Append the dynamic fields to the row
//     const row = document.querySelector('.tab .row');
//     row.appendChild(rangDiv);
//     row.appendChild(bematRangDiv);
//     const removeButton = document.createElement('button');
//     removeButton.textContent = 'Remove'; // Change the text or icon as needed
//     removeButton.addEventListener('click', function() {
//       row.removeChild(rangDiv);
//       row.removeChild(bematRangDiv);
//       row.removeChild(removeButton);
//     });
  
//     row.appendChild(removeButton);   
//   }
  
//   // Event listener for the plus button
//   document.getElementById('addDynamicFields').addEventListener('click', function() {
//     // Call the function to create dynamic fields when the icon is clicked
//     createDynamicFields();
//   });
function addField() {
  var dynamicFieldsContainer = document.getElementById("dynamicFieldsContainer");
  
  // Tạo một div mới để chứa các trường đầu vào động
  var newInputContainer = document.createElement("div");
  newInputContainer.classList.add("col-sm-4", "form-group");
  
  // Tạo một trường select mới cho RANG
  var newRangSelect = document.createElement("select");
  newRangSelect.classList.add("form-control", "browser-default", "custom-select");
  newRangSelect.setAttribute("name", "RANG[]");
  
  // Thêm các option vào trường select RANG
  for (let i = 0; i < Rang.length; i++) {
    var newOption = document.createElement("option");
    newOption.setAttribute("value", Rang[i].MARANG);
    newOption.innerText = Rang[i].TENRANG;
    newRangSelect.appendChild(newOption);
  }
  
  // Thêm trường select RANG vào div mới
  newInputContainer.appendChild(newRangSelect);
  
  // Tạo một trường select mới cho BEMATRANG
  var newBeMatRangSelect = document.createElement("select");
  newBeMatRangSelect.classList.add("form-control", "browser-default", "custom-select");
  newBeMatRangSelect.setAttribute("name", "BEMATRANG[]");
  
  // Thêm các option vào trường select BEMATRANG
  for (let i = 0; i < BeMatRang.length; i++) {
    var newOption = document.createElement("option");
    newOption.setAttribute("value", BeMatRang[i].MABEMATRANG);
    newOption.innerText = BeMatRang[i].TENBEMATRANG;
    newBeMatRangSelect.appendChild(newOption);
  }
  
  // Thêm trường select BEMATRANG vào div mới
  newInputContainer.appendChild(newBeMatRangSelect);
  
  // Tạo nút "Xóa" và gắn sự kiện xóa trường
  var removeButton = document.createElement("button");
  removeButton.classList.add("btn", "btn-danger", "btn-sm", "removeField");
  removeButton.innerText = "Xóa";
  removeButton.addEventListener("click", function() {
    dynamicFieldsContainer.removeChild(newInputContainer);
  });
  newInputContainer.appendChild(removeButton);
  
  // Thêm div mới vào container chứa các trường đầu vào động
  dynamicFieldsContainer.appendChild(newInputContainer);
}

// Gắn sự kiện thêm trường khi nhấp vào nút "Thêm"
document.querySelector(".addField").addEventListener("click", addField);