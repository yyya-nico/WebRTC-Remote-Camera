var g=e=>{throw TypeError(e)};var p=(e,t,s)=>t.has(e)||g("Cannot "+s);var c=(e,t,s)=>(p(e,t,"read from private field"),s?s.call(e):t.get(e)),u=(e,t,s)=>t.has(e)?g("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),b=(e,t,s,a)=>(p(e,t,"write to private field"),a?a.call(e,s):t.set(e,s),s),o=(e,t,s)=>(p(e,t,"access private method"),s);const S=()=>(Date.now()%1e5).toString().padStart(5,"0"),w=[],C=()=>{console.table(w)};globalThis.printEvents=C;const H=()=>{const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";return Array.from(crypto.getRandomValues(new Uint32Array(16))).map(s=>e[s%e.length]).join("")};var n,r,h;class R{constructor(){u(this,r);u(this,n,t=>{});this.pc=new RTCPeerConnection;const t="wss://cloud.achex.ca/yyya-nico.co";this.hubName="WebRTC-Remote-Camera";const s=self.crypto.randomUUID();this.ws=new WebSocket(t),this.track=null,this.sid=null,this.secret=null,this.sidHandler=()=>{},this.pairSid=null,this.pairSecret=null,this.disconnectHandler=()=>{},this.joinHub=!1,this.promise=new Promise((a,i)=>{this.resolve=a,this.reject=i}),this.ws.addEventListener("message",a=>{const i=JSON.parse(a.data);if(i.secret!==this.secret&&i.secret!==this.pairSecret){console.log(i),i.auth&&i.auth==="OK"?(this.sid=i.SID,this.secret=H(),this.sidHandler(this.sid,this.secret)):i.joinHub?(this.joinHub=i.joinHub==="OK",this.joinHub?this.resolve():this.reject()):i.leftHub&&this.pairSid===i.sID&&(this.pc.close(),this.pairSid=null,this.pairSecret=null,this.pc=new RTCPeerConnection,this.disconnectHandler(),c(this,n).call(this,"切断しました"),this.listenIceconnectionstatechange());return}switch(w.push({timestamp:S(),from:i.sID,to:"me",type:i.type}),i.type){case"offer":this.pc.setRemoteDescription(i),this.pc.createAnswer().then(l=>{this.pc.setLocalDescription(l),o(this,r,h).call(this,{...l})});break;case"answer":this.pc.setRemoteDescription(i),c(this,n).call(this,"接続済み");break;case"candidate":this.pc.addIceCandidate(i.ice);break;case"requestConstraints":this.pairSid=i.sID,this.returnConstraints();break;case"returnConstraints":const d=i.constraints,{type:m,angle:f}=screen.orientation;if(m.startsWith("portrait")&&f%180===0||m.startsWith("landscape")&&f%180!==0){const{width:l,height:v,aspectRatio:y}=d;d.width=v,d.height=l,d.aspectRatio=1/y}this.track.applyConstraints(d);break}}),o(this,r,h).call(this,{auth:s,passwd:"none"}),o(this,r,h).call(this,{joinHub:this.hubName}),this.listenIceconnectionstatechange()}set onEvent(t){b(this,n,t)}listenIceconnectionstatechange(){this.pc.addEventListener("iceconnectionstatechange",()=>{switch(this.pc.iceConnectionState){case"checking":c(this,n).call(this,"確認中...");break;case"connected":c(this,n).call(this,"接続済み");break;case"closed":c(this,n).call(this,"切断しました");break;case"failed":c(this,n).call(this,"切断されました");break;case"disconnected":c(this,n).call(this,"一時的に切断しています");break;default:c(this,n).call(this,this.pc.iceConnectionState);break}})}returnConstraints(){o(this,r,h).call(this,{type:"returnConstraints",constraints:{width:{max:window.innerWidth*window.devicePixelRatio},height:{max:window.innerHeight*window.devicePixelRatio},aspectRatio:window.innerWidth/window.innerHeight}})}async start(t,s,a){c(this,n).call(this,"準備中..."),this.pairSid=s,this.pairSecret=a,t&&(this.pc.addTrack(t),this.track=t,o(this,r,h).call(this,{type:"requestConstraints"})),c(this,n).call(this,"接続中..."),this.pc.addEventListener("icecandidate",i=>{i.candidate&&o(this,r,h).call(this,{type:"candidate",ice:i.candidate})}),this.pc.createOffer().then(i=>{this.pc.setLocalDescription(i),o(this,r,h).call(this,{...i})})}}n=new WeakMap,r=new WeakSet,h=async function(t){!this.joinHub&&!t.auth&&!t.joinHub&&await this.promise,w.push({timestamp:S(),from:"me",to:this.pairSid,type:t.type});const s=()=>{const a=this.pairSid?{toS:this.pairSid}:this.joinHub?{toH:this.hubName}:{},i=this.pairSecret?this.pairSecret:this.secret;this.ws.send(JSON.stringify({...a,secret:i,...t}))};this.ws.readyState?s():this.ws.addEventListener("open",s,{once:!0})};const j=e=>{const t=document.documentElement;e.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(a=>{alert("ご利用のブラウザは全画面表示に対応していません"+a.name),e.disabled=!0})});const s=()=>{e.textContent=document.fullscreenElement?"fullscreen_exit":"fullscreen"};document.addEventListener("fullscreenchange",s)},L=()=>{const e=document.body;let t=0;const s=()=>{clearTimeout(t),e.classList.remove("hide"),t=setTimeout(function(){e.classList.add("hide")},3e3)};return window.addEventListener("pointerdown",s),window.addEventListener("pointermove",s),s(),s};export{R,j as f,L as u};