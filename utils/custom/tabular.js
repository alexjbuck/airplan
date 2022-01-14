var tabular = new Object;

tabular.draw = function(){
    var events = sorties.data.events;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Sortie List</h3>";
    html += "<button class='btn btn-primary mb-2' onclick='sorties.add()'>Add Sortie</button>";
    html += "<table class='table table-striped table-bordered table-condensed'>";
    html += "<thead><tr><th>Sqdrn</th><th>Cycle</th><th>Num</th><th>Off</th><th>On</th></tr></thead>";
    html += "<tbody>";
    for(var i=0;i<events.squadrons.length;i++){
        var sqdrn = events.squadrons[i];
        for(var ii=0;ii<sqdrn.sorties.length;ii++){
            var sortie = sqdrn.sorties[ii];
            html += "<tr>";
            html += "<td>"+sqdrn.name+"</td>";
            html += "<td>"+sortie.startCycle+"</td>";
            html += "<td>"+(ii+1)+"</td>";
            html += "<td>"+sortie.start+"</td>";
            html += "<td>"+sortie.end+"</td>";
            html += "<td><button class='btn btn-secondary' onclick='sorties.edit("+i+")'>Edit</button></td>";
            html += "</tr>";
        }
    }
    html += "</tbody>";

    $("#tabular").html(html);
}