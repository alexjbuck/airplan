var tabular = new Object;

tabular.draw = () => {
    tabular.sorties.draw()
    tabular.cycles.draw()
}    

tabular.sorties = new Object;
tabular.sorties.draw = () => {
    var events = sorties.data.events;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Sortie List</h3>";
    html += "<button class='btn btn-primary mb-2' onclick='tabular.sorties.add()'>Add Sortie</button>";
    html += "<table class='table table-striped table-bordered table-condensed'>";
    html += "<thead><tr><th>Sqdrn</th><th>Launch</th><th>Type</th><th>Recovery</th><th>Type</th><th>Event #</th></tr></thead>";
    html += "<tbody>";
    events.squadrons.forEach((sqdrn, i) => {
        sqdrn.sorties.forEach((sortie, ii) => {
            html += "<tr>";
            html += "<td>"+sqdrn.name+"</td>";
            if(sortie.startCycle) {
                html += "<td>Cycle "+sortie.startCycle+"</td>";
                sortie.start = events.cycles.filter(c => c.id == sortie.startCycle).reduce(c=>c).start; // Finds the cycle with the matching id and returns its start time.
            } else {
                html += "<td>"+sortie.start+"</td>";
            }
            html += "<td>"+sortie.startCondition+"</td>";
            if(sortie.endCycle) {
                html += "<td>Cycle "+sortie.endCycle+"</td>";
                sortie.end = events.cycles.filter(c => c.id == sortie.endCycle).reduce(c=>c).end; // Finds the cycle with the matching id and returns its end time.
            } else {
                html += "<td>"+sortie.end+"</td>";
            }
            html += "<td>"+sortie.endCondition+"</td>";
            let cycle = sortie.startCycle ? sortie.startCycle : events.cycles.filter(c=> c.start <= sortie.start && c.end >= sortie.start).reduce(c=>c,{id:0}).id;
            html += "<td>"+cycle+(ii+1)+sqdrn.letter+"</td>";
            html += "<td><button class='btn btn-secondary' onclick='sorties.edit("+i+")'>Edit</button></td>";
            html += "</tr>";
        })
    })
    html += "</tbody>";
    $("#tabular-sorties").html(html);
}

tabular.cycles = new Object;
tabular.cycles.draw = () => {
    var cycles = sorties.data.events.cycles;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Cycle List</h3>";
    html += "<button class='btn btn-primary mb-2' onclick='tabular.cycles.add()'>Add Cycle</button>";
    html += "<table class='table table-striped table-bordered table-condensed'>";
    html += "<thead><tr><th>Cycle #</th><th>Start</th><th>End</th></thead>";
    html += "<tbody>";
    cycles.forEach((cycle, index) => {
        html += "<tr>";
        html += "<td>" + cycle.id + "</td>";
        html += "<td>" + cycle.start + "</td>";
        html += "<td>" + cycle.end + "</td>";
        html += "<td><button class='btn btn-primary' onclick='sorties.edit(" + index + ")'>Edit</button></td>"; // Method needs to be exitCycles or something like that. cycles.edit, whatever works.
        html += "</tr>";
        }
    )
    html += "</tbody>";
    $("#tabular-cycles").html(html);
}

tabular.cycles.add = () => {
    var html = "<h3>Add Cycle</h3>";
    html += "<form>";
    html += "<div class='form-group'>";
    html += "<label for='start'>Start</label>";
    html += "<input type='text' class='form-control' id='start' placeholder='Start'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='end'>End</label>";
    html += "<input type='text' class='form-control' id='end' placeholder='End'>";
    html += "</div>";
    html += "<button type='submit' class='btn btn-primary' onclick='cycles.addSubmit()'>Submit</button>";
    html += "</form>";
    openModal(html);
}

tabular.sorties.add = () => {
    var html = "<h3>Add Sortie</h3>";
    html += "<form>";
    html += "<div class='form-group'>";
    html += "<label for='startCycle'>Start Cycle</label>";
    html += "<input type='text' class='form-control' id='startCycle' placeholder='Start Cycle'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='start'>Start</label>";
    html += "<input type='text' class='form-control' id='start' placeholder='Start'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='startCondition'>Start Condition</label>";
    html += "<input type='text' class='form-control' id='startCondition' placeholder='Start Condition'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='endCycle'>End Cycle</label>";
    html += "<input type='text' class='form-control' id='endCycle' placeholder='End Cycle'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='end'>End</label>";
    html += "<input type='text' class='form-control' id='end' placeholder='End'>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='endCondition'>End Condition</label>";
    html += "<input type='text' class='form-control' id='endCondition' placeholder='End Condition'>";
    html += "</div>";
    html += "<button type='submit' class='btn btn-primary' onclick='sorties.addSubmit()'>Submit</button>";
    html += "</form>";
    openModal(html);
}
