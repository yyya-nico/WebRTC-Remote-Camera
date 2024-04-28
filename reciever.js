import './style.scss'
import './reciever.scss'

'use strict';

import {RTCPeerConnectionHelper} from './utils';

document.addEventListener('DOMContentLoaded', () => {
    const helper = new RTCPeerConnectionHelper();
    const pc = helper.pc;
    const video = document.getElementById('video');
    let videoTrack = null;

    pc.addEventListener('track', e => {
        videoTrack = e.track;
        const stream = new MediaStream();
        video.srcObject = e.streams && e.streams[0] || stream;
        stream.addTrack(videoTrack);
    });

    setTimeout(() => {
        if (!videoTrack) {
            helper.requestOffer();
        }
    }, 1000);
});