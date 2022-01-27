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

getMissionNumber = (sortie) => {
    return '1A1'
}


//
//  Cycles Table
// 
tabular.cycles = new Object;
tabular.cycles.draw = () => {
    var cycles = airplan.data.events.cycles;//or wherever the data is stored, may need to change how we loop over it
    var html = "<h3>Cycle List</h3>";
    html += "<button class='btn btn-primary btn-block mb-2' onclick=tabular.cycles.add()>Add Cycle</button>";
    html += "<table class='table table-striped table-hover table-sm text-center'>";
    html += "<thead><tr>";
    html += "<th class='col-3'>Cycle</th>";
    html += "<th class='col-3'>Start</th>"
    html += "<th class='col-3'>End</th>";
    html += "<th class='col-3'></th></thead>";
    html += "<tbody>";
    Object.entries(cycles).sort((a,b)=>a[1].start-b[1].start).forEach(([id,cycle],i) => {
        cycle.number = parseInt(i+1);
        html += "<tr>";
        html += "<td class='align-middle'>" + cycle.number + "</td>";
        html += "<td class='align-middle'>" + cycle.start.toHHMM() + "</td>";
        html += "<td class='align-middle'>" + cycle.end.toHHMM() + "</td>";
        html += "<td class='align-middle'><div class='btn-group' role='group'>"
        html +=   "<button class='btn btn-sm btn-secondary' onclick=tabular.cycles.edit('"+id+"')>Edit</button>"
        html +=   "<button class='btn btn-sm btn-danger'    onclick=tabular.cycles.delete('"+id+"')>X</button>"
        html += "</div></td>"; // Method needs to be exitCycles or something like that. cycles.edit, whatever works.
        html += "</tr>";
        }
    )
    html += "</tbody>";
    $("#tabular-cycles").html(html);
}

tabular.cycles.addEditForm = () => {
    let html = ""
    // Cycle Number
    // let html = "<div class='form-group row align-items-center'>";
    // html += "<label for='number' class='col-12 col-md-2 text-left text-md-right'>Cycle #</label>";
    // html += "<input type='number' class='col form-control mr-5' id='number' placeholder='Cycle Number' required disabled>";
    // html += "</div>"
    // Start time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='start' class='col-12 col-md-2 text-left text-md-right'>Start</label>";
    html += "<input type='datetime-local' class='col form-control mr-5' id='start' placeholder='Start'>";
    html += "</div>";
    // End time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='end' class='col-12 col-md-2 text-left text-md-right'>End</label>";
    html += "<input type='datetime-local' class='col form-control mr-5' id='end' placeholder='End'>";
    html += "</div>";
    return html
}

tabular.cycles.readForm = () => {
    // let number    = $( "#number" ).val();
    let number = Object.keys(airplan.data.events.cycles).length + 1;
    let start     = new Date(Date.parse($('#start').val()));
    let end       = new Date(Date.parse($( '#end' ).val()));
    return {number: number, start: start, end: end}
}


// Callback on the "Add Cycle" button.
tabular.cycles.add = () => {
    var html = "<h3>Add Cycle</h3>";
    html += tabular.cycles.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick=tabular.cycles.addSubmit()>Submit</button>";
    openModal(html);
    $("#number").val(Object.keys(airplan.data.events.cycles).length+1);
    let d = new Date(new Date(airplan.data.date.valueOf()).setHours(9,0,0,0));
    let startD = Object.values(airplan.data.events.cycles).reduce((p,c)=>p.end > c.end ? p : c,{end:d});
    let start = startD.end.getHours()
    let end = start + 1

    $("#start").val( new Date( new Date( airplan.data.date.valueOf() ).setHours(start,0,0,0) ).toLocalTimeString() );
    $("#end").val(   new Date( new Date( airplan.data.date.valueOf() ).setHours(end,0,0,0)   ).toLocalTimeString() );
}

// Callback on the "Submit" button in the "Add Cycle" modal.
tabular.cycles.addSubmit = () => {
    tabular.cycles.editSubmit(uuidv4());
    // let cycle = tabular.cycles.readForm();
    // // if valid cycle, push to data object, log, close modal, redraw table.
    // if (tabular.cycles.validate(cycle)) {
    //     // Push the new cycle to the data object.
    //     console.log("New Cycle: ",cycle.number, cycle.start, cycle.end);
    //     airplan.data.events.cycles.push(cycle);
    //     tabular.processSubmit()
    // }
}

tabular.cycles.edit = (id) => {
    var html = "<h3>Edit Cycle</h3>";
    html += tabular.cycles.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick=tabular.cycles.editSubmit('"+id+"')>Submit</button>";
    openModal(html);
    $("#number").val(airplan.data.events.cycles[id].number);
    $("#start").val(airplan.data.events.cycles[id].start.toLocalTimeString());
    $("#end").val(airplan.data.events.cycles[id].end.toLocalTimeString());
}

tabular.cycles.editSubmit = (id) => {
    let cycle = tabular.cycles.readForm();
    // if valid cycle, update data object, log, close modal, redraw table.
    if (tabular.cycles.validate(cycle)) {
        // Update the cycle in the data object.
        console.log("Updated Cycle: ",cycle.number, cycle.start, cycle.end);
        airplan.data.events.cycles[id] = cycle;
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
    html += "<button class='btn btn-primary btn-block mb-2' onclick=tabular.sorties.add()>Add Sortie</button>";
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
        Object.entries(events.sorties).filter(([id,sortie])=>sortie.squadron == sqdrn.name).forEach(([id,sortie]) => {
            console.log("  Sortie: "+id+" "+sortie);
            html += "<tr>";
            html += "<td class='align-middle'>"+sortie.squadron+"</td>";
            html += "<td class='align-middle'>"+sortie.start.toHHMM()+"</td>";
            html += "<td class='align-middle'>"+sortie.end.toHHMM()+"</td>";
            html += "<td class='align-middle'>"+getMissionNumber(id)+"</td>";
            html += "<td class='align-middle'><div class='btn-group'>"
            html +=   "<button class='btn btn-sm btn-secondary' onclick=tabular.sorties.edit('"+id+"')>Edit</button>"
            html +=   "<button class='btn btn-sm btn-danger'    onclick=tabular.sorties.delete('"+id+"') >X</button>"
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
    html += "<select class='col form-control mr-5' id='squadron'>";
    airplan.data.events.squadrons.forEach((sqdrn, i) => {
        html += "<option value='"+sqdrn.name+"'>"+sqdrn.name+"</option>";
    })
    html += "</select>";
    html += "</div>";
    // Start Time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='start' class='col-12 col-md-3 text-left text-md-right'>Start Time</label>";
    html += "<input type='datetime-local' class='col form-control mr-5' id='start' placeholder='0000'>";
    html += "</div>";
    // Start Condition
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='startCondition' class='col-12 col-md-3 text-left text-md-right'>Start Condition</label>";
    html += "<select type='text' class='col form-control mr-5' id='startCondition' placeholder='Start Condition'>";
        html += "<option value='pull'>Pull</option>";
        html += "<option value='flyOn'>Fly On</option>";
        html += "<option value='hp'>Hot Pump</option>";
        html += "<option value='hpcs'>Hot Pump & Crew Swap</option>";
    html += "</select>";
    html += "</div>";
    // End time
    html += "<div class='form-group row align-items-center end-time'>";
    html += "<label for='end' class='col-12 col-md-3 text-left text-md-right'>End Time</label>";
    html += "<input type='datetime-local' class='col form-control mr-5' id='end' placeholder='0000'>";
    html += "</div>";
    // End Condition
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='endCondition' class='col-12 col-md-3 text-left text-md-right'>End Condition</label>";
    html += "<select type='text' class='col form-control mr-5' id='endCondition' placeholder='End Condition'>";
        html += "<option value='stuff'>Stuff</option>";
        html += "<option value='flyOff'>Fly Off</option>";
        html += "<option value='hp'>Hot Pump</option>";
        html += "<option value='hpcs'>Hot Pump & Crew Swap</option>";
    html += "</select>";
    html += "</div>";
    // Annotation
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='annotation' class='col-12 col-md-3 text-left text-md-right'>Annotation</label>";
    html += "<input type='text' class='col form-control mr-5' id='annotation' placeholder='Mission'>";
    html += "</div>";
    return html;
}

// Callback on the "Add Sortie" button.
tabular.sorties.add = () => {
    var html = "<h3>Add Sortie</h3>";
    html += tabular.sorties.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick=tabular.sorties.addSubmit()>Submit</button>";
    openModal(html);
    let d = new Date(airplan.data.date);
    d.setHours(0,0,0,0);
    $("#start").val(d.toLocalTimeString());
    $("#end").val(d.toLocalTimeString());
}

tabular.sorties.readForm = function() {
    let sortie = new Object;
    sortie.squadron =                  $("#squadron").val();
    sortie.start = new Date(Date.parse($( "#start" ).val()));
    sortie.startCondition =            $( "#startCondition" ).val();
    sortie.end   = new Date(Date.parse($( "#end" ).val()));
    sortie.endCondition =              $( "#endCondition" ).val();
    sortie.annotation =                $( "#annotation" ).val();
    return sortie
}

// Callback on the "Submit" button in the "Add Sortie" modal.
tabular.sorties.addSubmit = () => {
    tabular.sorties.editSubmit(uuidv4())
    // let sortie = tabular.sorties.readForm()
    // if (tabular.sorties.validate(sortie)) {
    //     airplan.data.events.sorties[uuidv4()] = sortie;
    //     console.log(sortie.start, sortie.startCondition, sortie.end, sortie.endCondition, sortie.annotation);
    //     tabular.processSubmit()    
    // }
}

tabular.sorties.edit = (id) => {
    console.log("Editing sortie "+id);
    var html = "<h3>Edit Sortie</h3>";
    html += tabular.sorties.addEditForm();
    html += "<button type='submit' class='btn btn-primary' onclick=tabular.sorties.editSubmit('"+id+"')>Submit</button>";
    openModal(html);
    $("#squadron").val(airplan.data.events.sorties[id].squadron);
    $("#start").val(airplan.data.events.sorties[id].start.toLocalTimeString());
    $("#startCondition").val(airplan.data.events.sorties[id].startCondition);
    $("#end").val(airplan.data.events.sorties[id].end.toLocalTimeString());
    $("#endCondition").val(airplan.data.events.sorties[id].endCondition);
    $("#annotation").val(airplan.data.events.sorties[id].annotation);
}

tabular.sorties.editSubmit = (id) => {
    console.log("processing edit of sortie "+id);
    let sortie = tabular.sorties.readForm()
    if (tabular.sorties.validate(sortie)) {
        airplan.data.events.sorties[id] = sortie;
        console.log(sortie.start, sortie.startCondition, sortie.end, sortie.endCondition, sortie.annotation);
        tabular.processSubmit()
    }
}

tabular.sorties.validate = ({squadron,start,startCondition,end,endCondition,annotation}) => {
    let valid = {squadron: true,start: true,startCondition: true,end: true,endCondition: true,annotation: true};
    $squadron =         $( "#squadron" );
    $start =            $( "#start" );
    $startCondition =   $( "#startCondition" );
    $end   =            $( "#end" );
    $endCondition =     $( "#endCondition" );
    $annotation =       $( "#annotation" );
    if (squadron == "") {
        highlightInvalidInput($squadron);
        valid.squadron = false;
    }
    if (start == "Invalid Date" || start == null) {
        highlightInvalidInput($start);
        valid.start = false;
    }
    if (end == "Invalid Date" || end == null) {
        highlightInvalidInput($end);
        valid.end = false;
    }
    if (start > end) {
        highlightInvalidInput($start);
        highlightInvalidInput($end);
        valid.start = false;
        valid.end = false;
    }
    if (annotation == "") {
        highlightInvalidInput($annotation);
        valid.annotation = false;
    }
    // if all valid, return true
    return Object.values(valid).reduce((a,b) => a && b, true);
}

tabular.cycles.delete = function(id) {
    let del = async () => delete airplan.data.events.cycles[id];
    del().then(refresh())
}

tabular.sorties.delete = function(id) {
    let del = async () => delete airplan.data.events.sorties[id];
    del().then(refresh())
}