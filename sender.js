import './style.scss'
import './sender.scss'

'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const pc = new RTCPeerConnection();
    const video = document.getElementById('video');
    const setParams = document.forms['set-params'];
    setParams._candidate = setParams.elements['candidate'];
    setParams._description = setParams.elements['description'];
    const output = document.getElementById('output');
    output.log = (...texts) => {
        output.textContent += texts.join(' ') + '\n\n';
    };
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
        pc.addStream(stream);
        videoTrack = stream.getVideoTracks()[0];
        pc.createOffer()
            .then(desc => {
                pc.setLocalDescription(desc);
                output.log('概要:', JSON.stringify(desc));
            });
        const supported = videoTrack.getCapabilities();
        torchBtn.hidden = !('torch' in supported);
    });

    let timer = null, candidates = [];
    const timeoutHandler = () => {
        output.log('候補:', candidates.join('\n'));
    };
    pc.addEventListener('icecandidate', e => {
        if (e.candidate) {
            clearTimeout(timer);
            candidates.push(JSON.stringify(e.candidate.toJSON()));
            timer = setTimeout(timeoutHandler, 200);
        }
    });

    setParams.addEventListener('submit', e => {
        e.preventDefault();
        const candidates = setParams._candidate.value.split('\n');
        const description = setParams._description.value;
        if (description) {
            pc.setRemoteDescription(JSON.parse(description));
        }
        if (candidates) {
            candidates.forEach(candidate => {
                pc.addIceCandidate(JSON.parse(candidate));
            });
        }
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