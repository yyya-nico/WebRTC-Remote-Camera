var w=s=>{throw TypeError(s)};var l=(s,t,e)=>t.has(s)||w("Cannot "+e);var c=(s,t,e)=>(l(s,t,"read from private field"),e?e.call(s):t.get(s)),p=(s,t,e)=>t.has(s)?w("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),m=(s,t,e,n)=>(l(s,t,"write to private field"),n?n.call(s,e):t.set(s,e),e),r=(s,t,e)=>(l(s,t,"access private method"),e);const f=()=>(Date.now()%1e5).toString().padStart(5,"0"),u=[],b=()=>{console.table(u)};globalThis.printEvents=b;var a,o,h;class g{constructor(){p(this,o);p(this,a,t=>{});this.pc=new RTCPeerConnection;const t="wss://cloud.achex.ca/yyya-nico.co";this.hubName="WebRTC-Remote-Camera";const e=self.crypto.randomUUID();this.ws=new WebSocket(t),this.track=null,this.sid=null,this.sidHandler=()=>{},this.pairSid=null,this.disconnectHandler=()=>{},this.joinHub=!1,this.promise=new Promise((n,i)=>{this.resolve=n,this.reject=i}),this.ws.addEventListener("message",n=>{const i=JSON.parse(n.data);switch(u.push({timestamp:f(),from:i.sID,to:"me",type:i.type}),i.type){case"offer":this.pc.setRemoteDescription(i),this.pc.createAnswer().then(d=>{this.pc.setLocalDescription(d),r(this,o,h).call(this,{...d})});break;case"answer":this.pc.setRemoteDescription(i),c(this,a).call(this,"接続済み");break;case"candidate":this.pc.addIceCandidate(i.ice);break;case"requestConstraints":this.pairSid=i.sID,this.returnConstraints();break;case"returnConstraints":this.track.applyConstraints(i.constraints);break;default:console.log(i),i.auth&&i.auth==="OK"?(this.sid=i.SID,this.sidHandler(this.sid)):i.joinHub?(this.joinHub=i.joinHub==="OK",this.joinHub?this.resolve():this.reject()):i.leftHub&&this.pairSid===i.sID&&(this.pc.close(),this.pairSid=null,this.pc=new RTCPeerConnection,this.disconnectHandler(),c(this,a).call(this,"切断しました"));break}}),r(this,o,h).call(this,{auth:e,passwd:"none"}),r(this,o,h).call(this,{joinHub:this.hubName}),this.pc.addEventListener("iceconnectionstatechange",()=>{switch(this.pc.iceConnectionState){case"checking":c(this,a).call(this,"確認中...");break;case"connected":c(this,a).call(this,"接続済み");break;case"closed":c(this,a).call(this,"切断しました");break;case"failed":c(this,a).call(this,"切断されました");break;case"disconnected":c(this,a).call(this,"一時的に切断しています");break;default:c(this,a).call(this,this.pc.iceConnectionState);break}})}set onEvent(t){m(this,a,t)}returnConstraints(){const{type:t,angle:e}=screen.orientation,n=t.startsWith("portrait")&&e%180===0||t.startsWith("landscape")&&e%180!==0,i=window.innerWidth/window.innerHeight,d=1/i;r(this,o,h).call(this,{type:"returnConstraints",constraints:{width:{max:window.innerWidth*window.devicePixelRatio},height:{max:window.innerHeight*window.devicePixelRatio},aspectRatio:n?d:i}})}async start(t,e){c(this,a).call(this,"準備中..."),this.pairSid=e,t&&(this.pc.addTrack(t),this.track=t,r(this,o,h).call(this,{type:"requestConstraints"})),c(this,a).call(this,"接続中..."),this.pc.addEventListener("icecandidate",n=>{n.candidate&&r(this,o,h).call(this,{type:"candidate",ice:n.candidate})}),this.pc.createOffer().then(n=>{this.pc.setLocalDescription(n),r(this,o,h).call(this,{...n})})}}a=new WeakMap,o=new WeakSet,h=async function(t){!this.joinHub&&!t.auth&&!t.joinHub&&await this.promise,u.push({timestamp:f(),from:"me",to:this.pairSid,type:t.type});const e=()=>{const n=this.pairSid?{toS:this.pairSid}:this.joinHub?{toH:this.hubName}:{};this.ws.send(JSON.stringify({...n,...t}))};this.ws.readyState?e():this.ws.addEventListener("open",e,{once:!0})};const C=s=>{const t=document.documentElement;s.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen():t.requestFullscreen().catch(n=>{alert("ご利用のブラウザは全画面表示に対応していません"+n.name),s.disabled=!0})});const e=()=>{s.textContent=document.fullscreenElement?"fullscreen_exit":"fullscreen"};document.addEventListener("fullscreenchange",e)},H=()=>{const s=document.body;let t=0;const e=()=>{clearTimeout(t),s.classList.remove("hide"),t=setTimeout(function(){s.classList.add("hide")},3e3)};return window.addEventListener("pointerdown",e),window.addEventListener("pointermove",e),e(),e};export{g as R,C as f,H as u};