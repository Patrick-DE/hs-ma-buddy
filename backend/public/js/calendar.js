var calendar;

$(function() {
// page is now ready, initialize the calendar...
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
            console.log(date);
            dialog.showModal();
        },
        events: 'https://fullcalendar.io/demo-events.json'
    });

    // a convenient utility for getting the calendar object.
    // you can call methods on the calendar object directly.
    calendar = $('#calendar').fullCalendar('getCalendar');

    //REGISTER DIALOG
    var dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
    });
});
