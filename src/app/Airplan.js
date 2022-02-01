class Model {
    constructor() {
        this._date           = new Date( new Date().setHours(0) )
        this._start          = new Date( new Date().setHours(8,0) )
        this._end            = new Date( new Date().setHours(18,0) )
        this.title           = "Check it out Title";
        this._sunrise        = new Date( new Date().setHours(6,30) )
        this._sunset         = new Date( new Date().setHours(19,0) )
        this._moonrise       = new Date( new Date().setHours(20) )
        this._moonset        = new Date( new Date().setHours(2) )
        this.moonphase       = "__%";
        this._flightquarters = new Date( new Date() )
        this._heloquarters   = new Date( new Date() )
        this.variation      = "__";
        this.timezone       = "__";
        this.lines          = {};
        this.sorties        = {}
        this.squadrons      = {};
        this.cycles         = {};
        this.counts         = {};
    }
    
    set date(date) {
        this._date = new Date(date);
        this._date.setHours(0);
    }
    set start(start)                    { this._start             = new Date(start)          }
    set end(end)                        { this._end               = new Date(end)            }
    set flightquarters(flightquarters)  { this._flightquarters    = new Date(flightquarters) }
    set heloquarters(heloquarters)      { this._heloquarters      = new Date(heloquarters)   }
    set sunrise(sunrise)                { this._sunrise           = new Date(sunrise)        }
    set sunset(sunset)                  { this._sunset            = new Date(sunset)         }
    set moonrise(moonrise)              { this._moonrise          = new Date(moonrise)       }
    set moonset(moonset)                { this._moonset           = new Date(moonset)        }
    get date()                          { return this._date           } 
    get start()                         { return this._start          }
    get end()                           { return this._end            } 
    get flightquarters()                { return this._flightquarters }
    get heloquarters()                  { return this._heloquarters   }
    get sunrise()                       { return this._sunrise        }   
    get sunset()                        { return this._sunset         }
    get moonrise()                      { return this._moonrise       }
    get moonset()                       { return this._moonset        }
    
    async removeSortie(id) { delete this.sorties[id] }
    addSortie(lineID, start, end, startType, endType, note, startCycle=null, endCycle=null) {
        let sortie = new Sortie(lineID, start, end, startType, endType, note, startCycle, endCycle)
        sortie.parent = this;
        this.sorties[sortie.ID] = sortie;
    }
    
    updateCounts() {
        this.counts = {}
        Object.values(this.sorties).sort((a,b)=>a.start-b.start).forEach(s=>{
            let letter = s.line.squadron.letter
            if (counts[[s.cycle,letter]] == undefined) {
                counts[[s.cycle,letter]] = 1
            } else {
                counts[[s.cycle,letter]] += 1
            }
        })  
    }
    
    async removeLine(id) { delete this.lines[id] }
    addLine(squadronID) {
        let line = new Line(squadronID)
        line.parent = this;
        this.lines[line.ID] = line;
    }
    
    async removeCycle(cycle) { delete this.cycles[cycle.ID] }
    addCycle(start, end) {
        let cycle = new Cycle(start, end);
        cycle.parent = this;
        this.cycles[cycle.ID] = cycle;
    }
    
    async removeSquadron(squadron) { delete this.squadrons[squadron.ID] }
    addSquadron(name, cs, tms, modex) {
        let squadron = new Squadron(name, cs, tms, modex)
        squadron.parent = this;
        this.squadrons[squadron.ID] = squadron;
    }
    
}

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
    
    drawMenu = () => {
        var html =`
        <div class='btn-group btn-group-sm mr-3'>
        <button class='btn btn-outline-success btn' data-toggle='tooltip' data-placement='top' title='Add Squadron' onclick='this.addSquadron()'><i class='fas fa-plus'></i></button>
        <button class='btn btn-outline-danger btn' data-toggle='tooltip' data-placement='top' title='Remove Squadron' onclick='this.deleteBottomSquadron()'><i class='fas fa-minus'></i></button>
        </div>
        <!-- <div class='btn-group btn-group-sm mr-3'>
        <button id='help' class='btn btn-warning' onclick='this.help()'>Help</button>
        </div> -->
        <div class='btn-group btn-group-sm mr-3'>
        <button id='reset-stage'   class='btn btn-outline-danger' data-toggle='tooltip' data-placement='top' title='Reset Airplan' onclick='this.reset()'><i class='fas fa-dumpster-fire'></i></button>
        <button id='refresh-stage' class='btn btn-outline-primary' data-toggle='tooltip' data-placement='top' title='Refresh' onclick='refresh()'><i class='fas fa-sync'></i></button>
        <label  id='load' type='file'  class='btn btn-outline-primary my-0' data-toggle='tooltip' data-placement='top' title='Load'><i class="fas fa-folder-open" aria-hidden="true"></i><input type='file' id='filepath' hidden onchange='this.load(event)'></label>
        <button id='save'  class='btn btn-outline-primary' data-toggle='tooltip' data-placement='top' title='Save' onclick='this.save()'><i class='fas fa-save'></i></button>
        <button id='print' class='btn btn-outline-primary' data-toggle='tooltip' data-placement='top' title='Export PDF' onclick='this.print()'><i class='fas fa-file-pdf'></i></button>
        <button id="submit-feedback" class="btn btn-outline-success" data-toggle='tooltip' data-placement='top' title='Thank you!' onclick="location.href='mailto:alexander.j.buck@navy.mil?subject=Airplan feedback&body=Three things I liked:%0d%0a1. %0d%0a2. %0d%0a3. %0d%0a%0d%0aThree things I did not like:%0d%0a1. %0d%0a2. %0d%0a3. %0d%0a%0d%0aAny other feedback:%0d%0a%0d%0aThank You!'">Provide Feedback</button>
        </div>`
        
        $('#menu').html(html)
    }
    
    drawList = (airplan) => {
        
    }
    
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
        this.printArea.add( new Konva.Rect({
            width: this.printArea.width(),
            height: this.printArea.height(),
            stroke: 'black',
        }))
        
        // Header
        this.header = new Konva.Group({
            width: this.printArea.width(),
            height: this.headerHeight,
        }).addTo(this.printArea);
        
        new Konva.Line({
            points: [0,this.header.height(),this.header.width(),this.header.height()],
            stroke: 'black'
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
        new Konva.Group({
            id: 'title',
            x: this.header.width()/2,
            y: config.body.padding,
        }).addTo(this.header)
        
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
        new Konva.Group({
            id: 'time',
            x: this.header.width()-config.body.padding,
            y: config.body.padding,
        }).addTo(this.header)
        
        new Konva.Text({
            id: 'time.label',
            text: ['flight quarters:','Helo quarters:','Mag Var:','Time Zone:'].join('\n').toUpperCase(),
            align: 'right',
        }).addTo(this.stage.findOne('#time'));
        
        new Konva.Text({
            id: 'time.value',
            x: this.stage.findOne('#time.label').width() + config.body.padding,
            text: ['flightquarters','heloquarters'].map(k=>airplan[k].toHHMM()).concat([airplan.variation,airplan.timezone]).join('\n'),
        }).addTo(this.stage.findOne('#time'));
        
        this.stage.findOne('#time').fitToChildren().anchorTopRight().addHighlightBox();
        
        // Events
        this.events = new Konva.Group({
            id: 'events',
            y: this.header.height(),
            width: this.printArea.width(),
            height: this.printArea.height()-this.header.height()
        }).addTo(this.printArea);
        
        new Konva.Line({ // Horizontal Line below sun/moon
            points: [0,this.topRow, this.events.width(),this.topRow],
            stroke: 'black'
        }).addTo(this.events);
        
        new Konva.Line({ // Horizontal Line across top of sorties
            points: [0,2*this.topRow, this.events.width(),2*this.topRow],
            stroke: 'black'
        }).addTo(this.events);
        
        new Konva.Line({ // Vertical Line along right side of squadrons
            points: [this.leftCol,2*this.topRow, this.leftCol, this.events.height()-this.bottomRow],
            stroke: 'black'
        }).addTo(this.events);
        
        new Konva.Line({ // Vertical Line along right side of squadron letter
            points: [this.leftCol+this.letterCol,2*this.topRow, this.leftCol+this.letterCol, this.events.height()],
            stroke: 'black'
        }).addTo(this.events);
        
        new Konva.Text({ // Text label for Squadron column
            text: 'SQUADRON',
            x: this.leftCol/2,
            y: 1.5 * this.topRow
        }).addTo(this.events).anchorCenter();
        
        new Konva.Line({ // Horizontal Line across bottom of sorties
            points: [0,this.events.height()-this.bottomRow, this.events.width(), this.events.height()-this.bottomRow],
            stroke: 'black'
        }).addTo(this.events);
        
        new Konva.Text({ // Text label for Launch/Land totals
            text: 'LAUNCH/LAND',
            x: (this.leftCol+this.letterCol)/2,
            y: this.events.height()-this.bottomRow/2,
        }).addTo(this.events).anchorCenter()
        
        new Konva.Line({ // Vertical Line along the left side of day/night totals
            points: [this.events.width()-this.rightCol,this.topRow, this.events.width()-this.rightCol, this.events.height()],
            stroke: 'black'
        }).addTo(this.events);
        
        new Konva.Text({ // Text Label for day/night totals
            text: 'D/N',
            x: this.events.width()-this.rightCol/2,
            y: 1.5 * this.topRow,
        }).addTo(this.events).anchorCenter()
        
        // Events.Squadrons
        this.squadrons = new Konva.Group({
            id: 'squadrons',
            y: 2*this.topRow,
            width: this.events.width(),
            height: this.events.height()-this.bottomRow-2*this.topRow,
        }).addTo(this.events);
        let spacing = Object.keys(airplan.squadrons).length ? this.squadrons.height() / (Object.keys(airplan.squadrons).length) : this.squadrons.height()
        Object.values(airplan.squadrons).forEach((squadron,i)=>{
            let group = new Konva.Group({ // Group for Squadron Text
                id: `squadron${i}`,
                name: 'squadron',
                x: this.leftCol/2,
                y: (i+.5)*spacing,
            }).addTo(this.squadrons).anchorCenter()
            
            new Konva.Text({ // Squadron Text
                id: `squadron${i}.label`,
                text: [squadron.name,squadron.cs,squadron.tms,squadron.modex].join('\n').toUpperCase(),
                align: 'center',
            }).addTo(group).anchorCenter()
            
            group.fitToChildren().addHighlightBox();
            
            new Konva.Text({ // Squadron Letter
                id: `squadron${i}.letter`,
                text: squadron.letter,
                x: this.leftCol/2+this.letterCol/2,
            }).addTo(group).anchorCenter()
            
            new Konva.Line({ // Horizontal Line across bottom of squadron
                points: [0,(i+1)*spacing, this.squadrons.width(), (i+1)*spacing],
                stroke: 'black'
            }).addTo(this.squadrons);

            group = new Konva.Group({ // Group for D/N Totals
                x: this.squadrons.width()-this.rightCol/2,
                y: (i+.5)*spacing,
            }).addTo(this.squadrons).anchorCenter()
            new Konva.Text({ // D/N Totals Text
                text: squadron.day + '/' + squadron.night,
            }).addTo(group).anchorCenter()


        })
        
        // Events.Timebox
        this.timebox = new Konva.Group({
            id: 'timebox',
            x: this.leftCol + this.letterCol,
            width: this.events.width() - this.leftCol - this.letterCol - this.rightCol,
            height: this.events.height() - this.bottomRow,
        }).addTo(this.events).addHighlightBox()
        
        /** Sunrise Icon */
        new Konva.Group({ // Sunrise Group
            x: this.time2pixels(airplan.sunrise,airplan),
            y: 20,
            id:'sunrise.group',
        }).addTo(this.timebox).anchorCenter()
        
        new Konva.Arc({ // Sunrise
            angle: 180,
            outerRadius: 15,
            clockwise: true,
            stroke: 'black',
        }).addTo(this.stage.findOne('#sunrise.group'));
        
        new Konva.Text({ // Sunrise Text
            text: airplan.sunrise.toHHMM(),
            y: -20,
        }).addTo(this.stage.findOne('#sunrise.group')).anchorBottomMiddle();
        this.stage.findOne('#sunrise.group').fitToChildren().addHighlightBox()
        
        /** Sunset Icon */
        new Konva.Group({ // Sunset Group
            x: this.time2pixels(airplan.sunset,airplan),
            y: 20,
            id:'sunset.group',
        }).addTo(this.timebox).anchorCenter()
        
        new Konva.Arc({ // Sunset
            angle: 180,
            outerRadius: 15,
            clockwise: true,
            stroke: 'black',
            fill: 'black'
        }).addTo(this.stage.findOne('#sunset.group'));
        
        new Konva.Text({ // Sunset Text
            text: airplan.sunset.toHHMM(),
            y: -20,
        }).addTo(this.stage.findOne('#sunset.group')).anchorBottomMiddle();
        this.stage.findOne('#sunset.group').fitToChildren().addHighlightBox()
        
        /** Timebox.Start/End */
        new Konva.Text({
            text: '\u21A6'+airplan.start.toHHMM(),
            y: this.topRow*2.5
        }).addTo(this.timebox).anchorTopLeft()
        new Konva.Text({
            text: airplan.end.toHHMM()+'\u21A4',
            x: this.timebox.width(),
            y: this.topRow*2.5
        }).addTo(this.timebox).anchorTopRight()
    
        /** Timebox.Cycles */
        Object.values(airplan.cycles).forEach((cycle,i)=>{
            let group = new Konva.Group({
                id: `cycle${i}`,
                x: this.time2pixels(cycle.start,airplan),
                y: this.topRow*2,
                width: this.time2pixels(cycle.end,airplan) - this.time2pixels(cycle.start,airplan),
                height: this.timebox.height() - this.topRow*2,
            }).addTo(this.timebox)
            new Konva.Line({ // Start of Cycle line
                points: [0,0,0,group.height()+this.bottomRow],
                stroke: 'black'
            }).addTo(group)
            new Konva.Line({ // End of Cycle Line
                points: [group.width(),0,group.width(),group.height()+this.bottomRow],
                stroke: 'black'
            }).addTo(group)
            new Konva.Text({ // Cycle # Label
                text: cycle.number,
                x: group.width()/2,
            }).addTo(group).anchorBottomMiddle()
            new Konva.Text({ // Cycle Launch Count
                text: cycle.launchCount,
                y: group.height()
            }).addTo(group).anchorTopRight({padX:5,padY:5})
            new Konva.Text({ // Cycle Land Count
                text: cycle.landCount,
                x: group.width(),
                y: group.height()
            }).addTo(group).anchorTopLeft({padX:5,padY:5})
            new Konva.Text({ // Cycle Start Time
                text: cycle.start.toHHMM(),
            }).addTo(group).anchorBottomMiddle()
            new Konva.Text({ // Cycle End Time
                text: cycle.end.toHHMM(),
                x: group.width(),
            }).addTo(group).anchorBottomMiddle()
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
}

class Controller {
    constructor() {
        this.airplan = new Model();
        this.view = new View();
        window.addEventListener('resize', this.view.fitStageIntoParentContainer);

        let d1 = new Date()
        let d2 = new Date()
        d1.setHours(10,0,0,0)
        d2.setHours(11,0,0,0)
        this.airplan.addCycle(d1,d2)
        this.airplan.addSquadron('VFA-1','TOM','FA-18','100')
        this.airplan.addSquadron('VFA-2','HEX','FA-18','200')

        this.onAirplanChanged(this.airplan);
    }
    
    onAirplanChanged(airplan) {
        this.view.drawStage(airplan);
        this.view.drawList(airplan);
    }
    
    
}


