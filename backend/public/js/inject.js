var error_element = `<div id="error-toast" class="mdl-js-snackbar mdl-snackbar">
                            <div class="mdl-snackbar__text"></div>
                            <button class="mdl-snackbar__action" type="button"></button>
                        </div>`;
var navigation = `<div class="android-header mdl-layout__header mdl-layout__header--waterfall">
                        <div class="mdl-layout__header-row">
                          <span class="android-title mdl-layout-title">
                            <img class="android-logo-image" src="img/logo.png">
                          </span>
                          <!-- Add spacer, to align navigation to the right in desktop -->
                          <div class="android-header-spacer mdl-layout-spacer"></div>
                          <!-- Navigation -->
                          <div class="android-navigation-container">
                            <nav class="android-navigation mdl-navigation">
                              <a class="mdl-navigation__link mdl-typography--text-uppercase" href="/dashboard.html">Dashboard</a>
                              <a class="mdl-navigation__link mdl-typography--text-uppercase" href="/buddies.html">Buddies</a>
                              <a class="mdl-navigation__link mdl-typography--text-uppercase" href="/calendar.html">Kalender</a>
                              <a class="mdl-navigation__link mdl-typography--text-uppercase" href="/contact.html">Kontakt</a>
                            </nav>
                          </div>
                          <span class="android-mobile-title mdl-layout-title">
                            <img class="android-logo-image" src="img/logo.png">
                          </span>
                        </div>
                    </div>
                
                    <div class="android-drawer mdl-layout__drawer">
                        <span class="mdl-layout-title">
                          <img class="android-logo-image" src="img/logo-white.png">
                        </span>
                        <nav class="mdl-navigation">
                           <a class="mdl-navigation__link" href="/dashboard.html">Dashboard</a>
                           <a class="mdl-navigation__link" href="/buddies.html">Buddies</a>
                           <a class="mdl-navigation__link" href="/calendar.html">Kalender</a>
                           <a class="mdl-navigation__link" href="/contact.html">Kontakt</a>
                        </nav>
                    </div>`;
var footer = `<div class="mdl-mega-footer--top-section">
                    <div class="mdl-mega-footer--left-section">
                      <button class="mdl-mega-footer--social-btn"></button>
                      &nbsp;
                      <button class="mdl-mega-footer--social-btn"></button>
                      &nbsp;
                      <button class="mdl-mega-footer--social-btn"></button>
                    </div>
                    <div class="mdl-mega-footer--right-section">
                      <a class="mdl-typography--font-light" href="#top">
                        Back to Top
                        <i class="material-icons">expand_less</i>
                      </a>
                    </div>
                  </div>
        
                  <div class="mdl-mega-footer--middle-section">
                    <p class="mdl-typography--font-light">© 2019 Patrick Eisenschmidt</p>
                    <p class="mdl-typography--font-light">Might be working, might be buggy. But always remember it's a feature not a bug!</p>
                  </div>
        
                  <div class="mdl-mega-footer--bottom-section">
                    <a class="android-link mdl-typography--font-light" href="https://secdud.es">Blog</a>
                    <a class="android-link mdl-typography--font-light" href="https://www.linkedin.com/in/patrick-eisenschmidt-bb644616a/">Author</a>
                    <a class="android-link mdl-typography--font-light" href="">Privacy Policy</a>
                  </div>`;
                  
/*
* inject error elements
*/
$(function() {
    document.getElementById("footer").insertAdjacentHTML("beforebegin",error_element);
    document.getElementById("nav").insertAdjacentHTML("afterbegin",navigation);
    document.getElementById("footer").insertAdjacentHTML("afterbegin",footer);
});


/*
* call showError(msg); and you are done!
*/
function showError(msg){
    var error;
    if (msg.responseJSON !== undefined && msg.responseJSON.err !== undefined){
      error = msg.responseJSON.err;
      if(error.includes("token")) window.location.href = "/";
      //if(error.includes("token")) window.location.href = "https://moodle.hs-mannheim.de/course/view.php?id=2662";
    }else{
      error = msg.statusText;
    }

    window['counter'] = 0;
    var data = {message: error + ' # ' + ++counter};
    document.querySelector('#error-toast').MaterialSnackbar.showSnackbar(data);
}

/*
* Functions for all fullcalendar applications
*/
function fetchEvents(path, _start, _end, timezone, callback){
  var _anticache = Math.floor((Math.random() * 1000000) + 1);
  $.getJSON('/appointment'+path, {start: _start.format('YYYY-MM-DD'), end: _end.format('YYYY-MM-DD'), _: _anticache}, function (doc) {
      var events = [];
      $(doc).each(function() {
        // will be parsed
        events.push({
            title: $(this).attr('title'),
            start: moment($(this).attr('start')).format("YYYY-MM-DD HH:mm"),
            end: moment($(this).attr('end')).format("YYYY-MM-DD HH:mm"),
            id: $(this).attr('_id'),
            category: $(this).attr('category_id').name,
            desc: $(this).attr('description'),
            urgency: $(this).attr('urgency'),
            overlap: $(this).attr('overlap'),
            editable: $(this).attr('editable'),
            buddy_id: $(this).attr('buddy_id')
        });
      });
      callback(events);
  }).fail(function(msg){
      showError(msg);
  });
}

function calendarMouseoverText(event){
  return `<div id="${event.id}" class="hover-end">${event.start.format('HH:mm')}-${event.end.format('HH:mm')}<br/>${event.category}<br/>${event.buddy_id.fullname}</div>`;
}

function calendarMouseout(event, jsEvent, view){
  $('#'+event.id).remove();
}


/*
* For proper injection timing (displaying error)
*/
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}