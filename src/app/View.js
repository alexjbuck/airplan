class View {
    constructor(airplan) {
        this.app                = this.getElement('#view');

        this.margin             = {top: 10, right: 10, bottom: 10, left: 10};
        this.sceneWidth         = 1100;
        this.sceneHeight        = 850;
        this.headerHeight       = 100;
        this.leftCol            = 100;
        this.letterCol          = 20;
        this.rightCol           = 50;
        this.topRow             = 20;
        this.bottomRow          = 20;
        this.drawMenu();
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })          
    }

    bindMenuAddPlaceholderSquadron(handler){
        this.menu.squadron.add.on('click', event=>{
            handler()
        })
    }
    bindMenuRemoveSquadron(handler){
        this.menu.squadron.rem.on('click', event=>{
            handler()
        })
    }
    bindMenuReset(handler){
        this.menu.file.reset.on('click', event=>{
            handler()
        })
    }
    bindMenuRefresh(handler){
        this.menu.file.refresh.on('click', event=>{
            handler()
        })
    }
    bindMenuLoad(handler){
        this.menu.file.load.on('change', event=>{
            if(event.target.files[0]!=''){
                handler(event.target.files[0])
            }
        })
        this.menu.file.load.on('click', event=>{
            event.target.value=''
        })
    }
    bindMenuSave(handler){
        this.menu.file.save.on('click', event=>{
            handler()
        })
    }
    bindMenuExport(handler){
        this.menu.file.export.on('click', event=>{
            handler()
        })
    }
    bindMenuHelp(handler){

    }
    bindMenuAddCycle(handler){

    }
    bindMenuRemoveCycle(handler){

    }
    bindMenuEditCycle(handler){

    }
    bindMenuAddLine(handler){

    }
    bindMenuRemoveLine(handler){

    }
    bindMenuAddSortie(handler){

    }
    bindMenuRemoveSortie(handler){
        
    }




    /**
     * @method drawMenu Populate the #menu in the menu div.
     */
    drawMenu = () => {
        this.menu = {squadron:{},file:{},info:{}}
        var html =`
        <h3>Menu</h3>
        <div class='btn-group menu-group'>
            <button id='add-squadron' class='btn btn-outline-primary add-squadron' data-toggle='tooltip' data-placement='top' title='Add Squadron'>   <i class='fas fa-plus'> </i></button>
            <button id='rem-squadron' class='btn btn-outline-danger rem-squadron'  data-toggle='tooltip' data-placement='top' title='Remove Squadron'><i class='fas fa-minus'></i></button>
        </div>
        <div class='btn-group menu-group'>
            <button id='reset'   class='btn btn-outline-danger'       data-toggle='tooltip' data-placement='top' title='Burn it Down!'><i class='fas fa-dumpster-fire'> </i></button>
            <button id='refresh' class='btn btn-outline-primary'      data-toggle='tooltip' data-placement='top' title='Refresh'>      <i class='fas fa-sync'>          </i></button>
            <label  id='load'    class='btn btn-outline-primary my-0' data-toggle='tooltip' data-placement='top' title='Load'>         <i class='fas fa-folder-open'>   </i><input type='file' id='filepath' hidden></label>
            <button id='save'    class='btn btn-outline-primary'      data-toggle='tooltip' data-placement='top' title='Save'>         <i class='fas fa-save'>          </i></button>
            <button id='export'  class='btn btn-outline-primary'      data-toggle='tooltip' data-placement='top' title='Export PDF'>   <i class='fas fa-file-pdf'>      </i></button>
        </div>
        <div class='btn-group menu-group'>
            <button id="help"            class='btn btn-outline-warning'      data-toggle='tooltip' data-placement='top' title='Help'>         <i class='fas fa-question-circle'></i></button>
            <button id="feedback" class='btn btn-outline-success' data-toggle='tooltip' data-placement='top' title='Thank you!'        onclick='location.href="mailto:alexander.j.buck@navy.mil?subject=Airplan feedback&body=Three things I liked:%0d%0a1. %0d%0a2. %0d%0a3. %0d%0a%0d%0aThree things I did not like:%0d%0a1. %0d%0a2. %0d%0a3. %0d%0a%0d%0aAny other feedback:%0d%0a%0d%0aThank You!"'>Feedback</button>
        </div>
        `;
        $('#menu').html(html)
        this.menu.squadron.add = $('#add-squadron')
        this.menu.squadron.rem = $('#rem-squadron')
        this.menu.file.reset = $('#reset')
        this.menu.file.refresh = $('#refresh')
        this.menu.file.load = $('#load')
        this.menu.file.save = $('#save')
        this.menu.file.export = $('#export')
        this.menu.info.help = $('#help')
        this.menu.info.feedback = $('#feedback')
    }
    
    drawList = (airplan) => {
        this.drawCycleList(airplan);
        this.drawSortieList(airplan);        
    }
    
    /**
     * @param {Model} airplan 
     * @method drawCycleList populates the #cycles-list div with cycles information.
     */
    drawCycleList = (airplan) => {
        let html = `
        <h3>Cycles</h3>
        <ul class='list-group'>`
        
        Object.values(airplan.cycles).forEach(cycle => {
            html += `<li class='list-group-item list-group-item-action' onclick='this.cycleClicked(${cycle.ID})'>`
            html += `<div class='row'>`
            html += `<div class='col-xl-3 col-md'><b>Cycle ${cycle.number}</b>:</div>`
            html += `<div class='col-xl col-md'>${cycle.start.toHHMM()} - ${cycle.end.toHHMM()}</div>`
            html += `</div>`
        })
        // if (Object.values(airplan.cycles).length == 0) {
        //     html += `<li class='list-group-item list-group-item-action'>No cycles</li>`
        // } else {
            html += `<li class='list-group-item list-group-item-action' onclick='this.addCycle()'><i class='fas fa-plus'></i> Add Cycle...</li>`
        // }
        $('#cycles-list').html(html)
    }
    
    /**
     * @param {Model} airplan
     * @method drawSortieList populates the #sorties-view div view with sorties information
     */
    drawSortieList = (airplan) => {
        let html =`<h3>Lines and Sorties</h3>`
        html += `<div class='list-group'>`
        Object.values(airplan.squadrons).forEach(squadron => {
            Object.values(airplan.lines).filter(line=>line.squadronID == squadron.ID).sort((a,b)=>a.start-b.start).forEach((line,i) => {
                html += `<div class='list-group-item' onclick='this.squadronClicked(${squadron.ID})'>`
                html += `<div class='row'>`
                html += `<div class='col-xl-3 col-md-4'> <b>${squadron.name}</b> </div>`
                html += `<div class='col-xl-5 col-md-8'> Aircraft Line ${i+1} </div>`
                if (line.sorties.length) {
                html += `<div class='col-xl-4 col-md-6'><small>${line.start.toHHMM()}-${line.end.toHHMM()}</small></div>`
                }
                html += `</div>`
                    html += `<div class='list-group list-group-flush'>`
                    Object.values(airplan.sorties).filter(sortie => sortie.lineID === line.ID).forEach(sortie => {
                        html += `
                                <div class='list-group-item list-group-item-action px-5 py-1' onclick='this.cycleClicked(${sortie.ID})'>
                                    <i class='fas fa-bars'></i>
                                    <small>Event: <b>${sortie.event}:</b> ${sortie.start.toHHMM()} - ${sortie.end.toHHMM()}
                                    <i class='fas fa-trash-alt'></i></small>
                                </div>`
                })
                        html += `
                                <div class='list-group-item list-group-item-action px-5 py-1'><small><i class='fas fa-plus'>
                                    </i> Add Sortie...</small>
                                </div>`
                html +=     `</div>
                        </div>`
            })
        })
        html +=         `<div class='list-group-item list-group-item-action' onclick='this.squadronClicked(0)'><i class='fas fa-plus'></i> Add Line...</div>`        
        html += `</div>`
        
        $('#sorties-list').html(html)
    }

    /**
     * 
     * @param {Model} airplan Create the Konva object and draw the airplan on it.
     */
    drawStage = (airplan) => { 
        // Create Stage
        this.stage = new Konva.Stage({
            container: 'graphic-stage',   // id of container <div>
            width: this.sceneWidth,
            height: this.sceneHeight,
        });
        
        // Page Layer
        this.pageLayer = new Konva.Layer().addTo(this.stage);
        
        // Print Area
        this.printArea = new Konva.Group({
            x: this.margin.left,
            y: this.margin.top,  
            width: this.sceneWidth-this.margin.left-this.margin.right,
            height: this.sceneHeight-this.margin.top-this.margin.bottom,
        }).addTo(this.pageLayer);
        
        new Konva.Rect({ width: this.printArea.width(), height: this.printArea.height(), stroke:'black'})
        .addTo(this.printArea);
        
        // Header
        this.header = new Konva.Group({
            width: this.printArea.width(),
            height: this.headerHeight,
        }).addTo(this.printArea);
        
        new Konva.Line({
            points: [0,this.header.height(),this.header.width(),this.header.height()],
            stroke:'black'
        }).addTo(this.header);
        
        // Header.Slap
        new Konva.Group({
            id: 'slap',
            x: config.body.padding,
            y: config.body.padding,
        }).addTo(this.header)
        
        new Konva.Text({
            id: 'slap.label',
            text: ['sunrise', 'sunset', 'moonrise', 'moonset','moonphase'].join('\n').toUpperCase(),
        }).addTo(this.stage.findOne('#slap'));
        
        new Konva.Text({
            text: ['sunrise', 'sunset', 'moonrise', 'moonset'].map(k=>airplan[k].toHHMM()).concat(airplan.moonphase).join('\n'),
            offsetX: -this.stage.findOne('#slap.label').width() - config.body.padding,
        }).addTo(this.stage.findOne('#slap'));
        
        this.stage.findOne('#slap').fitToChildren().addHighlightBox();
        
        // Header.Title
        new Konva.Group({id: 'title', x: this.header.width()/2, y: config.body.padding }).addTo(this.header)
        
        new Konva.Text({
            id: 'title.title',
            text: airplan.title,
            fontSize: config.title.fontSize,
        }).addTo(this.stage.findOne('#title')).anchorTopMiddle()
        
        new Konva.Text({
            id: 'title.subtitle',
            y: this.stage.findOne('#title.title').height() + config.subtitle.padding,
            text: airplan.date.toDateString(),
            fontSize : config.subtitle.fontSize,
        }).addTo(this.stage.findOne('#title')).anchorTopMiddle()
        
        this.stage.findOne('#title').fitToChildren().addHighlightBox();
        
        // Header.Time
        new Konva.Group({ id: 'time', x: this.header.width()-config.body.padding, y: config.body.padding }).addTo(this.header)
        
        // Time Labels
        new Konva.Text({
            text: ['flight quarters:','Helo quarters:','Mag Var:','Time Zone:'].join('\n').toUpperCase(), 
            id: 'time.label',
            align: 'right' 
        }).addTo(this.stage.findOne('#time'));
        
        // Time Values
        new Konva.Text({
            text: ['flightquarters','heloquarters'].map(k=>airplan[k].toHHMM()).concat([airplan.variation,airplan.timezone]).join('\n'),
            id: 'time.value',
            x: this.stage.findOne('#time.label').width() + config.body.padding
        }).addTo(this.stage.findOne('#time'));
        
        this.stage.findOne('#time').fitToChildren().anchorTopRight().addHighlightBox();
        
        // Events
        this.events = new Konva.Group({
            id: 'events',
            y: this.header.height(),
            width: this.printArea.width(),
            height: this.printArea.height()-this.header.height()
        }).addTo(this.printArea);
        
        // Horizontal Line below sun/moon
        new Konva.Line({stroke:'black', points: [0,this.topRow, this.events.width(),this.topRow]}).addTo(this.events);
        
        // Horizontal Line across top of sorties
        new Konva.Line({stroke:'black', points: [0,2*this.topRow, this.events.width(),2*this.topRow]}).addTo(this.events);
        
        // Vertical Line along right side of squadrons
        new Konva.Line({stroke:'black', points: [this.leftCol,2*this.topRow, this.leftCol, this.events.height()-this.bottomRow]}).addTo(this.events);
        
        // Vertical Line along right side of squadron letter
        new Konva.Line({stroke:'black', points: [this.leftCol+this.letterCol,2*this.topRow, this.leftCol+this.letterCol, this.events.height()]}).addTo(this.events);
        
        // Horizontal Line across bottom of sorties
        new Konva.Line({stroke:'black', points: [0,this.events.height()-this.bottomRow, this.events.width(), this.events.height()-this.bottomRow]}).addTo(this.events);
        
        // Vertical Line along the left side of day/night totals
        new Konva.Line({stroke:'black', points: [this.events.width()-this.rightCol,this.topRow, this.events.width()-this.rightCol, this.events.height()]}).addTo(this.events);
        
        // Text label for Squadron column
        new Konva.Text({text:'SQUADRON', x: this.leftCol/2, y: 1.5 * this.topRow}).addTo(this.events).anchorCenter();
        
        // Text label for Launch/Land totals
        new Konva.Text({text:'LAUNCH/LAND', x: (this.leftCol+this.letterCol)/2, y: this.events.height()-this.bottomRow/2}).addTo(this.events).anchorCenter()
        
        // Text Label for day/night totals
        new Konva.Text({text:'D/N', x: this.events.width()-this.rightCol/2, y: 1.5 * this.topRow,}).addTo(this.events).anchorCenter()
        
        // Events.Timebox
        this.timebox = new Konva.Group({
            id: 'timebox',
            x: this.leftCol + this.letterCol,
            width: this.events.width() - this.leftCol - this.letterCol - this.rightCol,
            height: this.events.height() - this.bottomRow,
        }).addTo(this.events)
        
        /** Sunrise Group */
        new Konva.Group({ x: this.time2pixels(airplan.sunrise,airplan), y: 20, id:'sunrise.group' }).addTo(this.timebox).anchorCenter()
        
        // Sunrise
        new Konva.Arc({ angle: 180, outerRadius: 15, clockwise: true, stroke:'black' }).addTo(this.stage.findOne('#sunrise.group'));
        
        // Sunrise Text
        new Konva.Text({ text: airplan.sunrise.toHHMM(), y: -20 }).addTo(this.stage.findOne('#sunrise.group')).anchorBottomMiddle();
        
        this.stage.findOne('#sunrise.group').fitToChildren().addHighlightBox()
        
        /** Sunset Group */
        new Konva.Group({ x: this.time2pixels(airplan.sunset,airplan), y: 20, id:'sunset.group' }).addTo(this.timebox).anchorCenter()
        
        // Sunset
        new Konva.Arc({ angle: 180, outerRadius: 15, clockwise: true, stroke:'black', fill: 'black' }).addTo(this.stage.findOne('#sunset.group'));
        
        // Sunset Text
        new Konva.Text({ text: airplan.sunset.toHHMM(), y: -20 }).addTo(this.stage.findOne('#sunset.group')).anchorBottomMiddle();
        
        this.stage.findOne('#sunset.group').fitToChildren().addHighlightBox()
        
        /** Timebox.Start/End */
        new Konva.Text({ text: `\u21A6${airplan.start.toHHMM()}`, y: this.topRow*2.5 }).addTo(this.timebox).anchorTopLeft()
        new Konva.Text({ text: airplan.end.toHHMM()+'\u21A4',   y: this.topRow*2.5, x: this.timebox.width() }).addTo(this.timebox).anchorTopRight()
        
        /** Timebox.Cycles */
        Object.values(airplan.cycles).forEach((cycle,i)=>{
            let group = new Konva.Group({
                id: `cycle${i}`,
                x: this.time2pixels(cycle.start,airplan),
                y: this.topRow*2,
                width: this.time2pixels(cycle.end,airplan) - this.time2pixels(cycle.start,airplan),
                height: this.timebox.height() - this.topRow*2,
            }).addTo(this.timebox)
            // Start of Cycle lineebox)
            new Konva.Line({ stroke:'black', points: [0,0,0,group.height()+this.bottomRow]}).addTo(group)
            // End of Cycle Line
            new Konva.Line({ stroke:'black', points: [group.width(),0,group.width(),group.height()+this.bottomRow]}).addTo(group)
            // Cycle # Label
            new Konva.Text({ text:cycle.number,      x: group.width()/2 }).addTo(group).anchorBottomMiddle()
            // Cycle Launch Count
            new Konva.Text({ text:cycle.launchCount, y: group.height() }).addTo(group).anchorTopRight({padX:5,padY:5})
            // Cycle Land Count
            new Konva.Text({ text:cycle.landCount,   x: group.width(), y: group.height() }).addTo(group).anchorTopLeft({padX:5,padY:5})
            // Cycle Start Time
            new Konva.Text({ text:cycle.start.toHHMM() }).addTo(group).anchorBottomMiddle()
            // Cycle End Time
            new Konva.Text({ text:cycle.end.toHHMM(), x: group.width() }).addTo(group).anchorBottomMiddle()
        })
        
        /** Events.Squadrons */
        this.squadrons = new Konva.Group({ y: 2*this.topRow, width: this.events.width(), height: this.events.height()-this.bottomRow-2*this.topRow}).addTo(this.events)
        
        let spacing = Object.keys(airplan.squadrons).length ? this.squadrons.height() / (Object.keys(airplan.squadrons).length) : this.squadrons.height()
        // For each squadron
        Object.values(airplan.squadrons).forEach((squadron,i)=>{
            // Group for Squadron Text
            let group = new Konva.Group({x: this.leftCol/2, y: (i+.5)*spacing}).addTo(this.squadrons).anchorCenter()
            
            // Squadron Text
            new Konva.Text({align: 'center', text: [squadron.name,squadron.cs,squadron.tms,squadron.modex].join('\n').toUpperCase()}).addTo(group).anchorCenter()
            
            group.fitToChildren().addHighlightBox();
            
            // Squadron Letter
            new Konva.Text({ text: squadron.letter, x: this.leftCol/2+this.letterCol/2 }).addTo(group).anchorCenter()
            
            // Horizontal Line across bottom of squadron
            new Konva.Line({stroke:'black', points: [0,(i+1)*spacing, this.squadrons.width(), (i+1)*spacing]}).addTo(this.squadrons);
            
            // Group for D/N Totals
            group = new Konva.Group({x: this.squadrons.width()-this.rightCol/2, y: (i+.5)*spacing}).addTo(this.squadrons).anchorCenter()
            
            // D/N Totals Text
            new Konva.Text({ text: squadron.day + '/' + squadron.night }).addTo(group).anchorCenter()
            
            // Squadron.Timebox
            let timebox = new Konva.Group({ 
                x: this.leftCol + this.letterCol,
                y: i*spacing,
                width: this.squadrons.width() - this.leftCol - this.letterCol-this.rightCol,
                height: spacing,
            }).addTo(this.squadrons)
            
            let lineCount = Object.values(airplan.lines).filter(l=>l.squadronID==squadron.ID).length
            let lineSpace = timebox.height() / (lineCount+1) //=> Heuristic for placing lines nicely
            // For each line in this squadron, sorting lines by start time. Lines will flow top left to bottom right
            Object.values(airplan.lines).filter(l=>l.squadronID==squadron.ID).sort((a,b)=>a.start-b.start).forEach((line,j)=>{
                // Draw all of the sorties
                line.sorties.forEach((sortie,k)=>{
                    // Group for sortie, to simplify drawing dimensions
                    let sortieGroup = new Konva.Group({
                        x: this.time2pixels(sortie.start,airplan),
                        y: (1+j)*lineSpace,
                        width: this.time2pixels(sortie.end,airplan) - this.time2pixels(sortie.start,airplan),
                    }).addTo(timebox)
                    
                    // Sortie Line
                    new Konva.Line({stroke:'black', points:[0,0,sortieGroup.width(),0]}).addTo(sortieGroup)
                    View.drawCondition[sortie.startType](0,0).addTo(sortieGroup)
                    View.drawCondition[sortie.endType](sortieGroup.width(),0).addTo(sortieGroup)
                    
                    // Event + Note
                    new Konva.Text({ text:`${sortie.event} ${sortie.note}`,x:1,fontSize:10}).addTo(sortieGroup).anchorBottomLeft({padX:2,padY:2})
                    
                    sortieGroup.fitToChildren().addHighlightBox({minSize:4,strokeWidth:4})
                })
            })
        })
        
        
        this.fitStageIntoParentContainer();
    }
    
    // Create an element with an optional CSS class
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        return element
    }
    
    // Retrieve an element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector)
        return element
    }
    
    time2pixels = (time,airplan) => {
        let pixels = (time-airplan.start) * this.timebox.width()/(airplan.end-airplan.start)
        pixels = pixels<0 ? 0 : pixels
        pixels = pixels>this.timebox.width() ? this.timebox.width(): pixels
        return pixels
    }
    
    fitStageIntoParentContainer = () => {
        var container = this.stage.container();
        // now we need to fit stage into parent container
        var containerWidth = container.offsetWidth;
        // but we also make the full scene visible so we need to scale all objects on canvas
        var scale = containerWidth / this.sceneWidth;
        this.stage.width(this.sceneWidth * scale);
        this.stage.height(this.sceneHeight * scale);
        this.stage.scale({ x: scale, y: scale });
    }
    
    static drawCondition = {
        flyon: (x,y) => {
            return new Konva.Line({ points: [x-12,y-12,x,y],stroke: 'black' })
        },
        flyoff: (x,y) => {
            return new Konva.Line({ points: [x,y,x+12,y-12],stroke: 'black' })
        },
        pull: (x,y) => {
            return new Konva.Line({ points: [x,y-8,x,y+8],stroke: 'black' })
        },
        stuff: (x,y) => {
            return new Konva.Line({ points: [x,y-8,x,y+8],stroke: 'black' })
        },
        hp: (x,y) => {
            return new Konva.Line({
                points: [x,y+5, x+4,y,  x,y-5,  x-4,y,  x,y+5],
                stroke: 'black',
                closed: true,
                fill: 'white', fillEnabled: true,
            })
        },
        hpcs: (x,y) => {
            return new Konva.Line({
                points: [x,y+5, x+4,y,  x,y-5,  x-4,y,  x,y+5],
                stroke: 'black',
                closed: true,
                fill: 'black', fillEnabled: true,
            })
        }
    }
}
