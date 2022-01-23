var menu = new Object

menu.draw = function() {
    var html = "<button id='refresh-stage' class='btn btn-primary mx-3' onclick='refresh()'>Refresh View</button>"
    html += "<label type='file' id='load' class='btn btn-primary my-0 mx-3'>Load Airplan <input type='file' id='filepath' hidden onchange='menu.load(event)'></label>"
    html += "<button id='save' class='btn btn-primary mx-3' onclick='menu.save()'>Save Airplan</button>"
    html += "<button id='print' class='btn btn-primary mx-3' onclick='menu.print()'>Print Airplan</button>"
    $('#menu').html(html)
}
menu.load = function(e) {
    console.log("Loaded airplan: "+e.target.files[0].name)
    let reader = new FileReader();
    reader.onload = function(e) {
        airplan = JSON.parse(reader.result)
        // convert all Date objects to Date objects
        airplan.data.date = new Date(airplan.data.date)
        airplan.data.header.slap.sunrise = new Date(airplan.data.header.slap.sunrise)
        airplan.data.header.slap.sunset = new Date(airplan.data.header.slap.sunset)
        airplan.data.header.slap.moonrise = new Date(airplan.data.header.slap.moonrise)
        airplan.data.header.slap.moonset = new Date(airplan.data.header.slap.moonset)
        airplan.data.header.time.flightquarters = new Date(airplan.data.header.time.flightquarters)
        airplan.data.header.time.heloquarters = new Date(airplan.data.header.time.heloquarters)
        Object.values(airplan.data.events.sorties).forEach((sortie) => {
            sortie.start = new Date(sortie.start)
            sortie.end = new Date(sortie.end)
        })
        Object.values(airplan.data.events.cycles).forEach((cycle) => {
            cycle.start = new Date(cycle.start)
            cycle.end = new Date(cycle.end)
        })
        refresh()
    }
    reader.readAsText(e.target.files[0])
}
menu.save = function() {
    console.log("Save!")
    let file = new Blob([JSON.stringify(airplan)], {type: "application/json"})
    let url = URL.createObjectURL(file)
    let a = document.createElement('a')
    a.href = url
    a.id = "airplan-download"
    a.download = airplan.data.date.toYYYYMMDD()+".json"
    $('body').append(a)
    a.click()
    $('#airplan-download').remove()
}

menu.print = function() {
    let w = 11
    let h = 8.5
    let m = .01
    var pdf = new jspdf.jsPDF('l', 'in', [8.5, 11]);
    let imgData = g.stage.toDataURL({mimeType: 'image/png', quality: 1, pixelRatio: 3});
    pdf.addImage(imgData, 'JPEG', m*w/2, m*h/2, w*(1-m), h*(1-m), undefined, 'FAST');
    pdf.save('airplan_'+airplan.data.date.toYYYYMMDD()+'.pdf');
  }