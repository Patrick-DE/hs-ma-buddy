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
            var _anticache = Math.floor((Math.random() * 1000000) + 1);
            $.getJSON('/appointment', {start: _start.format('YYYY-MM-DD'), end: _end.format('YYYY-MM-DD'), _: _anticache}, function (doc) {
                var events = [];
                $(doc).find('event').each(function() {
                    events.push({
                        title: $(this).attr('title'),
                        start: $(this).attr('start') // will be parsed
                    });
                });
                callback(events);
            }).fail(function(msg){
                showError(msg);
            });
        },
    });

    // a convenient utility for getting the calendar object.
    // you can call methods on the calendar object directly.
    calendar = $('#agenda').fullCalendar('getCalendar');
});