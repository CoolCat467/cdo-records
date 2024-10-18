import fetch from 'node-fetch';

async function request(content, method, path){
    var url = process.env['REPLIT_DB_URL'];
    if (path){
        url += path;
    }
    let params = {
        method: method,
    }
    if (content){
        params.content = content
    }
    return await fetch(url, params);
}

export async function set(key, value){
    var url = process.env['REPLIT_DB_URL'];
    return await fetch(url, {
        method: 'POST',
        body: key + '=' + JSON.stringify(value),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

export async function get(key){
    let response =  await request('', 'GET', '/'+key)
    let message = await response.text();
    if (!message){
        return message;
    }
    try {
        return JSON.parse(message);
    } catch (error) {
        console.log(message)
        console.log(error)
    }
    return {};
}

export async function delete_key(key){
    return (await request('', 'DELETE', '/'+key)).text();
}

export async function list(prefix){
    if (!prefix){
        prefix = ''
    }
    var response = (await request('', 'GET', '?encode=true&prefix='+encodeURIComponent(prefix))).text();
    if (!response.length){
        return [];
    }
    return response.split("\n").map(decodeURIComponent);
}

export async function clear(){
    const promises = [];
    for (const key of await list()) {
        promises.push(delete_key(key));
    }

    await Promise.all(promises);
}

export async function get_all(){
    let output = {};
    for (const key of await list()) {
      output[key] = await get(key);
    }
    return output;
}

export async function set_all(obj) {
    for (const key in obj) {
        await set(key, obj[key]);
    }
}
