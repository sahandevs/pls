(this.webpackJsonppls=this.webpackJsonppls||[]).push([[0],{111:function(e,t,n){e.exports=n(124)},124:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(13),i=n.n(o),u=n(11),c=n(167),l=n(168),s=n(173),f=n(169),d=n(171),m=n(154),v=n(181),h=n(155),b=n(156),y=n(96),g=n(158),p=n(51),E=n(64),w=n(12),x=n(29),O=n(65),k=n(66),j=n(176),C=n(178),S=n(150),M=n(151),R=n(152),L=n(73),D=n(179),K=r.a.createContext(null),N=window.firebase;function T(){var e=r.a.useContext(K);if(null==e)throw new Error("useDBContext used outside of the context");return e}var U=function(){function e(){var t=this;Object(O.a)(this,e),this.currencies=new j.a([]),this.exchangeRates=new j.a([]),this.bank=new j.a({}),this.dbRef=void 0,Object(C.a)([this.bank.pipe(Object(S.a)(1),Object(M.a)()),this.exchangeRates.pipe(Object(S.a)(1),Object(M.a)()),this.currencies.pipe(Object(S.a)(1),Object(M.a)())]).pipe(Object(R.a)(1e3)).subscribe({next:function(){return t.save()}})}return Object(k.a)(e,[{key:"addOrUpdateCurrency",value:function(e){var t=Object(x.a)(this.currencies.value),n=t.find((function(t){return t.id===e.id}));null!=n?Object.assign(n,e):t.push(e),this.currencies.next(t)}},{key:"getCurrency",value:function(e){return this.currencies.value.find((function(t){return t.id===e}))}},{key:"bankOf",value:function(e){return this.bank.pipe(Object(L.a)((function(t){var n;return null!==(n=t[e])&&void 0!==n?n:0})))}},{key:"canSpend",value:function(e,t){return this.bankOf(e.id).pipe(Object(L.a)((function(e){return e-t>=0})))}},{key:"addToBank",value:function(e,t){var n;this.bank.next(Object(w.a)({},this.bank.value,Object(E.a)({},e.id,Math.max(0,(null!==(n=this.bank.value[e.id])&&void 0!==n?n:0)+t))))}},{key:"exchange",value:function(e,t){var n=this;this.canExchange(e,t).pipe(Object(D.a)(1)).subscribe({next:function(a){if(a){var r=Object(w.a)({},n.bank.value);null==r[e.from]&&(r[e.from]=0),r[e.from]-=t,null==r[e.to]&&(r[e.to]=0),r[e.to]+=t*e.rate,n.bank.next(r)}}})}},{key:"canExchange",value:function(e,t){return this.bankOf(e.from).pipe(Object(L.a)((function(e){return e>=t})))}},{key:"removeCurrency",value:function(e){this.currencies.next(this.currencies.value.filter((function(t){return t.id!==e.id})))}},{key:"addOrUpdateExchangeRate",value:function(e){var t=Object(x.a)(this.exchangeRates.value),n=t.find((function(t){return t.from===e.from&&t.to===e.to}));null!=n?Object.assign(n,e):t.push(e),this.exchangeRates.next(t)}},{key:"removeExchangeRate",value:function(e){this.exchangeRates.next(this.exchangeRates.value.filter((function(t){return t.from!==e.from||t.to!==e.to})))}},{key:"getCurrencies",value:function(){return this.currencies}},{key:"getExchangeRates",value:function(){return this.exchangeRates}},{key:"loadFromFirebase",value:function(e){var t=this;N.firestore().enablePersistence().then((function(e){return console.log("OK enablePersistence",e)})).catch((function(e){return console.error("NOK enablePersistence",e)})),this.dbRef=N.database().ref("sync_data/".concat(e)),console.log(this.dbRef),this.dbRef.on("value",(function(e){var n,a=function(e){if(null!=e.version&&"2"===e.version)return e;var t,n=e,a={bank:{},currencies:[],exchangeRates:[],version:"2"},r={},o=Object(p.a)(n.currencies);try{for(o.s();!(t=o.n()).done;){var i=t.value,u=W();r[i.name]=u,a.currencies.push({icon:i.icon,id:u,isSource:i.isSource,name:i.name,unit:i.unit})}}catch(v){o.e(v)}finally{o.f()}var c,l=Object(p.a)(n.exchangeRates);try{for(l.s();!(c=l.n()).done;){var s=c.value;a.exchangeRates.push({from:r[s.from.name],to:r[s.to.name],rate:s.rate})}}catch(v){l.e(v)}finally{l.f()}for(var f=0,d=Object.keys(n.bank);f<d.length;f++){var m=d[f];a.bank[r[m]]=n.bank[m]}return a}(JSON.parse(null!==(n=e.val())&&void 0!==n?n:"{}"));t.currencies.next(a.currencies),t.exchangeRates.next(a.exchangeRates),t.bank.next(a.bank),console.log("Updating")}))}},{key:"backup",value:function(){var e={currencies:this.currencies.value,exchangeRates:this.exchangeRates.value,bank:this.bank.value},t=JSON.stringify(e);localStorage.setItem("__backup_PLSDB",t),console.log("Backup",t)}},{key:"floorAllBanks",value:function(){for(var e=JSON.parse(JSON.stringify(this.bank.value)),t=0,n=Object.keys(e);t<n.length;t++){var a=n[t];e[a]=Math.floor(e[a])}this.bank.next(e)}},{key:"restoreBackup",value:function(){var e=localStorage.getItem("__backup_PLSDB");console.log("Restoring backup"),this.dbRef.set(e)}},{key:"save",value:function(){var e={currencies:this.currencies.value,exchangeRates:this.exchangeRates.value,bank:this.bank.value,version:"2"};this.dbRef.set(JSON.stringify(e)),console.log("Saving")}},{key:"version",get:function(){return"2"}}]),e}();function W(){return window.URL.createObjectURL(new Blob([])).split("/").pop()}function B(e,t){var n=r.a.useState(t),a=Object(u.a)(n,2),o=a[0],i=a[1];return r.a.useEffect((function(){var t=("function"===typeof e?e():e).subscribe({next:function(e){i(e)}});return function(){return t.unsubscribe()}}),[]),o}function _(e){var t,n=localStorage.getItem(e);null==n&&(n=null!==(t=prompt(e))&&void 0!==t?t:"",localStorage.setItem(e,n));return n}function I(e){var t=e.exchangeRate,n=e.value,a=e.onDone,o=e.innerRef,i=T(),u=B(i.canExchange(t,n),!1);return r.a.createElement(v.a,{disabled:!u,innerRef:o,onClick:function(){i.exchange(t,n),a()}},"1 ".concat(i.getCurrency(t.from).unit," of ").concat(i.getCurrency(t.from).name," to ").concat(n*t.rate," ").concat(i.getCurrency(t.to).unit," of ").concat(i.getCurrency(t.to).name))}var G=r.a.forwardRef((function(e,t){return r.a.createElement(I,Object.assign({},e,{innerRef:t}))}));function P(e){var t=e.currency,n=e.filter,a=T(),o=B(a.getExchangeRates(),[]),i=B(a.bankOf(t.id),0),c=r.a.useState(null),l=Object(u.a)(c,2),s=l[0],f=l[1],v=function(){f(null)};return r.a.createElement(m.a,{variant:"outlined",style:{margin:3}},r.a.createElement(d.a,{padding:2,display:"flex",flexDirection:"column"},r.a.createElement(h.a,null,"".concat(i," ").concat(t.unit," of "),r.a.createElement("span",{dangerouslySetInnerHTML:{__html:t.name.toLowerCase().replace(n,'<span style="background-color:yellow">'.concat(n,"</span>"))}})),r.a.createElement(b.a,{onClick:function(e){return f(e.currentTarget)},"aria-controls":"menu","aria-haspopup":"true"},"Exchange"),r.a.createElement(y.a,{id:"menu",anchorEl:s,keepMounted:!0,open:null!=s,onClose:v},o.filter((function(e){return e.from===t.id})).map((function(e){return r.a.createElement(G,{key:e.from+"_"+e.to,exchangeRate:e,value:1,onDone:v})}))),r.a.createElement(d.a,{display:"flex",flexDirection:"row"},r.a.createElement(b.a,{onClick:function(e){return a.addToBank(t,1)}},"+1"),r.a.createElement(b.a,{onClick:function(e){return a.addToBank(t,-1)}},"-1"))))}function z(e){var t=e.currency,n=e.filter,a=T(),o=B(a.bankOf(t.id),0),i=B(a.canSpend(t,1),!1),c=B(a.getExchangeRates(),[]).filter((function(e){return e.from===t.id})),l=r.a.useState(null),s=Object(u.a)(l,2),f=s[0],v=s[1],g=function(){v(null)};return r.a.createElement(m.a,{variant:"outlined",style:{margin:3}},r.a.createElement(d.a,{padding:2,display:"flex",flexDirection:"column"},r.a.createElement(h.a,null,"".concat(o," ").concat(t.unit," of "),r.a.createElement("span",{dangerouslySetInnerHTML:{__html:t.name.toLowerCase().replace(n,'<span style="background-color:yellow">'.concat(n,"</span>"))}})),c.length>0&&r.a.createElement(r.a.Fragment,null,r.a.createElement(b.a,{onClick:function(e){return v(e.currentTarget)},"aria-controls":"menu","aria-haspopup":"true"},"Exchange"),r.a.createElement(y.a,{id:"menu",anchorEl:f,keepMounted:!0,open:null!=f,onClose:g},c.filter((function(e){return e.from===t.id})).map((function(e){return r.a.createElement(G,{key:e.from+"_"+e.to,exchangeRate:e,value:1,onDone:g})})))),r.a.createElement(b.a,{disabled:!i,onClick:function(){return a.addToBank(t,-1)}},"Spend 1 ".concat(t.unit))))}function F(){var e=B(T().getCurrencies(),[]),t=r.a.useState(""),n=Object(u.a)(t,2),a=n[0],o=n[1];r.a.useEffect((function(){var e=function(e){switch(e.key){case"Escape":o("");break;case"Backspace":o((function(e){return e.slice(0,-1)}));break;default:1===e.key.length&&o((function(t){return t+e.key}))}};return document.addEventListener("keydown",e),function(){return document.removeEventListener("keydown",e)}}),[o]);var i=function(e){return e.name.toLowerCase().match(a.toLowerCase())};return r.a.createElement(d.a,{display:"flex",flexDirection:"column",alignItems:"center"},r.a.createElement(h.a,{variant:"h5"},"Exchange"),r.a.createElement(h.a,{variant:"body2"},a),r.a.createElement(d.a,{display:"flex",flexWrap:"wrap",flexDirection:"row",justifyContent:"center"},e.filter((function(e){return e.isSource&&i(e)})).map((function(e){return r.a.createElement(P,{key:e.id,currency:e,filter:a})}))),r.a.createElement(g.a,{variant:"middle"}),r.a.createElement(h.a,{variant:"h5"},"Spend"),r.a.createElement(d.a,{display:"flex",flexWrap:"wrap",flexDirection:"row",justifyContent:"center"},e.filter((function(e){return!e.isSource&&i(e)})).map((function(e){return r.a.createElement(z,{key:e.id,currency:e,filter:a})}))))}var J=n(160),A=n(182),V=n(175),H=n(159);function X(){return Object(H.a)("(max-width:425px)")}function Y(e){var t=e.currency,n=e.isNew,a=T(),o=r.a.useState((function(){return t.name})),i=Object(u.a)(o,2),c=i[0],l=i[1],s=r.a.useState((function(){return t.icon})),f=Object(u.a)(s,2),v=f[0],y=f[1],g=r.a.useState((function(){return t.isSource})),p=Object(u.a)(g,2),E=p[0],w=p[1],x=r.a.useState((function(){return t.unit})),O=Object(u.a)(x,2),k=O[0],j=O[1],C=X(),S=c!==t.name||v!==t.icon||k!==t.unit||E!==t.isSource,M=r.a.createElement(r.a.Fragment,null,!n&&r.a.createElement(J.a,null,t.icon),n&&r.a.createElement(A.a,{label:"Icon",value:v,onChange:function(e){return y(e.target.value)}}),r.a.createElement(A.a,{label:"Name",value:c,onChange:function(e){return l(e.target.value)}}),r.a.createElement(A.a,{label:"Unit",value:k,onChange:function(e){return j(e.target.value)}}),r.a.createElement(h.a,null,"Is time"),r.a.createElement(V.a,{checked:E,onChange:function(e,t){return w(t)}}),r.a.createElement(h.a,null,"Is source"),S&&r.a.createElement(b.a,{onClick:function(){a.addOrUpdateCurrency({name:c,icon:v,unit:k,isSource:E,id:t.id})}},r.a.createElement(J.a,null,"save")),!n&&r.a.createElement(b.a,{onClick:function(){a.removeCurrency(t)}},r.a.createElement(J.a,null,"delete")));return C?r.a.createElement(m.a,{style:{margin:15}},r.a.createElement(d.a,{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:1},M)):r.a.createElement(d.a,{display:"flex",flexDirection:"row",alignItems:"center",margin:1,justifyContent:"space-between"},M)}function Z(){var e=B(T().getCurrencies(),[]);return r.a.createElement(d.a,{display:"flex",flexDirection:"column"},e.map((function(e,t){return r.a.createElement(Y,{key:e.name,currency:e,isNew:!1})})),r.a.createElement(Y,{key:"new_currency_item_".concat(e.length),currency:{name:"New currency ".concat(e.length+1),icon:"",isSource:!1,id:W(),unit:"hour"},isNew:!0}))}var Q=n(163),$=n(184),q=n(174);function ee(e){var t,n,a,o,i,c,l=e.rate,s=e.isNew,f=T(),y=B(f.getCurrencies(),[]),g=r.a.useState((function(){return null===l||void 0===l?void 0:l.from})),p=Object(u.a)(g,2),E=p[0],w=p[1],x=r.a.useState((function(){return null===l||void 0===l?void 0:l.to})),O=Object(u.a)(x,2),k=O[0],j=O[1],C=r.a.useState((function(){var e;return null!==(e=null===l||void 0===l?void 0:l.rate.toString())&&void 0!==e?e:""})),S=Object(u.a)(C,2),M=S[0],R=S[1],L=X(),D=E!==(null===l||void 0===l?void 0:l.from)||k!==(null===l||void 0===l?void 0:l.to)||Number(M)!==(null===l||void 0===l?void 0:l.rate),K=!isNaN(Number(M))&&null!=E&&null!=k&&Number(M)>0,N=r.a.createElement(r.a.Fragment,null,r.a.createElement(d.a,{display:"flex",flexDirection:"row"},r.a.createElement(Q.a,null,r.a.createElement($.a,{id:"from-label-id"},"From"),r.a.createElement(q.a,{labelId:"from-label-id",value:null===(t=f.getCurrency(null!==E&&void 0!==E?E:""))||void 0===t?void 0:t.id,onChange:function(e,t){var n;return w(null===(n=y.find((function(t){return t.id===e.target.value})))||void 0===n?void 0:n.id)}},r.a.createElement(v.a,null,"-"),y.filter((function(e){return e.id!==k})).map((function(e,t){return r.a.createElement(v.a,{key:e.id+"_from",value:e.id},e.name)})))),r.a.createElement(d.a,{marginX:1}),r.a.createElement(A.a,{value:M,inputMode:"decimal",onChange:function(e){return R(e.target.value)},label:"Rate"}),r.a.createElement(d.a,{marginX:1}),r.a.createElement(Q.a,null,r.a.createElement($.a,{id:"to-label-id"},"To"),r.a.createElement(q.a,{labelId:"to-label-id",value:null===(n=f.getCurrency(null!==k&&void 0!==k?k:""))||void 0===n?void 0:n.id,onChange:function(e,t){var n;return j(null===(n=y.find((function(t){return t.id===e.target.value})))||void 0===n?void 0:n.id)}},r.a.createElement(v.a,null,"-"),y.filter((function(e){return e.id!==E})).map((function(e,t){return r.a.createElement(v.a,{key:e.id+"_to",value:e.id},e.name)}))))),K&&r.a.createElement(h.a,null,"1 ".concat(null===(a=f.getCurrency(null!==E&&void 0!==E?E:""))||void 0===a?void 0:a.unit," of ").concat(null===(o=f.getCurrency(null!==E&&void 0!==E?E:""))||void 0===o?void 0:o.name," = ").concat(Number(M)," ").concat(null===(i=f.getCurrency(null!==k&&void 0!==k?k:""))||void 0===i?void 0:i.unit," of ").concat(null===(c=f.getCurrency(null!==k&&void 0!==k?k:""))||void 0===c?void 0:c.name)),r.a.createElement(d.a,{display:"flex",flexDirection:"row"},D&&K&&r.a.createElement(b.a,{onClick:function(){null!=E&&null!=k&&f.addOrUpdateExchangeRate({from:E,to:k,rate:Number(M)})}},r.a.createElement(J.a,null,"save")),!s&&null!=l&&r.a.createElement(b.a,{onClick:function(){f.removeExchangeRate(l)}},r.a.createElement(J.a,null,"delete"))));return L?r.a.createElement(m.a,{style:{margin:10}},r.a.createElement(d.a,{display:"flex",flexDirection:"column",alignItems:"center",margin:1},N)):r.a.createElement(d.a,{display:"flex",flexDirection:"row",alignItems:"center",margin:1,justifyContent:"space-between"},N)}function te(){var e=B(T().getExchangeRates(),[]);return r.a.createElement(d.a,{display:"flex",flexDirection:"column"},e.map((function(e,t){return r.a.createElement(ee,{key:e.from+"_"+e.to+"_"+e.rate,rate:e,isNew:!1})})),r.a.createElement(ee,{key:e.length,isNew:!0}))}var ne=n(165),ae=n(170),re=n(185),oe=n(172),ie={bounds:{top:0,height:50,left:0,width:50},name:"",labels:[]},ue=window.firebase,ce=a.createContext(null);function le(){var e=a.useContext(ce);if(null==e)throw new Error("useDBContext used outside of the context");return e}function se(e){return null!=e.name?e.name:e.from+":"+e.to}var fe=function(){function e(){var t=this;Object(O.a)(this,e),this._forceUpdate=new j.a(null),this.goals=new j.a([]),this.connections=new j.a([]),this.systems=new j.a([]),this.config=new j.a({zoomLevel:1,cameraPosition:{x:0,y:0}}),this.dbRef=void 0,Object(C.a)(this.goals.pipe(Object(S.a)(1),Object(L.a)((function(e){return JSON.stringify(e.map((function(e){return e.value})))})),Object(M.a)()),this.connections.pipe(Object(S.a)(1),Object(L.a)((function(e){return JSON.stringify(e.map((function(e){return e.value})))})),Object(M.a)()),this.systems.pipe(Object(S.a)(1),Object(L.a)((function(e){return JSON.stringify(e.map((function(e){return e.value})))})),Object(M.a)()),this.config.pipe(Object(S.a)(1),Object(L.a)((function(e){return JSON.stringify(e)})),Object(M.a)()),this._forceUpdate).pipe(Object(R.a)(1e3)).subscribe({next:function(){return t.save()}})}return Object(k.a)(e,[{key:"getGoalInitialValue",value:function(e){var t,n=null===(t=this.goals.value.find((function(t){return se(t.value)===e})))||void 0===t?void 0:t.value;return null==n?ie:n}},{key:"getGoalWithKey",value:function(e){var t=this.goals.value.find((function(t){return se(t.value)===e}));return null==t?new j.a(ie):t}},{key:"updateGoalWithKey",value:function(e,t){var n=this.goals.value.find((function(t){return se(t.value)===e}));if(null!=n){var a=t(n.value);null==this.goals.value.find((function(e){return se(e.value)===se(a)&&e!==n}))?(n.next(a),this._forceUpdate.next(null)):alert("There is already another goal with this name")}}},{key:"deleteGoal",value:function(e){this.goals.next(this.goals.value.filter((function(t){return se(t.value)!==e})))}},{key:"createGoal",value:function(e){this.goals.next([].concat(Object(x.a)(this.goals.value),[new j.a(e)]))}},{key:"getZoomLevel",value:function(){return this.config.pipe(Object(M.a)(),Object(L.a)((function(e){return e.zoomLevel})))}},{key:"getCameraPosition",value:function(){return this.config.pipe(Object(M.a)(),Object(L.a)((function(e){return e.cameraPosition})))}},{key:"getGoalsWithKey",value:function(){return this.goals.pipe(Object(L.a)((function(e){return e.map((function(e){return[e,se(e.value)]}))})))}},{key:"getSystemsWithKey",value:function(){return this.systems.pipe(Object(L.a)((function(e){return e.map((function(e){return[e,se(e.value)]}))})))}},{key:"getConnectionsWithKeys",value:function(){return this.connections.pipe(Object(L.a)((function(e){return e.map((function(e){return[e.value,se(e.value)]}))})))}},{key:"deleteConnection",value:function(e){this.connections.next(this.connections.value.filter((function(t){return se(t.value)!==e})))}},{key:"createConnection",value:function(e){var t=e.from,n=e.to;this.connections.next([].concat(Object(x.a)(this.connections.value),[new j.a({from:se(t),to:se(n)})]))}},{key:"getSystemGoals",value:function(e){var t=this,n=this.systems.value.find((function(t){return se(t.value)===("string"===typeof e?e:se(e))}));if(null==n)throw new Error("System not found");return Object(C.a)(n,this.goals).pipe(Object(re.a)(30),Object(L.a)((function(e){var n=Object(u.a)(e,1)[0];return t.goals.pipe(Object(re.a)(30),Object(L.a)((function(e){return e.filter((function(e){return t=e.value.bounds,a=n.bounds,!(t.left<=a.left)&&!(t.top<=a.top)&&!(t.left+t.width>=a.left+a.width)&&!(t.top+t.height>=a.top+a.height);var t,a}))})))})),Object(oe.a)((function(e){return e})))}},{key:"getSystemInitialValue",value:function(e){var t,n=null===(t=this.systems.value.find((function(t){return se(t.value)===e})))||void 0===t?void 0:t.value;if(null==n)throw new Error("System not found");return n}},{key:"updateSystemWithKey",value:function(e,t){var n=this.systems.value.find((function(t){return se(t.value)===e}));if(null==n)throw new Error("System not found");var a=t(n.value);null==this.systems.value.find((function(e){return se(e.value)===se(a)&&e!==n}))?(n.next(a),this._forceUpdate.next(null)):alert("There is already another goal with this name")}},{key:"deleteSystem",value:function(e){this.systems.next(this.systems.value.filter((function(t){return se(t.value)!==e})))}},{key:"createSystem",value:function(e){this.systems.next([].concat(Object(x.a)(this.systems.value),[new j.a(e)]))}},{key:"loadFromFirebase",value:function(e){var t=this;this.dbRef=ue.database().ref("systems/".concat(e)),this.dbRef.on("value",(function(e){var n,a,r,o,i;console.log("Updating Systems");var u=JSON.parse(null!==(n=e.val())&&void 0!==n?n:"{}"),c=null!==(a=u.goals)&&void 0!==a?a:[],l=null!==(r=u.systems)&&void 0!==r?r:[],s=null!==(o=u.connections)&&void 0!==o?o:[],f=null!==(i=u.config)&&void 0!==i?i:{zoomLevel:1,cameraPosition:{x:0,y:0}};JSON.stringify(f)!==JSON.stringify(t.config.value)&&t.config.next(f),de(t.goals,c),de(t.systems,l),de(t.connections,s)}))}},{key:"save",value:function(){var e={goals:this.goals.value.map((function(e){return e.value})),systems:this.systems.value.map((function(e){return e.value})),connections:this.connections.value.map((function(e){return e.value})),config:this.config.value},t=JSON.stringify(e);this.dbRef.set(t),console.log("Saving Systems")}}]),e}();function de(e,t){var n={},a=function(e,t){var n,a=[],r=[],o=Object(p.a)(t);try{e:for(o.s();!(n=o.n()).done;){var i,u=n.value,c=Object(p.a)(e);try{for(c.s();!(i=c.n()).done;){if(se(i.value)===se(u)){r.push(u);continue e}}}catch(s){c.e(s)}finally{c.f()}a.push(u)}}catch(s){o.e(s)}finally{o.f()}var l=e.filter((function(e){return!r.map((function(e){return se(e)})).includes(se(e))}));return{newAdded:a,deleted:l,existed:r}}(e.value.map((function(e){return n[se(e.value)]=e,e.value})),t),r=Object(x.a)(a.newAdded.map((function(e){return new j.a(e)})));a.existed.forEach((function(e){var t=n[se(e)];r.push(t),JSON.stringify(t.value)!==JSON.stringify(e)&&t.next(e)})),e.next(r)}var me=Object(ae.a)({rootContainer:{"&::-webkit-scrollbar":{display:"none"}},innerContainer:{width:"100%",height:"100%",position:"relative"}});function ve(e){var t=e.zoomLevel,n=e.cameraPosition;return"transform:translate(".concat(n.x,"px,").concat(n.y,"px) scale(").concat(t,")")}function he(e){var t=r.a.useRef(),n=r.a.useRef(),a=r.a.useRef(),o=le(),i=me({}),c=r.a.useState({width:0,height:0}),l=Object(u.a)(c,2),s=l[0],f=l[1],d=function(e){var t=r.a.useState(!1),n=Object(u.a)(t,2),a=n[0],o=n[1];return r.a.useEffect((function(){var t=function(t){t.button===e&&o(!0)},n=function(t){t.button===e&&o(!1)};return window.document.addEventListener("mousedown",t),window.document.addEventListener("mouseup",n),function(){window.document.removeEventListener("mousedown",t),window.document.removeEventListener("mouseup",n)}}),[e]),a}(1),m=r.a.useState(1),v=Object(u.a)(m,2)[1],h=r.a.useMemo((function(){return o.config.value}),[o]),b=r.a.useCallback((function(){o.config.next(h)}),[o.config,h]),y=r.a.useCallback((function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(null==n.current)throw new Error("Unhandled situtation innerRef cannot be null here");null!=a.current&&(a.current.innerText="".concat(h.cameraPosition.x,", ").concat(h.cameraPosition.y," (x").concat(h.zoomLevel.toPrecision(2),")"));var t=ve(h),r=";transition: transform 100ms";e&&(n.current.setAttribute("style",n.current.style+r),t+=r),n.current.setAttribute("style",t)}),[n,h,a]);return r.a.useEffect((function(){y(!1)}),[y]),r.a.useEffect((function(){var e=o.config.pipe(Object(S.a)(1),Object(D.a)(1)).subscribe({next:function(e){h.cameraPosition=e.cameraPosition,h.zoomLevel=e.zoomLevel,y(!1)}});return function(){return e.unsubscribe()}}),[o,h,y]),r.a.useEffect((function(){var e=function(e){32===e.keyCode&&(h.zoomLevel=1,y(!0),b())};return window.document.addEventListener("keyup",e),function(){return window.document.removeEventListener("keyup",e)}}),[y,h,b]),r.a.useEffect((function(){var e=new j.a(null),t=e.pipe(Object(R.a)(100)).subscribe({next:function(){return v(h.zoomLevel)}}),n=function(t){h.zoomLevel=Math.max(.1,h.zoomLevel+-5e-4*t.deltaY),b(),y(!0),e.next(null)};return window.document.addEventListener("wheel",n),function(){window.document.removeEventListener("wheel",n),t.unsubscribe()}}),[y,h,b]),r.a.useLayoutEffect((function(){if(d){document.body.style.cursor="move";var e=function(e){h.cameraPosition.x+=e.movementX,h.cameraPosition.y+=e.movementY,b(),y()};return document.addEventListener("mousemove",e),function(){return document.removeEventListener("mousemove",e)}}document.body.style.cursor="default"}),[d,n,y,h,b]),r.a.useLayoutEffect((function(){var e=function(){if(null==t.current)throw new Error("Unhandled situtation");var e=window.innerHeight-t.current.getBoundingClientRect().top,n=window.innerWidth;f({height:e,width:n})};e();var n=Object(ne.a)(window,"resize").pipe(Object(R.a)(50)).subscribe({next:function(){return e()}});return function(){return n.unsubscribe()}}),[t]),r.a.createElement("div",{ref:t,className:i.rootContainer,id:"canvas",style:{width:s.width,height:s.height,position:"relative",overflow:"hidden"}},r.a.createElement("div",{ref:n,className:i.innerContainer},e.children),r.a.createElement("p",{ref:a,style:{position:"absolute",bottom:0,right:20,opacity:.5}}))}var be=n(187),ye=n(186),ge=n(93),pe=n.n(ge);function Ee(e){var t,n={display:"flex",flexDirection:"row"},a={width:e.borderWidth,height:e.borderWidth},o={flex:1,height:e.borderWidth},i={width:e.borderWidth};return r.a.createElement("div",{style:Object(w.a)({},null!==(t=e.style)&&void 0!==t?t:{},{display:"flex",flexDirection:"column"}),onMouseMove:e.onMouseMove},r.a.createElement("div",{style:n},r.a.createElement("div",{onMouseEnter:null==e.onTL?void 0:function(){return e.onTL({state:"entered"})},onMouseLeave:null==e.onTL?void 0:function(){return e.onTL({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},a,{cursor:"nw-resize"})}),r.a.createElement("div",{onMouseEnter:null==e.onT?void 0:function(){return e.onT({state:"entered"})},onMouseLeave:null==e.onT?void 0:function(){return e.onT({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},o,{cursor:"n-resize"})}),r.a.createElement("div",{onMouseEnter:null==e.onTR?void 0:function(){return e.onTR({state:"entered"})},onMouseLeave:null==e.onTR?void 0:function(){return e.onTR({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},a,{cursor:"ne-resize"})})),r.a.createElement("div",{style:n},r.a.createElement("div",{onMouseEnter:null==e.onL?void 0:function(){return e.onL({state:"entered"})},onMouseLeave:null==e.onL?void 0:function(){return e.onL({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},i,{cursor:"w-resize"})}),r.a.createElement("div",{style:{width:"100%",height:"100%"}},e.children),r.a.createElement("div",{onMouseEnter:null==e.onR?void 0:function(){return e.onR({state:"entered"})},onMouseLeave:null==e.onR?void 0:function(){return e.onR({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},i,{cursor:"w-resize"})})),r.a.createElement("div",{style:n},r.a.createElement("div",{onMouseEnter:null==e.onBL?void 0:function(){return e.onBL({state:"entered"})},onMouseLeave:null==e.onBL?void 0:function(){return e.onBL({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},a,{cursor:"sw-resize"})}),r.a.createElement("div",{onMouseEnter:null==e.onB?void 0:function(){return e.onB({state:"entered"})},onMouseLeave:null==e.onB?void 0:function(){return e.onB({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},o,{cursor:"n-resize"})}),r.a.createElement("div",{onMouseEnter:null==e.onBR?void 0:function(){return e.onBR({state:"entered"})},onMouseLeave:null==e.onBR?void 0:function(){return e.onBR({state:"exited"})},onMouseDown:e.onMouseDown,onMouseUp:e.onMouseUp,style:Object(w.a)({},a,{cursor:"se-resize"})})))}var we=n(166);function xe(e){var t=a.useRef(!1),n=a.useRef(),o=a.useMemo((function(){return e.updateManager.initial}),[e.updateManager]),i=function(){var e=r.a.useState(0),t=Object(u.a)(e,2)[1];return r.a.useCallback((function(){return t((function(e){return e+1}))}),[])}(),c=a.useRef("none"),l=a.useCallback((function(t){var n=t(o),a=Object(w.a)({},n,{width:Math.max(n.width,100),height:Math.max(n.height,70)});Object.assign(o,a),i(),setTimeout((function(){return e.updateManager.sendUpdate(o)}),50)}),[o,i,e.updateManager]);a.useEffect((function(){var t=e.updateManager.updates.pipe(Object(we.a)((function(e){return e.width!==o.width||e.height!==o.height||e.top!==o.top||e.left!==o.left}))).subscribe({next:function(e){return l((function(){return e}))}});return function(){return t.unsubscribe()}}),[e.updateManager,o,l]),a.useEffect((function(){var e=function(e){if(t.current){var n=e.movementX,a=e.movementY;"r"===c.current&&l((function(e){return Object(w.a)({},e,{width:e.width+n})})),"br"===c.current&&l((function(e){return Object(w.a)({},e,{width:e.width+n,height:e.height+a})})),"b"===c.current&&l((function(e){return Object(w.a)({},e,{height:e.height+a})})),"bl"===c.current&&l((function(e){return Object(w.a)({},e,{width:e.width+-n,left:e.left+n,height:e.height+a})})),"l"===c.current&&l((function(e){return Object(w.a)({},e,{width:e.width+-n,left:e.left+n})})),"tl"===c.current&&l((function(e){return Object(w.a)({},e,{width:e.width+-n,top:e.top+a,left:e.left+n,height:e.height+-a})})),"t"===c.current&&l((function(e){return Object(w.a)({},e,{top:e.top+a,height:e.height+-a})})),"tr"===c.current&&l((function(e){return Object(w.a)({},e,{width:e.width+n,top:e.top+a,height:e.height+-a})}))}},n=function(e){t.current=!1};return document.addEventListener("mousemove",e),document.addEventListener("mouseup",n),function(){document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",n)}}),[t,c,e.scale,l]);return a.createElement(pe.a,{handle:".handle",position:{x:o.left,y:o.top},onDrag:function(e,t){l((function(e){return Object(w.a)({},e,{left:t.x,top:t.y})}))},positionOffset:e.offsetPosition,scale:e.scale},a.createElement("div",{ref:n,style:{position:"absolute"}},a.createElement(Ee,{onMouseDown:function(e){t.current=!0},borderWidth:10,onL:function(){return!t.current&&(c.current="l")},onR:function(){return!t.current&&(c.current="r")},onTL:function(){return!t.current&&(c.current="tl")},onT:function(){return!t.current&&(c.current="t")},onTR:function(){return!t.current&&(c.current="tr")},onBL:function(){return!t.current&&(c.current="bl")},onB:function(){return!t.current&&(c.current="b")},onBR:function(){return!t.current&&(c.current="br")}},e.children(o))))}function Oe(e){var t,n=B(e.goal,null),r=(null===(t=e.selectedGoal)||void 0===t?void 0:t.name)===(null===n||void 0===n?void 0:n.name),o=a.useRef(),i=le(),u=a.useMemo((function(){return{sendUpdate:function(t){return i.updateGoalWithKey(e.goalKey,(function(e){return Object(w.a)({},e,{bounds:t})}))},initial:i.getGoalInitialValue(e.goalKey).bounds,updates:e.goal.pipe(Object(L.a)((function(e){return e.bounds})),Object(ye.a)((function(e){if(null!=o.current){var t="".concat(e.left.toFixed(2),", ").concat(e.top.toFixed(2)),n="w".concat(e.width.toFixed(),"h").concat(e.height.toFixed());o.current.innerText="".concat(t," ").concat(n,";")}})))}}),[e.goalKey,i,e.goal]);return null==n?null:a.createElement(xe,{updateManager:u,scale:e.scale},(function(t){return a.createElement(m.a,{onClick:function(){return e.onClick(n)},elevation:4,variant:r?"elevation":"outlined",style:{padding:5,width:t.width,height:t.height,display:"flex",flexDirection:"column",userSelect:"none",justifyContent:"space-between"}},a.createElement("div",{style:{display:"flex",flexDirection:"row"}},a.createElement(J.a,{className:"handle"},"drag_handle"),a.createElement(J.a,{style:{cursor:"pointer"},onClick:function(){window.confirm("Are you sure you want to delete this goal?")&&i.deleteGoal(e.goalKey)}},"delete")),a.createElement("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap",alignItems:"baseline",fontSize:30,alignSelf:"center",cursor:"pointer"},className:"content",onClick:function(){var t=prompt("Enter goal name",n.name);null!=t&&i.updateGoalWithKey(e.goalKey,(function(e){return Object(w.a)({},e,{name:t})}))},dangerouslySetInnerHTML:{__html:n.name}}),a.createElement(d.a,{display:"flex",flexDirection:"row",flexWrap:"warp"},n.labels.map((function(t,n){return a.createElement(be.a,{onClick:function(){window.confirm("Are you sure you want to delete this label?")&&i.updateGoalWithKey(e.goalKey,(function(e){return Object(w.a)({},e,{labels:e.labels.filter((function(e){return e!==t}))})}))},style:{margin:3},size:"small",key:n,label:t})})),a.createElement(be.a,{onClick:function(){var t=prompt("Enter label text");null!=t&&i.updateGoalWithKey(e.goalKey,(function(e){return Object(w.a)({},e,{labels:[].concat(Object(x.a)(e.labels),[t])})}))},style:{margin:3,cursor:"pointer"},size:"small",color:"primary",label:"+"})),a.createElement("p",{ref:o,style:{position:"absolute",bottom:0,right:20,opacity:.5}}))}))}var ke=n(180),je=n(164);function Ce(e){var t=B(e.system,null),n=le(),r=a.useRef(),o=B((function(){return n.getSystemGoals(e.systemKey)}),[]),i=a.useMemo((function(){return{sendUpdate:function(t){return n.updateSystemWithKey(e.systemKey,(function(e){return Object(w.a)({},e,{bounds:t})}))},initial:n.getSystemInitialValue(e.systemKey).bounds,updates:e.system.pipe(Object(L.a)((function(e){return e.bounds})),Object(ye.a)((function(e){if(null!=r.current){var t="".concat(e.left.toFixed(2),", ").concat(e.top.toFixed(2)),n="w".concat(e.width.toFixed(),"h").concat(e.height.toFixed());r.current.innerText="".concat(t," ").concat(n,";")}})))}}),[e.systemKey,n,e.system]);if(null==t)return null;var u="".concat("rgba(0,0,0,0.6)"," dashed");return a.createElement(xe,{updateManager:i,scale:e.scale},(function(i){return a.createElement("div",{onClick:function(){return null!=e.onClick&&e.onClick(t)},style:{padding:5,width:i.width,height:i.height,display:"flex",flexDirection:"column",justifyContent:"space-between",borderColor:"rgba(0,0,0,0.6)",borderWidth:2,borderStyle:"dashed",borderRadius:5,borderTopLeftRadius:0,pointerEvents:"visible"}},a.createElement(J.a,{className:"handle"},"drag_handle"),a.createElement(J.a,{style:{cursor:"pointer",position:"absolute",left:50},onClick:function(){window.confirm("Are you sure you want to delete this system?")&&n.deleteSystem(e.systemKey)}},"delete"),a.createElement("p",{style:{position:"absolute",bottom:0,left:15}},"".concat(o.length," Goals")),a.createElement("div",{style:{position:"absolute",top:-38,fontSize:"25pt",paddingLeft:5,paddingRight:5,left:10,borderLeft:u,borderTop:u,borderRight:u,borderWidth:2},onClick:function(){var a=prompt("Enter system name",t.name);null!=a&&n.updateSystemWithKey(e.systemKey,(function(e){return Object(w.a)({},e,{name:a})}))},dangerouslySetInnerHTML:{__html:t.name}}),a.createElement("p",{ref:r,style:{position:"absolute",bottom:0,right:20,opacity:.5}}))}))}var Se=n(94);function Me(e){var t=le(),n=B((function(){return t.getConnectionsWithKeys()}),[]);return a.createElement("svg",{style:{width:"100%",overflow:"visible",height:"100%"},stroke:"#000",fill:"#000",strokeWidth:3},n.map((function(e){var t=Object(u.a)(e,2),n=t[0],r=t[1];return a.createElement(Re,{fromGoalKey:n.from,toGoalKey:n.to,key:r})})))}function Re(e){var t=e.fromGoalKey,n=e.toGoalKey,r=le(),o=B((function(){return r.getGoalWithKey(t)}),r.getGoalInitialValue(t)),i=B((function(){return r.getGoalWithKey(n)}),r.getGoalInitialValue(n)),c=Object(Se.a)(o.bounds.left,o.bounds.top,o.bounds.width+20,o.bounds.height+20,i.bounds.left,i.bounds.top,i.bounds.width+20,i.bounds.height+20,{bow:.1}),l=Object(u.a)(c,7),s=l[0],f=l[1],d=l[2],m=l[3],v=l[4],h=l[5],b=l[6]*(180/Math.PI);return console.log(s,f),a.createElement(a.Fragment,null,a.createElement("circle",{cx:s,cy:f,r:4}),a.createElement("path",{d:"M".concat(s,",").concat(f," Q").concat(d,",").concat(m," ").concat(v,",").concat(h),fill:"none",onClick:function(){window.confirm("Are you sure you want to delete this connection?")&&r.deleteConnection(se({from:t,to:n}))}}),a.createElement("polygon",{points:"0,-6 12,0, 0,6",transform:"translate(".concat(v,",").concat(h,") rotate(").concat(b,")")}))}function Le(){var e=le(),t=B((function(){return e.getZoomLevel()}),1),n=B((function(){return e.getGoalsWithKey()}),[]),r=B((function(){return e.getSystemsWithKey()}),[]),o=a.useState(!1),i=Object(u.a)(o,2),c=i[0],l=i[1],s=a.useState(),f=Object(u.a)(s,2),d=f[0],v=f[1];return a.createElement(a.Fragment,null,a.createElement(he,null,r.map((function(e){var n=Object(u.a)(e,2),r=n[0],o=n[1];return a.createElement(Ce,{key:o,system:r,scale:t,systemKey:o})})),n.map((function(n){var r=Object(u.a)(n,2),o=r[0],i=r[1];return a.createElement(Oe,{key:i,goal:o,scale:t,onClick:function(t){c&&(null==d?v(t):(e.createConnection({from:d,to:t}),v(void 0),l(!1)))},goalKey:i,selectedGoal:d})})),a.createElement(Me,null)),a.createElement(m.a,{elevation:10,style:{position:"absolute",top:70,left:20,opacity:.7,display:"flex",flexDirection:"column"}},a.createElement(ke.a,{title:"Add Goal"},a.createElement(je.a,{onClick:function(){var t=prompt("Enter goal name");if(null!=t){var n={labels:[],name:t,bounds:{left:-e.config.value.cameraPosition.x,top:-e.config.value.cameraPosition.y,height:300,width:400}};e.createGoal(n)}}},a.createElement(J.a,null,"add"))),a.createElement(ke.a,{title:"Add System"},a.createElement(je.a,{onClick:function(){var t=prompt("Enter system name");if(null!=t){var n={name:t,labels:[],bounds:{left:-e.config.value.cameraPosition.x,top:-e.config.value.cameraPosition.y,height:300,width:400}};e.createSystem(n)}}},a.createElement(J.a,null,"add"))),a.createElement(ke.a,{title:"Toggle Connection creation"},a.createElement(je.a,{onClick:function(){c?(v(void 0),l(!1)):l(!0)}},a.createElement(J.a,{color:c?"secondary":"inherit"},"trending_flat")))))}var De=window.firebase;var Ke=function(){var e=r.a.useState(1),t=Object(u.a)(e,2),n=t[0],a=t[1],o=r.a.useMemo((function(){return function(){var e=new U;return window.pls=e,e}()}),[]),i=r.a.useMemo((function(){return new fe}),[]);return r.a.useEffect((function(){var e=_("username"),t=_("password");console.log(o),console.log(i);var n=!1,a=localStorage.getItem("uid"),r=function(e){n||(n=!0,o.loadFromFirebase(e),i.loadFromFirebase(e))};null!=a&&r(a),De.auth().signInWithEmailAndPassword(e,t).then((function(e){localStorage.setItem("uid",e.user.uid),r(e.user.uid)})).catch((function(e){alert(e.message),null==a?window.location.reload():r(a)}))}),[o,i]),r.a.createElement(K.Provider,{value:o},r.a.createElement(ce.Provider,{value:i},r.a.createElement(c.a,null),r.a.createElement(l.a,{position:"static"},r.a.createElement(s.a,{value:n,onChange:function(e,t){return a(t)},centered:!0},r.a.createElement(f.a,{label:"Setup Currencies"}),r.a.createElement(f.a,{label:"Exchange"}),r.a.createElement(f.a,{label:"Setup Exchange Rates"}),r.a.createElement(f.a,{label:"Systems"}))),3===n&&r.a.createElement(Le,null),3!==n&&r.a.createElement(d.a,{marginTop:5,flex:1,minWidth:"75%"},r.a.createElement(m.a,null,0===n&&r.a.createElement(Z,null),1===n&&r.a.createElement(F,null),2===n&&r.a.createElement(te,null)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(Ke,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[111,1,2]]]);
//# sourceMappingURL=main.52537357.chunk.js.map