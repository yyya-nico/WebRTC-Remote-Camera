var b=e=>{throw TypeError(e)};var l=(e,t,i)=>t.has(e)||b("Cannot "+i);var c=(e,t,i)=>(l(e,t,"read from private field"),i?i.call(e):t.get(e)),p=(e,t,i)=>t.has(e)?b("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),g=(e,t,i,n)=>(l(e,t,"write to private field"),n?n.call(e,i):t.set(e,i),i),r=(e,t,i)=>(l(e,t,"access private method"),i);const v=()=>(Date.now()%1e5).toString().padStart(5,"0"),u=[],C=()=>{console.table(u)};globalThis.printEvents=C;var a,o,h;class S{constructor(){p(this,o);p(this,a,t=>{});this.pc=new RTCPeerConnection;const t="wss://cloud.achex.ca/yyya-nico.co";this.hubName="WebRTC-Remote-Camera";const i=self.crypto.randomUUID();this.ws=new WebSocket(t),this.track=null,this.sid=null,this.sidHandler=()=>{},this.pairSid=null,this.disconnectHandler=()=>{},this.joinHub=!1,this.promise=new Promise((n,s)=>{this.resolve=n,this.reject=s}),this.ws.addEventListener("message",n=>{const s=JSON.parse(n.data);switch(u.push({timestamp:v(),from:s.sID,to:"me",type:s.type}),s.type){case"offer":this.pc.setRemoteDescription(s),this.pc.createAnswer().then(f=>{this.pc.setLocalDescription(f),r(this,o,h).call(this,{...f})});break;case"answer":this.pc.setRemoteDescription(s),c(this,a).call(this,"接続済み");break;case"candidate":this.pc.addIceCandidate(s.ice);break;case"requestConstraints":this.pairSid=s.sID,this.returnConstraints();break;case"returnConstraints":const d=s.constraints,{type:w,angle:m}=screen.orientation;(w.startsWith("portrait")&&m%180===0||w.startsWith("landscape")&&m%180!==0)&&(d.aspectRatio=1/d.aspectRatio),this.track.applyConstraints(d);break;default:console.log(s),s.auth&&s.auth==="OK"?(this.sid=s.SID,this.sidHandler(this.sid)):s.joinHub?(this.joinHub=s.joinHub==="OK",this.joinHub?this.resolve():this.reject()):s.leftHub&&this.pairSid===s.sID&&(this.pc.close(),this.pairSid=null,this.pc=new RTCPeerConnection,this.disconnectHandler(),c(this,a).call(this,"切断しました"));break}}),r(this,o,h).call(this,{auth:i,passwd:"none"}),r(this,o,h).call(this,{joinHub:this.hubName}),this.pc.addEventListener("iceconnectionstatechange",()=>{switch(this.pc.iceConnectionState){case"checking":c(this,a).call(this,"確認中...");break;case"connected":c(this,a).call(this,"接続済み");break;case"closed":c(this,a).call(this,"切断しました");break;case"failed":c(this,a).call(this,"切断されました");break;case"disconnected":c(this,a).call(this,"一時的に切断しています");break;default:c(this,a).call(this,this.pc.iceConnectionState);break}})}set onEvent(t){g(this,a,t)}returnConstraints(){r(this,o,h).call(this,{type:"returnConstraints",constraints:{width:{max:window.innerWidth*window.devicePixelRatio},height:{max:window.innerHeight*window.devicePixelRatio},aspectRatio:window.innerWidth/window.innerHeight}})}async start(t,i){c(this,a).call(this,"準備中..."),this.pairSid=i,t&&(this.pc.addTrack(t),this.track=t,r(this,o,h).call(this,{type:"requestConstraints"})),c(this,a).call(this,"接続中..."),this.pc.addEventListener("icecandidate",n=>{n.candidate&&r(this,o,h).call(this,{type:"candidate",ice:n.candidate})}),this.pc.createOffer().then(n=>{this.pc.setLocalDescription(n),r(this,o,h).call(this,{...n})})}}a=new WeakMap,o=new WeakSet,h=async function(t){!this.joinHub&&!t.auth&&!t.joinHub&&await this.promise,u.push({timestamp:v(),from:"me",to:this.pairSid,type:t.type});const i=()=>{const n=this.pairSid?{toS:this.pairSid}:this.joinHub?{toH:this.hubName}:{};this.ws.send(JSON.stringify({...n,...t}))};this.ws.readyState?i():this.ws.addEventListener("open",i,{once:!0})};const k=e=>{const t=document.documentElement;e.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(n=>{alert("ご利用のブラウザは全画面表示に対応していません"+n.name),e.disabled=!0})});const i=()=>{e.textContent=document.fullscreenElement?"fullscreen_exit":"fullscreen"};document.addEventListener("fullscreenchange",i)},D=()=>{const e=document.body;let t=0;const i=()=>{clearTimeout(t),e.classList.remove("hide"),t=setTimeout(function(){e.classList.add("hide")},3e3)};return window.addEventListener("pointerdown",i),window.addEventListener("pointermove",i),i(),i};export{S as R,k as f,D as u};
