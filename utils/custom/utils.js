Date.prototype.toLocalTimeString = function() {
    // Take a date object and return a string of the format:
    // yyyy-mm-ddTHH:MM and return this in local time.
    // This looks like ISO format but ISO format uses GMT.
    let yyyy = this.getFullYear()
    let mm = this.getMonth() < 9 ? '0'+(+this.getMonth()+1) : this.getMonth()+1 // getMonth returns 0-11
    let dd = this.getDate() < 10 ? '0'+this.getDate() : this.getDate()
    let HH = this.getHours() < 10 ? '0'+this.getHours() : this.getHours()
    let MM = this.getMinutes() < 10 ? '0'+this.getMinutes() : this.getMinutes()
    return yyyy+'-'+mm+'-'+dd+'T'+HH+':'+MM
}

Date.prototype.toYYYYMMDD = function() {
    let yyyy = this.getFullYear()
    let mm = this.getMonth() < 9 ? '0'+(+this.getMonth()+1) : this.getMonth()+1 // getMonth returns 0-11
    let dd = this.getDate() < 10 ? '0'+this.getDate() : this.getDate()
    return yyyy+'-'+mm+'-'+dd
}

Date.prototype.toHHMM = function() {
    // return the datetime object as HHMM string
    let HH = this.getHours() < 10 ? '0'+this.getHours() : this.getHours()
    let MM = this.getMinutes() < 10 ? '0'+this.getMinutes() : this.getMinutes()
    return ''+HH+MM
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
}

// Returns the cycle number for a sortie based on launch time.
getCycle = ({start}) => {
    if (typeof start == "undefined" || start == null) {
        return "-"
    }
    let cycles = airplan.data.events.cycles;
    let sorted = Object.values(cycles).sort((a,b)=>a.start-b.start)
    if (sorted.length<1) {
        return 0
    }
    if (start < sorted[0].start) {
        // If the start is before the first cycle, it's cycle 0.
        return 0;
    } else if (start >= sorted[sorted.length-1].end) {
        // If the start is after the last cycle, it's the last cycle + 1 (which is the length+1).
        return sorted.length+1;
    } else {
        // Otherwise, it's the first cycle that starts before and ends after the start.
        let cycle = sorted.find(c => c.start <= start && c.end > start).number
        return cycle ? cycle : '-'
    }
}

getSquadron = ({squadron}) => {
    return Object.values(airplan.data.events.squadrons).find(s => s.name == squadron)
}

assignEvents = () => {
    // Assign an event code to each sortie. The code is defined as the cycle number, followed by the squadron letter, followed by the sortie number for that squadron within that cycle.
    let counts = {}
    Object.values(airplan.data.events.sorties).sort((a,b)=>a.start-b.start).forEach(s=>{
        let cycle = getCycle(s)
        let letter = getSquadron(s).letter
        if (counts[[cycle,letter]] == undefined) {
            counts[[cycle,letter]] = 1
        } else {
            counts[[cycle,letter]] += 1
        }
        s.event = cycle+letter+counts[[cycle,letter]]
    })
}