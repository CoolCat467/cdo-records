import Jimp from 'jimp';

function hex(str) {
    var digits = [];
    for (var n = 0, l = str.length; n < l; n++) {
        var h = Number(str.charCodeAt(n)).toString(16);
        digits.push(h);
    }
    return digits.join('');
}

function zero_pad_left(text, width){
    while (text.length < width){
        text += '0';
    }
    return text;
}

function zero_pad_right(text, width){
    while (text.length < width){
        text = '0'+text;
    }
    return text;
}

export function textToCode(text) {
    var codes = Array();
    let colours = Array();

    for (var i = 0; i < text.length; i++) {
        let parsed = text.charCodeAt(i);
        if (parsed >= 0xff){
            // console.log('Char >= 0xff: '+text[i]);
            let unicode = '\\u'+zero_pad_right(hex(text[i]), 4);
            text = text.replace(text[i], unicode);
            i--;
            continue;
        }
        codes.push(text[i]);
    }
    // console.log(text);

    for (var i = 0; i < ((codes.length - codes.length % 3) / 3) + 1; i++) {
        let pixel = '';
        for (var e = 0; e < 3; e++) {
            if (typeof codes[(i * 3 + e)] !== 'undefined'){
                pixel += hex(codes[(i * 3 + e)]+'');
            }
        }
        pixel = zero_pad_left(pixel, 6);
        if (pixel.length){
            colours.push((parseInt(pixel, 16) << 8) + 255);
        }
    }
  return colours;
}

export async function _image(pixel_colours) {
    const MAX_SIZE = 1024;
    return new Promise((resolve, reject) => {
        new Jimp(pixel_colours.length, 1, function(err, image) {
            if (err){
                reject(err);
            }

            let px_count = pixel_colours.length;
            let height = Math.max(1, Math.min(MAX_SIZE, Math.floor(px_count / MAX_SIZE)));
            let width = Math.max(1, Math.min(MAX_SIZE, px_count));
            // for (var i = 0; i < pixel_colours.length; i++) {
            for (var y = 0; y < height; y++){
                for (var x = 0; x < width; x++){
                    let idx = (y * MAX_SIZE) + x;
                    if (idx > px_count){
                        break;
                    }
                    image.setPixelColor(pixel_colours[idx], x, y);
                }
            }
            resolve(image);
        });
    });
}
