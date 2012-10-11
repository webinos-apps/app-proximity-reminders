/* edit reminder */


function getEditPage(reminderId) {
    changeHeading(reminderId);
    getEditFields(reminderId);  
}


function changeHeading(reminderId) {
    var heading = $('#editHeading');
    if (reminderId === null) {
        heading.text("Add Reminder");
    } else {
        heading.text("Edit Reminder");    
    }
}

function saveReminder() {   
    alert("Submit!");
}


function getEditFields(reminderId) {

    var editTable = $("#editTable");

    $("#datepicker").datepicker();

    $("#saveReminderButton").click(saveReminder);
    
    
}




