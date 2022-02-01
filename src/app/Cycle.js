/**
 * @class Cycle
 * @classdesc A cycle has a start and end time. They're also numbered in order based on start time.
 * @see Event
 */
class Cycle extends Event {
    constructor(start, end) { 
        super(start,end);
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


class CycleListView {
    constructor($container) {
        this.$container = $container;
    }
    draw() {
        let html = `
        <h3>Cycles</h3>
        <button class='btn btn-primary btn-block' onclick=tabular.cycles.add()>Add Cycle</button>
        <ul class='list-group'>`;
        Object.values(airplan.cycles).sort((a,b)=>a.start-b.start).forEach(c=>{
            html += `
            <li class='list-group-item list-group-item-action align-middle'>
                <b>#${c.number}</b>: <b>Start:</b> ${c.start.toHHMM()}\u0009<b>End:</b> ${c.end.toHHMM()}
                <div class='btn-group float-right'>
                <button class='btn'            onclick='tabular.cycles.edit("${c.ID}")'><i class='fas fa-bars fa-1x'></i></button>
                <button class='btn btn-danger' onclick='airplan.cycles["${c.ID}"].del().then(refresh())'><i class='fas fa-trash-alt fa-1x'></i></button>
                </div>
            </li>`;
        });
        this.$container.html(html);
    }
    edit(id) {
    }
}

