var p=t=>{throw TypeError(t)};var d=(t,e,i)=>e.has(t)||p("Cannot "+i);var c=(t,e,i)=>(d(t,e,"read from private field"),i?i.call(t):e.get(t)),l=(t,e,i)=>e.has(t)?p("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),w=(t,e,i,n)=>(d(t,e,"write to private field"),n?n.call(t,i):e.set(t,i),i),o=(t,e,i)=>(d(t,e,"access private method"),i);var a,r,h;class b{constructor(){l(this,r);l(this,a,e=>{});this.pc=new RTCPeerConnection;const e="wss://cloud.achex.ca/yyya-nico.co";this.hubName="WebRTC-Remote-Camera";const i=self.crypto.randomUUID();this.ws=new WebSocket(e),this.track=null,this.sid=null,this.sidHandler=()=>{},this.pairSid=null,this.disconnectHandler=()=>{},this.joinHub=!1,this.promise=new Promise((n,s)=>{this.resolve=n,this.reject=s}),this.ws.addEventListener("message",n=>{const s=JSON.parse(n.data);switch(console.log(s.type),s.type){case"offer":this.pc.setRemoteDescription(s),this.pc.createAnswer().then(u=>{this.pc.setLocalDescription(u),o(this,r,h).call(this,{...u})});break;case"answer":this.pc.setRemoteDescription(s),c(this,a).call(this,"接続済み");break;case"candidate":this.pc.addIceCandidate(s.ice);break;case"requestConstraints":this.pairSid=s.sID,o(this,r,h).call(this,{type:"returnConstraints",constraints:{width:{max:window.screen.width*window.devicePixelRatio},height:{max:window.screen.height*window.devicePixelRatio},aspectRatio:window.screen.height/window.screen.width}});break;case"returnConstraints":this.track.applyConstraints(s.constraints);break;default:console.log(s),s.auth&&s.auth==="OK"?(this.sid=s.SID,this.sidHandler(this.sid)):s.joinHub?(this.joinHub=s.joinHub==="OK",this.joinHub?this.resolve():this.reject()):s.leftHub&&this.pairSid===s.sID&&(this.pc.close(),this.pairSid=null,this.pc=new RTCPeerConnection,this.disconnectHandler(),c(this,a).call(this,"切断しました"));break}}),o(this,r,h).call(this,{auth:i,passwd:"none"}),o(this,r,h).call(this,{joinHub:this.hubName}),this.pc.addEventListener("iceconnectionstatechange",()=>{switch(this.pc.iceConnectionState){case"checking":c(this,a).call(this,"確認中...");break;case"connected":c(this,a).call(this,"接続済み");break;case"closed":c(this,a).call(this,"切断しました");break;case"failed":c(this,a).call(this,"切断されました");break;case"disconnected":c(this,a).call(this,"一時的に切断しています");break;default:c(this,a).call(this,this.pc.iceConnectionState);break}})}set onEvent(e){w(this,a,e)}async start(e,i){c(this,a).call(this,"準備中..."),this.pairSid=i,e&&(this.pc.addTrack(e),this.track=e,o(this,r,h).call(this,{type:"requestConstraints"})),c(this,a).call(this,"接続中..."),this.pc.addEventListener("icecandidate",n=>{n.candidate&&o(this,r,h).call(this,{type:"candidate",ice:n.candidate})}),this.pc.createOffer().then(n=>{this.pc.setLocalDescription(n),o(this,r,h).call(this,{...n})})}}a=new WeakMap,r=new WeakSet,h=async function(e){!this.joinHub&&!e.auth&&!e.joinHub&&await this.promise,this.ws.readyState?this.ws.send(JSON.stringify({...this.joinHub&&{toH:this.hubName},...this.pairSid&&{toS:this.pairSid},...e})):this.ws.addEventListener("open",()=>{this.ws.send(JSON.stringify({...this.joinHub&&{toH:this.hubName},...this.pairSid&&{toS:this.pairSid},...e}))},{once:!0})};const m=t=>{const e=document.documentElement;t.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():e.requestFullscreen().catch(n=>{alert("ご利用のブラウザは全画面表示に対応していません"+n.name),t.disabled=!0})});const i=()=>{t.textContent=document.fullscreenElement?"fullscreen_exit":"fullscreen"};document.addEventListener("fullscreenchange",i)},H=()=>{const t=document.body;let e=0;const i=()=>{clearTimeout(e),t.classList.remove("hide"),e=setTimeout(function(){t.classList.add("hide")},3e3)};return window.addEventListener("pointerdown",i),window.addEventListener("pointermove",i),i(),i};export{b as R,m as f,H as u};