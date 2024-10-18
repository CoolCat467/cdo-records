import fetch from 'node-fetch';

export async function channelExists(id){
  return new Promise((resolve,reject)=>{
    let request = fetch(`https://studio.code.org/v3/sources/${id}/main.json`);
    request.then(r=>resolve(r.status != 404))
  })
}
