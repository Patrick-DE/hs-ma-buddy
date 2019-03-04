var calendar;

r(function() {
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
            fetchEvents(_start, _end, timezone, callback);
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
    calendar = $('#agenda').fullCalendar('getCalendar');
});