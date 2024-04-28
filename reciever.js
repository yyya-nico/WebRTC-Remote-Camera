import './style.scss'
import './reciever.scss'

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
    let videoTrack = null;

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

    pc.addEventListener('addstream', e => {
        video.srcObject = e.stream;
        videoTrack = e.stream.getVideoTracks()[0];
    });

    setParams.addEventListener('submit', e => {
        e.preventDefault();
        const candidates = setParams._candidate.value.split('\n');
        const description = setParams._description.value;
        if (description) {
            pc.setRemoteDescription(JSON.parse(description));
            pc.createAnswer()
                .then(desc => {
                    pc.setLocalDescription(desc);
                    output.log('概要:', JSON.stringify(desc));
                });
        }
        if (candidates) {
            candidates.forEach(candidate => {
                pc.addIceCandidate(JSON.parse(candidate));
            });
        }
    });
});