var tabular = new Object;

// Process add or edit submits
tabular.processSubmit = function() {
    closeModal()
    this.draw()
    g.draw()
}

// Draw the sortie and cycles tables.
tabular.draw = () => {
    tabular.sorties.draw()
    tabular.cycles.draw()
}

highlightInvalidInput = ($object) => {
    $object.css("border-color", "red");
    $object.one('click',() => {
        console.log("click event on ", $object);
        $object.css("border-color", "black");
    });
}

// Returns the cycle number for a sortie based on launch time.
getCycle = ({start}) => {
    if (typeof start == "undefined" || start == null) {
        return "-"
    }
    let cycles = airplan.data.events.cycles;
    if (start < cycles[0].start) {
        // If the start is before the first cycle, it's cycle 0.
        return 0;
    } else if (start > cycles[cycles.length-1].end) {
        // If the start is after the last cycle, it's the last cycle + 1 (which is the length+1).
        return cycles.length+1;
    } else {
        // Otherwise, it's the first cycle that starts before and ends after the start.
        let cycle = cycles.filter(c => c.start <= start && c.end > start).reduce((p,c)=>p).number
        return cycle ? cycle : '-'
    }
}

//
//  Cycles Table
// 
tabular.cycles = new Object;
tabular.cycles.draw = () => {
    var cycles = airplan.data.events.cycles;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Cycle List</h3>";
    html += "<button class='btn btn-primary btn-block mb-2' onclick='tabular.cycles.add()'>Add Cycle</button>";
    html += "<table class='table table-striped table-hover table-sm text-center'>";
    html += "<thead><tr>";
    html += "<th class='col-3'>Cycle</th>";
    html += "<th class='col-3'>Start</th>"
    html += "<th class='col-3'>End</th>";
    html += "<th class='col-3'></th></thead>";
    html += "<tbody>";
    cycles.forEach((cycle, index) => {
        html += "<tr>";
        html += "<td class='align-middle'>" + cycle.number + "</td>";
        html += "<td class='align-middle'>" + cycle.start.toHHMM() + "</td>";
        html += "<td class='align-middle'>" + cycle.end.toHHMM() + "</td>";
        html += "<td class='align-middle'><div class='btn-group' role='group'>"
        html +=   "<button class='btn btn-sm btn-secondary' onclick='tabular.cycles.edit(" + index + ")'>Edit</button>"
        html +=   "<button class='btn btn-sm btn-danger'    onclick=tabular.cycles.delete("+index+")>X</button>"
        html += "</div></td>"; // Method needs to be exitCycles or something like that. cycles.edit, whatever works.
        html += "</tr>";
        }
    )
    html += "</tbody>";
    $("#tabular-cycles").html(html);
}

tabular.cycles.addEditForm = () => {
    // Cycle Number
    let html = "<div class='form-group row align-items-center'>";
    html += "<label for='number' class='col-12 col-md-2 text-left text-md-right'>Cycle #</label>";
    html += "<input type='number' class='col form-control' id='number' placeholder='Cycle Number' required>";
    html += "</div>"
    // Start time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='start' class='col-12 col-md-2 text-left text-md-right'>Start</label>";
    html += "<input type='datetime-local' class='col form-control' id='start' placeholder='Start'>";
    html += "</div>";
    // End time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='end' class='col-12 col-md-2 text-left text-md-right'>End</label>";
    html += "<input type='datetime-local' class='col form-control' id='end' placeholder='End'>";
    html += "</div>";
    return html
}

tabular.cycles.readForm = () => {
    let number    = $( "#number" ).val();
    let start     = new Date(Date.parse($('#start').val()));
    let end       = new Date(Date.parse($( '#end' ).val()));
    return {number: number, start: start, end: end}
}


// Callback on the "Add Cycle" button.
tabular.cycles.add = () => {
    var html = "<h3>Add Cycle</h3>";
    html += tabular.cycles.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick='tabular.cycles.addSubmit()'>Submit</button>";
    openModal(html);
}

// Callback on the "Submit" button in the "Add Cycle" modal.
tabular.cycles.addSubmit = () => {
    let cycle = tabular.cycles.readForm();
    // if valid cycle, push to data object, log, close modal, redraw table.
    if (tabular.cycles.validate(cycle)) {
        // Push the new cycle to the data object.
        console.log("New Cycle: ",cycle.number, cycle.start, cycle.end);
        airplan.data.events.cycles.push(cycle);
        tabular.processSubmit()
    }
}

tabular.cycles.edit = (i) => {
    var html = "<h3>Edit Cycle</h3>";
    html += tabular.cycles.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick='tabular.cycles.editSubmit("+i+")'>Submit</button>";
    openModal(html);
    $("#number").val(airplan.data.events.cycles[i].number);
    $("#start").val(airplan.data.events.cycles[i].start.toLocalTimeString());
    $("#end").val(airplan.data.events.cycles[i].end.toLocalTimeString());
}

tabular.cycles.editSubmit = (i) => {
    let cycle = airplan.data.events.cycles[i]
    cycle = tabular.cycles.readForm();
    // if valid cycle, update data object, log, close modal, redraw table.
    if (tabular.cycles.validate(cycle)) {
        // Update the cycle in the data object.
        console.log("Updated Cycle: ",cycle.number, cycle.start, cycle.end);
        airplan.data.events.cycles[i] = cycle;
        tabular.processSubmit()
    }
}

tabular.cycles.validate = ({number,start,end}) => {
    let valid = {number:true,start:true,end:true};
    let $number = $("#number");
    let $start = $("#start");
    let $end = $("#end");

    // Check if number is empty or undefined
    if (number == "" || typeof number == "undefined") {
        alert("Cycle number cannot be empty.");
        valid.number = false;
    } 
    // Check if start is empty or undefined
    if (start == "" || typeof start == "undefined") {
        alert("Start time cannot be empty.");
        valid.start = false;
    }
    // Check if end is empty or undefined
    if (end == "" || typeof end == "undefined") {
        alert("End time cannot be empty.");
        valid.end = false;
    }
    // Check if the cycle number is unique.
    // if (airplan.data.events.cycles.filter(c => c.number == number).length > 0) {
    //     alert("Cycle number must be unique.");
    //     valid.number = false;
    // }
    // Check if the start is before the end.
    if (start > end) {
        alert("Start must be before end.");
        valid.start = false;
        valid.end = false;
    }

    // if id not valid, highlight red until input changed
    if (!valid.number) {
        highlightInvalidInput( $number );
    }
    // if start not valid, highlight red until input changed
    if (!valid.start) {
        highlightInvalidInput( $start );
    }
    // if end not valid, highlight red until input changed
    if (!valid.end) {
        highlightInvalidInput( $end );
    }
    console.log(number,start,end);
    //if all valid, return true, otherwise return false
    return valid.number && valid.start && valid.end;
}

//
//  Sorties Table
// 
tabular.sorties = new Object;
tabular.sorties.draw = () => {
    var events = airplan.data.events;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Sortie List</h3>";
    html += "<button class='btn btn-primary btn-block mb-2' onclick='tabular.sorties.add()'>Add Sortie</button>";
    html += "<table class='table table-striped table-hover table-sm text-center'>";
    html += "<thead><tr>"
    html += "<th class='col-3'>Sqdrn</th>"
    html += "<th class='col-2'>Time</th>"
    html += "<th class='col-2'>Recovery</th>"
    html += "<th class='col-2'>Event</th>"
    html += "<th class='col-3'></th>";
    html += "</tr></thead>";
    html += "<tbody>";
    events.squadrons.forEach((sqdrn, i) => {
        console.log("Sorties for: "+sqdrn.name);
        events.sorties.filter(sortie=>sortie.squadron == sqdrn.name).forEach((sortie, ii) => {
            console.log("  Sortie: "+ii+" "+sortie);
            html += "<tr>";
            html += "<td class='align-middle'>"+sortie.squadron+"</td>";
            html += "<td class='align-middle'>"+sortie.start.toHHMM()+"</td>";
            html += "<td class='align-middle'>"+sortie.end.toHHMM()+"</td>";
            let cycle = getCycle(sortie);
            html += "<td class='align-middle'>"+cycle+sqdrn.letter+(ii+1)+"</td>";
            html += "<td class='align-middle'><div class='btn-group'>"
            html +=   "<button class='btn btn-sm btn-secondary' onclick='tabular.sorties.edit("+sortie.id+")'>Edit</button>"
            html +=   "<button class='btn btn-sm btn-danger'    onclick=tabular.sorties.delete("+sortie.id+") >X</button>"
            html += "</div></td>";
            html += "</tr>";
        })
    })
    html += "</tbody>";
    $("#tabular-sorties").html(html);
}

tabular.sorties.addEditForm = () => {
    // Squadron dropdown
    let html = "<div class='form-group row align-items-center'>";
    html += "<label for='squadron' class='col-12 col-md-3 text-left text-md-right'>Squadron</label>";
    html += "<select class='col form-control' id='squadron'>";
    airplan.data.events.squadrons.forEach((sqdrn, i) => {
        html += "<option value='"+sqdrn.name+"'>"+sqdrn.name+"</option>";
    })
    html += "</select>";
    html += "</div>";
    // Start Time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='startTime' class='col-12 col-md-3 text-left text-md-right'>Start Time</label>";
    html += "<input type='datetime-local' class='col form-control' id='startTime' placeholder='0000'>";
    html += "</div>";
    // Start Condition
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='startCondition' class='col-12 col-md-3 text-left text-md-right'>Start Condition</label>";
    html += "<select type='text' class='col form-control' id='startCondition' placeholder='Start Condition'>";
        html += "<option value='pull'>Pull</option>";
        html += "<option value='flyOn'>Fly On</option>";
        html += "<option value='hp'>Hot Pump</option>";
        html += "<option value='hpcs'>Hot Pump & Crew Swap</option>";
    html += "</select>";
    html += "</div>";
    // End time
    html += "<div class='form-group row align-items-center end-time'>";
    html += "<label for='endTime' class='col-12 col-md-3 text-left text-md-right'>End Time</label>";
    html += "<input type='datetime-local' class='col form-control' id='endTime' placeholder='0000'>";
    html += "</div>";
    // End Condition
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='endCondition' class='col-12 col-md-3 text-left text-md-right'>End Condition</label>";
    html += "<select type='text' class='col form-control' id='endCondition' placeholder='End Condition'>";
        html += "<option value='stuff'>Stuff</option>";
        html += "<option value='flyOff'>Fly Off</option>";
        html += "<option value='hp'>Hot Pump</option>";
        html += "<option value='hpcs'>Hot Pump & Crew Swap</option>";
    html += "</select>";
    html += "</div>";
    // Annotation
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='annotation' class='col-12 col-md-3 text-left text-md-right'>Annotation</label>";
    html += "<input type='text' class='col form-control' id='annotation' placeholder='Mission'>";
    html += "</div>";
    return html;
}

// Callback on the "Add Sortie" button.
tabular.sorties.add = () => {
    var html = "<h3>Add Sortie</h3>";
    html += tabular.sorties.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick='tabular.sorties.addSubmit()'>Submit</button>";
    openModal(html);
}

tabular.sorties.readForm = function() {
    let sortie = new Object;
    sortie.squadron =                  $("#squadron").val();
    sortie.start = new Date(Date.parse($( "#startTime" ).val()));
    sortie.startCondition =            $( "#startCondition" ).val();
    sortie.end   = new Date(Date.parse($( "#endTime" ).val()));
    sortie.endCondition =              $( "#endCondition" ).val();
    sortie.annotation =                $( "#annotation" ).val();
    return sortie
}

// Callback on the "Submit" button in the "Add Sortie" modal.
tabular.sorties.addSubmit = () => {
    let sortie = tabular.sorties.readForm()
    sortie.id = +airplan.data.events.sorties[airplan.data.events.sorties.length-1].id+1;
    if (tabular.sorties.validate(sortie)) {
        airplan.data.events.sorties.push(sortie);
        console.log(sortie.start, sortie.startCondition, sortie.end, sortie.endCondition, sortie.annotation);
        tabular.processSubmit()    }
}

tabular.sorties.edit = (i) => {
    console.log("Editing sortie "+i);
    var html = "<h3>Edit Sortie</h3>";
    html += tabular.sorties.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick='tabular.sorties.editSubmit("+i+")'>Submit</button>";
    openModal(html);
    $("#squadron").val(airplan.data.events.sorties[i].squadron);
    $("#startTime").val(airplan.data.events.sorties[i].start.toLocalTimeString());
    $("#startCondition").val(airplan.data.events.sorties[i].startCondition);
    $("#endTime").val(airplan.data.events.sorties[i].end.toLocalTimeString());
    $("#endCondition").val(airplan.data.events.sorties[i].endCondition);
    $("#annotation").val(airplan.data.events.sorties[i].annotation);
}

tabular.sorties.editSubmit = (i) => {
    console.log("processing edit of sortie "+i);
    let sortie = airplan.data.events.sorties[i]
    sortie = tabular.sorties.readForm()
    console.log(sortie.start, sortie.startCondition, sortie.end, sortie.endCondition, sortie.annotation);
    if (tabular.sorties.validate(sortie)) {
        airplan.data.events.sorties[i] = sortie;
        console.log(sortie.start, sortie.startCondition, sortie.end, sortie.endCondition, sortie.annotation);
        tabular.processSubmit()    }
}

tabular.sorties.validate = (sortie) => {
    return true
}

tabular.cycles.delete = (i) => {
    // Todo: delete cycle
}

tabular.sorties.delete = (i) => {
    // Todo: delete sortie
}