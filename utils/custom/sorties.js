var sorties = new Object;

sorties.data = {
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
        "squadrons": [
            {
                "name": "Squadron 1",
                "cs": "WOLF",
                "tms": "MH-60R",
                "modex": "700",
                "sorties":[
                    {
                        "start": 9.5,
                        "end": 12.5,
                        "startCycle": null,
                        "endCycle": null,
                        "startCondition": "pull",
                        "endCondition": "stuff",
                        "annotation": "SSC"
                    },
                    {
                        "start": null,
                        "end": null,
                        "startCycle": 1,
                        "endCycle": 2,
                        "startCondition": "flyOn",
                        "endCondition": "flyOff",
                        "annotation": "LOG"
                    }
                ]
            }
        ],
        "cycles": [
            {
                "start": 10,
                "end": 12,
                "id": 1
            },
            {
                "start": 12.5,
                "end": 15,
                "id": 2
            }
        ]
    }
} 
        