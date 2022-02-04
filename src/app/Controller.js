class Controller {
    constructor() {
        this.airplan = new Model();
        this.view = new View();
        window.addEventListener('resize', this.view.fitStageIntoParentContainer);
        
        // this.airplan.addSquadron('VFA-213','TOM','FA-18','100')
        // this.airplan.addLine(Object.keys(this.airplan.squadrons)[0])
        // this.airplan.addLine(Object.keys(this.airplan.squadrons)[0])
        // this.airplan.addSquadron('VFA-87','HEX','FA-18','200')
        // this.airplan.addLine(Object.keys(this.airplan.squadrons)[1])
        // this.airplan.addLine(Object.keys(this.airplan.squadrons)[1])
        // let d1 = new Date()
        // let d2 = new Date()
        // d1.setHours(10,0,0,0)
        // d2.setHours(11,0,0,0)
        // let c1 = this.airplan.addCycle(d1,d2)
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[0],d1, d2, 'flyon','hpcs','Jarvis')
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[1],1, 1, 'pull','hp','Poon',c1.ID,c1.ID)
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[2],d1-3600*1000, d2, 'flyon','hp','Jarvis')
        // d1.setHours(11,0,0,0)
        // d2.setHours(12,0,0,0)
        // let c2 = this.airplan.addCycle(d1,d2)
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[0],d1, d2+3600, 'hpcs','flyoff','Jarvis')
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[1],1, 1, 'hp','stuff','Poon',c2.ID,c2.ID)
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[2],d1, d2, 'hp','flyoff','Jarvis')
        // this.airplan.addSortie(Object.keys(this.airplan.lines)[3],1, 1, 'flyon','stuff','Poon',c2.ID,c2.ID)
 
        
        this.airplan.bindOnChange(this.onAirplanChanged)
        this.view.bindMenuAddPlaceholderSquadron(this.handleAddPlaceholderSquadron)
        this.view.bindMenuRemoveSquadron(this.handleRemoveSquadron)
        this.view.bindMenuReset(this.handleReset)
        this.view.bindMenuRefresh(this.handleRefresh)
        this.view.bindMenuLoad(this.handleLoadFile)
        this.view.bindMenuSave(this.handleSaveFile)
        this.view.bindMenuExport(this.handleExportFile)
        this.view.bindMenuHelp(this.handleHelp)
        this.view.help()
        this.onAirplanChanged();

    }
    
    onAirplanChanged = () => {
        this.view.drawStage(this.airplan);
        this.view.drawList(this.airplan);
    }

    handleAddPlaceholderSquadron = () => {
        this.airplan.addSquadron('Squadron ' + (Object.keys(this.airplan.squadrons).length+1),'CS','TMS','MODEX')
    }

    handleReset = () => {
        this.airplan.init()
    }

    handleRefresh = () => {
        this.onAirplanChanged();
    }

    handleLoadFile = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = JSON.parse(e.target.result)
            this.airplan.load(data)
        }
        reader.readAsText(file)
    }

    handleSaveFile = () => {
        let file = new Blob([JSON.stringify(this.airplan,getCircularReplacer())], {type: "application/json"})
        saveAs(file,this.airplan.date.toYYYYMMDD()+".json")
    }

    handleExportFile = () => {
        let w = 11
        let h = 8.5
        let m = .01
        var pdf = new jspdf.jsPDF('l', 'in', [8.5, 11]);
        let imgData = this.view.stage.toDataURL({mimeType: 'image/png', quality: 1, pixelRatio: 3});
        pdf.addImage(imgData, 'JPEG', m*w/2, m*h/2, w*(1-m), h*(1-m), undefined, 'FAST');
        pdf.save('airplan_'+this.airplan.date.toYYYYMMDD()+'.pdf');    
    }

    handleHelp = () => {
        this.view.help()
    }

    handleRemoveSquadron = () => {
        this.airplan.removeSquadron(Object.values(this.airplan.squadrons).at(-1))
    }

    handleAddSquadron = (name,cs,tms,modex) => {
        this.airplan.addSquadron(name,cs,tms,modex)
    }

    handleAddLine = (squadronID) => {
        this.airplan.addLine(squadronID)
    }

    handleAddSortie = (lineID, start, end, startType, endType, note, startCycleID, endCycleID) => {
        this.airplan.addSortie(lineID, start, end, startType, endType, note, startCycleID, endCycleID)
    }

    handleAddCycle = (start, end) => {
        this.airplan.addCycle(start, end)
    }
    
    openCycleForm = (airplan) => {
        let html = `
            <h3>Cycle Form</h3>
            `
        openModal(html)
    }

    openListForm = (airplan) => {
        let html = `
            <h3>List Form</h3>
            `
        openModal(html)
    }

    openSortieForm = (airplan) => {
        let html = `
            <h3>Sortie Form</h3>
            `
        openModal(html)
    }

    openTimeForm = (airplan) => {
        let html = `
            <h3>Time Form</h3>
            `
        openModal(html)
    }
    
}