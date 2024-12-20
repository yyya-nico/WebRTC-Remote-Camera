import './style.scss'
import './sender.scss'

import jsQR from 'jsqr';
import {RTCPeerConnectionHelper} from './utils';

const helper = new RTCPeerConnectionHelper();
const video = document.getElementById('video');
const output = document.getElementById('output');
output.log = text => {
    output.textContent = text;
};
const resolution = document.getElementById('resolution');
resolution.log = text => {
    resolution.textContent = text;
};
helper.onEvent = output.log;
const torchBtn = document.getElementById('torch');
const torchBtnIconDefs = ['flashlight_off', 'flashlight_on'];
let videoTrack = null, torch = false;

video.addEventListener('resize', () => {
    resolution.log(`${video.videoWidth} x ${video.videoHeight}`);
});

const initialMediaStreamConstraints = {
    video: {
        facingMode: 'environment'
    }
};

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', {
    willReadFrequently: true
});
const readStart = () => {
    return setInterval(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            if (code.data.startsWith('Connect:') && code.data.includes('@')) {
                const secret = code.data.split(':')[1].split('@')[0];
                const sid = Number(code.chunks[1].text);
                if (!Number.isInteger(sid)) {
                    return;
                }
                helper.start(videoTrack, sid, secret);
                clearInterval(readInterval);
            }
        }
    }, 1000);
};
let readInterval = null;

navigator.mediaDevices.getUserMedia(initialMediaStreamConstraints).then(stream => {
    output.log('受信画面に表示されているQRコードを読み取ってください。');
    video.srcObject = stream;
    videoTrack = stream.getVideoTracks()[0];
    const supported = videoTrack.getCapabilities();
    torchBtn.hidden = !supported.torch;
    readInterval = readStart();
});

torchBtn.addEventListener('click', () => {
    videoTrack.applyConstraints({
        advanced: [{
            torch: torch = !torch
        }]
    }).then(() => {
        torchBtn.textContent = torchBtnIconDefs[Number(torch)];
    });
});

helper.disconnectHandler = () => {
    clearInterval(readInterval);
    readInterval = readStart();
    setTimeout(() => {
        output.log('受信画面に表示されているQRコードを読み取ってください。');
    }, 2000);
};