import './style.scss'
import './reciever.scss'

'use strict';

import {RTCPeerConnectionHelper, fullscreenSwitcher, uiDispManage} from './utils';

document.addEventListener('DOMContentLoaded', () => {
    const helper = new RTCPeerConnectionHelper();
    const pc = helper.pc;
    const video = document.getElementById('video');
    const fade = uiDispManage();
    const output = document.getElementById('output');
    output.log = text => {
        output.textContent = text;
        fade();
    };
    const resolution = document.getElementById('resolution');
    resolution.log = text => {
        resolution.textContent = text;
        fade();
    };
    helper.onEvent = output.log;
    const fsBtn = document.getElementById('fullscreen');
    let videoTrack = null;

    video.addEventListener('resize', () => {
        resolution.log(`${video.videoWidth} x ${video.videoHeight}`);
    });

    pc.addEventListener('track', e => {
        videoTrack = e.track;
        const stream = new MediaStream();
        video.srcObject = e.streams && e.streams[0] || stream;
        stream.addTrack(videoTrack);
    });

    fullscreenSwitcher(fsBtn);

    helper.ready(videoTrack);
});