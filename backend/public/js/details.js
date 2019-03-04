var calendar;
var dialog;

r(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const buddy_id = urlParams.get('id');
    document.getElementById("buddy_id").value = buddy_id;
    getBuddy(buddy_id);

    $('#calendar').fullCalendar({
        defaultView: 'month',
        weekends: false, // will hide Saturdays and Sundays
        header: {
            // buttons for switching between views
            center: 'month,agendaWeek,agendaDay'
        },
        locale: 'de',
        nowIndicator: true,
        minTime: "08:00:00",
        maxTime: "19:00:00",
        weekNumbers: true,
        weekNumbersWithinDays:true,
        navLinks: true,
        selectOverlap: false,
        validRange: {
            start: moment().format("YYYY-MM-DD"),
            end: moment().add(2,'month').format("YYYY-MM-DD")
        },
        eventLimit: true, // allow "more" link when too many events
        dayClick: function(date) {
            document.getElementById("date").value = date.format("DD-MM-YYYY");
            document.getElementById("start").value = date.format("hh:mm");
            document.getElementById("end").value = date.add(30,'minutes').format("hh:mm");
            $('input').each(function(index, element){
                if(element.value !== "") element.parentElement.className += " is-dirty";
            });
            dialog.showModal();
        },
        //events: 'https://fullcalendar.io/demo-events.json'
        events: function(_start, _end, timezone, callback) {
            fetchEvents("buddy/"+buddy_id, _start, _end, timezone, callback);
        },
        eventMouseover: function(event, jsEvent, view) {
            $('.fc-content', this).append(calendarMouseoverText(event));
        },
        eventMouseout: function(event, jsEvent, view) {
            calendarMouseout(event, jsEvent, view);
        },
    });

    // a convenient utility for getting the calendar object.
    // you can call methods on the calendar object directly.
    calendar = $('#calendar').fullCalendar('getCalendar');

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
    
    /*$.getScript("https://cdn.rawgit.com/kybarg/mdl-selectfield/mdl-menu-implementation/mdl-selectfield.min.js", function() {
        //BREAKS
        //componentHandler.upgradeElements();
        alert("Script loaded but not necessarily executed.");
     });*/
});

function getBuddy(id){
	$.getJSON(`buddy/${id}`, function (profile) {
        $("content-grid").empty();
        var select = document.getElementById('category_id');
        var header = ["fullname", "mobile", "email", "email2", "available", "room", "away", "away_reason", "categories"];
        
        var formContent = '<div class="mdl-cell" id="solo-card">';
        formContent += '<div class="demo-card-wide mdl-card mdl-shadow--2dp">';
        formContent += '<div class="mdl-card__title">';
        header.forEach(function(key, index){
            if(key === "fullname") formContent += `<h2 class="mdl-card__title-text">${profile[key]}</h2></div><div class="mdl-card__supporting-text">`;
            else if(key === "categories"){ 
                formContent += `${key.toUpperCase()}: `;
                profile[key].forEach(function(elem, index){
                    formContent += `${profile[key][index].name}, `;
                    var opt = document.createElement('option');
                    opt.value = profile[key][index]._id;
                    opt.innerHTML = profile[key][index].name;
                    select.appendChild(opt);
                });
            }
            else if(profile[key] !== undefined) formContent += `${key.toUpperCase()}: ${profile[key]} <br/>`;
        });
        formContent += `</div></div></div>`;
        document.getElementsByClassName("content-grid")[0].insertAdjacentHTML("afterbegin",formContent);
	}).fail(function (msg) {
        showError(msg);
	});
}

function submitAppointment(){
    $.ajax({
        url: '/appointment',
        type: 'POST',
        data: $('#appointmentForm').serialize(),
        success: function(result) {
            $('#calendar').fullCalendar('refetchEvents');
            dialog.close();
        },
        error: function(msg) {
            showError(msg);
        }
    });
}