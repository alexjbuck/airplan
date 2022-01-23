var airplan = new Object;

airplan.data = {
    "header": {
        "title": {
            "title": "Airplan Title",
            "subtitle": "Subtitle"
        },
        "slap": {
            "sunrise": new Date(1642675800000),
            "sunset": new Date(1642724400000),
            "moonrise": new Date(1650284400000),
            "moonset": new Date(1650530400000),
            "moonphase": "25%"
        },
        "time": {
            "flightquarters": "1000",
            "heloquarters": "0930",
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
            "5dddeab8-5e53-4322-a370-0fbab93a9dd0": {
                "squadron": "VFA-201",
                "start": new Date(1642698000000),
                "end": new Date(1642702500000),
                "startCycle": null,
                "endCycle": null,
                "startCondition": "pull",
                "endCondition": "stuff",
                "annotation": "SSC",
                "id": "0",
            },
            "64768f2a-2427-43b8-8e51-2e4f625bbded": {
                "squadron": "VFA-201",
                "start": new Date(1642702500000),
                "end": new Date(1642707000000),
                "startCycle": 1,
                "endCycle": 2,
                "startCondition": "flyOn",
                "endCondition": "flyOff",
                "annotation": "LOG",
                "id": "1"
            }
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
            "b713e05b-d976-4863-843d-d9d52c6aa4e1": {
                "start": new Date(1642698000000), // Thu Jan 20 2022 12:00:00 GMT-0500 (Eastern Standard Time)
                "end": new Date(1642702500000), // Thu Jan 20 2022 13:15:00 GMT-0500 (Eastern Standard Time)
                "number": 1
            },
            "7e56b778-beeb-4b44-b60a-b310d64e0d94":{
                "start": new Date(1642702500000), // Thu Jan 20 2022 13:15:00 GMT-0500 (Eastern Standard Time)
                "end": new Date(1642707000000), // Thu Jan 20 2022 14:30:00 GMT-0500 (Eastern Standard Time)
                "number": 2
            }
        },
        "start": 1642692600000, // Thu Jan 20 2022 10:30:00 GMT-0500 (Eastern Standard Time)
        "end": 1642717800000, // Thu Jan 20 2022 17:30:00 GMT-0500 (Eastern Standard Time)
    }
} 
        