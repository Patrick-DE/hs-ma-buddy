var calendar;
var dialog;
var buddy_id;

r(function(){
    const urlParams = new URLSearchParams(window.location.search);
    buddy_id = urlParams.get('id');
    document.getElementById("buddy_id").value = buddy_id;
    getBuddy();

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
            fetchEvents("/buddy/"+buddy_id, _start, _end, timezone, callback);
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

function getBuddy(){
	$.getJSON(`/buddy/${buddy_id}`, function (profile) {
        //Fix for not own profile
        if(profile.buddy === undefined) profile.buddy = profile;

        $("#categories").empty();
        var catHTML = "";
        profile.categories.forEach(function(elem, index){
            catHTML += `<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-${elem._id}">
                            <input type="checkbox" id="checkbox-${elem._id}" name="categories" value="${elem._id}" class="mdl-checkbox__input">
                            <span class="mdl-checkbox__label">${elem.name}</span>
                        </label>`
        });
        document.getElementById("categories").insertAdjacentHTML("afterbegin", catHTML);

        $("#data").empty();
        var dataHTML = "";
        var headerLocked = ["fullname", "email"];
        headerLocked.forEach(function(elem, index){
            //generate all elements for edit /even if empty
            dataHTML += `<div class="mdl-textfield mdl-js-textfield mdl-textfield-buddy mdl-textfield--floating-label">
                            <input class="mdl-textfield__input" type="text" id="${elem}" name="${elem}" disabled>
                            <label class="mdl-textfield__label" for="${elem}">${elem}...*</label>
                        </div>`
        });
        var header = ["email2", "mobile", "available", "room", "away", "away_reason"];
        header.forEach(function(elem, index){
            //generate all elements for edit /even if empty
            dataHTML += `<div class="mdl-textfield mdl-js-textfield mdl-textfield-buddy mdl-textfield--floating-label">
                            <input class="mdl-textfield__input" type="text" id="${elem}" name="${elem}">
                            <label class="mdl-textfield__label" for="${elem}">${elem}...</label>
                        </div>`
        });
        document.getElementById("data").insertAdjacentHTML("afterbegin", dataHTML);

        //AutoInsert values
        var merged = headerLocked.concat(header);
        merged.forEach(function(elem, index){
            var cur = document.getElementById(elem);
            if(profile.buddy[elem] !== undefined) cur.value = profile.buddy[elem];
        });
        //Set category checkboxes
        var select = document.getElementById('category_id');
        profile.buddy["categories"].forEach(function(elem, index){
            //for profile
            document.getElementById("checkbox-"+elem._id).setAttribute("checked", true);
            //for appointment selection
            var opt = document.createElement('option');
            opt.value = elem._id;
            opt.innerHTML = elem.name;
            select.appendChild(opt);
        });

        $('#profileForm input').each(function(index, element){
            //lock for non owner
            if(!profile.own){
                element.setAttribute("disabled", true);
                if(element.value === undefined || element.value === "" || element.name === "id") element.parentElement.style.display = "none";
            }else{
                document.getElementById("submit").style.display = "block";
            }
            //mark as autofill dirty for proper label positioning
            if(element.value !== "") element.parentElement.className += " is-dirty";
        });
	}).fail(function (msg) {
        showError(msg);
    });
    
    return 
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

function updateBuddy(){
    $.ajax({
        url: '/buddy',
        type: 'PUT',
        data: $('#profileForm').serialize(),
        success: function(result) {
            getBuddy();
        },
        error: function(msg) {
            showError(msg);
        }
    });
}