document.addEventListener('DOMContentLoaded', function () {
    populateDueDateDropdown();

    document.getElementById('taxForm').addEventListener('submit', function (e) {
        e.preventDefault
