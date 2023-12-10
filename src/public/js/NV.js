// Display modal hiển thị thông tin
$(document).ready(function () {
    // Handle click event on elements with the 'view-trigger' class
    $('table tbody').on('click', '.view-trigger', function() {
        // Extract data from the clicked row
        var nv = [];
        var row = $(this).closest('tr');
        row.find('td').each(function () {
            nv.push($(this).text());
        });

        // Display the clicked row's data in a modal
        $('#modalMANV').val(nv[0]);
        $('#modalHOTEN').val(nv[1]);
        $('#modalNGAYSINH').val(nv[2]);
        $('#modalGIOITINH').val(nv[3]);
        $('#modalSDT').val(nv[4]);
        $('#modalDIACHI').val(nv[5]);
        $('#modalEMAIL').val(nv[6]);
        $('#modalLOAITK').val(nv[7]);
        $('#modalLOAINV').val(nv[8]);

        // Trigger the modal to show
        $('#nvModal').modal('show');

        var formElements = document.querySelectorAll('#form_UpdateNV input, #form_UpdateNV select');

        // Loop through each element and add the disabled attribute
        formElements.forEach(function (element) {
            element.setAttribute('disabled', 'true');
        });

        var button = document.querySelector('.modal-footer').setAttribute('hidden', 'true');
    });
});

// Display modal cập nhật
$(document).ready(function () {
    // Handle click event on elements with the 'edit-trigger' class
    $('table tbody').on('click', '.edit-trigger', function() {
        // Extract data from the clicked row
        var nv = [];
        var row = $(this).closest('tr');
        row.find('td').each(function () {
            nv.push($(this).text());
        });

        // Display the clicked row's data in a modal
        $('#modalMANV').val(nv[0]);
        $('#modalHOTEN').val(nv[1]);
        $('#modalNGAYSINH').val(nv[2]);
        $('#modalGIOITINH').val(nv[3]);
        $('#modalSDT').val(nv[4]);
        $('#modalDIACHI').val(nv[5]);
        $('#modalEMAIL').val(nv[6]);
        $('#modalLOAITK').val(nv[7]);
        $('#modalLOAINV').val(nv[8]);

        // Trigger the modal to show
        $('#nvModal').modal('show');

        var formElements = document.querySelectorAll('#form_UpdateNV input, #form_UpdateNV select');

        // Loop through each element and remove the disabled attribute
        formElements.forEach(function (element) {
            element.removeAttribute('disabled');
        });

        var button = document.querySelector('.modal-footer').removeAttribute('hidden');
    });
});

var form = $('#form_UpdateNV');
function submitForm() {
    var isValid = true;
    // Loop through all fields in the form
    form.find('input, select').each(function() {
        var fieldValue = $(this).val();
        // Check if the value is empty
        if (fieldValue.trim() === '') {
            // Display a message or perform other actions if needed
            isValid = false; // Set isValid variable to false
            return false; // Stop the loop if at least one field is empty
        }
    });
    if (isValid) {
        var data = form.serialize();
        $.ajax({
            type: "POST",
            url: "/updateNV",
            data: data,
            success: function (msg) {
                $.toast({
                    heading: 'Cập nhật Nhân Viên thành công',
                    icon: 'success',
                    showHideTransition: 'slide',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: false,
                    position: 'top-left',
                    textAlign: 'left',
                    loader: true,
                    loaderBg: '#9EC600',
                });
                setTimeout(() => {
                    location.reload();
                }, 1000);
            },
            error: function (error) {
                $.toast({
                    heading: `${error.responseJSON.error}`,
                    icon: 'error',
                    showHideTransition: 'slide',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: false,
                    position: 'top-left',
                    textAlign: 'left',
                    loader: true,
                    loaderBg: '#9EC600',
                });
            }
        });
    }
    else {
        $.toast({
            heading: 'Vui lòng điền đầy đủ thông tin',
            icon: 'warning',
            showHideTransition: 'slide',
            allowToastClose: true,
            hideAfter: 3000,
            stack: false,
            position: 'top-left',
            textAlign: 'left',
            loader: true,
            loaderBg: '#9EC600',
        });
    }
}
