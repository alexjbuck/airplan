let config = new Object();
config.textOptions = {
  body: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    padding: 10,
  },
  title: {
    fontFamily: 'Calibri',
    fontSize: 36,
    padding: 10,
    align: 'center',
  },
  subtitle: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    padding: 10,
    align: 'center',
  },
}
// {padX=0,padY=0}={} allows for default values of padX and padY. 
// If a param object isn't passed, the ={} is needed to not thrown an error on destructuring
fitWidthToChildren = function(p,{padX=0,padY=0}={}) {
  if (p.children.length>0){
    let width  = p.children.map(c=>{return c.x()+c.width()-c.offsetX() - Math.min(c.x()-c.offsetX(),0)}).reduce((prev,curr)=>Math.max(prev,curr))
    p.width(width+padX)
  }
  return p
}

fitHeightToChildren = function(p,{padX=0,padY=0}={}) {
  if (p.children.length>0){
    let height = p.children.map(c=>{return c.y()+c.height()-c.offsetY()-Math.min(c.y()-c.offsetY(),0)}).reduce((prev,curr)=>Math.max(prev,curr))
    p.height(height+padY)
  }
  return p
}

fitSizeToChildren = function(p,{padX=0,padY=0}={}) {
  p = fitWidthToChildren(p,{padX,padY})
  p = fitHeightToChildren(p,{padX,padY})
  return p
}

fitStageIntoParentContainer = function({stage, sceneHeight, sceneWidth}) {
  if (this === window) {
    stage = g.stage;
    sceneHeight = g.sceneHeight;
    sceneWidth = g.sceneWidth;
  }
  var container = document.querySelector('#graphical-stage');
  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;
  // but we also make the full scene visible so we need to scale all objects on canvas
  var scale = containerWidth / g.sceneWidth;
  stage.width(g.sceneWidth * scale);
  stage.height(g.sceneHeight * scale);
  stage.scale({ x: scale, y: scale });
}
window.addEventListener('resize', fitStageIntoParentContainer);

drawBoundingBox = function(c,{stroke='black',strokeWidth=1, name='box', fillEnabled='false', fill='',opacity=1,zIndex=0}={}){
  let x=0,y=0
  if (c.children.length) {
    x = c.children.map(c=>c.x()-c.offsetX()).reduce((prev,curr)=>Math.min(prev,curr),0)
    y = c.children.map(c=>c.y()-c.offsetY()).reduce((prev,curr)=>Math.min(prev,curr),0)
  }
  let box = new Konva.Rect({
    x: x,
    y: y,
    width: c.width(),
    height: c.height(),
    stroke: stroke,
    strokeWidth: strokeWidth,
    name: name,
    fillEnabled: fillEnabled,
    fill: fill,
    opacity: opacity,
  })
  c.add(box)
  box.zIndex(zIndex)
  return box
}

time2pixels = function(h,p) {
  let pixels = (h.valueOf()-airplan.data.events.start.valueOf()) * p.width()/(airplan.data.events.end.valueOf()-airplan.data.events.start.valueOf())
  pixels = pixels<0 ? 0 : pixels
  pixels = pixels>p.width() ? p.width(): pixels
  return pixels
}

var g = {
  // Page Margin
  m: 10,
  
  // This means that the scene drawn in units of 1/10th inch. 
  // Also forces aspect ratio to be 11:8.5, which is the ratio of the paper size.
  sceneWidth: 1100,
  sceneHeight: 850,

  draw: function() {
    this.makeStage();
    fitStageIntoParentContainer(this);
    // console.log('Make Stage');
  },

  makeStage: function() {
    console.log('Make Stage')
    let stage = new Konva.Stage({
      container: 'graphical-stage',   // id of container <div>
      width: this.sceneWidth,
      height: this.sceneHeight,
      name: 'stage',
    });
    this.stage = stage;
    stage.pageLayer = this.makePageLayer(stage);
    stage.add(stage.pageLayer)
    // drawBoundingBox(stage.pageLayer,{stroke:'red',strokeWidth:5,name:'pageLayerBoundary'})
    return stage;
  },
  // Page area is the whole page, then add it to stage, draw it, and add a red bounding box
  makePageLayer: function(p) {
    console.log('Make Page Layer')
    let pageLayer = new Konva.Layer({
      name: 'pageLayer',
    });
    pageLayer.printArea = this.makePrintArea(pageLayer);
    pageLayer.add(pageLayer.printArea);
    return pageLayer;
  },
  // Print Area is the printable area, inset by a margin of g.m on all sides, add it to stage, and draw it
  makePrintArea: function(p) {
    console.log('Make Print Area')
    let printArea = new Konva.Group({
      x: this.m,
      y: this.m,  
      width: this.sceneWidth-2*this.m,
      height: this.sceneHeight-2*this.m,
      name: 'printArea',
    })
    drawBoundingBox(printArea,{name:'printAreaBoundary'})
    printArea.header = this.makeHeader(printArea);
    printArea.events = this.makeEvents(printArea);
    printArea.add(printArea.header);
    printArea.add(printArea.events);
    return printArea;
  },
}
g.makeHeader = function(p) {
  console.log('Make Header')
  let header = new Konva.Group({
    x: 0,
    y: 0,
    width: p.width(),
    height: 100,
    name: 'header',
  });
  header.slap = this.makeSlap(header);
  header.title = this.makeTitle(header);
  header.time = this.makeTime(header);
  header.add(header.slap);
  header.add(header.title);
  header.add(header.time);
  header = fitHeightToChildren(header,{padY:this.m})
  // drawBoundingBox(header)
  let bottomLine = new Konva.Line({
    points: [0, header.height(), header.width(), header.height()],
    stroke: 'black',
    strokeWidth: 1,
    name: 'header.line'
  });
  header.add(bottomLine);
  // header.draw()
  return header
}

g.makeSlap = function(p) {
  let slap = new Konva.Group({
      x: config.textOptions.body.padding,
      y: config.textOptions.body.padding,
      name: 'slap',
  })
  // Label Text
  var slapLabel = new Konva.Text({
    text: Object.keys(airplan.data.header.slap).join('\n').toUpperCase(),
    fontSize: config.textOptions.body.fontSize,
    align: 'left',
    fontFamily: config.textOptions.body.fontFamily,
    name: 'slap.label',
  });
  // SLAP Data
  var slapData = new Konva.Text({
    text: Object.values(airplan.data.header.slap).map((v)=>{
      if(typeof(v)=='object'){
        return v.toHHMM()
      } else {
        return v
      }
    }).join('\n'),
    fontSize: slapLabel.fontSize(),
    fontFamily: slapLabel.fontFamily(),
    name: 'slap.data',
  });
  slapData.offsetX(-1*(slapLabel.width()+config.textOptions.body.padding));  
  // Add to Group
  slap.add(slapLabel, slapData);
  slap = fitSizeToChildren(slap)
  drawBoundingBox(slap,{name:'boundary',strokeWidth:0})
  slap.on('click', function () {
    openModal(g.editSlapForm())
    $('#sunrise').val(airplan.data.header.slap.sunrise.toLocalTimeString())
    $('#sunset').val(airplan.data.header.slap.sunset.toLocalTimeString())
    $('#moonrise').val(airplan.data.header.slap.moonrise.toLocalTimeString())
    $('#moonset').val(airplan.data.header.slap.moonset.toLocalTimeString())
    $('#moonphase').val(airplan.data.header.slap.moonphase)
  });
  slap.on('mouseover', function () {
    box = this.findOne('.boundary')
    box.setAttrs({cornerRadius: 8,opacity:.9,stroke:'green',strokeWidth:5, shadowBlur: 10, shadowColor: 'black', offset:{x:.1*box.width()/2,y:.1*box.height()/2},scale: {x:1.1,y:1.1},})
    g.stage.container().style.cursor = 'pointer'
  })
  slap.on('mouseout',function() {
    this.findOne('.boundary').setAttrs({opacity:0,strokeWidth:0, shadowBlur: 0, offset:{x:0,y:0}, scale: {x:1,y:1}})
    g.stage.container().style.cursor = 'default'
  })
  return slap
}

g.makeTitle = function(p) {
  let title = new Konva.Group({
    x: p.width()/2,
    y: config.textOptions.body.padding,
    name: 'title',
  })
  // Title Text
  var titleText = new Konva.Text({
    text: airplan.data.header.title,
    fontSize: config.textOptions.title.fontSize,
    fontFamily: config.textOptions.title.fontFamily,
    align: config.textOptions.title.align,
    name: 'title.title',
  });
  // Subtitle Text
  var subTitleText = new Konva.Text({
    y: titleText.height() + config.textOptions.subtitle.padding,
    text: airplan.data.date.toDateString(),
    fontSize: config.textOptions.subtitle.fontSize,
    fontFamily: config.textOptions.subtitle.fontFamily,
    align: config.textOptions.subtitle.align,
    name: 'title.subtitle',
  });
  // Add to Group
  title.add(titleText);
  title.add(subTitleText);
  title.children.forEach(c=>{c.offsetX(c.width()/2)})
  title = fitSizeToChildren(title)
  drawBoundingBox(title,{strokeWidth:0,name:'boundary'})
  title.on('click', function(e) {
    openModal(g.editTitleForm())
    $('#title').val(airplan.data.header.title)
    $('#date').val(airplan.data.date.toYYYYMMDD())
  })
  title.on('mouseover', function () {
    box = this.findOne('.boundary')
    box.setAttrs({cornerRadius: 8,opacity:.9,stroke:'green',strokeWidth:5, shadowBlur: 10, shadowColor: 'black', offset:{x:.1*box.width()/2,y:.1*box.height()/2},scale: {x:1.1,y:1.1},})
    g.stage.container().style.cursor = 'pointer'
  })
  title.on('mouseout',function() {
    this.findOne('.boundary').setAttrs({opacity:0,strokeWidth:0, shadowBlur: 0, offset:{x:0,y:0}, scale: {x:1,y:1}})
    g.stage.container().style.cursor = 'default'
  })
  return title
}

g.makeTime = function(p) {
  let time = new Konva.Group({
    x: p.width()-config.textOptions.body.padding,
    y: config.textOptions.body.padding,
    name: 'time',
  })
  // Time Label
  let timeLabel = new Konva.Text({
    text: ['flight quarters:','Helo quarters:','Mag Var:','Time Zone:'].join('\n').toUpperCase(),
    fontSize: config.textOptions.body.fontSize,
    fontFamily: config.textOptions.body.fontFamily,
    align: 'right',
    name: 'time.label',
  });
  // Time Data
  let timeData = new Konva.Text({
    x: timeLabel.width()+config.textOptions.body.padding,
    text: ['flightquarters','heloquarters','variation','timezone'].map((k)=>{
      let v = airplan.data.header.time[k]
      if(typeof(v)=='object'){
        return v.toHHMM()
      } else {
        return v
      }
    }).join('\n'),
    fontSize: timeLabel.fontSize(),
    fontFamily: timeLabel.fontFamily(),
    name: 'time.data',
  });
  // Add to Group
  time.add(timeLabel);
  time.add(timeData);
  time = fitSizeToChildren(time);
  time.offsetX(time.width())
  drawBoundingBox(time,{strokeWidth:0,name:'boundary'})
  time.on('click', function(e) {
    openModal(g.editTimeForm())
    $('#fq').val(airplan.data.header.time.flightquarters.toLocalTimeString())
    $('#hq').val(airplan.data.header.time.heloquarters.toLocalTimeString())
    $('#variation').val(airplan.data.header.time.variation)
    $('#timezone').val(airplan.data.header.time.timezone)
  })
  time.on('mouseover', function () {
    box = this.findOne('.boundary')
    box.setAttrs({cornerRadius: 8,opacity:.9,stroke:'green',strokeWidth:5, shadowBlur: 10, shadowColor: 'black', offset:{x:.1*box.width()/2,y:.1*box.height()/2},scale: {x:1.1,y:1.1},})
    g.stage.container().style.cursor = 'pointer'
  })
  time.on('mouseout',function() {
    this.findOne('.boundary').setAttrs({opacity:0,strokeWidth:0, shadowBlur: 0, offset:{x:0,y:0}, scale: {x:1,y:1}})
    g.stage.container().style.cursor = 'default'
  })
  return time
}

g.makeEvents = function(p) {
  console.log('Make Events')
  let events = new Konva.Group({
    x: 0,
    y: p.header.height(),
    width: p.width(),
    height: p.height()-p.header.height(),
    name: 'events',
  })
  events.leftColWidth = 100
  events.rightColWidth = 50
  this.time2pixels = (events.width()-events.leftColWidth-events.rightColWidth)/(airplan.data.events.end-airplan.data.events.start)

  events.timeline = this.makeTimeline(events)
  events.cycleTotals = this.makeCycleTotals(events)
  events.squadrons = this.makeSquadrons(events)
  events.add(events.timeline)
  events.add(events.cycleTotals)
  events.add(events.squadrons)
  // drawBoundingBox(events,{stroke:'blue',strokeWidth:'5'})
  return events
}

g.makeTimeline = function(p){
  console.log('Make Timeline')
  let timeline = new Konva.Group({
    x: 0,
    y: 0,
    width: p.width(),
    height:40,
    name: 'timeline'
  })
  // drawBoundingBox(timeline,{stroke:'red', fillEnabled:true, fill: 'red'})
  timeline.add( new Konva.Line({
    points: [0,timeline.height()/2,timeline.width(),timeline.height()/2],
    stroke: 'black',
    strokeWidth: 1,
  }))
  timeline.add( new Konva.Line({
    points: [0,timeline.height()  ,timeline.width(),timeline.height()  ],
    stroke: 'black',
    strokeWidth: 1,
  }))
  // Create a timebox that is sized to use this.time2pixels conversions
  timeline.timebox = new Konva.Group({
    x: p.leftColWidth,
    y: 0,
    width: timeline.width() - p.leftColWidth - p.rightColWidth,
    height: timeline.height(),
    name: 'timeline.timebox'
  })
  drawBoundingBox(timeline.timebox, {strokeWidth:0,name:'boundary'})
  timeline.add(timeline.timebox)
  timeline.timebox.on('click', function () {
    openModal(g.editTimelineForm())
    $('#start').val(airplan.data.events.start.toLocalTimeString())
    $('#end').val(airplan.data.events.end.toLocalTimeString())
  })
  timeline.timebox.on('mouseover', function () {
    box = this.findOne('.boundary')
    box.setAttrs({cornerRadius: 8,opacity:.9,stroke:'green',strokeWidth:5, shadowBlur: 10, shadowColor: 'black'})
    g.stage.container().style.cursor = 'pointer'
  })
  timeline.timebox.on('mouseout',function() {
    this.findOne('.boundary').setAttrs({opacity:0,strokeWidth:0, shadowBlur: 0, offset:{x:0,y:0}, scale: {x:1,y:1}})
    g.stage.container().style.cursor = 'default'
  })
  timeline.timebox.add( new Konva.Text({
    x: 0,
    y: timeline.timebox.height(),
    text: '\u21A6'+airplan.data.events.start.toHHMM(),
  }))
  let endTime = new Konva.Text({
    x: timeline.timebox.width(),
    y: timeline.timebox.height(),
    text: airplan.data.events.end.toHHMM()+'\u21A4',
  })
  endTime.offsetX(endTime.width())
  timeline.timebox.add(endTime)
  // Sunrise
  timeline.timebox.add( new Konva.Arc({
    x: time2pixels(airplan.data.header.slap.sunrise,timeline.timebox),
    y: 20,
    innerRadius: 0,
    outerRadius: 15,
    angle: 180,
    clockwise: true,
    stroke: 'black',
    strokeWidth: 1,
    name: 'sunrise.icon'
  }))
  timeline.find('.sunrise.icon').forEach((s)=>{
    timeline.timebox.add( new Konva.Text({
      x: s.x(),
      y: s.y(),
      text: airplan.data.header.slap.sunrise.toHHMM(),
      name: 'sunrise.text',
    }))
  })
  
  // This is sunset
  timeline.timebox.add( new Konva.Arc({
    x: time2pixels(airplan.data.header.slap.sunset,timeline.timebox),
    y: 20,
    innerRadius: 0,
    outerRadius: 15,
    angle: 180,
    clockwise: true,
    stroke: 'black',
    fill: 'black',
    strokeWidth: 1,
    name: 'sunset.icon'
  }))
  timeline.find('.sunset.icon').forEach((s)=>{
    timeline.timebox.add( new Konva.Text({
      x: s.x(),
      y: s.y(),
      text: airplan.data.header.slap.sunset.toHHMM(),
      name: 'sunrise.text',
    }))
  })
  

  // Iterate over all cycles.
  Object.values(airplan.data.events.cycles).forEach((cycle)=>{
    // This is a cycle start line
    let x = time2pixels(cycle.start,timeline.timebox)
    timeline.timebox.add( new Konva.Line({
      points: [x,timeline.height()  ,x,p.height()  ],
      stroke: 'black',
      strokeWidth: 1,
      name: 'cycle.start'
    }))
    // This is the cycle label
    x = time2pixels((cycle.start.valueOf()+cycle.end.valueOf())/2,timeline.timebox)
    let cycleText = new Konva.Text({
      x: x,
      y: timeline.height(),
      text: cycle.number,
    })
    timeline.timebox.add(cycleText)
    cycleText.offsetY(cycleText.height())
    // This is a cycle end line
    x = time2pixels(cycle.end,timeline.timebox)
    timeline.timebox.add( new Konva.Line({
      points: [x,timeline.height(),  x,p.height()  ],
      stroke: 'black',
      strokeWidth: 1,
      name: 'cycle.end'
    }))
  })

  return timeline
}

g.makeCycleTotals = function(p){
  console.log('Make Cycle Totals')
  let cycleTotals = new Konva.Group({
    x: 0,
    y: p.height(),
    width: p.width(),
    height: 40,
    name: 'cycleTotals'
  })
  cycleTotals.offsetY(cycleTotals.height())
  // drawBoundingBox(cycleTotals,{stroke:'green', fillEnabled:true, fill: 'green'})
  return cycleTotals
}

g.makeSquadrons = function(p){
  console.log('Make Squadrons')
  let squadrons = new Konva.Group({
    x: 0,
    y: p.timeline.height(),
    width: p.width(),
    height:p.height()-p.cycleTotals.height()-p.timeline.height(),
    name: 'squadrons'
  })
  // Right border of squadron labels
  squadrons.add( new Konva.Line({
    points:[p.leftColWidth,0,  p.leftColWidth,squadrons.height()],
    stroke: 'black',
    strokeWidth: 1,
  }))
  let header = new Konva.Text({
    x: p.leftColWidth/2,
    y: 0,
    text: 'SQUADRON',
    align: 'center',
    style: 'bold',
  })
  header.offsetX(header.width()/2)
  header.offsetY(header.height())
  squadrons.add(header)
  squadrons.leftColWidth = p.leftColWidth
  squadrons.rightColWidth = p.rightColWidth
  squadrons.squadronGroups = []
  // --------- Loop over all squadrons ---------
  airplan.data.events.squadrons.forEach((s,i)=>{
    let group = this.makeSquadronGroup(s,i,squadrons)
    squadrons.squadronGroups.push(group)
    squadrons.add(group)
  })
  // drawBoundingBox(squadrons,{stroke:'black', fillEnabled:true, fill: 'orange'})
  return squadrons  
}

g.makeSquadronGroup = function(s,i,p) {
  let n = airplan.data.events.squadrons.length
  let squadronHeight = p.height()/n
  let group = new Konva.Group({
    x:0,
    y:i*squadronHeight,
    width: p.width(),
    height: squadronHeight,
    name: 'squadron.group'
  })
  group.add( new Konva.Line({
    points: [0,group.height(),  group.width(), group.height()],
    stroke: 'black',
    strokeWidth: 1,
    name:'squadron.bottomline'
  }))
  // vertical line between text and letter
  let letterWidth = 15
  group.add( new Konva.Line({
    points: [p.leftColWidth-letterWidth, 0, p.leftColWidth-letterWidth, group.height()],
    stroke: 'black',
    strokeWidth: 1,
  }))
  // A,B,C,... letter labels
  let letterText = new Konva.Text({
    x: p.leftColWidth-letterWidth/2,
    y: group.height()/2,
    text: s.letter,
    align: 'center',
    name: 'squadron.letter'
  })
  letterText.offsetX(letterText.width()/2)
  letterText.offsetY(letterText.height()/2)
  // Squadron name/cs/type/modex labels
  let groupText = new Konva.Text({
    x: (p.leftColWidth-letterWidth)/2,
    y: group.height()/2,
    text: [s.name, s.cs, s.tms, s.modex].join('\n').toUpperCase(),
    align: 'center',
    name: 'squadron.name'
  })
  groupText.offsetX(groupText.width()/2)
  groupText.offsetY(groupText.height()/2)
  
  // squadron totals vertical line
  group.add( new Konva.Line({
    points: [group.width()-p.rightColWidth,0,  group.width()-p.rightColWidth,group.height()],
    stroke: 'black',
    strokeWidth: 1,
  }))
  group.add(letterText)
  group.add(groupText)

  // Squadron Sorties
  let sortieGroup = new Konva.Group({
    x: p.leftColWidth,
    y: 0,
    width: group.width()-p.rightColWidth-p.leftColWidth,
    height: group.height(),
    name: 'sortie.group',
  })
  console.log("Sorties for "+s.name)
  let sorties = Object.values(airplan.data.events.sorties).filter(sortie=>sortie.squadron==s.name)
  let ns = sorties.length
  let h = group.height()/(ns+2)
  sorties.forEach((s,i)=>{
    let x1 = time2pixels(s.start,sortieGroup)
    let x2 = time2pixels(s.end,sortieGroup)
    let y = h*(i+1)
    sortieGroup.add( new Konva.Line({
      points: [x1,y,x2,y],
      stroke: 'black',
      strokeWidth: 1,
      name: 'sortie.line'
    }))
    sortieGroup.add( new Konva.Text({
      x: x1+5,
      y: y-15,
      text: s.annotation,
    }))
    this.makeCondition[s.startCondition](x1,y,sortieGroup)
    this.makeCondition[s.endCondition](x2,y,sortieGroup)
  })
  group.add(sortieGroup)
  group.sortieGroup = sortieGroup
  return group
}

g.makeCondition = {}
// Swoosh down to start point
g.makeFlyOn = function(x,y,p) {
  p.add( new Konva.Line({
    points: [x-14,y-14,x,y],
    stroke:'black',
    strokeWidth:1,
    name: 'flyon'
  }))
}
g.makeCondition.flyOn = g.makeFlyOn

// swoosh up from start point
g.makeFlyOff = function(x,y,p) {
  p.add( new Konva.Line({
    points: [x,y,x+14,y-14],
    strokeWidth: 1,
    stroke: 'black',
    name: 'flyoff',
  }))
}
g.makeCondition.flyOff = g.makeFlyOff

// vertical bar
g.makePullStuff = function(x,y,p) {
  p.add( new Konva.Line({
    points: [x,y-10,x,y+10],
    stroke: 'black',
    strokeWidth: 1,
    name: 'pullstuff',
  }))
}
g.makeCondition.stuff= g.makePullStuff
g.makeCondition.pull = g.makePullStuff

g.makeHotPump = function(x,y,p) {
  p.add( new Konva.Line({
    points: [x,y+10, x+5,y,  x,y-10,  x-5,y,  x,y+10],
    stroke: 'black',
    strokeWidth: 1,
    closed: true,
    fill: 'white',
    fillEnabled: true,
  }))
}
g.makeCondition.hp = g.makeHotPump

g.makeHotPumpCrewSwap = function(x,y,p) {
  p.add( new Konva.Line({
    points: [x,y+10, x+5,y,  x,y-10,  x-5,y,  x,y+10],
    stroke: 'black',
    strokeWidth: 1,
    fill:'black',
    fillEnabled:true,
    closed: true,
  }))
}
g.makeCondition.hpcs = g.makeHotPumpCrewSwap

// g.makeEventsOld = function(p) {
//   // Define Events group, starting at the bottom left of the header, full width, height of remaining printable area
//   // add it to print area
//   let events = new Konva.Group({
//     x: 0,
//     y: offsetY,
//     width: width,
//     height: height,
//     name: 'events',
//   })

//   // Define the event groups: timeline, squadron, cycle totals
//   // Add the timeline group to the events group
//   events.timeline = new Konva.Group({
//     x: 0,
//     y: 0,
//     width: events.width(),
//     height: 40,
//     name: 'timeline',
//   })
//   // Add the cycle totals group to the events group, offsetY to anchor at bottom left corner
//   events.cycleTotals = new Konva.Group({
//     x: 0,
//     y: events.height(),
//     width: events.width(),
//     height: 20,
//     name: 'cycleTotals',
//   })
//   events.cycleTotals.offsetY(events.cycleTotals.height())
//   // Add the squadron group to the events group
//   events.squadronArea = new Konva.Group({
//     x: 0,
//     y: g.stage.find('.timeline')[0].height(),
//     width: events.width(),
//     height: events.height()-events.timeline.height()-events.cycleTotals.height(),
//     name: 'squadronArea',
//   })
//   return events;
// }

// g.addSquadrons = () => {
//   g.squadronLayer = new Konva.Layer();
//   let leftColWidth = 100;
//   let squadronYPos = 140;
//   let squadronHeight = sceneHeight-squadronYPos-g.m
  
//   let squadronBoundingBox = new Konva.Line({
//     x: g.m,
//     y: squadronYPos,
//     points: [0, 0, leftColWidth, 0, leftColWidth, squadronHeight],
//     stroke: 'black',
//     strokeWidth: 1,
//     // fillEnabled: false,
//   })

//   let squadronHeader = new Konva.Text({
//     x: squadronBoundingBox.x()+squadronBoundingBox.width()/2,
//     y: squadronBoundingBox.y(),
//     text: 'squadron'.toUpperCase(),
//     fontSize: config.textOptions.body.fontSize,
//     fontFamily: config.textOptions.body.fontFamily,
//     fontStyle: 'bold',
//     align: 'left',
//   })
//   squadronHeader.offsetX((squadronHeader.width()/2))
//   squadronHeader.offsetY(squadronHeader.height());

//   let squadronData = airplan.data.events.squadrons.forEach((squadron, index, arr) => {
//     let n = arr.length;
//     let height = squadronBoundingBox.height()/n;

//     // Draw a line across the top of each squadron (except the first one, its topline is the bounding box)
//     if (index!=0) {
//       let line = new Konva.Line({
//         points: [squadronBoundingBox.x(), squadronBoundingBox.y()+height*index, squadronBoundingBox.x()+squadronBoundingBox.width(), squadronBoundingBox.y()+height*index],
//         stroke: 'black',
//         strokeWidth: 1,
//       })
//       g.squadronLayer.add(line);
//     }
    
//     // Draw the squadron text block
//     let text = new Konva.Text({
//       text: [squadron.name , squadron.cs , squadron.tms , squadron.modex].join('\n').toUpperCase(),
//       x: squadronBoundingBox.x()+squadronBoundingBox.width()/2,
//       y: squadronBoundingBox.y()+height*index + height/2,
//       align: 'center',
//     })
//     text.offsetX(text.width()/2)
//     text.offsetY(text.height()/2)
//     g.squadronLayer.add(text);
//   })
  
//   g.squadronLayer.add(squadronHeader);
//   g.squadronLayer.add(squadronBoundingBox);
//   g.squadronLayer.draw();
//   g.stage.add(g.squadronLayer);
// }

g.editTitleForm = function () {
    let html = "<h3>Edit Title</h3>";
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='title' class='col-12 col-md-2 text-left text-md-right'>Title</label>";
    html += "<input type='text' class='col form-control mr-5' id='title' placeholder='Air Plan' required>";
    html += "</div>"
    // Start time
    html += "<div class='form-group row align-items-center'>";
    html += "<label for='date' class='col-12 col-md-2 text-left text-md-right'>Date</label>";
    html += "<input type='date' pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}T00:00' class='col form-control mr-5' id='date' placeholder='Date'>";
    html += "</div>";
    html += "<button type='submit' class='btn btn-primary' onclick='g.updateTitle()'>Update</button>";
    return html
}

g.updateTitle = function () {
  let title = $('#title').val();
  let date = $('#date').val()+"T00:00";
  airplan.data.header.title = title
  airplan.data.date = new Date(date)
  closeModal()
  refresh()
}

g.editTimeForm = function(){
  let html = "<h3>Edit Times and Variation</h3>";
  // flight quarters time
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='fq' class='col-12 col-md-2 text-left text-md-right'>Flight Quarters</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='fq' required>";
  html += "</div>"
  // helo quarters time
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='hq' class='col-12 col-md-2 text-left text-md-right'>Helo Quarters</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='hq'>";
  html += "</div>";
  // Magnetic Variation
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='variation' class='col-12 col-md-2 text-left text-md-right'>Mag Var (\u00B0E/W)</label>";
  html += "<input type='text' class='col form-control mr-5' id='variation'>";
  html += "</div>";
  // Magnetic Variation
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='timezone' class='col-12 col-md-2 text-left text-md-right'>Time Zone (\u00B1offset)</label>";
  html += "<input type='text' class='col form-control mr-5' id='timezone'>";
  html += "</div>";
  html += "<button type='submit' class='btn btn-primary' onclick='g.updateTime()'>Update</button>";
  return html
}

g.updateTime = function () {
  let fq = new Date($('#fq').val())
  let hq = new Date($('#hq').val())
  let variation = $('#variation').val()
  let timezone = $('#timezone').val()
  airplan.data.header.time.flightquarters = fq
  airplan.data.header.time.heloquarters = hq
  airplan.data.header.time.variation = variation
  airplan.data.header.time.timezone = timezone
  closeModal()
  refresh()
}

g.editSlapForm = function () {
  let html = "<h3>Edit SLAP Data</h3>";
  // Sunrise
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='sunrise' class='col-12 col-md-2 text-left text-md-right'>Sunrise</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='sunrise' required>";
  html += "</div>"
  // Sunset
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='sunset' class='col-12 col-md-2 text-left text-md-right'>Sunset</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='sunset'>";
  html += "</div>";
  // Moonrise
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='moonrise' class='col-12 col-md-2 text-left text-md-right'>Moonrise</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='moonrise' required>";
  html += "</div>"
  // Moonset
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='moonset' class='col-12 col-md-2 text-left text-md-right'>Moonset</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='moonset'>";
  html += "</div>";
  // Moonphase
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='moonphase' class='col-12 col-md-2 text-left text-md-right'>Moonphase (%)</label>";
  html += "<input type='text' class='col form-control mr-5' id='moonphase'>";
  html += "</div>";
  html += "<button type='submit' class='btn btn-primary' onclick='g.updateSlap()'>Update</button>";
  return html
}

g.updateSlap = function () {
  // read the form
  let sunrise = new Date($('#sunrise').val())
  let sunset = new Date($('#sunset').val())
  let moonrise = new Date($('#moonrise').val())
  let moonset = new Date($('#moonset').val())
  let moonphase = $('#moonphase').val()
  // update the data
  airplan.data.header.slap.sunrise = sunrise
  airplan.data.header.slap.sunset = sunset
  airplan.data.header.slap.moonrise = moonrise
  airplan.data.header.slap.moonset = moonset
  airplan.data.header.slap.moonphase = moonphase
  closeModal()
  refresh()
}

g.editTimelineForm = function () {
  let html = "<h3>Edit SLAP Data</h3>";
  // Sunrise
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='start' class='col-12 col-md-2 text-left text-md-right'>Start of Day</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='start' required>";
  html += "</div>"
  // Sunset
  html += "<div class='form-group row align-items-center'>";
  html += "<label for='end' class='col-12 col-md-2 text-left text-md-right'>End of Day</label>";
  html += "<input type='datetime-local' class='col form-control mr-5' id='end'>";
  html += "</div>";
  html += "<button type='submit' class='btn btn-primary' onclick='g.updateTimeline()'>Update</button>";
  return html
}

g.updateTimeline = function () {
  airplan.data.events.start = new Date($('#start').val())
  airplan.data.events.end = new Date($('#end').val())
  closeModal()
  refresh()
}