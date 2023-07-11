var shell = require('shelljs');
var cron = require('node-cron');
const Parse = require('parse/node');
const moment = require("moment")
const Collect = require('collect.js');
const uuid = require('random-uuid-v4');
Parse.initialize("rYGp5WDpqvxwWQyesURfzCk2O", "rYGp5WDpqvxwWQyesURfzCk2O", "HJPByAXqRtqhq76xCgtrH7Asy");
Parse.serverURL = 'https://parse.pearldrift.com/parse'


var runner = async () => {

    const RosterEvents = Parse.Object.extend("RosterEvents");

    const AttendanceQ = Parse.Object.extend("Attendance");

    const queryUser = new Parse.Query(Parse.User);

    const queryEvents = new Parse.Query(RosterEvents);


    const queryAttendance = new Parse.Query(AttendanceQ);

    var events = await queryEvents.equalTo('expired', false).includeAll().find()




    events.map(async (event, key) => {

        if (moment().isBefore(event.get("date_to"))) {

            var dates_list = getDateArray(event.get("date_from"), event.get("date_to"))
            var collectedDates = Collect(dates_list)



            if (collectedDates.contains( moment().format("YYYY-MM-DD") )) {


                var staff = event.get("staff_object")
                // saving new attendance

                var object = [
                    {
                        capture_type: "auto",
                        location: "system",
                        timestamp: new Date(moment().format("YYYY-MM-DD")),
                        timestamp_date: new Date(moment().format("YYYY-MM-DD")),
                        staff_objectId: staff,
                        enrol_id:'0',
                        staff_uuid: staff.get("uuid"),
                        uid: uuid(),
                        excuse_type: event.get('type'),
                        attns_type: "signed_in",
                        device_admin: event.get("admin_staff")
                    },
                    {
                        capture_type: "auto",
                        location: "system",
                        timestamp: new Date(moment().format("YYYY-MM-DD")),
                        timestamp_date: new Date(moment().format("YYYY-MM-DD")),
                        staff_objectId: staff,
                        enrol_id:'0',
                        excuse_type: event.get('type'),
                        staff_uuid: staff.get("uuid"),
                        uid: uuid(),
                        attns_type: "signed_out",
                        device_admin: event.get("admin_staff")
                    }
                ]


                var Attendance1 = Parse.Object.extend("Attendance");
                var attns1 = new Attendance1();


                var ParseArrayObjects = []

                var c = 0
                object.forEach(  (item, key) => {
                    c++


                    if (item.attns_type == "signed_in") {
                        var Attendance1 = Parse.Object.extend("Attendance");
                        var attns1 = new Attendance1();


                        for (const [key, value] of Object.entries(item)) {
                            attns1.set(`${key}`, value)
                        }


                        ParseArrayObjects.push(attns1)

                        return false
                    }
                    else if (item.attns_type == "signed_out") {
                        var Attendance2 = Parse.Object.extend("Attendance");
                        var _attns = new Attendance2();

                        for (const [key, value] of Object.entries(item)) {
                            _attns.set(`${key}`, value)
                        }

                        ParseArrayObjects.push(_attns)

                        return false
                    }


                })

               var data =  await saveAllInChunks(ParseArrayObjects)

            }

            return false
        }

        if (moment().isSame(event.get("date_to"), 'day')) {
            event.set("expired", true)
            event.save()
        }

    })




}

runner()


var saveAllInChunks = async (ParseArrayObjects) => {

    setTimeout(async () => {
        Parse.Object.saveAll(ParseArrayObjects)
            .then((list) => {
                console.log(list);
            }, (error) => {
                console.log(error);
            });
    }, 100);

    return false
}


var getDateArray = function (start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        arr.push(moment(new Date(dt)).format("YYYY-MM-DD"));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}
