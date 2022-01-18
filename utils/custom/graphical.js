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
fitStageIntoParentContainer = function() {
  var container = document.querySelector('#stage');
  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;
  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  var scale = containerWidth / g.sceneWidth;
  g.stage.width(g.sceneWidth * scale);
  g.stage.height(g.sceneHeight * scale);
  g.stage.scale({ x: scale, y: scale });
  // console.log("this: ",this)
  // console.log('Resize event. Stage size: ' + g.stage.width() + 'x' + g.stage.height());
}
window.addEventListener('resize', fitStageIntoParentContainer);

var g = {
  // Page Margin
  m: 10,
  
  // This means that the scene drawn in units of 1/10th inch. 
  // Also forces aspect ratio to be 11:8.5, which is the ratio of the paper size.
  sceneWidth: 1100,
  sceneHeight: 850,

  stage: {},

  draw: function() {
    this.makeStage();
    console.log('Make Stage');
  },
  makeStage: function() {
    let stage = new Konva.Stage({
      container: 'stage',   // id of container <div>
      width: this.sceneWidth,
      height: this.sceneHeight,
      name: 'stage',
    });
    this.stage = stage;
    console.log('Draw Stage')
    stage.pageArea = this.makePageArea(stage);
    stage.add(stage.pageArea)
    stage.draw();
    return stage;
  },
  // Page area is the whole page, then add it to stage, draw it, and add a red bounding box
  makePageArea: function(parent) {
    console.log('MakePageArea')
    let pageArea = new Konva.Layer({
      name: 'pageArea',
    });
    pageArea.add( new Konva.Rect({
      x: 0,
      y: 0,
      width: this.sceneWidth,
      height: this.sceneHeight,
      stroke: 'red',
      strokeWidth: 5,
      name: 'pageAreaBoundary',
    }))
    pageArea.printArea = this.makePrintArea(pageArea);
    pageArea.add(pageArea.printArea);
    // pageArea.draw()
    return pageArea;
  },
  // Print Area is the printable area, inset by a margin of g.m on all sides, add it to stage, and draw it
  makePrintArea: function(parent) {
    console.log('MakePrintArea')
    let printArea = new Konva.Group({
      x: this.m,
      y: this.m,  
      width: this.sceneWidth-2*this.m,
      height: this.sceneHeight-2*this.m,
      name: 'printArea',
    })
    printArea.header = this.makeHeader(printArea);
    printArea.events = this.makeEvents(printArea);
    printArea.add(printArea.header);
    printArea.add(printArea.events);
    printArea.add( new Konva.Rect({
      x: 0,
      y: 0,
      width: printArea.width(),
      height: printArea.height(),
      stroke: 'black',
      strokeWidth: 1,
      name: 'printAreaBoundary',
    }))
    // printArea.draw()
    return printArea;
  },
}
g.makeHeader = function(parent) {
  console.log('MakeHeader')
  let header = new Konva.Group({
    x: 0,
    y: 0,
    width: parent.width(),
    height: parent.height(),
    name: 'header',
  });
  let bottomLine = new Konva.Line({
    points: [0, header.height(), header.width(), header.height()],
    stroke: 'black',
    strokeWidth: 1,
  });
  header.slap = this.makeSlap(header);
  header.title = this.makeTitle(header);
  header.time = this.makeTime(header);
  header.add(bottomLine);
  header.add(header.slap);
  header.add(header.title);
  header.add(header.time);
  // header.draw()
  return header
}

g.makeSlap = function(parent) {
  let slap = new Konva.Group({
      x: config.textOptions.body.padding,
      y: config.textOptions.body.padding,
      name: 'slap_group',
  })
  // Label Text
  var slapLabel = new Konva.Text({
    text: Object.keys(airplan.data.header.slap).join('\n').toUpperCase(),
    fontSize: config.textOptions.body.fontSize,
    align: 'left',
    fontFamily: config.textOptions.body.fontFamily,
    name: 'slap_label',
  });
  // SLAP Data
  var slapData = new Konva.Text({
    text: ['0800L','1730L','1530L','2230L','50% ILLUMINATION'].join('\n'),
    fontSize: slapLabel.fontSize(),
    fontFamily: slapLabel.fontFamily(),
    name: 'slap_data',
  });
  slapData.offsetX(-1*(slapLabel.width()+config.textOptions.body.padding));  
  // Add to Group
  slap.add(slapLabel);
  slap.add(slapData);
  // slap.draw()
  return slap
}

g.makeTitle = function(parent) {
  let title = new Konva.Group({
    x: parent.width()/2,
    y: config.textOptions.body.padding,
    name: 'title_group',
  })
  title.offsetX(title.width()/2)
  // Title Text
  var titleText = new Konva.Text({
    text: 'AIR PLAN',
    fontSize: config.textOptions.title.fontSize,
    fontFamily: config.textOptions.title.fontFamily,
    align: config.textOptions.title.align,
    name: 'title',
  });
  // Subtitle Text
  var subTitleText = new Konva.Text({
      y: titleText.height() + config.textOptions.subtitle.padding,
      text: 'CQ Day 1',
      fontSize: config.textOptions.subtitle.fontSize,
      fontFamily: config.textOptions.subtitle.fontFamily,
      align: config.textOptions.subtitle.align,
      name: 'subtitle',
  });
  // Add to Group
  title.add(titleText);
  title.add(subTitleText);
  // title.draw()
  return title
}

g.makeTime = function(parent) {
  let time = new Konva.Group({
    x: parent.width()-config.textOptions.body.padding,
    y: config.textOptions.body.padding,
    name: 'time_group',
  })
  time.offsetX(time.width())
  // Time Label
  let timeLabel = new Konva.Text({
    text: ['flight quarters:','Helo quarters','Mag Var:','Time Zone:'].join('\n').toUpperCase(),
    fontSize: config.textOptions.body.fontSize,
    fontFamily: config.textOptions.body.fontFamily,
    align: 'right',
    name: 'time_label',
  });
  // Time Data
  let timeData = new Konva.Text({
    text: ['1','2','0','0'].join('\n'),
    fontSize: timeLabel.fontSize(),
    fontFamily: timeLabel.fontFamily(),
    name: 'time_data',
  });
  // Add to Group
  time.add(timeLabel);
  time.add(timeData);
  // time.draw()
  return time
}

g.makeEvents = function(parent) {
  let events = new Konva.Group({
    x: 0,
    y: parent.header.height(),
    width: parent.width(),
    height: parent.height()-parent.header.height(),
    name: 'events',
  })
  return events
}

// Define Header group, starting at the top left of the printable area, full width, height of 100
// add it to print area

g.buildStageTree = () => {
  g.stage.add(g.pageArea);
    g.pageArea.add(g.printArea);
      g.printArea.add(g.header);
        g.header.add(g.header.slap);
        g.header.add(g.header.title);
        g.header.add(g.header.time);
      g.printArea.add(g.events);
        g.events.add(g.events.timeline);
        g.events.add(g.events.squadronArea);
        g.events.add(g.events.cycleTotals);
}

g.addHeader = () => {
  var header = new Konva.Layer({
    x: g.m,
    y: g.m,
    width: sceneWidth - 2 * g.m,
    height: 100,
  });
  var title = new Konva.Text({
    x: header.width() / 2,
    y: g.m,
    text: 'AIR PLAN',
    fontSize: config.textOptions.title.fontSize,
    fontFamily: config.textOptions.title.fontFamily,
    align: config.textOptions.title.align,
  });
  title.offsetX(title.width() / 2);
  header.add(titleText);

  var subTitleText = new Konva.Text({
      x: header.width() / 2,
      y: titleText.height() + config.textOptions.subtitle.padding,
      text: 'CQ Day 1',
      fontSize: config.textOptions.subtitle.fontSize,
      fontFamily: config.textOptions.subtitle.fontFamily,
      align: config.textOptions.subtitle.align,
  });
  subTitleText.offsetX(subTitleText.width() / 2);
  header.add(subTitleText);
  g.stage.add(header);
  header.draw();
}



//
// TIME
//
g.addTimeText = () => {
  g.timeLayer = new Konva.Layer();
  let timeText = new Konva.Text({
      x: sceneWidth-2*g.m,
      y: 2*g.m,
      text: 'flight quarters:\nHelo quarters\nMag Var:\nTime Zone:'.toUpperCase(),
      fontSize: 14,
      fontFamily: 'sans-serif',
      align: 'right',
  });
  g.timeLayer.add(timeText);
  
  let timeData = new Konva.Text({
    x: timeText.x(),
    y: timeText.y(),
    text: '0800L\n1730L\n1530L\nT (+5)'.toUpperCase(),
    fontSize: timeText.fontSize(),
    fontFamily: timeText.fontFamily(),
    align: 'left',
  });
  g.timeLayer.add(timeData);

  timeText.offsetX(timeText.width()+timeData.width()+config.textOptions.body.padding);
  timeData.offsetX(timeData.width())

  g.stage.add(g.timeLayer);
  g.timeLayer.draw()
}

g.addSquadrons = () => {
  g.squadronLayer = new Konva.Layer();
  let squadronWidth = 100;
  let squadronYPos = 140;
  let squadronHeight = sceneHeight-squadronYPos-g.m
  
  let squadronBoundingBox = new Konva.Line({
    x: g.m,
    y: squadronYPos,
    points: [0, 0, squadronWidth, 0, squadronWidth, squadronHeight],
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


// adapt the stage on any window resize
