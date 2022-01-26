BlankAirplan = function() {
    return {
        data: {
            "date": new Date(new Date().setHours(0)),
            "header": {
                "title": "Airplan Title",
                "slap": {
                    "sunrise": new Date( new Date().setHours(6,30) ),
                    "sunset": new Date( new Date().setHours(19,0) ),
                    "moonrise": new Date( new Date().setHours(20) ),
                    "moonset": new Date( new Date().setHours(2) ),
                    "moonphase": "%"
                },
                "time": {
                    "flightquarters": new Date(),
                    "heloquarters": new Date(),
                    "variation": "",
                    "timezone": "",
                    "sorties": {
                        "day": 1,
                        "night": 0,
                        "total": 1
                    },
                    "hours": {
                        "day": 5,
                        "night": 0,
                        "total": 5
                    }
                }
            },
            "events": {
                "sorties":{
                },
                "squadrons": [
                    {
                        "name": "Name",
                        "cs": "Callsign",
                        "tms": "TMS",
                        "modex": "MODEX",
                        "letter": "A",
                    },
                ],
                "cycles": {
                },
                "start": new Date( new Date().setHours(8,0) ), // Thu Jan 20 2022 10:30:00 GMT-0500 (Eastern Standard Time)
                "end": new Date( new Date().setHours(18,0) ), // Thu Jan 20 2022 17:30:00 GMT-0500 (Eastern Standard Time)
            }
        } 
    }  
}