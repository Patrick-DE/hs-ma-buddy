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
        editable: false,
        eventLimit: true, // allow "more" link when too many events
        events: function(_start, _end, timezone, callback) {
            fetchEvents("/all", _start, _end, timezone, callback);
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
});
