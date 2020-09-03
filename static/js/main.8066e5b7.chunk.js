(this.webpackJsonppls=this.webpackJsonppls||[]).push([[0],{82:function(e,n,a){e.exports=a(90)},90:function(e,n,a){"use strict";a.r(n);var t=a(0),r=a.n(t),c=a(8),l=a.n(c),i=a(12),u=a(132),o=a(133),m=a(137),s=a(134),f=a(136),d=a(123),v=a(142),E=a(124),h=a(125),g=a(69),p=a(126),b=a(52),x=a(58),y=a(59),k=a(64),O=a(65),C=a(140),j=a(120),w=a(121),S=a(141),R=r.a.createContext(null);function D(){var e=r.a.useContext(R);if(null==e)throw new Error("useDBContext used outside of the context");return e}var N=function(){function e(){var n=this;Object(k.a)(this,e),this.currencies=new C.a([]),this.exchangeRates=new C.a([]),this.bank=new C.a({}),this.currencies.pipe(Object(j.a)(1)).subscribe({next:function(){return n.save()}}),this.exchangeRates.pipe(Object(j.a)(1)).subscribe({next:function(){return n.save()}}),this.bank.pipe(Object(j.a)(1)).subscribe({next:function(){return n.save()}})}return Object(O.a)(e,[{key:"addOrUpdateCurrency",value:function(e){var n=Object(y.a)(this.currencies.value),a=n.find((function(n){return n.name===e.name}));null!=a?Object.assign(a,e):n.push(e),this.currencies.next(n)}},{key:"bankOf",value:function(e){return this.bank.pipe(Object(w.a)((function(n){var a;return null!==(a=n[e.name])&&void 0!==a?a:0})))}},{key:"canSpend",value:function(e,n){return this.bankOf(e).pipe(Object(w.a)((function(e){return e-n>=0})))}},{key:"addToBank",value:function(e,n){var a;this.bank.next(Object(x.a)({},this.bank.value,Object(b.a)({},e.name,Math.max(0,(null!==(a=this.bank.value[e.name])&&void 0!==a?a:0)+n))))}},{key:"exchange",value:function(e,n){var a=this;this.canExchange(e,n).pipe(Object(S.a)(1)).subscribe({next:function(t){if(t){var r=Object(x.a)({},a.bank.value);null==r[e.from.name]&&(r[e.from.name]=0),r[e.from.name]-=n,null==r[e.to.name]&&(r[e.to.name]=0),r[e.to.name]+=n*e.rate,a.bank.next(r)}}})}},{key:"canExchange",value:function(e,n){return this.bankOf(e.from).pipe(Object(w.a)((function(e){return e>=n})))}},{key:"removeCurrency",value:function(e){this.currencies.next(this.currencies.value.filter((function(n){return n.name!==e.name})))}},{key:"addOrUpdateExchangeRate",value:function(e){var n=Object(y.a)(this.exchangeRates.value),a=n.find((function(n){return n.from.name===e.from.name&&n.to.name===e.to.name}));null!=a?Object.assign(a,e):n.push(e),this.exchangeRates.next(n)}},{key:"removeExchangeRate",value:function(e){this.exchangeRates.next(this.exchangeRates.value.filter((function(n){return n.from.name===e.from.name&&n.to.name===e.to.name})))}},{key:"getCurrencies",value:function(){return this.currencies}},{key:"getExchangeRates",value:function(){return this.exchangeRates}},{key:"load",value:function(){var e,n,a,t,r=JSON.parse(null!==(e=localStorage.getItem("DATA"))&&void 0!==e?e:"{}");this.currencies.next(null!==(n=r.currencies)&&void 0!==n?n:[]),this.exchangeRates.next(null!==(a=r.exchangeRates)&&void 0!==a?a:[]),this.bank.next(null!==(t=r.bank)&&void 0!==t?t:{})}},{key:"save",value:function(){var e={currencies:this.currencies.value,exchangeRates:this.exchangeRates.value,bank:this.bank.value};localStorage.setItem("DATA",JSON.stringify(e))}}]),e}();function T(e,n){var a=r.a.useState(n),t=Object(i.a)(a,2),c=t[0],l=t[1];return r.a.useEffect((function(){var n=("function"===typeof e?e():e).subscribe({next:function(e){l(e)}});return function(){return n.unsubscribe()}}),[e]),c}function I(e){var n=e.exchangeRate,a=e.value,t=e.onDone,c=e.innerRef,l=D(),i=T(l.canExchange(n,a),!1);return r.a.createElement(v.a,{disabled:!i,innerRef:c,onClick:function(){l.exchange(n,a),t()}},"1 ".concat(n.from.unit," of ").concat(n.from.name," to ").concat(a*n.rate," ").concat(n.to.unit," of ").concat(n.to.name))}var _=r.a.forwardRef((function(e,n){return r.a.createElement(I,Object.assign({},e,{innerRef:n}))}));function B(e){var n=e.currency,a=D(),t=T(a.getExchangeRates(),[]),c=T(a.bankOf(n),0),l=r.a.useState(null),u=Object(i.a)(l,2),o=u[0],m=u[1],s=function(){m(null)};return r.a.createElement(d.a,{variant:"outlined",style:{margin:3}},r.a.createElement(f.a,{padding:2,display:"flex",flexDirection:"column"},r.a.createElement(E.a,null,"".concat(c," ").concat(n.unit," of ").concat(n.name)),r.a.createElement(h.a,{onClick:function(e){return m(e.currentTarget)},"aria-controls":"menu","aria-haspopup":"true"},"Exchange"),r.a.createElement(g.a,{id:"menu",anchorEl:o,keepMounted:!0,open:null!=o,onClose:s},t.filter((function(e){return e.from.name===n.name})).map((function(e){return r.a.createElement(_,{key:e.from.name+"_"+e.to.name,exchangeRate:e,value:1,onDone:s})}))),r.a.createElement(f.a,{display:"flex",flexDirection:"row"},r.a.createElement(h.a,{onClick:function(e){return a.addToBank(n,1)}},"+1"),r.a.createElement(h.a,{onClick:function(e){return a.addToBank(n,-1)}},"-1"))))}function M(e){var n=e.currency,a=D(),t=T(a.bankOf(n),0),c=T(a.canSpend(n,1),!1),l=T(a.getExchangeRates(),[]).filter((function(e){return e.from.name===n.name})),u=r.a.useState(null),o=Object(i.a)(u,2),m=o[0],s=o[1],v=function(){s(null)};return r.a.createElement(d.a,{variant:"outlined",style:{margin:3}},r.a.createElement(f.a,{padding:2,display:"flex",flexDirection:"column"},r.a.createElement(E.a,null,"".concat(t," ").concat(n.unit," of ").concat(n.name)),l.length>0&&r.a.createElement(r.a.Fragment,null,r.a.createElement(h.a,{onClick:function(e){return s(e.currentTarget)},"aria-controls":"menu","aria-haspopup":"true"},"Exchange"),r.a.createElement(g.a,{id:"menu",anchorEl:m,keepMounted:!0,open:null!=m,onClose:v},l.filter((function(e){return e.from.name===n.name})).map((function(e){return r.a.createElement(_,{key:e.from.name+"_"+e.to.name,exchangeRate:e,value:1,onDone:v})})))),r.a.createElement(h.a,{disabled:!c,onClick:function(){return a.addToBank(n,-1)}},"Spend 1 ".concat(n.unit))))}function U(){var e=T(D().getCurrencies(),[]);return r.a.createElement(f.a,{display:"flex",flexDirection:"column",alignItems:"center"},r.a.createElement(E.a,{variant:"h5"},"Exchange"),r.a.createElement(f.a,{display:"flex",flexWrap:"wrap",flexDirection:"row",justifyContent:"center"},e.filter((function(e){return e.isSource})).map((function(e){return r.a.createElement(B,{key:e.name,currency:e})}))),r.a.createElement(p.a,{variant:"middle"}),r.a.createElement(E.a,{variant:"h5"},"Spend"),r.a.createElement(f.a,{display:"flex",flexWrap:"wrap",flexDirection:"row",justifyContent:"center"},e.filter((function(e){return!e.isSource})).map((function(e){return r.a.createElement(M,{key:e.name,currency:e})}))))}var W=a(128),A=a(143),F=a(138),J=a(127);function X(){return Object(J.a)("(max-width:425px)")}function P(e){var n=e.currency,a=e.isNew,t=D(),c=r.a.useState((function(){return n.name})),l=Object(i.a)(c,2),u=l[0],o=l[1],m=r.a.useState((function(){return n.icon})),s=Object(i.a)(m,2),v=s[0],g=s[1],p=r.a.useState((function(){return n.description})),b=Object(i.a)(p,2),x=b[0],y=b[1],k=r.a.useState((function(){return n.isSource})),O=Object(i.a)(k,2),C=O[0],j=O[1],w=r.a.useState((function(){return n.isTime})),S=Object(i.a)(w,2),R=S[0],N=S[1],T=r.a.useState((function(){return n.unit})),I=Object(i.a)(T,2),_=I[0],B=I[1],M=X(),U=u!==n.name||v!==n.icon||x!==n.description||R!==n.isTime||_!==n.unit||C!==n.isSource,J=r.a.createElement(r.a.Fragment,null,!a&&r.a.createElement(W.a,null,n.icon),a&&r.a.createElement(A.a,{label:"Icon",value:v,onChange:function(e){return g(e.target.value)}}),r.a.createElement(A.a,{label:"Name",value:u,onChange:function(e){return o(e.target.value)}}),r.a.createElement(A.a,{label:"Description",value:x,onChange:function(e){return y(e.target.value)}}),r.a.createElement(A.a,{label:"Unit",value:_,onChange:function(e){return B(e.target.value)}}),r.a.createElement(F.a,{checked:R,onChange:function(e,n){return N(n)}}),r.a.createElement(E.a,null,"Is time"),r.a.createElement(F.a,{checked:C,onChange:function(e,n){return j(n)}}),r.a.createElement(E.a,null,"Is source"),U&&r.a.createElement(h.a,{onClick:function(){t.addOrUpdateCurrency({name:u,icon:v,description:x,isTime:R,unit:_,isSource:C})}},r.a.createElement(W.a,null,"save")),!a&&r.a.createElement(h.a,{onClick:function(){t.removeCurrency(n)}},r.a.createElement(W.a,null,"delete")));return M?r.a.createElement(d.a,{style:{margin:15}},r.a.createElement(f.a,{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:1},J)):r.a.createElement(f.a,{display:"flex",flexDirection:"row",alignItems:"center",margin:1,justifyContent:"space-between"},J)}function $(){var e=T(D().getCurrencies(),[]);return r.a.createElement(f.a,{display:"flex",flexDirection:"column"},e.map((function(e,n){return r.a.createElement(P,{key:e.name,currency:e,isNew:!1})})),r.a.createElement(P,{key:"new_currency_item_".concat(e.length),currency:{name:"New currency ".concat(e.length+1),description:"",icon:"",isSource:!1,isTime:!1,unit:"hour"},isNew:!0}))}var q=a(131),z=a(145),G=a(139);function H(e){var n=e.rate,a=e.isNew,t=D(),c=T(t.getCurrencies(),[]),l=r.a.useState((function(){return null===n||void 0===n?void 0:n.from})),u=Object(i.a)(l,2),o=u[0],m=u[1],s=r.a.useState((function(){return null===n||void 0===n?void 0:n.to})),g=Object(i.a)(s,2),p=g[0],b=g[1],x=r.a.useState((function(){var e;return null!==(e=null===n||void 0===n?void 0:n.rate.toString())&&void 0!==e?e:""})),y=Object(i.a)(x,2),k=y[0],O=y[1],C=X(),j=(null===o||void 0===o?void 0:o.name)!==(null===n||void 0===n?void 0:n.from.name)||(null===p||void 0===p?void 0:p.name)!==(null===n||void 0===n?void 0:n.to.name)||Number(k)!==(null===n||void 0===n?void 0:n.rate),w=!isNaN(Number(k))&&null!=o&&null!=p&&Number(k)>0,S=r.a.createElement(r.a.Fragment,null,r.a.createElement(f.a,{display:"flex",flexDirection:"row"},r.a.createElement(q.a,null,r.a.createElement(z.a,{id:"from-label-id"},"From"),r.a.createElement(G.a,{labelId:"from-label-id",value:null===o||void 0===o?void 0:o.name,onChange:function(e,n){return m(c.find((function(n){return n.name===e.target.value})))}},r.a.createElement(v.a,null,"-"),c.filter((function(e){return e.name!==(null===p||void 0===p?void 0:p.name)})).map((function(e,n){return r.a.createElement(v.a,{key:e.name+"_from",value:e.name},e.name)})))),r.a.createElement(f.a,{marginX:1}),r.a.createElement(A.a,{value:k,inputMode:"decimal",onChange:function(e){return O(e.target.value)},label:"Rate"}),r.a.createElement(f.a,{marginX:1}),r.a.createElement(q.a,null,r.a.createElement(z.a,{id:"to-label-id"},"To"),r.a.createElement(G.a,{labelId:"to-label-id",value:null===p||void 0===p?void 0:p.name,onChange:function(e,n){return b(c.find((function(n){return n.name===e.target.value})))}},r.a.createElement(v.a,null,"-"),c.filter((function(e){return e.name!==(null===o||void 0===o?void 0:o.name)})).map((function(e,n){return r.a.createElement(v.a,{key:e.name+"_to",value:e.name},e.name)}))))),w&&r.a.createElement(E.a,null,"1 ".concat(null===o||void 0===o?void 0:o.unit," of ").concat(null===o||void 0===o?void 0:o.name," = ").concat(Number(k)," ").concat(null===p||void 0===p?void 0:p.unit," of ").concat(null===p||void 0===p?void 0:p.name)),r.a.createElement(f.a,{display:"flex",flexDirection:"row"},j&&w&&r.a.createElement(h.a,{onClick:function(){null!=o&&null!=p&&t.addOrUpdateExchangeRate({from:o,to:p,rate:Number(k)})}},r.a.createElement(W.a,null,"save")),!a&&null!=n&&r.a.createElement(h.a,{onClick:function(){t.removeExchangeRate(n)}},r.a.createElement(W.a,null,"delete"))));return C?r.a.createElement(d.a,{style:{margin:10}},r.a.createElement(f.a,{display:"flex",flexDirection:"column",alignItems:"center",margin:1},S)):r.a.createElement(f.a,{display:"flex",flexDirection:"row",alignItems:"center",margin:1,justifyContent:"space-between"},S)}function K(){var e=T(D().getExchangeRates(),[]);return r.a.createElement(f.a,{display:"flex",flexDirection:"column"},e.map((function(e,n){return r.a.createElement(H,{key:e.from.name+"_"+e.to.name+"_"+e.rate,rate:e,isNew:!1})})),r.a.createElement(H,{key:e.length,isNew:!0}))}var L=function(){var e=r.a.useState(1),n=Object(i.a)(e,2),a=n[0],t=n[1],c=r.a.useMemo((function(){return function(){var e=new N;return e.load(),e}()}),[]);return r.a.createElement(R.Provider,{value:c},r.a.createElement(u.a,null),r.a.createElement(o.a,{position:"static"},r.a.createElement(m.a,{value:a,onChange:function(e,n){return t(n)},centered:!0},r.a.createElement(s.a,{label:"Setup Currencies"}),r.a.createElement(s.a,{label:"Exchange"}),r.a.createElement(s.a,{label:"Setup Exchange Rates"}))),r.a.createElement(f.a,{marginTop:5,flex:1,minWidth:"75%"},r.a.createElement(d.a,null,0===a&&r.a.createElement($,null),1===a&&r.a.createElement(U,null),2===a&&r.a.createElement(K,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(L,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[82,1,2]]]);
//# sourceMappingURL=main.8066e5b7.chunk.js.map