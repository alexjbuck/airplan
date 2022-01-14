var tabular = new Object;

// Draw the sortie and cycles tables.
tabular.draw = () => {
    tabular.sorties.draw()
    tabular.cycles.draw()
}    

// Returns the cycle number for a sortie based on launch time.
getCycle = ({start}) => {
    let cycles = sorties.data.events.cycles;
    if (start < cycles[0].start) {
        // If the start is before the first cycle, it's cycle 0.
        return 0;
    } else if (start > cycles[cycles.length-1].end) {
        // If the start is after the last cycle, it's the last cycle + 1 (which is the length, since it's zero-indexed).
        return cycles.length;
    } else {
        // Otherwise, it's the first cycle that starts before and ends after the start.
        return cycles.filter(c => c.start <= start && c.end >= start)[0].id;
    }
}

// Tabular view of the cycles
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

tabular.sorties = new Object;
tabular.sorties.draw = () => {
    var events = sorties.data.events;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Sortie List</h3>";
    html += "<button class='btn btn-primary mb-2' onclick='tabular.sorties.add()'>Add Sortie</button>";
    html += "<table class='table table-striped table-bordered table-condensed'>";
    html += "<thead><tr><th>Sqdrn</th><th>Launch<br>Time</th><th>Launch<br>Condition</th><th>Recovery<br>Time</th><th>Recovery<br>Condition</th><th>Event</th></tr></thead>";
    html += "<tbody>";
    events.squadrons.forEach((sqdrn, i) => {
        sqdrn.sorties.forEach((sortie, ii) => {
            html += "<tr>";
            html += "<td>"+sqdrn.name+"</td>";
            html += "<td>"+sortie.start+"</td>";
            html += "<td>"+sortie.startCondition+"</td>";
            html += "<td>"+sortie.end+"</td>";
            html += "<td>"+sortie.endCondition+"</td>";
            let cycle = getCycle(sortie)
            html += "<td>"+cycle+(ii+1)+sqdrn.letter+"</td>";
            html += "<td><button class='btn btn-secondary' onclick='sorties.edit("+i+")'>Edit</button></td>";
            html += "</tr>";
        })
    })
    html += "</tbody>";
    $("#tabular-sorties").html(html);
}

// Callback on the "Add Cycle" button.
tabular.cycles.add = () => {
    var html = "<h3>Add Cycle</h3>";
    // Cycle Number
    html += "<div class='form-group'>";
    html += "<label for='cycleNumber'>Cycle Number</label>";
    html += "<input type='number' class='form-control' id='cycleNumber' placeholder='Cycle Number' required>";
    html += "</div>"
    // Start time
    html += "<div class='form-group'>";
    html += "<label for='start'>Start</label>";
    html += "<input type='text' maxlength='4' class='form-control' id='start' placeholder='Start'>";
    html += "</div>";
    // End time
    html += "<div class='form-group'>";
    html += "<label for='end'>End</label>";
    html += "<input type='text' maxlength='4' class='form-control' id='end' placeholder='End'>";
    html += "</div>";
    html += "<button type='submit' class='btn btn-primary' onclick='tabular.cycles.addSubmit()'>Submit</button>";
    openModal(html);
}

// Callback on the "Add Sortie" button.
tabular.sorties.add = () => {
    var html = "<h3>Add Sortie</h3>";
    // Squadron dropdown
    html += "<div class='form-group'>";
    html += "<label for='squadron'>Squadron</label>";
    html += "<select class='form-control' id='squadron'>";
    sorties.data.events.squadrons.forEach((sqdrn, i) => {
        html += "<option value='"+i+"'>"+sqdrn.name+"</option>";
    })
    html += "</select>";
    // Start Time
    html += "<div class='form-group start-time'>";
    html += "<label for='startTime'>Start Time</label>";
    html += "<input type='text' class='form-control' id='startTime' placeholder='0000'>";
    html += "</div>";
    // Start Condition
    html += "<div class='form-group'>";
    html += "<label for='startCondition'>Start Condition</label>";
    html += "<select type='text' class='form-control' id='startCondition' placeholder='Start Condition'>";
        html += "<option value='pull'>Pull</option>";
        html += "<option value='flyOn'>Fly On</option>";
        html += "<option value='hp'>Hot Pump</option>";
        html += "<option value='hpcs'>Hot Pump & Crew Swap</option>";
    html += "</select>";
    html += "</div>";
    // End time
    html += "<div class='form-group end-time'>";
    html += "<label for='endTime'>End Time</label>";
    html += "<input type='text' class='form-control' id='endTime' placeholder='0000'>";
    html += "</div>";
    // End Condition
    html += "<div class='form-group'>";
    html += "<label for='endCondition'>End Condition</label>";
    html += "<select type='text' class='form-control' id='endCondition' placeholder='End Condition'>";
        html += "<option value='stuff'>Stuff</option>";
        html += "<option value='flyOff'>Fly Off</option>";
        html += "<option value='hp'>Hot Pump</option>";
        html += "<option value='hpcs'>Hot Pump & Crew Swap</option>";
    html += "</select>";
    html += "</div>";
    // Annotation
    html += "<div class='form-group'>";
    html += "<label for='annotation'>Annotation</label>";
    html += "<input type='text' class='form-control' id='annotation' placeholder='Mission'>";
    html += "</div>";
    html += "<button type='submit' class='btn btn-primary' onclick='tabular.sorties.addSubmit()'>Submit</button>";
    openModal(html);
}

// Callback on the "Submit" button in the "Add Cycle" modal.
tabular.cycles.addSubmit = (form) => {
    let cycle = new Object;
    cycle.id = $("#cycleNumber").val();
    cycle.start = $( "#start" ).val();
    cycle.end = $( "#end" ).val();
    console.log(start, end);
    // Push the new cycle to the data object.
    sorties.data.events.cycles.push(cycle);
    closeModal();
    tabular.draw();
}

// Callback on the "Submit" button in the "Add Sortie" modal.
tabular.sorties.addSubmit = () => {
    let sortie = new Object;
    squadron = $("#squadron").val();
    sortie.start = $( "#startTime" ).val();
    sortie.startCondition = $( "#startCondition" ).val();
    sortie.end = $( "#endTime" ).val();
    sortie.endCondition = $( "#endCondition" ).val();
    sortie.annotation = $( "#annotation" ).val();
    console.log(sortie.start, sortie.startCondition, sortie.end, sortie.endCondition, sortie.annotation);
    // push the sortie to the data object.
    sorties.data.events.squadrons[squadron].sorties.push(sortie);
    closeModal();
    tabular.draw()
}

