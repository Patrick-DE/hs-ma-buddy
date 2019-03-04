var calendar;
var dialog;

$(function() {
// page is now ready, initialize the calendar...
    $('#agenda').fullCalendar({
        defaultView: 'listWeek',
        locale: 'de',
        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
            listDay: { buttonText: 'Tag' },
            listWeek: { buttonText: 'Woche' },
            listMonth: { buttonText: 'Monat' }
        },
        
        header: {
            left: 'title',
            center: '',
            right: 'listDay,listWeek,listMonth'
        },
        /*events: "/appointment",*/
        events: function(_start, _end, timezone, callback) {
            fetchEvents("/own", _start, _end, timezone, callback);
        },
        eventMouseover: function(event, jsEvent, view) {
            $('.fc-list-item-title', this).append(`<a id="${event.id}" style="float: right" onclick="deleteAppointment('${event.id}')">|Löschen</a>`);
            $('.fc-list-item-title', this).append(`<a id="${event.id}-e" style="float: right" onclick="editAppointment('${event._id}')">Ändern</a>`);
        },
        eventMouseout: function(event, jsEvent, view) {
            calendarMouseout(event, jsEvent, view);
            $('#'+event.id+"-e").remove();
        },
    });
    
    // a convenient utility for getting the calendar object.
    // you can call methods on the calendar object directly.
    calendar = $('#agenda').fullCalendar('getCalendar');

    //REGISTER DIALOG
    dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
    });
    dialog.querySelector('.send').addEventListener('click', function() {
        submitAppointment();
    });
});

function deleteAppointment(id){
    var ok = confirm("Wollen Sie den Termin wirklich löschen!");
    if (ok == true) {
        $.ajax({
            url: '/appointment/'+id,
            type: 'DELETE',
            success: function(result) {
                $('#agenda').fullCalendar('refetchEvents');
            },
            error: function(msg) {
                showError(msg);
            }
        });
    }
}

function editAppointment(id){
    var event = $('#agenda').fullCalendar( 'clientEvents' , id);
    document.getElementById("date").value = event[0].start.format("DD-MM-YYYY");
    document.getElementById("start").value = event[0].start.format("HH:MM");
    document.getElementById("end").value = event[0].end.format("HH:MM");
    document.getElementById("description").value = event[0].desc;
    document.getElementById("urgency").value = event[0].urgency;
    document.getElementById("category").value = event[0].category;
    $('input').each(function(index, element){
        if(element.value !== "") element.parentElement.className += " is-dirty";
    });
    dialog.showModal();
}
function sendEditAppointment(id){
    $.ajax({
        url: '/appointment/'+id,
        type: 'PUT',
        success: function(result) {
            $('#agenda').fullCalendar('refetchEvents');
        },
        error: function(msg) {
            showError(msg);
        }
    });
}