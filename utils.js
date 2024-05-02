'use strict';

class RTCPeerConnectionHelper {
    #loggingHandler = str => {};

    constructor() {
        this.pc = new RTCPeerConnection();
        const wsUrl = import.meta.env.VITE_WS_URL;
        this.ws = new WebSocket(wsUrl);
        this.track = null;
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
                case 'ready':
                    this.restart(this.track);
                    break;
                case 'requestConstraints':
                    this.#sendWrap(JSON.stringify({
                        type: 'returnConstraints',
                        constraints: {
                            width: {
                                max: window.screen.width * window.devicePixelRatio
                            },
                            height: {
                                max: window.screen.height * window.devicePixelRatio
                            },
                            aspectRatio: window.screen.height / window.screen.width
                        }
                    }));
                    break;
                case 'returnConstraints':
                    this.track.applyConstraints(msg.constraints);
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
        window.addEventListener('beforeunload', () => {
            this.pc.close();
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

    async start(track) {
        this.#loggingHandler('準備中...');
        if (track) {
            this.pc.addTrack(track);
            this.track = track;
            this.#sendWrap(JSON.stringify({
                type: 'requestConstraints'
            }));
        }
        this.#loggingHandler('接続中...');
        this.pc.addEventListener('icecandidate', e => {
            if (e.candidate) {
                this.#sendWrap(JSON.stringify({
                    type: 'candidate',
                    ice: e.candidate
                }));
            }
        });
        this.pc.createOffer()
            .then(desc => {
                this.pc.setLocalDescription(desc);
                this.#sendWrap(JSON.stringify(desc));
            });
    }

    restart(track) {
        this.#loggingHandler('接続しなおしています...');
        this.pc.close();
        this.pc = new RTCPeerConnection();
        this.start(track);
    }

    ready(track) {
        this.#sendWrap(JSON.stringify({
            type: 'ready',
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

const uiDispManage = () => {
    const target = document.body;
    let fadeTimer = 0;
    const fade = () => {
        clearTimeout(fadeTimer);
        target.classList.remove('hide');
        fadeTimer = setTimeout(function() {
            target.classList.add('hide');
        },3000);
    };
    window.addEventListener('pointerdown',fade);
    window.addEventListener('pointermove',fade);
    fade();
    return fade;
};

export {RTCPeerConnectionHelper, fullscreenSwitcher, uiDispManage}