let sunMoonGroup = new Konva.Group({
    x: g.m,
    y: g.m,
    name: 'sunMoonGroup',
});
g.header.add(sunMoonGroup);

var sunMoonText = new Konva.Text({
    x: g.m,
    y: g.m,
    text: Object.keys(airplan.data.header.slap).join('\n').toUpperCase(),
    fontSize: g.textOptions.body.fontSize,
    align: 'left',
    fontFamily: g.textOptions.body.fontFamily,
    name: 'sunMoonText',
});
sunMoonGroup.add(sunMoonText);

//create data
var sunMoonData = new Konva.Text({
    x: sunMoonText.x(),
    y: sunMoonText.y(),
    text: '0800L\n1730L\n1530L\n2230L\n50% ILLUMINATION',
    fontSize: sunMoonText.fontSize(),
    fontFamily: sunMoonText.fontFamily(),
    name: 'sunMoonData',
});
sunMoonData.offsetX(-1*(sunMoonText.width()+g.textOptions.body.padding));  
g.header.add(sunMoonData);



//
// TITLE
//
let addTitleTo = (container) => {
    //create lables
    var titleText = new Konva.Text({
        x: sceneWidth / 2,
        y: 2*g.m,
        text: 'AIR PLAN',
        fontSize: g.textOptions.title.fontSize,
        fontFamily: g.textOptions.title.fontFamily,
        align: g.textOptions.title.align,
    });
    titleText.offsetX(titleText.width() / 2);
    container.add(titleText);
  
    var subTitleText = new Konva.Text({
        x: sceneWidth / 2,
        y: titleText.y() + titleText.height() + g.textOptions.subtitle.padding,
        text: 'CQ Day 1',
        fontSize: g.textOptions.subtitle.fontSize,
        fontFamily: g.textOptions.subtitle.fontFamily,
        align: g.textOptions.subtitle.align,
    });
    subTitleText.offsetX(subTitleText.width() / 2);
    container.add(subTitleText);
  }
  
  //
  // FRAME
  //
  g.addFrame = () => {
    g.outerBoxLayer = new Konva.Layer();
  
    var pageOutline = new Konva.Rect({
        x: 0,
        y: 0,
        width: sceneWidth,
        height: sceneHeight,
        stroke: 'red',
        strokeWidth: 1,
    });
    g.outerBoxLayer.add(pageOutline);
  
    //create lables
    var outerBox = new Konva.Rect({
        x: g.m,
        y: g.m,
        width: sceneWidth-2*g.m,
        height: sceneHeight-2*g.m,
        fillEnabled: false,
        stroke: '#000',
        strokeWidth: 1,
    });
    g.outerBoxLayer.add(outerBox);
  
    let lh = 100;
    var topLine = new Konva.Line({
        points: [g.m, lh, sceneWidth-g.m, lh],
        stroke: 'black',
        strokeWidth: 1,
      });
    g.outerBoxLayer.add(topLine);
  
    //add layer to stage and draw
    g.outerBoxLayer.draw();
    g.stage.add(g.outerBoxLayer);
  }