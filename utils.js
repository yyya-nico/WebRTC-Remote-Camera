'use strict';

const getTimestamp = () => {
    const now = Date.now();
    const lastFiveDigits = now % 100000; // 下5桁を取得
    return lastFiveDigits.toString().padStart(5, '0'); // 0で埋める
};

const events = [];

const printEvents = () => {
    console.table(events);
};

globalThis.printEvents = printEvents;

class RTCPeerConnectionHelper {
    #loggingHandler = str => {};

    constructor() {
        this.pc = new RTCPeerConnection();
        const wsUrl = import.meta.env.VITE_WS_URL;
        this.hubName = import.meta.env.VITE_WS_HUB_NAME;
        const uuid = self.crypto.randomUUID();
        this.ws = new WebSocket(wsUrl);
        this.track = null;
        this.sid = null;
        this.sidHandler = () => {};
        this.pairSid = null;
        this.disconnectHandler = () => {};
        this.joinHub = false;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.ws.addEventListener('message', e => {
            const msg = JSON.parse(e.data);
            events.push({
                'timestamp': getTimestamp(),
                'from': msg.sID,
                'to': 'me',
                'type': msg.type
            });
            switch (msg.type) {
                case 'offer':
                    this.pc.setRemoteDescription(msg);
                    this.pc.createAnswer()
                        .then(desc => {
                            this.pc.setLocalDescription(desc);
                            this.#sendWrap({
                                ...desc
                            });
                        });
                    break;
                case 'answer':
                    this.pc.setRemoteDescription(msg);
                    this.#loggingHandler('接続済み');
                    break;
                case 'candidate':
                    this.pc.addIceCandidate(msg.ice);
                    break;
                case 'requestConstraints':
                    this.pairSid = msg.sID;
                    this.returnConstraints();
                    break;
                case 'returnConstraints':
                    this.track.applyConstraints(msg.constraints);
                    break;
                default:
                    console.log(msg);
                    if (msg.auth && msg.auth === 'OK') {
                        this.sid = msg.SID;
                        this.sidHandler(this.sid);
                    } else if (msg.joinHub) {
                        this.joinHub = msg.joinHub === 'OK';
                        this.joinHub ? this.resolve() : this.reject();
                    } else if (msg.leftHub && this.pairSid === msg.sID) {
                        this.pc.close();
                        this.pairSid = null;
                        this.pc = new RTCPeerConnection();
                        this.disconnectHandler();
                        this.#loggingHandler('切断しました');
                    }
                    break;
            }
        });
        this.#sendWrap({
            auth: uuid,
            passwd:'none'
        });
        this.#sendWrap({
            joinHub: this.hubName
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

    async #sendWrap(msg) {
        if (!this.joinHub && !msg.auth && !msg.joinHub) {
            await this.promise;
        }
        events.push({
            'timestamp': getTimestamp(),
            'from': 'me',
            'to': this.pairSid,
            'type': msg.type
        });
        const send = () => {
            const to = this.pairSid ? { toS: this.pairSid } : this.joinHub ? { toH: this.hubName } : {};
            this.ws.send(JSON.stringify({
                ...to,
                ...msg
            }));
        };
        if (this.ws.readyState) { // Connection Opened
            send();
        } else {
            this.ws.addEventListener('open', send, {once: true});
        }
    }

    returnConstraints() {
        this.#sendWrap({
            type: 'returnConstraints',
            constraints: {
                width: {
                    max: window.innerWidth * window.devicePixelRatio
                },
                height: {
                    max: window.innerHeight * window.devicePixelRatio
                },
                aspectRatio: window.innerWidth / window.innerHeight
            }
        });
    }

    async start(track, pairSid) {
        this.#loggingHandler('準備中...');
        this.pairSid = pairSid;
        if (track) {
            this.pc.addTrack(track);
            this.track = track;
            this.#sendWrap({
                type: 'requestConstraints'
            });
        }
        this.#loggingHandler('接続中...');
        this.pc.addEventListener('icecandidate', e => {
            if (e.candidate) {
                this.#sendWrap({
                    type: 'candidate',
                    ice: e.candidate
                });
            }
        });
        this.pc.createOffer()
            .then(desc => {
                this.pc.setLocalDescription(desc);
                this.#sendWrap({
                    ...desc
                });
            });
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