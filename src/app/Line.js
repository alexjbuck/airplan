class Line extends Event {
    constructor(squadronID) {
        super(new Date(),new Date());
        this.squadronID = squadronID;
    }
    static convert({squadronID, ID}) {
        let line = new Line(squadronID);
        line.ID = ID
        return line
    }

    /** @returns {Squadron} The squadron the line is assigned to. */
    get squadron() {
        if (this.parent) {
            return this.parent.squadrons[this.squadronID];
        }
    }
    get sorties() {
        if (this.parent) {
            return Object.values(this.parent.sorties).filter(s=>s.lineID == this.ID).sort((a,b)=>a.start-b.start);
        }
    }
    get start() {
        if (this.sorties.length > 0) {
            return this.sorties[0].start;
        }
    }
    get end() {
        if (this.sorties.length > 0) {
            return this.sorties[this.sorties.length-1].end;
        }
    }
}