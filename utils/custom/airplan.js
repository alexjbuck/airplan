var airplan = new Object;

airplan.data = {
    "header": {
        "title": {
            "title": "Airplan Title",
            "subtitle": "Subtitle"
        },
        "slap": {
            "sunrise": "0550",
            "sunset": "1920",
            "moonrise": "2120",
            "moonset": "0440",
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
        "sorties":[
            {
                "squadron": "VFA-201",
                "start": 9.5,
                "end": 12.5,
                "startCycle": null,
                "endCycle": null,
                "startCondition": "pull",
                "endCondition": "stuff",
                "annotation": "SSC",
                "id": "0"
            },
            {
                "squadron": "VFA-201",
                "start": 11,
                "end": 13,
                "startCycle": 1,
                "endCycle": 2,
                "startCondition": "flyOn",
                "endCondition": "flyOff",
                "annotation": "LOG",
                "id": "1"
            }
        ],
        "squadrons": [
            {
                "name": "VFA-201",
                "cs": "WOLF",
                "tms": "MH-60R",
                "modex": "700",
                "letter": "A",
            },
            {
                "name": "VFA-202",
                "cs": "DIMON",
                "tms": "FA-18E",
                "modex": "100",
                "letter": "B",
            }
        ],
        "cycles": [
            {
                "start": '2022-01-18T11:00',
                "end": '2022-01-18T12:00',
                "number": 1
            },
            {
                "start": 12.5,
                "end": 15,
                "number": 2
            }
        ]
    }
} 
        