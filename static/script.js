// Function to populate the due date dropdown
function populateDueDateDropdown() {
    var dropdown = document.getElementById('dueDate');
    var currentYear = new Date().getFullYear();

    // Define the due dates
    var dates = [
        `April 15, ${currentYear}`,
        `June 15, ${currentYear}`,
        `September 15, ${currentYear}`,
        `January 15, ${currentYear + 1}` // January of the next year
    ];

    // Clear existing options
    dropdown.innerHTML = '';

    // Populate dropdown with new options
    dates.forEach(function(date) {
        var option = document.createElement('option');
        option.value = new Date(date).toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        option.textContent = date;
        dropdown.appendChild(option);
    });
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
        var deleteForm = document.getElementById(`deleteForm_${taxId}`);
        if (deleteForm) {
            deleteForm.submit();
        }
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
