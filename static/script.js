// Function to populate the due date dropdown
function populateDueDateDropdown(dropdownId, includeAllOption = false) {
    var dropdown = document.getElementById(dropdownId);
    var years = [2023, 2024, 2025, 2026];

    // Clear existing options
    dropdown.innerHTML = '';

    // Add 'All' option for the filter dropdown
    if (includeAllOption) {
        var allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All';
        dropdown.appendChild(allOption);
    }

    // Populate dropdown with new options
    years.forEach(function (year) {
        [0, 3, 5, 8].forEach(function (monthOffset) {
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
    $.ajax({
        type: "GET",
        url: "/fetchTaxRecords/" + dateText,
        success: function(result) {
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
                            <td name='record-amount'>${row.amount}</td>
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

    updateTaxTable();
}

function formatDate(dateStr) {
    if (dateStr !== null && dateStr !== undefined) {
        return new Date(dateStr).toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    }
    else {
        return "N/A"
    }
}

function updateTaxTable() {
    // Update total amount
    let elements = document.getElementsByName('record-amount');

    if (elements.length === 0) {
        document.getElementById("taxContainer").style.display = 'none';
    } else {
        let sum = 0;
        for (const e of elements) {
            sum += parseFloat(e.textContent);
        }
        document.getElementById("totalAmount").innerHTML = "$" + sum;
        document.getElementById("taxContainer").style.display = 'block';
    }

    calculateTaxDue();
}

function calculateTaxDue() {
    let totalAmount = parseFloat(document.getElementById("totalAmount").innerHTML.replace("$",""));
    let taxRate = parseFloat(document.getElementById("taxRate").value);

    if (!isNaN(totalAmount) && !isNaN(taxRate)) {
        let taxAmount = totalAmount * taxRate;
        taxAmount = (Math.round(taxAmount * 100) / 100).toFixed(2); // Round to two decimals
        document.getElementById("taxDue").innerHTML = "$" + taxAmount;
    }
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    populateDueDateDropdown('dueDate');
    populateDueDateDropdown('filterDueDate', true); // Include 'All' option for filter dropdown
    populateDueDateDropdown('updateDueDate');

    updateTaxTable();
});
