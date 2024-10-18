// Code.org project with use case: uWrgUCl0_x4epfCt64mvr-rqgGBLUIXjh-OYDRbCS7g

import express from 'express';
import Jimp from 'jimp'
import { textToCode, _image } from './image.js';
import { channelExists } from './cdo_utils.js';
//import { send } from './sendBack.js';
import { sendDB } from './sendBackDB.js';
const send = sendDB;

async function send_image(code, respond){
    let img = await _image(textToCode(JSON.stringify(code)));
    img = await Jimp.read(img);
    img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        respond.set('Content-Type','image/png');
        respond.send(buffer);
    });
}


const app = express();
app.listen(5000);

app.get('/', (req, res) => {
    res.send("<DOCTYPE HTML>\n<html>\n<body>\n<p>Invalid access method. Access project<a href=\"https://studio.code.org/projects/applab/uWrgUCl0_x4epfCt64mvr-rqgGBLUIXjh-OYDRbCS7g/view\"> here</a></p>\n</body>\n</html>");
})

app.get("/:id/read/:table", async (req, res) => {
    console.log("\nTable read");
    if (!req.params.id || !req.params.table) return res.send('Invalid');

    let exists = await channelExists(req.params.id);
    if (!exists){
        send_image({
            good: 0,
            message: "Project ID invalid"
        }, res);
        return;
    }

    try {
        var filter = req.query?.filter ? JSON.parse(req.query.filter) : {};
    } catch {
        filter = {};
    }

    let code = {
        good: 0,
        records: null,
    };

    code.records = await send.sendBackRead(req.params.id, req.params.table, filter);

    if (code.records){
        code.good = 1;
    }

    await send_image(code, res);
})

app.get('/:id/create/:table/:record', async(req, res)=>{
    console.log('\nTable create');
    if (!req.params.id || !req.params.table){
        await send_image({
            good: 0,
            message: "Invalid parameters"
        }, res);
        return
    }

    let exists = await channelExists(req.params.id);
    if (!exists){
        await send_image({
            good: 0,
            message: "Project ID does not exist"
        }, res);
        return
    }

    var record;
    try {
        var record = req.params.record ? JSON.parse(req.params.record) : {};
    } catch {
        record = {};
    }

    var code = {
        good: 0,
        record: null
    }

    code.record = await send.sendBackCreate(req.params.id, req.params.table, record);

    if (code.record){
        code.good = 1;
    }

    console.log(code);

    await send_image(code, res);
})

app.get('/:id/update/:table/:record', async(req, res)=>{
    console.log('\nTable update');
    if (!req.params.id || !req.params.table){
        await send_image({
            good: 0,
            message: "Invalid parameters"
        }, res);
        return
    }

    let exists = await channelExists(req.params.id);
    if (!exists){
        await send_image({
            good: 0,
            message: "Project ID does not exist"
        }, res);
        return
    }

    var record;
    try {
        var record = req.params.record ? JSON.parse(req.params.record) : {};
    } catch {
        record = {};
    }

    var code = {
        good: 0,
        record: null
    }

    code.record = await send.sendBackUpdate(req.params.id, req.params.table, record);

    if (code.record){
        code.good = 1;
    }

    console.log(code);

    await send_image(code, res);
})

app.get('/:id/delete/:table/:record', async(req, res)=>{
    console.log('\nTable delete');
    if (!req.params.id || !req.params.table){
        await send_image({
            good: 0,
            message: "Invalid parameters"
        }, res);
        return
    }

    let exists = await channelExists(req.params.id);
    if (!exists){
        await send_image({
            good: 0,
            message: "Project ID does not exist"
        }, res);
        return
    }

    var record;
    try {
        var record = req.params.record ? JSON.parse(req.params.record) : {};
    } catch {
        record = {};
    }

    var code = {
        good: 0
    }

    code.good = await send.sendBackDelete(req.params.id, req.params.table, record);

    console.log(code);

    await send_image(code, res);
})






// app.get('/amiup', async(req,res)=>{
//     let code = {
//         good: 1
//     };
//     let request = await fetch(process.env['path_check']);
//     if (request.status !== 200){
//         code.good = 0;
//     }

//     await send_image(code, res);
// })


// //uptime
// setInterval(()=>{
//   fetch(process.env['path_check']);
// },(1000*10))
