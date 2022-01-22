var menu = new Object

menu.draw = function() {
    var html = "<button id='refresh-stage' class='btn btn-primary mx-3' onclick='refresh()'>Refresh View</button>"
    html += "<button id='load' class='btn btn-primary mx-3' onclick='menu.load()'>Load Airplan</button>"
    html += "<button id='save' class='btn btn-primary mx-3' onclick='menu.save()'>Save Airplan</button>"
    $('#menu').html(html)
}
menu.load = function() {
    console.log("Load!")
}
menu.save = function() {
    console.log("Save!")
}