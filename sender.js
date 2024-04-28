import './style.scss'
import './sender.scss'

'use strict';

import {RTCPeerConnectionHelper} from './utils';

document.addEventListener('DOMContentLoaded', () => {
    const helper = new RTCPeerConnectionHelper();
    const video = document.getElementById('video');
    const torchBtn = document.getElementById('torch');
    const torchBtnIconDefs = ['flashlight_off', 'flashlight_on'];
    let videoTrack = null, torch = false;

    navigator.mediaDevices.getUserMedia({
        video: {
            width: {
                max: window.screen.width * window.devicePixelRatio
            },
            height: {
                max: window.screen.height * window.devicePixelRatio
            },
            facingMode: 'environment'
        }
    }).then(stream => {
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0];
        helper.start(videoTrack);
        const supported = videoTrack.getCapabilities();
        torchBtn.hidden = !('torch' in supported);
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
});