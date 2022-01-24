var airplan = new Object;

airplan.data = {
    "date": new Date(),
    "header": {
        "title": "Airplan Title",
        "slap": {
            "sunrise": new Date(1642675800000),
            "sunset": new Date(1642724400000),
            "moonrise": new Date(1650284400000),
            "moonset": new Date(1650530400000),
            "moonphase": "25%"
        },
        "time": {
            "flightquarters": new Date(1642675800000),
            "heloquarters": new Date(1642724400000),
            "variation": "10 W",
            "timezone": "L",
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
                "name": "VFA-213",
                "cs": "WOLF",
                "tms": "MH-60R",
                "modex": "700",
                "letter": "A",
            },
            {
                "name": "VFA-201",
                "cs": "DIMON",
                "tms": "FA-18E",
                "modex": "100",
                "letter": "B",
            },
            {
                "name": "VFA-37",
                "cs": "TOMCAT",
                "tms": "FA-18E",
                "modex": "200",
                "letter": "C",
            }
        ],
        "cycles": {
        },
        "start": new Date(1642692600000), // Thu Jan 20 2022 10:30:00 GMT-0500 (Eastern Standard Time)
        "end": new Date(1642717800000), // Thu Jan 20 2022 17:30:00 GMT-0500 (Eastern Standard Time)
    }
} 
        