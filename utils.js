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

const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 16;
    return Array.from(crypto.getRandomValues(new Uint32Array(length))).map((n) => chars[n % chars.length]).join('');
};

class RTCPeerConnectionHelper {
    #loggingHandler = str => {};

    constructor({
        setupPeerConnectionHandler = () => {},
        setupDataChannelHandler = () => {},
        sidHandler = () => {},
        closedHandler = () => {}
    } = {}) {
        this.setupPeerConnectionHandler = setupPeerConnectionHandler;
        this.setupDataChannelHandler = setupDataChannelHandler;
        this.sidHandler = sidHandler;
        this.closedHandler = closedHandler;
        this.pc = new RTCPeerConnection();
        this.setupPeerConnection();
        const wsUrl = import.meta.env.VITE_WS_URL;
        this.hubName = import.meta.env.VITE_WS_HUB_NAME;
        const uuid = self.crypto.randomUUID();
        this.ws = new WebSocket(wsUrl);
        this.track = null;
        this.sid = null;
        this.secret = null;
        this.pairSid = null;
        this.pairSecret = null;
        this.joinHub = false;
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.ws.addEventListener('message', e => {
            const msg = JSON.parse(e.data);
            const isSecretInvalid = msg.secret !== this.secret && msg.secret !== this.pairSecret;
            if (isSecretInvalid) {
                console.log(msg);
                if (msg.auth && msg.auth === 'OK') {
                    this.sid = msg.SID;
                    this.secret = generateSecret();
                    this.sidHandler(this.sid, this.secret);
                } else if (msg.joinHub) {
                    this.joinHub = msg.joinHub === 'OK';
                    this.joinHub ? this.resolve() : this.reject();
                } else if (msg.leftHub && this.pairSid === msg.sID) {
                    this.pc.close();
                    this.closedHandler();
                    this.pairSid = null;
                    this.pairSecret = null;
                    this.#loggingHandler('切断しました');
                    this.pc = new RTCPeerConnection();
                    this.setupPeerConnection();
                }
                return;
            }
            events.push({
                'timestamp': getTimestamp(),
                'from': msg.sID,
                'to': 'me',
                'type': msg.type,
                'protocol': 'WebSocket'
            });
            switch (msg.type) {
                case 'offer':
                    this.pairSid = msg.sID;
                    this.pc.setRemoteDescription(msg);
                    this.pc.createAnswer()
                        .then(desc => {
                            this.pc.setLocalDescription(desc);
                            this.#wsSendWrap({
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
            }
        });
        this.#wsSendWrap({
            auth: uuid,
            passwd:'none'
        });
        this.#wsSendWrap({
            joinHub: this.hubName
        });
    }

    set onEvent(handler) {
        this.#loggingHandler = handler;
    }

    setupPeerConnection() {
        this.pc.addEventListener('iceconnectionstatechange', () => {
            switch (this.pc.iceConnectionState) {
                case 'checking':
                    this.#loggingHandler('確認中...');
                    break;
                case 'connected':
                    this.#loggingHandler('接続済み');
                    break;
                case 'closed':
                    this.closedHandler();
                    this.pairSid = null;
                    this.pairSecret = null;
                    this.#loggingHandler('切断しました');
                    this.pc = new RTCPeerConnection();
                    this.setupPeerConnection();
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
        this.pc.addEventListener('datachannel', e => {
            this.dc = e.channel;
            this.setupDataChannel();
        });
        this.setupPeerConnectionHandler(this.pc);
    }

    createDataChannel() {
        this.dc = this.pc.createDataChannel('data');
        this.setupDataChannel();
    }

    setupDataChannel() {
        this.dc.addEventListener('message', e => {
            const msg = JSON.parse(e.data);
            events.push({
                'timestamp': getTimestamp(),
                'from': '',
                'to': 'me',
                'type': msg.type,
                'protocol': 'DataChannel'
            });
            switch (msg.type) {
                case 'requestConstraints':
                    this.returnConstraints();
                    break;
                case 'returnConstraints':
                    const constraints = msg.constraints;
                    const { type, angle } = screen.orientation;
                    const isPortraitDefault =
                        type.startsWith('portrait') && angle % 180 === 0
                        || type.startsWith('landscape') && angle % 180 !== 0;
                    if (isPortraitDefault) {
                        const { width, height, aspectRatio } = constraints;
                        constraints.width = height;
                        constraints.height = width;
                        constraints.aspectRatio = 1 / aspectRatio; // 90度回転(縦横入れ替え)
                    }
                    this.track.applyConstraints(constraints);
                    break;
            }
        });
        this.setupDataChannelHandler(this.dc);
    }

    async #wsSendWrap(msg) {
        if (!this.joinHub && !msg.auth && !msg.joinHub) {
            await this.promise;
        }
        events.push({
            'timestamp': getTimestamp(),
            'from': 'me',
            'to': this.pairSid,
            'type': msg.type,
            'protocol': 'WebSocket'
        });
        const send = () => {
            const to = this.pairSid ? { toS: this.pairSid } : this.joinHub ? { toH: this.hubName } : {};
            const secret = this.pairSecret ? this.pairSecret : this.secret;
            this.ws.send(JSON.stringify({
                ...to,
                secret,
                ...msg
            }));
        };
        if (this.ws.readyState) { // Connection Opened
            send();
        } else {
            this.ws.addEventListener('open', send, {once: true});
        }
    }

    async #dcSendWrap(msg) {
        if (this.dc.readyState === 'connecting') {
            await new Promise(resolve => {
                this.dc.addEventListener('open', resolve, {once: true});
            });
        }
        events.push({
            'timestamp': getTimestamp(),
            'from': 'me',
            'to': '',
            'type': msg.type,
            'protocol': 'DataChannel'
        });
        this.dc.send(JSON.stringify({
            ...msg
        }));
    }

    returnConstraints() {
        this.#dcSendWrap({
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

    async start(track, pairSid, pairSecret) {
        this.#loggingHandler('準備中...');
        this.pairSid = pairSid;
        this.pairSecret = pairSecret;
        this.#loggingHandler('接続中...');
        this.createDataChannel();
        if (track) {
            this.pc.addTrack(track);
            this.track = track;
            this.#dcSendWrap({
                type: 'requestConstraints'
            });
        }
        this.pc.addEventListener('icecandidate', e => {
            if (e.candidate) {
                this.#wsSendWrap({
                    type: 'candidate',
                    ice: e.candidate
                });
            }
        });
        this.pc.createOffer()
            .then(desc => {
                this.pc.setLocalDescription(desc);
                this.#wsSendWrap({
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