// Function to populate the due date dropdown
function populateDueDateDropdown() {
    var dropdown = document.getElementById('dueDate');
    var futureYears = [2024, 2025, 2026];

    // Clear existing options
    dropdown.innerHTML = '';

    // Populate dropdown with new options
    futureYears.forEach(function (year) {
        [0, 3, 5, 8].forEach(function (monthOffset) {
            // Get the due date for January, April, June, and September
            var dueDate = new Date(year, monthOffset, 15);

            // Check if the due date is after the current date
            if (dueDate > new Date() && dueDate.getMonth() !== 11) {
                var option = document.createElement('option');
                option.value = dueDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                option.textContent = getFormattedDate(dueDate);
                dropdown.appendChild(option);
            }
        });
    });
}

// Function to format the date as 'MMMM DD, YYYY'
function getFormattedDate(date) {
    var options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Function to show the update modal with pre-filled data
function showUpdateModal(recordId, company, amount, paymentDate, status, dueDate) {
    // Fill the modal with existing data
    $('#updateId').val(recordId);
    $('#updateCompany').val(company);
    $('#updateAmount').val(amount);
    $('#updatePaymentDate').val(paymentDate);
    $('#updateStatus').val(status);
    $('#updateDueDate').val(dueDate);

    // Show the modal
    $('#updateModal').modal('show');
}

// Function to submit the updated data
function submitUpdate() {
    // Update action URL with the record ID
    var actionUrl = '/update/' + $('#updateId').val();
    $('#updateForm').attr('action', actionUrl);

    // Submit the form in the modal
    $('#updateForm').submit();
}

// Function to confirm and handle record deletion
function confirmDelete(taxId) {
    if (confirm("Are you sure you want to delete this record?")) {
        // If the user confirms, submit the delete form
        
        // Update action URL to DELETE with the record ID
        var actionUrl = '/delete/' + taxId;
        $('#updateForm').attr('action', actionUrl);

        // Submit the form in the modal
        $('#updateForm').submit();
    } else {
        // If the user cancels, do nothing
        return false;
    }
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Call the function to populate the due date dropdown
    populateDueDateDropdown();

    // Add more event listeners if needed
});
