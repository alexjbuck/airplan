class Squadron { 
    constructor(name, cs, tms, modex) {
        this.name = name;
        this.cs = cs;
        this.tms = tms;
        this.modex = modex;
        this.ID = uuidv4();
        this._day = 0;
        this._night=0;
    }
    get letter() {
        return String.fromCharCode(Object.values(this.parent.squadrons).findIndex(squadron => squadron.ID === this.ID)+65);
    }
    get day() {
        return this._day;
    }
    get night() {
        return this._night;
    }
}