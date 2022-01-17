var g = {};
g.textOptions = {
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
// Page Margin
g.m = 10;

// This means that the scene drawn in units of 1/10th inch. 
// Also forces aspect ratio to be 11:8.5, which is the ratio of the paper size.
var sceneWidth = 1100;
var sceneHeight = 850;

// first we need to create a stage
g.stage = new Konva.Stage({
    container: 'stage',   // id of container <div>
    width: sceneWidth,
    height: sceneHeight,
    name: 'stage',
    x: 0,
    y: 0,
});

// Page area is the whole page, then add it to stage, draw it, and add a red bounding box
g.pageArea = new Konva.Layer({
  x: 0,
  y: 0,
  width: sceneWidth,
  height: sceneHeight,
  name: 'pageArea',
});
g.stage.add(g.pageArea);

g.pageArea.add( new Konva.Rect({
    x: 0,
    y: 0,
    width: g.pageArea.width(),
    height: g.pageArea.height(),
    stroke: 'red',
    strokeWidth: 5,
    name: 'pageAreaBoundary',
  })
);

// Print Area is the printable area, inset by a margin of g.m on all sides, add it to stage, and draw it
g.printArea = new Konva.Group({
  x: g.m,
  y: g.m,
  width: g.pageArea.width()-2*g.m,
  height: g.pageArea.height()-2*g.m,
  name: 'printArea',
  })
g.pageArea.add(g.printArea);

g.printArea.add( new Konva.Rect({
    x: 0,
    y: 0,
    width: g.printArea.width(),
    height: g.printArea.height(),
    stroke: 'black',
    strokeWidth: 1,
    name: 'printAreaBoundary',
}))

// Define Header group, starting at the top left of the printable area, full width, height of 100
// add it to print area
g.header = new Konva.Group({
  x: 0,
  y: 0,
  width: g.printArea.width(),
  height: 100,
  name: 'header',
});
g.printArea.add(g.header);

// Define the three header groups: slap, title, and time
  // Add the slap group to the header group
  g.header.add( new Konva.Group({
    x: g.textOptions.body.padding,
    y: g.textOptions.body.padding,
    name: 'slap',
  }))
  // Add the title to the header group
  g.header.add( new Konva.Group({
    x: g.header.width()/2,
    y: g.textOptions.body.padding,
    name: 'title',
  }))
  g.stage.find('.title').forEach( (obj) => obj.offsetX(obj.width()/2) )
  // Add the time group to the header group
  g.header.add( new Konva.Group({
    x: g.header.width()-g.textOptions.body.padding,
    y: g.textOptions.body.padding,
    name: 'time',
  }))
  g.stage.find('.time').forEach( (obj) => obj.offsetX(obj.width()) )

// Define Events group, starting at the bottom left of the header, full width, height of remaining printable area
// add it to print area
g.events = new Konva.Group({
  x: 0,
  y: 0+g.header.height(),
  width: g.printArea.width(),
  height: g.printArea.height()-g.header.height(),
  name: 'events',
})
g.printArea.add(g.events);

// Define the event groups: timeline, squadron, cycle totals
  // Add the timeline group to the events group
  g.events.add( g.events.timeline = new Konva.Group({
    x: 0,
    y: 0,
    width: g.events.width(),
    height: 40,
    name: 'timeline',
  }))
  // Add the cycle totals group to the events group, offsetY to anchor at bottom left corner
  g.events.add( g.events.cycleTotals = new Konva.Group({
    x: 0,
    y: g.events.height(),
    width: g.events.width(),
    height: 20,
    name: 'cycleTotals',
  }))
  g.events.cycleTotals.offsetY(g.events.cycleTotals.height())
  // Add the squadron group to the events group
  g.events.add( g.events.squadronArea = new Konva.Group({
    x: 0,
    y: g.stage.find('.timeline')[0].height(),
    width: g.events.width(),
    height: g.events.height()-g.events.timeline.height()-g.events.cycleTotals.height(),
    name: 'squadronArea',
  }))



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
    fontSize: g.textOptions.title.fontSize,
    fontFamily: g.textOptions.title.fontFamily,
    align: g.textOptions.title.align,
  });
  title.offsetX(title.width() / 2);
  header.add(titleText);

  var subTitleText = new Konva.Text({
      x: header.width() / 2,
      y: titleText.height() + g.textOptions.subtitle.padding,
      text: 'CQ Day 1',
      fontSize: g.textOptions.subtitle.fontSize,
      fontFamily: g.textOptions.subtitle.fontFamily,
      align: g.textOptions.subtitle.align,
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

  timeText.offsetX(timeText.width()+timeData.width()+g.textOptions.body.padding);
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
    fontSize: g.textOptions.body.fontSize,
    fontFamily: g.textOptions.body.fontFamily,
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


//
// DRAW
//
g.draw = () => {
  g.addFrame();
  g.addTitle();
  // g.addHeader();
  g.addSunMoonText();
  g.addTimeText();
  g.addSquadrons();
  console.log('Stage Drawn');
}


g.draw = () => {
  g.pageArea.draw()
  g.printArea.draw()
  g.fitStageIntoParentContainer();
}

g.fitStageIntoParentContainer = () =>{
  var container = document.querySelector('#stage');

  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;

  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  var scale = containerWidth / sceneWidth;
  g.stage.width(sceneWidth * scale);
  g.stage.height(sceneHeight * scale);
  g.stage.scale({ x: scale, y: scale });
  console.log('Resize event. Stage size: ' + g.stage.width() + 'x' + g.stage.height());
}

// adapt the stage on any window resize
window.addEventListener('resize', g.fitStageIntoParentContainer);
