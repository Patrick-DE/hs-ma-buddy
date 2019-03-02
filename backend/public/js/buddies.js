function getBuddies(){
	$.getJSON('buddy/', function (profile) {
        $("content-grid").empty();
        var header = ["fullname", "mobile", "email", "email2", "room", "away", "away_reason", "categories"];
        var formContent = "";
        profile.forEach(function(obj, index){
            formContent += '<div class="mdl-cell">';
            formContent += '<div class="demo-card-wide mdl-card mdl-shadow--2dp">';
            formContent += '<div class="mdl-card__title">';
            header.forEach(function(key, index){
                if(key === "fullname") formContent += `<h2 class="mdl-card__title-text">${obj[key]}</h2></div><div class="mdl-card__supporting-text">`;
                else if(key === "categories") formContent += `${key.toUpperCase()}: ${JSON.stringify(obj[key])} <br/>`;
                else if(obj[key] !== undefined) formContent += `${key.toUpperCase()}: ${obj[key]} <br/>`;
            });
            formContent += `</div><div class="mdl-card__actions mdl-card--border">`;
            formContent += `<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/detail.html?id=${obj["id"]}">Termin ausmachen</a>`;
            formContent += `</div></div></div>`;
        });
		document.getElementsByClassName("content-grid")[0].insertAdjacentHTML("afterbegin",formContent);
	}).fail(function (msg) {
		showError(msg);
	});
}

getBuddies();