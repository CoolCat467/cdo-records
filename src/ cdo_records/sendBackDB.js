import { loadFirebase } from "cdo-firebase-storage";

async function sendBackRead(id, table, filter) {
    // console.log("sendBackRead");
    try {
        var storage = await loadFirebase(id);
    } catch (error) {
        return;
    }

    return new Promise(resolve => {
        storage.readRecords(table, filter, records => {
            console.log(records);
            resolve(records);
        }, fail => {
            resolve(null);
        });
    });
}

async function sendBackDelete(id, table, record) {
    console.log(id);
    console.log(table);
    console.log(record);

    try {
        var storage = await loadFirebase(id);
    } catch (error) {
        return;
    }

    return new Promise(resolve => {
        function onComplete(success){
            resolve(success);
        }
        function onError(){
            resolve(false);
        }
        storage.deleteRecord(table, record, onComplete, onError)
    })
}

async function sendBackUpdate(id, table, record) {
    console.log(id);
    console.log(table);
    console.log(record);

    try {
        var storage = await loadFirebase(id);
    } catch (error) {
        return;
    }

    // await sendBackRead(id, table, record);

    return new Promise(resolve => {
        function onComplete(back_record, success){
            if (!success){
                resolve(null);
            } else {
                resolve(back_record);
            }
        }
        function onError(){
            resolve(null);
        }
        storage.updateRecord(table, record, onComplete, onError)
    })
}

async function sendBackCreate(id, table, record) {
    console.log(id);
    console.log(table);
    console.log(record);

    if (record.id){
        return await sendBackUpdate(id, table, record);
    }

    try {
        var storage = await loadFirebase(id);
    } catch (error) {
        return;
    }

    return new Promise(resolve => {
        var complete = function(){
            console.log("complete");
            resolve(table);
        }
        var fail = function(){
            console.log("fail");
            resolve(null);
        }
        var error = function(){
            storage.createTable(table, function(){
                console.log("created woo");
                storage.createRecord(table, record, complete, fail);
            }, function(){
                console.log("Could not make table");
                fail();
            });
        }

        try {
            storage.createRecord(table, record, complete, error);
        } catch (error) {
            console.log(error);
            fail();
        }
    });
}

export const sendDB = {
  sendBackCreate: sendBackCreate,
  sendBackDelete: sendBackDelete,
  sendBackRead: sendBackRead,
  sendBackUpdate: sendBackUpdate
}
