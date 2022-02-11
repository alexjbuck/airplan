class Controller {
    constructor() {
        this.airplan = new Model();
        this.view = new View();
        window.addEventListener('resize', this.view.fitStageIntoParentContainer);
        this.onAirplanChanged();
        
        // Bind Model update events
        this.airplan.bindOnChange(this.onAirplanChanged)
        
        // Bind Menu Buttons. This only needs to be done once because the menu is not redrawn.
        this.view.bindMenuAddPlaceholderSquadron(this.handleAddPlaceholderSquadron)
        this.view.bindMenuRemoveSquadron(this.handleRemoveSquadron)
        this.view.bindMenuReset(this.handleReset)
        this.view.bindMenuRefresh(this.handleRefresh)
        this.view.bindMenuLoad(this.handleLoadFile)
        this.view.bindMenuSave(this.handleSaveFile)
        this.view.bindMenuExport(this.handleExportFile)
        this.view.bindMenuHelp(this.handleHelp)
        
        // Draw the spash page help.
        this.view.drawHelp()
    }
    
    /**
    * Core function to handle any updates that need to occur when the model changes.
    * @callback onAirplanChanged This is called when the model changes.
    */
    onAirplanChanged = () => {
        // Redraw the view.
        this.view.drawStage(this.airplan);
        this.view.drawCycleList(this.airplan);
        this.view.drawSortieList(this.airplan);        
        
        // Bind items in the stage and list view.
        // We need to rebind each time we draw because the elements are recreated.
        this.view.bindAddCycleMenu(this.handleAddCycleMenu)
        this.view.bindEditCycleMenu(this.handleEditCycleMenu)
        
        this.view.bindAddLineMenu(this.handleAddLineMenu)
        this.view.bindEditLineMenu(this.handleEditLineMenu)
        this.view.bindLineRemove(this.handleRemoveLine)
        
        this.view.bindAddSortieMenu(this.handleAddSortieMenu)
        this.view.bindEditSortieMenu(this.handleEditSortieMenu)
        this.view.bindSortieRemove(this.handleRemoveSortie)

        this.view.bindCanvasClick(this.handleCanvasClick)
    }
    
    // Stubs

    
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
    
    handleHelp = () => { this.view.drawHelp() }
    
    /**
    * @method handleAddCycleMenu is called when the user clicks the add cycle button.
    * It draws the menu and binds the submit button.
    * It prepopulates the start and end fields based on the following rules:
    *  - The start time is set based on the following priorities:
    *    1. The last cycle's end time
    *    2. One hour after the airplan's start time
    *  - The end time is set based on the following priorities:
    *    1. The start time plus one hour
    */
    handleAddCycleMenu = () => {
        this.view.drawAddCycleMenu()
        let start = new Date()
        let end = new Date()
        if (Object.keys(this.airplan.cycles).length > 0) {
            start = new Date(this.airplan.cycleList.at(-1).end)
        } else {
            start = new Date(this.airplan.start.valueOf() + 3600*1000)
        }
        end = new Date(start.valueOf() + 3600*1000)
        $('#start').val(start.toLocalTimeString())
        $('#end').val(end.toLocalTimeString())
        this.view.bindAddCycleSubmit(this.handleAddCycleSubmit) 
    }
    handleAddCycleSubmit = (start, end) => { this.airplan.addCycle(start,end)}
    
    handleEditCycleMenu = (cycleID) => {
        this.view.drawEditCycleMenu(cycleID)
        let cycle = this.airplan.cycles[cycleID]
        $('#start').val(cycle.start.toLocalTimeString())
        $('#end').val(cycle.end.toLocalTimeString())
        this.view.bindEditCycleSubmit(this.handleEditCycleSubmit)
        this.view.bindEditCycleRemove(this.handleEditCycleRemove)
    }
    handleEditCycleSubmit = (cycleID, start, end) => {
        this.airplan.cycles[cycleID].start = start;
        this.airplan.cycles[cycleID].end = end;
        this.airplan.onChange()
    }
    handleEditCycleRemove = (cycleID) => {
        this.airplan.removeCycle({ID:cycleID})
    }
    handleAddLineMenu = () => {
        this.view.drawAddLineMenu(this.airplan.squadrons)
        this.view.bindAddLineSubmit(this.handleAddLineSubmit)
    }
    handleAddLineSubmit = (squadronID) => { this.airplan.addLine(squadronID) }
    handleEditLineSubmit = (lineID, squadronID) => {
        this.airplan.lines[lineID].squadronID = squadronID
        this.airplan.onChange()
    }
    handleEditLineMenu = (lineID) => {
        this.view.drawEditLineMenu(lineID, this.airplan.squadrons)
        $('#squadron').val(this.airplan.lines[lineID].squadronID)
        this.view.bindEditLineSubmit(this.handleEditLineSubmit)
        this.view.bindEditLineRemove(this.handleRemoveLine)
    }
    handleRemoveLine = (lineID) => {
        this.airplan.removeLine(lineID)
    }
    /**
    * @method handleAddSortieMenu is called when the user clicks on the add sortie button.
    * It draws the menu and binds the submit button.
    * It prepopulates the fields based on the following rules:
    *  - The start time is set based on the following priorities:
    *    1. The start time is the end time of the line's last sortie if this is not the first sortie in the line.
    *    2. The start time is the start of the first cycle, if there is a cycle.
    *    3. The start time is the start of the airplan timeline.
    *  - The end time is set based on the following priorities:
    *    1. The end time is the cycle end time if the start was set to the cycle start time.
    *    1. The end time is 1 hour after the start time
    *  - The start type is set based on the following priorities:
    *    1. The start type is the end type of the line's last sortie if this is not the first sortie in the line.
    *    2. The start type is a pull.
    *  - The end type is set based on the following priorities:
    *    1. The end type is a stuff.
    *  - The start cycle is set based on the following priorities:
    *    1. The start cycle ID is null.
    *  - The end cycle is set based on the following priorities:
    *    1. The end cycle ID is null.
    * @param {String} lineID 
    */
    handleAddSortieMenu = (lineID) => {
        this.view.drawAddSortieMenu(this.airplan.lines[lineID])
        .then(()=>{
            let start = new Date()
            let end = new Date()
            let startType = 'pull'
            if(this.airplan.lines[lineID].end != undefined) {
                start = new Date(this.airplan.lines[lineID].end)
                end = new Date(start.valueOf()+3600*1000)
            } else if ( this.airplan.cycleList.length>0 && this.airplan.cycleList[0].end != undefined) {
                start = new Date(this.airplan.cycleList[0].start)
                end = new Date(this.airplan.cycleList[0].end)
            } else {
                start = new Date(this.airplan.start)
                end = new Date(start.valueOf()+3600*1000)
            }
            if (this.airplan.lines[lineID].sorties.length>0) {
                startType = this.airplan.endStartTypeMap[this.airplan.lines[lineID].sorties.at(-1).endType]
            }
            let endType = 'stuff'
            let startCycleID = null
            let endCycleID = null
            $('#start').val(start.toLocalTimeString())
            $('#end').val(end.toLocalTimeString())
            $('#startType').val(startType)
            $('#endType').val(endType)
            // Bind handleAddSortieSubmit to the submit button.
            this.view.bindAddSortieSubmit(this.handleAddSortieSubmit)
        })
    }
    handleAddSortieSubmit = (lineID, start, end, startType, endType, note, startCycleID, endCycleID) => {
        this.airplan.addSortie(lineID, start, end, startType, endType, note, startCycleID, endCycleID)
    }
    // This could get pushed into an Model.editSortie method.
    // That would thin the controller and let the model manage updating values.
    // Its sorta trivial difference right now though.
    handleEditSortieSubmit = (sortieID, start, end, startType, endType, note, startCycleID, endCycleID) => {
        this.airplan.sorties[sortieID].start = start
        this.airplan.sorties[sortieID].end = end
        this.airplan.sorties[sortieID].startType = startType
        this.airplan.sorties[sortieID].endType = endType
        this.airplan.sorties[sortieID].note = note
        this.airplan.sorties[sortieID].startCycleID = startCycleID
        this.airplan.sorties[sortieID].endCycleID = endCycleID
        this.airplan.onChange()
    }
    handleRemoveSortie = (sortieID) => {
        this.airplan.removeSortie(sortieID)
    }
    handleEditSortieMenu = (sortieID) => {
        let sortie = this.airplan.sorties[sortieID]
        this.view.drawEditSortieMenu(sortie)
        $('#start').val(sortie.start.toLocalTimeString())
        $('#end').val(sortie.end.toLocalTimeString())
        $('#startType').val(sortie.startType)
        $('#endType').val(sortie.endType)
        $('#note').val(sortie.note)
        this.view.bindEditSortieSubmit(this.handleEditSortieSubmit)
        this.view.bindEditSortieRemove(this.handleRemoveSortie)
    }



    handleEditHeaderSubmit = (title, date, start, end, sunrise, sunset, moonrise, moonset, moonphase, flightquarters, heloquarters, variation, timezone) => {
        this.airplan.title = title
        // this.airplan.date = new Date(Date.parse(date+'T00:00'))
        this.airplan.start = new Date(Date.parse(start))
        this.airplan.end = new Date(Date.parse(end))
        this.airplan.sunrise = new Date(Date.parse(sunrise))
        this.airplan.sunset = new Date(Date.parse(sunset))
        this.airplan.moonrise = new Date(Date.parse(moonrise))
        this.airplan.moonset = new Date(Date.parse(moonset))
        this.airplan.moonphase = moonphase
        this.airplan.flightquarters = new Date(Date.parse(flightquarters))
        this.airplan.heloquarters = new Date(Date.parse(heloquarters))
        this.airplan.variation = variation
        this.airplan.timezone = timezone
        this.onAirplanChanged();
    }
    handleEditSquadronMenu = (squadronID) => {
        let squadron = this.airplan.squadrons[squadronID]
        this.view.drawEditSquadronData(squadron)
        $('#name').val(squadron.name)
        $('#cs').val(squadron.cs)
        $('#tms').val(squadron.tms)
        $('#modex').val(squadron.modex)
        this.view.bindEditSquadronSubmit(this.handleEditSquadronSubmit)
        this.view.bindEditSquadronRemove(this.handleEditSquadronRemove)
    }
    handleEditSquadronSubmit = (squadronID, name,cs,tms,modex) => {
        this.airplan.squadrons[squadronID].name = name
        this.airplan.squadrons[squadronID].cs = cs
        this.airplan.squadrons[squadronID].tms = tms
        this.airplan.squadrons[squadronID].modex = modex
        this.onAirplanChanged();
    }
    handleEditSquadronRemove = (squadronID) => {
        this.airplan.removeSquadron(this.airplan.squadrons[squadronID])
    }
    
    handleCanvasClick = (e) => {
        console.log(e.parent.name() + ' ' + e.parent.id())
        if (e.parent.name() == 'sortie') {
            this.handleEditSortieMenu(e.parent.id())
        } else if (e.parent.name() == 'cycle') {
            // Does not yet exist
        } else if (e.parent.name() == 'header' || e.parent.name() == 'timeline') {
            this.view.drawEditHeaderData(this.airplan)
            $('#title').val(this.airplan.title)
            // $('#date').val(this.airplan.date.toYYYYMMDD())
            $('#start').val(this.airplan.start.toLocalTimeString())
            $('#end').val(this.airplan.end.toLocalTimeString())
            $('#sunrise').val(this.airplan.sunrise.toLocalTimeString())
            $('#sunset').val(this.airplan.sunset.toLocalTimeString())
            $('#moonrise').val(this.airplan.moonrise.toLocalTimeString())
            $('#moonset').val(this.airplan.moonset.toLocalTimeString())
            $('#moonphase').val(this.airplan.moonphase)
            $('#flightquarters').val(this.airplan.flightquarters.toLocalTimeString())
            $('#heloquarters').val(this.airplan.heloquarters.toLocalTimeString())
            $('#variation').val(this.airplan.variation)
            $('#timezone').val(this.airplan.timezone)
            this.view.bindEditHeaderSubmit(this.handleEditHeaderSubmit)
        } else if (e.parent.name() == 'squadron') {
            this.handleEditSquadronMenu(e.parent.id())
        }
    }
    

        
    
    handleRemoveCycle = (id) => {
        this.airplan.removeCycle(id)
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