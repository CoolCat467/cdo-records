import { set, get, delete_key, list } from './repldb.js';

function deep_copy(list){
    return JSON.parse(JSON.stringify(list));
}

function get_data_handler(id, table){
    return id+'_'+table;
}

/*
Internal Layout:
records: List of records
next_id: Next ID number
*/

async function read_internal(id, table){
    let table_name = get_data_handler(id, table);
    var internal = await get(table_name);
    if (!internal){
        internal = {};
    }
    if (internal.next_id === undefined){
        internal.next_id = 0;
    }
    // if (internal.records === undefined){
    //     internal.records = [];
    // }
    return internal
}

async function read_records(id, table){
    return (await read_internal(id, table)).records
}

async function write_internal(id, table, data){
    let table_name = get_data_handler(id, table);
    return await set(table_name, data);
}

async function write_records(id, table, records){
    let internal = await read_internal(id, table);
    let save = [];
    let ids = [];
    for (const i in records){
        let record = records[i];
        if (ids.includes(record.id) || record.id === undefined){
            record.id = internal.next_id;
            internal.next_id++;
        }
        ids.push(record.id);
        save.push(record);
    }
    internal.records = save;
    write_internal(id, table, internal);
    return records;
}

async function delete_table(id, table){
    let table_name = get_data_handler(id, table);
    return await delete_key(table_name);
}

async function sendBackRead(id, table, filter) {
    console.log("sendBackRead");

    return new Promise(async function(resolve){
        try {
            let records = await read_records(id, table);
            if (records === undefined){
                console.log("Records do not exist");
                resolve(null);
            }
            if (Object.entries(filter).length == 0){
                resolve(records);
            }
            let filtered = [];
            for (const ridx in records){
                for (const fidx in filter){
                    if (records[ridx][key] == filter[key]){
                        filtered.push(records[ridx]);
                    }
                }
            }
            resolve(filtered);
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    });
}

async function sendBackDelete(id, table, record) {
    console.log("sendBackDelete");
    console.log(id);
    console.log(table);
    console.log(record);

    if (record.id === undefined){
        return
    }

    return new Promise(async function(resolve){
        try {
            let records = await read_records(id, table);
            if (records === undefined){
                console.log("Cannot delete, does not exist");
                resolve(false);
            }
            let filtered = [];
            for (const i in records){
                if (records[i].id != record.id){
                    filtered.push(records[i]);
                }
            }
            if (filtered.length == 0){
                delete_table(id, table);
            } else {
                await write_records(id, table, filtered);
            }
            resolve(true);
        } catch (error) {
            console.log(error);
            resolve(false);
        }
    });
}

//Return record or null
async function sendBackUpdate(id, table, record) {
    console.log("sendBackUpdate");
    console.log(id);
    console.log(table);
    console.log(record);

    if (record.id === undefined){
        return await sendBackCreate(id, table, record);
    }

    return new Promise(async function(resolve){
        try {
            let records = await read_records(id, table);
            if (records === undefined){
                console.log("Records undefined, canceling");
                resolve(null);
                return
            }
            // find idx
            var ridx;
            for (ridx in records){
                if (records[ridx].id == record.id){
                    break
                }
            }
            let db_record = records[ridx];
            // update given with existing
            for (const key in db_record){
                if (record[key] === undefined){
                    record[key] = db_record[key];
                }
            }
            // update record
            records[ridx] = record;
            // write records
            await write_records(id, table, records);
            resolve(record);
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    })
}

async function sendBackCreate(id, table, record) {
    console.log("sendBackCreate");
    console.log(id);
    console.log(table);
    console.log(record);

    if (record.id){
        return await sendBackUpdate(id, table, record);
    }

    return new Promise(async function(resolve){
        try {
            var records = await read_records(id, table);
            if (records === undefined){
                records = [];
            }
            records.push(record);
            records = await write_records(id, table, records);
            resolve(records[records.length - 1]);
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    });
}

export const send = {
  sendBackCreate: sendBackCreate,
  sendBackDelete: sendBackDelete,
  sendBackRead: sendBackRead,
  sendBackUpdate: sendBackUpdate
}
