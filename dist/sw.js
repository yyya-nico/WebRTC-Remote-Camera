if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let o={};const l=e=>i(e,c),d={module:{uri:c},exports:o,require:l};s[c]=Promise.all(n.map((e=>d[e]||l(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/reciever-Csfv07ln.css",revision:null},{url:"assets/reciever-D_NCqHy8.js",revision:null},{url:"assets/sender-BtFHGMTL.css",revision:null},{url:"assets/sender-BW077D4J.js",revision:null},{url:"assets/style-BWhdRaJ7.css",revision:null},{url:"assets/style-DDYrY1On.js",revision:null},{url:"assets/utils-BGuPHG2h.js",revision:null},{url:"index.html",revision:"f5bfa23edf37387e2439f6a50939eb86"},{url:"reciever.html",revision:"96cdd104babb8e459bbd7024f8309e57"},{url:"registerSW.js",revision:"56f05a729cfaf30edec637e57fee0c80"},{url:"sender.html",revision:"86c339fc45b492e7fa5583f10839ebb2"},{url:"icons/icon-72x72.png",revision:"00cc8ba3c588e4c499da5121f7eb741b"},{url:"icons/icon-96x96.png",revision:"ef287a0dcddb08e548ca927fc6aa7b76"},{url:"icons/icon-128x128.png",revision:"09a105c2da8f1ddddd162787d9146b18"},{url:"icons/icon-144x144.png",revision:"e1690dae7c31a0f8c241e36ecde70821"},{url:"icons/icon-152x152.png",revision:"318f5af1b186c7966048a348bbbd6456"},{url:"icons/icon-192x192.png",revision:"b2ceeed403b7080afc89391dd77aef0b"},{url:"icons/icon-384x384.png",revision:"b3b9f26907c3e608fe80c40d4d21ba36"},{url:"icons/icon-512x512.png",revision:"1fdd1171c7232fcd37da5d4987d00d13"},{url:"icons/sender.png",revision:"002520fda9c49d700dae7b32c0ac59a9"},{url:"icons/reciever.png",revision:"b69624aa0630d598d5463c5b6524f93b"},{url:"manifest.webmanifest",revision:"f1b5739b8cbc36136b1eafb8ba0d1f12"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
