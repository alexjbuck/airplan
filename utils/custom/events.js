g.makeEvents = ({offsetY,width,height}) => {
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