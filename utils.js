'use strict';

class RTCPeerConnectionHelper {
    constructor() {
        this.pc = new RTCPeerConnection();
        const wsUrl = import.meta.env.VITE_WS_URL;
        this.ws = new WebSocket(wsUrl);
        this.track = null;
        this.pc.addEventListener('icecandidate', e => {
            if (e.candidate) {
                this.#sendWrap(JSON.stringify({
                    type: 'candidate',
                    ice: e.candidate
                }));
            }
        });
        this.ws.addEventListener('message', e => {
            const msg = JSON.parse(e.data);
            console.log(msg.type);
            switch (msg.type) {
                case 'offer':
                    this.pc.setRemoteDescription(msg);
                    this.pc.createAnswer()
                        .then(desc => {
                            this.pc.setLocalDescription(desc);
                            this.#sendWrap(JSON.stringify(desc));
                        });
                    break;
                case 'answer':
                    this.pc.setRemoteDescription(msg);
                    break;
                case 'candidate':
                    this.pc.addIceCandidate(msg.ice);
                    break;
                case 'requestOffer':
                    this.pc.close();
                    this.pc = new RTCPeerConnection();
                    this.start(this.track);
                    break;
            }
        });
    }

    #sendWrap(msg) {
        if (this.ws.readyState) { // Connection Opened
            this.ws.send(msg);
        } else {
            this.ws.addEventListener('open', () => {
                this.ws.send(msg);
            }, {once: true});
        }
    }

    start(track) {
        if (track) {
            this.pc.addTrack(track);
            this.track = track;
        }
        this.pc.createOffer()
            .then(desc => {
                this.pc.setLocalDescription(desc);
                this.#sendWrap(JSON.stringify(desc));
            });
    }

    requestOffer() {
        this.#sendWrap(JSON.stringify({
            type: 'requestOffer'
        }));
    }
}

export {RTCPeerConnectionHelper}