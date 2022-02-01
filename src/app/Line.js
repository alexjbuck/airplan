class Line extends Event {
    constructor(squadronID) {
        super(new Date(),new Date());
        this.squadronID = squadronID;
    }
    /** @returns {Squadron} The squadron the line is assigned to. */
    get squadron() {
        if (this.parent) {
            return this.parent.squadrons[this.squadronID];
        }
    }
}