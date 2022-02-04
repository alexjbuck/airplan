class Model {
    constructor() {
        this.init()
    }
        
    init() {
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
        this.onChange()
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
    
    /**
     * @method updateCounts Updates the sortie counts of each squadron-cycle pair. Used to number events.
     */
    updateCounts() {
        this.counts = {}
        Object.values(this.sorties).sort((a,b)=>a.start-b.start).forEach(s=>{
            if (this.counts[[s.cycle,s.line.squadron.letter]] == undefined) {
                this.counts[[s.cycle,s.line.squadron.letter]] = 1
            } else {
                this.counts[[s.cycle,s.line.squadron.letter]] += 1
            }
        })  
    }

    /**
     * @callback onChange Stub for the local callback function for when the model changes.
     */
    onChange() {}

    /**
     * @method bindOnChange The hook exposed to the controller for when the model changes.
     * @param {Function} handler The callback function from the controller to execute when the model is updated
     */
    bindOnChange(handler) {
        this.onChange = () => {
            this.updateCounts()
            handler()
        }
    }

    load(data) {
        this.init()
        this.date           = data._date
        this.start          = data._start
        this.end            = data._end
        this.title           = data.title
        this.sunrise        = data._sunrise
        this.sunset         = data._sunset
        this.moonrise       = data._moonrise
        this.moonset        = data._moonset
        this.moonphase       = data.moonphase
        this.flightquarters = data._flightquarters
        this.heloquarters   = data._heloquarters
        this.variation       = data.variation
        this.timezone        = data.timezone
        Object.values(data.lines).forEach(l=>{
            this.lines[l.ID] = Object.assign(new Line, l)
            this.lines[l.ID].parent = this;
        })
        Object.values(data.squadrons).forEach(s=>{
            this.squadrons[s.ID] = Object.assign(new Squadron, s)
            this.squadrons[s.ID].parent = this;
        })
        Object.values(data.cycles).forEach(c=>{
            this.cycles[c.ID] = Object.assign(new Cycle, c)
            this.cycles[c.ID].parent = this;
        })
        Object.values(data.sorties).forEach(s=>{
            this.sorties[s.ID] = Object.assign(new Sortie, s)
            this.sorties[s.ID].parent = this;
        })
        this.onChange()    
    }
    
    async removeSquadron(squadron) {
        delete this.squadrons[squadron.ID]
        this.onChange()
    }
    addSquadron(name, cs, tms, modex) {
        let squadron = new Squadron(name, cs, tms, modex)
        squadron.parent = this;
        this.squadrons[squadron.ID] = squadron;        
        this.onChange()
        return squadron
    }
    
    async removeLine(id) {
        delete this.lines[id]
        this.onChange()
    }
    addLine(squadronID) {
        let line = new Line(squadronID)
        line.parent = this;
        this.lines[line.ID] = line;
        this.onChange()
        return line;
    }
    
    async removeSortie(id) {
        delete this.sorties[id]
        this.onChange()
    }
    addSortie(lineID, start, end, startType, endType, note, startCycleID=null, endCycleID=null) {
        let sortie = new Sortie(lineID, start, end, startType, endType, note, startCycleID, endCycleID)
        sortie.parent = this;
        this.sorties[sortie.ID] = sortie;
        this.onChange()
        return sortie
    }
    
    async removeCycle(cycle) {
        delete this.cycles[cycle.ID]
        this.onChange()
    }
    addCycle(start, end) {
        let cycle = new Cycle(start, end);
        cycle.parent = this;
        this.cycles[cycle.ID] = cycle;
        this.onChange()
        return cycle
    }
}