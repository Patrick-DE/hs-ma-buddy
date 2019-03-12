var calendar;
var dialog;

$(function() {
// page is now ready, initialize the calendar...
    $('#agenda').fullCalendar({
        defaultView: 'listMonth',
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
            $('.fc-list-item-title', this).append(`<button id="${event.id}-d" data-tooltip="Delete" style="float: right" onclick="deleteAppointment('${event.id}')" class="mdl-button mdl-js-button mdl-button--icon">
                <i class="material-icons">delete</i>
            </button`);
            $('.fc-list-item-title', this).append(`<button id="${event.id}-e" data-tooltip="Edit" style="float: right" onclick="editAppointment('${event.id}')" class="mdl-button mdl-js-button mdl-button--icon">
                <i class="material-icons">edit</i>
            </button`);
            if(event.status === undefined){
                $('.fc-list-item-title', this).append(`<button id="${event.id}-d" data-tooltip="Accept" style="float: right" onclick="statusAppointment('${event.id}','false')" class="mdl-button mdl-js-button mdl-button--icon">
                    <i class="material-icons">block</i>
                </button`);
                $('.fc-list-item-title', this).append(`<button id="${event.id}-a" data-tooltip="Deny" style="float: right" onclick="statusAppointment('${event.id}','true')" class="mdl-button mdl-js-button mdl-button--icon">
                    <i class="material-icons">done</i>
                </button`);
            }
        },
        eventMouseout: function(event, jsEvent, view) {
            $('#'+event.id+"-d").remove();
            $('#'+event.id+"-e").remove();
            if(event.status === undefined){
                $('#'+event.id+"-d").remove();
                $('#'+event.id+"-a").remove();
            }
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
    document.getElementById("id").value = event[0].id;
    document.getElementById("title").value = event[0].title;
    document.getElementById("date").value = event[0].start.format("DD-MM-YYYY");
    document.getElementById("start").value = event[0].start.format("HH:mm");
    document.getElementById("end").value = event[0].end.format("HH:mm");
    document.getElementById("description").value = event[0].desc;
    $('#urgency').val(+event[0].urgency);
    document.getElementById("category").value = event[0].category;
    if(event[0].status !== undefined){
        $('input').each(function(index, element){
            element.disabled = true;
            if(element.value !== "") element.parentElement.className += " is-dirty";
        });
        document.getElementById("urgency").disabled=true;
        document.getElementsByClassName("send")[0].style.display="none";
        document.getElementById("instructions").innerHTML = `Der Termin wurde angenommen. Somit sind keine Änderungen mehr möglich!<br/>
                                                            Falls doch Änderungen gewünscht sind, lösche den Termin und erstellen einen neuen.`;
    }else{
        $('input').each(function(index, element){
            if(element.name !== "category") element.disabled = false;
            if(element.value !== "") element.parentElement.className += " is-dirty";
        });
        document.getElementById("urgency").disabled=false;
        document.getElementsByClassName("send")[0].style.display="block";
        document.getElementById("instructions").innerHTML = `Bitte geben Sie alle relevanten Daten für den Termin ein.<br/>
                                                            Alle notwendigen Informationen sind durch ein * gekennzeichnet.`;
    }
    document.getElementById("status").innerText = `Angenommen: ${(event[0].status === undefined) ? "Warten auf Bestätigung!" : event[0].status}`
    dialog.showModal();
}

function submitAppointment(){
    var id = document.getElementById("id").value;
    $.ajax({
        url: '/appointment/'+id,
        type: 'PUT',
        data: $('#appointmentForm').serialize(),
        success: function(result) {
            $('#agenda').fullCalendar('refetchEvents');
        },
        error: function(msg) {
            showError(msg);
        }
    });
}

function statusAppointment(id, _status){
    $.ajax({
        url: '/appointment/status/'+id,
        type: 'PUT',
        data: {status: _status},
        success: function(result) {
            $('#agenda').fullCalendar('refetchEvents');
        },
        error: function(msg) {
            showError(msg);
        }
    });
}