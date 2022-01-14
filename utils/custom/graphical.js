var graphical = {};

// first we need to create a stage
graphical.stage = new Konva.Stage({
    container: 'graphic',   // id of container <div>
    height: $("#graphic").width(),
    width: $("#graphic").height()
  });



  graphical.addSunMoonText = () => {
    graphical.sunMoonLayer = new Konva.Layer();

    //create lables
    var sunMoonText = new Konva.Text({
        x: 10,
        y: 10,
        text: 'SUNRISE:\nSUNSET:\nMOONRISE:\nMOONSET:\nMOONPHASE:',
        fontSize: 8,
        fontFamily: 'Calibri',
    });
    graphical.sunMoonLayer.add(sunMoonText);

    //create data
    var sunMoonData = new Konva.Text({
        x: 65,
        y: 10,
        text: '0800L\n1730L\n1530L\n2230L\n50% ILLUMINATION',
        fontSize: 8,
        fontFamily: 'Calibri',
    });
    graphical.sunMoonLayer.add(sunMoonData);

    //add layer to stage and draw
    graphical.stage.add(graphical.sunMoonLayer);
    graphical.sunMoonLayer.draw();
  }
  

  graphical.addTitle = () => {
    graphical.titleLayer = new Konva.Layer();

    //create lables
    var titleText = new Konva.Text({
        x: 155,
        y: 13,
        text: 'AIR PLAN',
        fontSize: 16,
        fontFamily: 'Calibri',
    });
    graphical.titleLayer.add(titleText);

    //add layer to stage and draw
    graphical.stage.add(graphical.titleLayer);
    graphical.titleLayer.draw();
  }

  graphical.addBox = () => {
    graphical.outerBoxLayer = new Konva.Layer();

    //create lables
    var outerBox = new Konva.Rect({
        x: 5,
        y: 5,
        width: $("#graphic").width()-10,
        height: $("#graphic").height()-20,
        fillEnabled: false,
        stroke: '#000',
        strokeWidth: 1,
    });
    graphical.outerBoxLayer.add(outerBox);

    var topLine = new Konva.Line({
        points: [5, 60, $("#graphic").width()-5, 60],
        stroke: 'black',
        strokeWidth: 1,
      });
    graphical.outerBoxLayer.add(topLine);

    //add layer to stage and draw
    graphical.stage.add(graphical.outerBoxLayer);
    graphical.outerBoxLayer.draw();
  }

  graphical.draw = () => {
    graphical.addSunMoonText();
    graphical.addTitle();
    graphical.addBox();

  }

