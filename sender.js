import './style.scss'
import './sender.scss'

'use strict';

import {RTCPeerConnectionHelper} from './utils';

document.addEventListener('DOMContentLoaded', () => {
    const helper = new RTCPeerConnectionHelper();
    const video = document.getElementById('video');
    const output = document.getElementById('output');
    output.log = text => {
        output.textContent = text;
    };
    helper.onEvent = output.log;
    const torchBtn = document.getElementById('torch');
    const torchBtnIconDefs = ['flashlight_off', 'flashlight_on'];
    let videoTrack = null, torch = false;

    const initialMediaStreamConstraints = {
        video: {
            facingMode: 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(initialMediaStreamConstraints).then(stream => {
        output.log('カメラを起動しました');
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0];
        const supported = videoTrack.getCapabilities();
        torchBtn.hidden = !('torch' in supported);
        helper.start(videoTrack);
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