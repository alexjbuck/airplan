/**
 * @class Cycle
 * @classdesc A cycle has a start and end time. They're also numbered in order based on start time.
 * @see Event
 */
class Cycle extends Event {
    constructor(start, end) { 
        super(start,end);
    }
    static convert({start, end, ID}) {
        let cycle = new Cycle(start,end);
        cycle.ID = ID;
        return cycle
    }

    get number() {
        if (this.parent) {
            return Object.values(this.parent.cycles).sort((a,b)=>a.start-b.start).findIndex(c=>c.ID == this.ID)+1
        }
    }
   
    get launchCount() {
        return 0;
    }

    get landCount() {
        return 0;
    }

    after() {
        // Return a cycle that starts after this cycle.
        let end = new Date(this.end);
        end.setHours( end.getHours() + airplan.defaults.sortieDuration );
        return new Cycle(this.end,end )
    }
    
    before() {
        // Return a cycle that starts before this cycle.
        let start = new Date(this.start);
        start.setHours( start.getHours() - airplan.defaults.sortieDuration );
        return new Cycle(start,this.start)
    }
}