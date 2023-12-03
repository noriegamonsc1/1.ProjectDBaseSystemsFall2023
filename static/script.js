// Function to populate the due date dropdown
function populateDueDateDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    var years = [2023, 2024, 2025, 2026];

    // Clear existing options
    dropdown.innerHTML = '';

    // Populate dropdown with new options
    years.forEach(function (year) {
        [0, 3, 5, 8].forEach(function (monthOffset) {
            // Get the due date for January, April, June, and September
            var dueDate = new Date(year, monthOffset, 15);

            var option = document.createElement('option');
            option.value = dueDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
            option.textContent = getFormattedDate(dueDate);
            dropdown.appendChild(option);
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

function updateDataTable() {   
    let dateText = $('#filterDueDate option:selected').val();
    // console.log("Changed filter dropdown! date: ", dateText);
    $.ajax({
        type: "GET",
        url: "/fetchTaxRecords/" + dateText,
        success: function(result) {
            // console.log("Ajax is success!! data: ", result);
            updateTable(result);
        }
    });
}

function updateTable(tableData) {
    const tableBody = document.getElementById('recordsTableBody');
    let tableContent = '';
    tableData.forEach((row) => {
        tableContent += `<tr>
                            <td>${row._company}</td>
                            <td>${row.amount}</td>
                            <td>${formatDate(row.payment_date)}</td>
                            <td>${row.status}</td>
                            <td>${formatDate(row.due_date)}</td>
                            <td>
                                <button type="button" class="btn btn-primary" onclick="showUpdateModal('${row.tax_id}', '${row._company}', '${row.amount}', '${formatDate(row.payment_date)}', '${row.status}', '${formatDate(row.due_date)}')">Update</button>
                                <button type="button" class="btn btn-danger" onclick="confirmDelete('${row.tax_id}')">Delete</button>    
                            </td>
                        </tr>`;
    });
    tableBody.innerHTML = tableContent;
}

function formatDate(dateStr) {
    if (dateStr !== null && dateStr !== undefined) {
        return new Date(dateStr).toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    }
    else {
        return "N/A"
    }
}



// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Call the function to populate the due date dropdown
    populateDueDateDropdown('dueDate');
    populateDueDateDropdown('filterDueDate');
    populateDueDateDropdown('updateDueDate');

    // Add more event listeners if needed
});
