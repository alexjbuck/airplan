var tabular = new Object;

tabular.draw = function(){
    var sorties = {};//sorties.data;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Sortie List</h3>";
    html += "<button class='btn btn-primary mb-2' onclick='sorties.add()'>Add Sortie</button>";
    html += "<table class='table table-striped table-bordered table-condensed'>";
    html += "<thead><tr><th>Sqdrn</th><th>Cycle</th><th>Num</th><th>Off</th><th>On</th></tr></thead>";
    html += "<tbody>";
    for(var i in sorties){
        html += "<tr>";
        html += "<td>"+sorties[i].sqdrn+"</td>";
        html += "<td>"+sorties[i].cycle+"</td>";
        html += "<td>"+sorties[i].num+"</td>";
        html += "<td>"+sorties[i].off+"</td>";
        html += "<td>"+sorties[i].on+"</td>";
        html += "<td><button class='btn btn-secondary' onclick='sorties.edit("+i+")'>Edit</button></td>";
        html += "</tr>";
    }
    html += "</tbody>";

    $("#tabular").html(html);

}