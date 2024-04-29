import './style.scss'
import './reciever.scss'

'use strict';

import {RTCPeerConnectionHelper, fullscreenSwitcher} from './utils';

document.addEventListener('DOMContentLoaded', () => {
    const helper = new RTCPeerConnectionHelper();
    const pc = helper.pc;
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    output.log = text => {
        output.textContent = text;
    };
    helper.onEvent = output.log;
    const fsBtn = document.getElementById('fullscreen');
    let videoTrack = null;

    pc.addEventListener('track', e => {
        videoTrack = e.track;
        const stream = new MediaStream();
        video.srcObject = e.streams && e.streams[0] || stream;
        stream.addTrack(videoTrack);
    });

    fullscreenSwitcher(fsBtn);

    helper.ready(videoTrack);
});