'use strict';

class RTCPeerConnectionHelper {
    #loggingHandler = str => {};

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
                    this.#loggingHandler('接続済み');
                    break;
                case 'candidate':
                    this.pc.addIceCandidate(msg.ice);
                    break;
                case 'requestOffer':
                    this.#loggingHandler('接続しなおしています...');
                    this.pc.close();
                    this.pc = new RTCPeerConnection();
                    this.start(this.track);
                    break;
            }
        });
        this.pc.addEventListener('iceconnectionstatechange', () => {
            switch (this.pc.iceConnectionState) {
                case 'checking':
                    this.#loggingHandler('確認中...');
                    break;
                case 'connected':
                    this.#loggingHandler('接続済み');
                    break;
                case 'closed':
                    this.#loggingHandler('切断しました');
                    break;
                case 'failed':
                    this.#loggingHandler('切断されました');
                    break;
                case 'disconnected':
                    this.#loggingHandler('一時的に切断しています');
                    break;
                default:
                    this.#loggingHandler(this.pc.iceConnectionState);
                    break;
            }

        });
    }

    set onEvent(handler) {
        this.#loggingHandler = handler;
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
        this.#loggingHandler('接続中...');
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

const fullscreenSwitcher = button => {
    const target = document.documentElement;
    button.addEventListener('click', () => {
		if (!document.fullscreenElement) {
			target.requestFullscreen()
                .catch((err) => {
                    alert('ご利用のブラウザは全画面表示に対応していません' + err.name);
                    button.disabled = true;
                });
		} else {
			document.exitFullscreen();
		}
	});

	const fullscreenChangeHandler = () => {
        button.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
	}
	document.addEventListener('fullscreenchange', fullscreenChangeHandler);
}

export {RTCPeerConnectionHelper, fullscreenSwitcher}