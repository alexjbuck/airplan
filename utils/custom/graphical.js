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

drawBoundingBox = function(c,{stroke='black',strokeWidth='1',name, fillEnabled='false', fill=''}={}){
  let x=0,y=0
  if (c.children.length) {
    x = c.children.map(c=>c.x()-c.offsetX()).reduce((prev,curr)=>Math.min(prev,curr),0)
    y = c.children.map(c=>c.y()-c.offsetY()).reduce((prev,curr)=>Math.min(prev,curr),0)
  }
  c.add(new Konva.Rect({
    x: x,
    y: y,
    width: c.width(),
    height: c.height(),
    stroke: stroke,
    strokeWidth: strokeWidth,
    name: name,
    fillEnabled: fillEnabled,
    fill: fill,
  }))
  return c
}

hours2pixels = function(h,p) {
  let pixels = (h-airplan.data.events.start) * p.width()/(airplan.data.events.end-airplan.data.events.start)
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
    console.log('Make Stage');
  },

  makeStage: function() {
    console.log('Draw Stage')
    let stage = new Konva.Stage({
      container: 'graphical-stage',   // id of container <div>
      width: this.sceneWidth,
      height: this.sceneHeight,
      name: 'stage',
    });
    this.stage = stage;
    stage.pageLayer = this.makePageLayer(stage);
    stage.add(stage.pageLayer)
    drawBoundingBox(stage.pageLayer,{stroke:'red',strokeWidth:5,name:'pageLayerBoundary'})
    stage.draw();
    return stage;
  },
  // Page area is the whole page, then add it to stage, draw it, and add a red bounding box
  makePageLayer: function(p) {
    console.log('MakePageLayer')
    let pageLayer = new Konva.Layer({
      name: 'pageLayer',
    });
    pageLayer.printArea = this.makePrintArea(pageLayer);
    pageLayer.add(pageLayer.printArea);
    return pageLayer;
  },
  // Print Area is the printable area, inset by a margin of g.m on all sides, add it to stage, and draw it
  makePrintArea: function(p) {
    console.log('MakePrintArea')
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
  console.log('MakeHeader')
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
  drawBoundingBox(header)
  let bottomLine = new Konva.Line({
    points: [0, header.height(), header.width(), header.height()],
    stroke: 'black',
    strokeWidth: 1,
    name: 'header.line'
  });
  // header.add(bottomLine);
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
    text: ['0800L','1730L','1530L','2230L','50% ILLUMINATION'].join('\n'),
    fontSize: slapLabel.fontSize(),
    fontFamily: slapLabel.fontFamily(),
    name: 'slap.data',
  });
  slapData.offsetX(-1*(slapLabel.width()+config.textOptions.body.padding));  
  // Add to Group
  slap.add(slapLabel);
  slap.add(slapData);
  // slap.draw()
  slap = fitSizeToChildren(slap)
  drawBoundingBox(slap,{stroke:'green'})
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
    text: 'AIR PLAN',
    fontSize: config.textOptions.title.fontSize,
    fontFamily: config.textOptions.title.fontFamily,
    align: config.textOptions.title.align,
    name: 'title.title',
  });
  // Subtitle Text
  var subTitleText = new Konva.Text({
    y: titleText.height() + config.textOptions.subtitle.padding,
    text: 'CQ Day 1',
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
  drawBoundingBox(title,{stroke:'green'})
  // title.draw()
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
    text: ['flight quarters:','Helo quarters','Mag Var:','Time Zone:'].join('\n').toUpperCase(),
    fontSize: config.textOptions.body.fontSize,
    fontFamily: config.textOptions.body.fontFamily,
    align: 'right',
    name: 'time.label',
  });
  // Time Data
  let timeData = new Konva.Text({
    x: timeLabel.width()+config.textOptions.body.padding,
    text: ['1','2','0','0'].join('\n'),
    fontSize: timeLabel.fontSize(),
    fontFamily: timeLabel.fontFamily(),
    name: 'time.data',
  });
  // Add to Group
  time.add(timeLabel);
  time.add(timeData);
  time = fitSizeToChildren(time);
  time.offsetX(time.width())
  drawBoundingBox(time,{stroke:'green'})
  // time.draw()
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
  this.hours2pixels = (events.width()-events.leftColWidth-events.rightColWidth)/(airplan.data.events.end-airplan.data.events.start)

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
  // Create a timebox that is sized to use this.hours2pixels conversions
  timeline.timebox = new Konva.Group({
    x: p.leftColWidth,
    y: 0,
    width: timeline.width() - p.leftColWidth - p.rightColWidth,
    height: timeline.height(),
    name: 'timeline.timebox'
  })
  // drawBoundingBox(timeline.timebox)
  timeline.add(timeline.timebox)
  timeline.timebox.add( new Konva.Arc({
    x: hours2pixels(7,timeline.timebox),
    y: 20,
    innerRadius: 0,
    outerRadius: 15,
    angle: 180,
    clockwise: true,
    stroke: 'black',
    strokeWidth: 1,
    name: 'sunrise.icon'
  }))
  
  // This is sunset
  timeline.timebox.add( new Konva.Arc({
    x: hours2pixels(16,timeline.timebox),
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

  airplan.data.events.cycles.forEach((cycle)=>{
    // This is a cycle start line
    let x = hours2pixels(cycle.start,timeline.timebox)
    timeline.timebox.add( new Konva.Line({
      points: [x,timeline.height()  ,x,p.height()  ],
      stroke: 'black',
      strokeWidth: 1,
      name: 'cycle'
    }))
    // This is the cycle label
    x = hours2pixels((cycle.start+cycle.end)/2,timeline.timebox)
    let cycleText = new Konva.Text({
      x: x,
      y: timeline.height(),
      text: cycle.number,
    })
    timeline.timebox.add(cycleText)
    cycleText.offsetY(cycleText.height())
    // This is a cycle start line
    x = hours2pixels(cycle.end,timeline.timebox)
    timeline.timebox.add( new Konva.Line({
      points: [x,timeline.height(),  x,p.height()  ],
      stroke: 'black',
      strokeWidth: 1,
      name: 'cycle'
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
  squadrons.squadronGroups = []
  let n = airplan.data.events.squadrons.length
  let squadronHeight = squadrons.height()/n
  // --------- Loop over all squadrons ---------
  airplan.data.events.squadrons.forEach((s,i,arr)=>{
      let group = new Konva.Group({
        x:0,
        y:i*squadronHeight,
        width: squadrons.width(),
        height: squadronHeight,
        name: 'squadron'
      })
      // ------ Context below this is within a squadron group --------
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
      })
      letterText.offsetX(letterText.width()/2)
      letterText.offsetY(letterText.height()/2)
      // Squadron name/cs/type/modex labels
      let groupText = new Konva.Text({
        x: (p.leftColWidth-letterWidth)/2,
        y: group.height()/2,
        text: [s.name, s.cs, s.tms, s.modex].join('\n').toUpperCase(),
        align: 'center',
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
      squadrons.squadronGroups.push(group)
      squadrons.add(group)
  })
  // drawBoundingBox(squadrons,{stroke:'black', fillEnabled:true, fill: 'orange'})
  return squadrons  
}

g.makeSquadronGroup = function(p) {
  let group = new Konva.Group({
    x:0,
    y:i*squadronHeight,
    width: squadrons.width(),
    height: squadronHeight,
    name: 'squadron_group'
  })
}

g.makeEventsOld = function(p) {
  // Define Events group, starting at the bottom left of the header, full width, height of remaining printable area
  // add it to print area
  let events = new Konva.Group({
    x: 0,
    y: offsetY,
    width: width,
    height: height,
    name: 'events',
  })

  // Define the event groups: timeline, squadron, cycle totals
  // Add the timeline group to the events group
  events.timeline = new Konva.Group({
    x: 0,
    y: 0,
    width: events.width(),
    height: 40,
    name: 'timeline',
  })
  // Add the cycle totals group to the events group, offsetY to anchor at bottom left corner
  events.cycleTotals = new Konva.Group({
    x: 0,
    y: events.height(),
    width: events.width(),
    height: 20,
    name: 'cycleTotals',
  })
  events.cycleTotals.offsetY(events.cycleTotals.height())
  // Add the squadron group to the events group
  events.squadronArea = new Konva.Group({
    x: 0,
    y: g.stage.find('.timeline')[0].height(),
    width: events.width(),
    height: events.height()-events.timeline.height()-events.cycleTotals.height(),
    name: 'squadronArea',
  })
  return events;
}

g.addSquadrons = () => {
  g.squadronLayer = new Konva.Layer();
  let leftColWidth = 100;
  let squadronYPos = 140;
  let squadronHeight = sceneHeight-squadronYPos-g.m
  
  let squadronBoundingBox = new Konva.Line({
    x: g.m,
    y: squadronYPos,
    points: [0, 0, leftColWidth, 0, leftColWidth, squadronHeight],
    stroke: 'black',
    strokeWidth: 1,
    // fillEnabled: false,
  })

  let squadronHeader = new Konva.Text({
    x: squadronBoundingBox.x()+squadronBoundingBox.width()/2,
    y: squadronBoundingBox.y(),
    text: 'squadron'.toUpperCase(),
    fontSize: config.textOptions.body.fontSize,
    fontFamily: config.textOptions.body.fontFamily,
    fontStyle: 'bold',
    align: 'left',
  })
  squadronHeader.offsetX((squadronHeader.width()/2))
  squadronHeader.offsetY(squadronHeader.height());

  let squadronData = airplan.data.events.squadrons.forEach((squadron, index, arr) => {
    let n = arr.length;
    let height = squadronBoundingBox.height()/n;

    // Draw a line across the top of each squadron (except the first one, its topline is the bounding box)
    if (index!=0) {
      let line = new Konva.Line({
        points: [squadronBoundingBox.x(), squadronBoundingBox.y()+height*index, squadronBoundingBox.x()+squadronBoundingBox.width(), squadronBoundingBox.y()+height*index],
        stroke: 'black',
        strokeWidth: 1,
      })
      g.squadronLayer.add(line);
    }
    
    // Draw the squadron text block
    let text = new Konva.Text({
      text: [squadron.name , squadron.cs , squadron.tms , squadron.modex].join('\n').toUpperCase(),
      x: squadronBoundingBox.x()+squadronBoundingBox.width()/2,
      y: squadronBoundingBox.y()+height*index + height/2,
      align: 'center',
    })
    text.offsetX(text.width()/2)
    text.offsetY(text.height()/2)
    g.squadronLayer.add(text);
  })
  
  g.squadronLayer.add(squadronHeader);
  g.squadronLayer.add(squadronBoundingBox);
  g.squadronLayer.draw();
  g.stage.add(g.squadronLayer);
}