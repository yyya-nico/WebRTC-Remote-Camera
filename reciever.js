import './style.scss'
import './reciever.scss'

import QRCode from 'qrcode';
import {RTCPeerConnectionHelper, fullscreenSwitcher, uiDispManage} from './utils';

const helper = new RTCPeerConnectionHelper();
const connectQrImage = document.querySelector('.connect-qr-image');
const view = document.querySelector('.view');
const video = document.getElementById('video');
const fade = uiDispManage();
const output = document.getElementById('output');
output.log = text => {
    output.textContent = text;
    fade();
};
helper.onEvent = output.log;
const resolution = document.getElementById('resolution');
resolution.log = text => {
    resolution.textContent = text;
    fade();
};
const qrCode = document.getElementById('qr-code');
helper.sidHandler = sid => {
    QRCode.toCanvas(qrCode, `Connect:${sid}`, {
        margin: 2,
        scale: 8
    }, error => {
        if (error) {
            alert('QRコードを作成できませんでした。お使いの環境では利用できません。');    
        }
    });
};
const fsBtn = document.getElementById('fullscreen');

video.addEventListener('resize', () => {
    resolution.log(`${video.videoWidth} x ${video.videoHeight}`);
});

const listenTrackEvent = () => {
    helper.pc.addEventListener('track', e => {
        const videoTrack = e.track;
        const stream = new MediaStream();
        video.srcObject = e.streams && e.streams[0] || stream;
        stream.addTrack(videoTrack);
        connectQrImage.hidden = true;
        view.hidden = false;
    });
};
listenTrackEvent();

let sendDelay = null;
window.addEventListener('resize', () => {
    if (!sendDelay) {
        helper.returnConstraints();
    }
    clearTimeout(sendDelay);
    sendDelay = setTimeout(() => {
        helper.returnConstraints();
        sendDelay = null;
    }, 100);
});

fullscreenSwitcher(fsBtn);

helper.disconnectHandler = () => {
    connectQrImage.hidden = false;
    view.hidden = true;
    video.srcObject = null;
    listenTrackEvent();
}