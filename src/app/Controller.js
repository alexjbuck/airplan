class Controller {
    constructor() {
        this.openInfoForm()
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

    openInfoForm = (airplan) => {
        let html = `
        <div class='container'>
            <div class='row'>
                <div class=''>
                    <h3> Welcome to Airplan!</h3>
                </div>
                <div class='ml-auto'>
                    <small>Version: 0.1.0</small>
                </div>
            </div>
        </div>
        <p>
            This is a simple web app that allows you to view and edit your squadron's flight plans.
            You can add new flights, edit existing flights, and delete flights.
            You can also export your squadron's flight plans to PDF.
        </p>
        <i class="fas fa-exclamation-triangle"></i> Tips:
        <ul>
            <li>To get started, click the blue <i style="color:blue" class='fas fa-plus'></i> in the top right corner to add a new squadron.</li>
            <li>You can add cycles by clicking the "<i class='fas fa-plus'></i> Add Cycle" button and providing the cycle times</li>
            <li>Next add an aircraft line by clicking the "<i class='fas fa-plus'></i> Add Line" button.</li>
            <li>Sorties are added into a line by clicking "<i class='fas fa-plus'></i> Add Sortie" within a line in the list.</li>
            <li>Save your airplan by clicking the <i class='fas fa-save'></i> button. This will download a file that you can upload later to resume your progress.</li>
            <li><b>Best Practice</b>: Add all of your squadrons, then save your airplan. Use that file as your starting point for the future.</li>
            <li>View these tips anytime by clicking the <i style='color:#ffc107' class='fa fa-question-circle'></i> help icon in the top right corner.</li>
        </ul>
        <p>
            Play around, you can't break anything, and hopefully you find this app useful!
        </p>
        <p>
            Please provide feedback to <span class='jarvis'>JARVIS</span> at <a href=mailto:alexander.j.buck@gmail.com>alexander.j.buck@navy.mil</a> by
            clicking the <span style="color:green">green</span> "Feedback" button in the top right corner.
        </p>
        `
        openModal(html)
    }
    
}