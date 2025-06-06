//Start Pako
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).pako=t()}}(function(){return function r(s,o,l){function h(e,t){if(!o[e]){if(!s[e]){var a="function"==typeof require&&require;if(!t&&a)return a(e,!0);if(d)return d(e,!0);var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}var n=o[e]={exports:{}};s[e][0].call(n.exports,function(t){return h(s[e][1][t]||t)},n,n.exports,r,s,o,l)}return o[e].exports}for(var d="function"==typeof require&&require,t=0;t<l.length;t++)h(l[t]);return h}({1:[function(t,e,a){"use strict";var s=t("./zlib/deflate"),o=t("./utils/common"),l=t("./utils/strings"),n=t("./zlib/messages"),r=t("./zlib/zstream"),h=Object.prototype.toString,d=0,f=-1,_=0,u=8;function c(t){if(!(this instanceof c))return new c(t);this.options=o.assign({level:f,method:u,chunkSize:16384,windowBits:15,memLevel:8,strategy:_,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new r,this.strm.avail_out=0;var a=s.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==d)throw new Error(n[a]);if(e.header&&s.deflateSetHeader(this.strm,e.header),e.dictionary){var i;if(i="string"==typeof e.dictionary?l.string2buf(e.dictionary):"[object ArrayBuffer]"===h.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(a=s.deflateSetDictionary(this.strm,i))!==d)throw new Error(n[a]);this._dict_set=!0}}function i(t,e){var a=new c(e);if(a.push(t,!0),a.err)throw a.msg||n[a.err];return a.result}c.prototype.push=function(t,e){var a,i,n=this.strm,r=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:!0===e?4:0,"string"==typeof t?n.input=l.string2buf(t):"[object ArrayBuffer]"===h.call(t)?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(r),n.next_out=0,n.avail_out=r),1!==(a=s.deflate(n,i))&&a!==d)return this.onEnd(a),!(this.ended=!0);0!==n.avail_out&&(0!==n.avail_in||4!==i&&2!==i)||("string"===this.options.to?this.onData(l.buf2binstring(o.shrinkBuf(n.output,n.next_out))):this.onData(o.shrinkBuf(n.output,n.next_out)))}while((0<n.avail_in||0===n.avail_out)&&1!==a);return 4===i?(a=s.deflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===d):2!==i||(this.onEnd(d),!(n.avail_out=0))},c.prototype.onData=function(t){this.chunks.push(t)},c.prototype.onEnd=function(t){t===d&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Deflate=c,a.deflate=i,a.deflateRaw=function(t,e){return(e=e||{}).raw=!0,i(t,e)},a.gzip=function(t,e){return(e=e||{}).gzip=!0,i(t,e)}},{"./utils/common":3,"./utils/strings":4,"./zlib/deflate":8,"./zlib/messages":13,"./zlib/zstream":15}],2:[function(t,e,a){"use strict";var f=t("./zlib/inflate"),_=t("./utils/common"),u=t("./utils/strings"),c=t("./zlib/constants"),i=t("./zlib/messages"),n=t("./zlib/zstream"),r=t("./zlib/gzheader"),b=Object.prototype.toString;function s(t){if(!(this instanceof s))return new s(t);this.options=_.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new n,this.strm.avail_out=0;var a=f.inflateInit2(this.strm,e.windowBits);if(a!==c.Z_OK)throw new Error(i[a]);if(this.header=new r,f.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=u.string2buf(e.dictionary):"[object ArrayBuffer]"===b.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=f.inflateSetDictionary(this.strm,e.dictionary))!==c.Z_OK))throw new Error(i[a])}function o(t,e){var a=new s(e);if(a.push(t,!0),a.err)throw a.msg||i[a.err];return a.result}s.prototype.push=function(t,e){var a,i,n,r,s,o=this.strm,l=this.options.chunkSize,h=this.options.dictionary,d=!1;if(this.ended)return!1;i=e===~~e?e:!0===e?c.Z_FINISH:c.Z_NO_FLUSH,"string"==typeof t?o.input=u.binstring2buf(t):"[object ArrayBuffer]"===b.call(t)?o.input=new Uint8Array(t):o.input=t,o.next_in=0,o.avail_in=o.input.length;do{if(0===o.avail_out&&(o.output=new _.Buf8(l),o.next_out=0,o.avail_out=l),(a=f.inflate(o,c.Z_NO_FLUSH))===c.Z_NEED_DICT&&h&&(a=f.inflateSetDictionary(this.strm,h)),a===c.Z_BUF_ERROR&&!0===d&&(a=c.Z_OK,d=!1),a!==c.Z_STREAM_END&&a!==c.Z_OK)return this.onEnd(a),!(this.ended=!0);o.next_out&&(0!==o.avail_out&&a!==c.Z_STREAM_END&&(0!==o.avail_in||i!==c.Z_FINISH&&i!==c.Z_SYNC_FLUSH)||("string"===this.options.to?(n=u.utf8border(o.output,o.next_out),r=o.next_out-n,s=u.buf2string(o.output,n),o.next_out=r,o.avail_out=l-r,r&&_.arraySet(o.output,o.output,n,r,0),this.onData(s)):this.onData(_.shrinkBuf(o.output,o.next_out)))),0===o.avail_in&&0===o.avail_out&&(d=!0)}while((0<o.avail_in||0===o.avail_out)&&a!==c.Z_STREAM_END);return a===c.Z_STREAM_END&&(i=c.Z_FINISH),i===c.Z_FINISH?(a=f.inflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===c.Z_OK):i!==c.Z_SYNC_FLUSH||(this.onEnd(c.Z_OK),!(o.avail_out=0))},s.prototype.onData=function(t){this.chunks.push(t)},s.prototype.onEnd=function(t){t===c.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=_.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Inflate=s,a.inflate=o,a.inflateRaw=function(t,e){return(e=e||{}).raw=!0,o(t,e)},a.ungzip=o},{"./utils/common":3,"./utils/strings":4,"./zlib/constants":6,"./zlib/gzheader":9,"./zlib/inflate":11,"./zlib/messages":13,"./zlib/zstream":15}],3:[function(t,e,a){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;a.assign=function(t){for(var e,a,i=Array.prototype.slice.call(arguments,1);i.length;){var n=i.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(var r in n)e=n,a=r,Object.prototype.hasOwnProperty.call(e,a)&&(t[r]=n[r])}}return t},a.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,a,i,n){if(e.subarray&&t.subarray)t.set(e.subarray(a,a+i),n);else for(var r=0;r<i;r++)t[n+r]=e[a+r]},flattenChunks:function(t){var e,a,i,n,r,s;for(e=i=0,a=t.length;e<a;e++)i+=t[e].length;for(s=new Uint8Array(i),e=n=0,a=t.length;e<a;e++)r=t[e],s.set(r,n),n+=r.length;return s}},r={arraySet:function(t,e,a,i,n){for(var r=0;r<i;r++)t[n+r]=e[a+r]},flattenChunks:function(t){return[].concat.apply([],t)}};a.setTyped=function(t){t?(a.Buf8=Uint8Array,a.Buf16=Uint16Array,a.Buf32=Int32Array,a.assign(a,n)):(a.Buf8=Array,a.Buf16=Array,a.Buf32=Array,a.assign(a,r))},a.setTyped(i)},{}],4:[function(t,e,a){"use strict";var l=t("./common"),n=!0,r=!0;try{String.fromCharCode.apply(null,[0])}catch(t){n=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){r=!1}for(var h=new l.Buf8(256),i=0;i<256;i++)h[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function d(t,e){if(e<65534&&(t.subarray&&r||!t.subarray&&n))return String.fromCharCode.apply(null,l.shrinkBuf(t,e));for(var a="",i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a}h[254]=h[254]=1,a.string2buf=function(t){var e,a,i,n,r,s=t.length,o=0;for(n=0;n<s;n++)55296==(64512&(a=t.charCodeAt(n)))&&n+1<s&&56320==(64512&(i=t.charCodeAt(n+1)))&&(a=65536+(a-55296<<10)+(i-56320),n++),o+=a<128?1:a<2048?2:a<65536?3:4;for(e=new l.Buf8(o),n=r=0;r<o;n++)55296==(64512&(a=t.charCodeAt(n)))&&n+1<s&&56320==(64512&(i=t.charCodeAt(n+1)))&&(a=65536+(a-55296<<10)+(i-56320),n++),a<128?e[r++]=a:(a<2048?e[r++]=192|a>>>6:(a<65536?e[r++]=224|a>>>12:(e[r++]=240|a>>>18,e[r++]=128|a>>>12&63),e[r++]=128|a>>>6&63),e[r++]=128|63&a);return e},a.buf2binstring=function(t){return d(t,t.length)},a.binstring2buf=function(t){for(var e=new l.Buf8(t.length),a=0,i=e.length;a<i;a++)e[a]=t.charCodeAt(a);return e},a.buf2string=function(t,e){var a,i,n,r,s=e||t.length,o=new Array(2*s);for(a=i=0;a<s;)if((n=t[a++])<128)o[i++]=n;else if(4<(r=h[n]))o[i++]=65533,a+=r-1;else{for(n&=2===r?31:3===r?15:7;1<r&&a<s;)n=n<<6|63&t[a++],r--;1<r?o[i++]=65533:n<65536?o[i++]=n:(n-=65536,o[i++]=55296|n>>10&1023,o[i++]=56320|1023&n)}return d(o,i)},a.utf8border=function(t,e){var a;for((e=e||t.length)>t.length&&(e=t.length),a=e-1;0<=a&&128==(192&t[a]);)a--;return a<0?e:0===a?e:a+h[t[a]]>e?a:e}},{"./common":3}],5:[function(t,e,a){"use strict";e.exports=function(t,e,a,i){for(var n=65535&t|0,r=t>>>16&65535|0,s=0;0!==a;){for(a-=s=2e3<a?2e3:a;r=r+(n=n+e[i++]|0)|0,--s;);n%=65521,r%=65521}return n|r<<16|0}},{}],6:[function(t,e,a){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],7:[function(t,e,a){"use strict";var o=function(){for(var t,e=[],a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}();e.exports=function(t,e,a,i){var n=o,r=i+a;t^=-1;for(var s=i;s<r;s++)t=t>>>8^n[255&(t^e[s])];return-1^t}},{}],8:[function(t,e,a){"use strict";var l,_=t("../utils/common"),h=t("./trees"),u=t("./adler32"),c=t("./crc32"),i=t("./messages"),d=0,f=4,b=0,g=-2,m=-1,w=4,n=2,p=8,v=9,r=286,s=30,o=19,k=2*r+1,y=15,x=3,z=258,B=z+x+1,S=42,E=113,A=1,Z=2,R=3,C=4;function N(t,e){return t.msg=i[e],e}function O(t){return(t<<1)-(4<t?9:0)}function D(t){for(var e=t.length;0<=--e;)t[e]=0}function I(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(_.arraySet(t.output,e.pending_buf,e.pending_out,a,t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))}function U(t,e){h._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,I(t.strm)}function T(t,e){t.pending_buf[t.pending++]=e}function F(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function L(t,e){var a,i,n=t.max_chain_length,r=t.strstart,s=t.prev_length,o=t.nice_match,l=t.strstart>t.w_size-B?t.strstart-(t.w_size-B):0,h=t.window,d=t.w_mask,f=t.prev,_=t.strstart+z,u=h[r+s-1],c=h[r+s];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(h[(a=e)+s]===c&&h[a+s-1]===u&&h[a]===h[r]&&h[++a]===h[r+1]){r+=2,a++;do{}while(h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&r<_);if(i=z-(_-r),r=_-z,s<i){if(t.match_start=e,o<=(s=i))break;u=h[r+s-1],c=h[r+s]}}}while((e=f[e&d])>l&&0!=--n);return s<=t.lookahead?s:t.lookahead}function H(t){var e,a,i,n,r,s,o,l,h,d,f=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=f+(f-B)){for(_.arraySet(t.window,t.window,f,f,0),t.match_start-=f,t.strstart-=f,t.block_start-=f,e=a=t.hash_size;i=t.head[--e],t.head[e]=f<=i?i-f:0,--a;);for(e=a=f;i=t.prev[--e],t.prev[e]=f<=i?i-f:0,--a;);n+=f}if(0===t.strm.avail_in)break;if(s=t.strm,o=t.window,l=t.strstart+t.lookahead,h=n,d=void 0,d=s.avail_in,h<d&&(d=h),a=0===d?0:(s.avail_in-=d,_.arraySet(o,s.input,s.next_in,d,l),1===s.state.wrap?s.adler=u(s.adler,o,d,l):2===s.state.wrap&&(s.adler=c(s.adler,o,d,l)),s.next_in+=d,s.total_in+=d,d),t.lookahead+=a,t.lookahead+t.insert>=x)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[r+x-1])&t.hash_mask,t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<x)););}while(t.lookahead<B&&0!==t.strm.avail_in)}function j(t,e){for(var a,i;;){if(t.lookahead<B){if(H(t),t.lookahead<B&&e===d)return A;if(0===t.lookahead)break}if(a=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-B&&(t.match_length=L(t,a)),t.match_length>=x)if(i=h._tr_tally(t,t.strstart-t.match_start,t.match_length-x),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=x){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=h._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}function K(t,e){for(var a,i,n;;){if(t.lookahead<B){if(H(t),t.lookahead<B&&e===d)return A;if(0===t.lookahead)break}if(a=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=x-1,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-B&&(t.match_length=L(t,a),t.match_length<=5&&(1===t.strategy||t.match_length===x&&4096<t.strstart-t.match_start)&&(t.match_length=x-1)),t.prev_length>=x&&t.match_length<=t.prev_length){for(n=t.strstart+t.lookahead-x,i=h._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-x),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=x-1,t.strstart++,i&&(U(t,!1),0===t.strm.avail_out))return A}else if(t.match_available){if((i=h._tr_tally(t,0,t.window[t.strstart-1]))&&U(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return A}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=h._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}function M(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}function P(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=p,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new _.Buf16(2*k),this.dyn_dtree=new _.Buf16(2*(2*s+1)),this.bl_tree=new _.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new _.Buf16(y+1),this.heap=new _.Buf16(2*r+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new _.Buf16(2*r+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function Y(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=n,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?S:E,t.adler=2===e.wrap?0:1,e.last_flush=d,h._tr_init(e),b):N(t,g)}function q(t){var e,a=Y(t);return a===b&&((e=t.state).window_size=2*e.w_size,D(e.head),e.max_lazy_match=l[e.level].max_lazy,e.good_match=l[e.level].good_length,e.nice_match=l[e.level].nice_length,e.max_chain_length=l[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0),a}function G(t,e,a,i,n,r){if(!t)return g;var s=1;if(e===m&&(e=6),i<0?(s=0,i=-i):15<i&&(s=2,i-=16),n<1||v<n||a!==p||i<8||15<i||e<0||9<e||r<0||w<r)return N(t,g);8===i&&(i=9);var o=new P;return(t.state=o).strm=t,o.wrap=s,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new _.Buf8(2*o.w_size),o.head=new _.Buf16(o.hash_size),o.prev=new _.Buf16(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new _.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=r,o.method=a,q(t)}l=[new M(0,0,0,0,function(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(H(t),0===t.lookahead&&e===d)return A;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+a;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,U(t,!1),0===t.strm.avail_out))return A;if(t.strstart-t.block_start>=t.w_size-B&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(U(t,!0),0===t.strm.avail_out?R:C):(t.strstart>t.block_start&&(U(t,!1),t.strm.avail_out),A)}),new M(4,4,8,4,j),new M(4,5,16,8,j),new M(4,6,32,32,j),new M(4,4,16,16,K),new M(8,16,32,32,K),new M(8,16,128,128,K),new M(8,32,128,256,K),new M(32,128,258,1024,K),new M(32,258,258,4096,K)],a.deflateInit=function(t,e){return G(t,e,p,15,8,0)},a.deflateInit2=G,a.deflateReset=q,a.deflateResetKeep=Y,a.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?g:(t.state.gzhead=e,b):g},a.deflate=function(t,e){var a,i,n,r;if(!t||!t.state||5<e||e<0)return t?N(t,g):g;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&e!==f)return N(t,0===t.avail_out?-5:g);if(i.strm=t,a=i.last_flush,i.last_flush=e,i.status===S)if(2===i.wrap)t.adler=0,T(i,31),T(i,139),T(i,8),i.gzhead?(T(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),T(i,255&i.gzhead.time),T(i,i.gzhead.time>>8&255),T(i,i.gzhead.time>>16&255),T(i,i.gzhead.time>>24&255),T(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),T(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(T(i,255&i.gzhead.extra.length),T(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=c(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(T(i,0),T(i,0),T(i,0),T(i,0),T(i,0),T(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),T(i,3),i.status=E);else{var s=p+(i.w_bits-8<<4)<<8;s|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(s|=32),s+=31-s%31,i.status=E,F(i,s),0!==i.strstart&&(F(i,t.adler>>>16),F(i,65535&t.adler)),t.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),I(t),n=i.pending,i.pending!==i.pending_buf_size));)T(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),I(t),n=i.pending,i.pending===i.pending_buf_size)){r=1;break}T(i,r=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0)}while(0!==r);i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),0===r&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),I(t),n=i.pending,i.pending===i.pending_buf_size)){r=1;break}T(i,r=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0)}while(0!==r);i.gzhead.hcrc&&i.pending>n&&(t.adler=c(t.adler,i.pending_buf,i.pending-n,n)),0===r&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&I(t),i.pending+2<=i.pending_buf_size&&(T(i,255&t.adler),T(i,t.adler>>8&255),t.adler=0,i.status=E)):i.status=E),0!==i.pending){if(I(t),0===t.avail_out)return i.last_flush=-1,b}else if(0===t.avail_in&&O(e)<=O(a)&&e!==f)return N(t,-5);if(666===i.status&&0!==t.avail_in)return N(t,-5);if(0!==t.avail_in||0!==i.lookahead||e!==d&&666!==i.status){var o=2===i.strategy?function(t,e){for(var a;;){if(0===t.lookahead&&(H(t),0===t.lookahead)){if(e===d)return A;break}if(t.match_length=0,a=h._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}(i,e):3===i.strategy?function(t,e){for(var a,i,n,r,s=t.window;;){if(t.lookahead<=z){if(H(t),t.lookahead<=z&&e===d)return A;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=x&&0<t.strstart&&(i=s[n=t.strstart-1])===s[++n]&&i===s[++n]&&i===s[++n]){r=t.strstart+z;do{}while(i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&n<r);t.match_length=z-(r-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=x?(a=h._tr_tally(t,1,t.match_length-x),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=h._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(U(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(U(t,!0),0===t.strm.avail_out?R:C):t.last_lit&&(U(t,!1),0===t.strm.avail_out)?A:Z}(i,e):l[i.level].func(i,e);if(o!==R&&o!==C||(i.status=666),o===A||o===R)return 0===t.avail_out&&(i.last_flush=-1),b;if(o===Z&&(1===e?h._tr_align(i):5!==e&&(h._tr_stored_block(i,0,0,!1),3===e&&(D(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),I(t),0===t.avail_out))return i.last_flush=-1,b}return e!==f?b:i.wrap<=0?1:(2===i.wrap?(T(i,255&t.adler),T(i,t.adler>>8&255),T(i,t.adler>>16&255),T(i,t.adler>>24&255),T(i,255&t.total_in),T(i,t.total_in>>8&255),T(i,t.total_in>>16&255),T(i,t.total_in>>24&255)):(F(i,t.adler>>>16),F(i,65535&t.adler)),I(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?b:1)},a.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==S&&69!==e&&73!==e&&91!==e&&103!==e&&e!==E&&666!==e?N(t,g):(t.state=null,e===E?N(t,-3):b):g},a.deflateSetDictionary=function(t,e){var a,i,n,r,s,o,l,h,d=e.length;if(!t||!t.state)return g;if(2===(r=(a=t.state).wrap)||1===r&&a.status!==S||a.lookahead)return g;for(1===r&&(t.adler=u(t.adler,e,d,0)),a.wrap=0,d>=a.w_size&&(0===r&&(D(a.head),a.strstart=0,a.block_start=0,a.insert=0),h=new _.Buf8(a.w_size),_.arraySet(h,e,d-a.w_size,a.w_size,0),e=h,d=a.w_size),s=t.avail_in,o=t.next_in,l=t.input,t.avail_in=d,t.next_in=0,t.input=e,H(a);a.lookahead>=x;){for(i=a.strstart,n=a.lookahead-(x-1);a.ins_h=(a.ins_h<<a.hash_shift^a.window[i+x-1])&a.hash_mask,a.prev[i&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=i,i++,--n;);a.strstart=i,a.lookahead=x-1,H(a)}return a.strstart+=a.lookahead,a.block_start=a.strstart,a.insert=a.lookahead,a.lookahead=0,a.match_length=a.prev_length=x-1,a.match_available=0,t.next_in=o,t.input=l,t.avail_in=s,a.wrap=r,b},a.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":3,"./adler32":5,"./crc32":7,"./messages":13,"./trees":14}],9:[function(t,e,a){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],10:[function(t,e,a){"use strict";e.exports=function(t,e){var a,i,n,r,s,o,l,h,d,f,_,u,c,b,g,m,w,p,v,k,y,x,z,B,S;a=t.state,i=t.next_in,B=t.input,n=i+(t.avail_in-5),r=t.next_out,S=t.output,s=r-(e-t.avail_out),o=r+(t.avail_out-257),l=a.dmax,h=a.wsize,d=a.whave,f=a.wnext,_=a.window,u=a.hold,c=a.bits,b=a.lencode,g=a.distcode,m=(1<<a.lenbits)-1,w=(1<<a.distbits)-1;t:do{c<15&&(u+=B[i++]<<c,c+=8,u+=B[i++]<<c,c+=8),p=b[u&m];e:for(;;){if(u>>>=v=p>>>24,c-=v,0===(v=p>>>16&255))S[r++]=65535&p;else{if(!(16&v)){if(0==(64&v)){p=b[(65535&p)+(u&(1<<v)-1)];continue e}if(32&v){a.mode=12;break t}t.msg="invalid literal/length code",a.mode=30;break t}k=65535&p,(v&=15)&&(c<v&&(u+=B[i++]<<c,c+=8),k+=u&(1<<v)-1,u>>>=v,c-=v),c<15&&(u+=B[i++]<<c,c+=8,u+=B[i++]<<c,c+=8),p=g[u&w];a:for(;;){if(u>>>=v=p>>>24,c-=v,!(16&(v=p>>>16&255))){if(0==(64&v)){p=g[(65535&p)+(u&(1<<v)-1)];continue a}t.msg="invalid distance code",a.mode=30;break t}if(y=65535&p,c<(v&=15)&&(u+=B[i++]<<c,(c+=8)<v&&(u+=B[i++]<<c,c+=8)),l<(y+=u&(1<<v)-1)){t.msg="invalid distance too far back",a.mode=30;break t}if(u>>>=v,c-=v,(v=r-s)<y){if(d<(v=y-v)&&a.sane){t.msg="invalid distance too far back",a.mode=30;break t}if(z=_,(x=0)===f){if(x+=h-v,v<k){for(k-=v;S[r++]=_[x++],--v;);x=r-y,z=S}}else if(f<v){if(x+=h+f-v,(v-=f)<k){for(k-=v;S[r++]=_[x++],--v;);if(x=0,f<k){for(k-=v=f;S[r++]=_[x++],--v;);x=r-y,z=S}}}else if(x+=f-v,v<k){for(k-=v;S[r++]=_[x++],--v;);x=r-y,z=S}for(;2<k;)S[r++]=z[x++],S[r++]=z[x++],S[r++]=z[x++],k-=3;k&&(S[r++]=z[x++],1<k&&(S[r++]=z[x++]))}else{for(x=r-y;S[r++]=S[x++],S[r++]=S[x++],S[r++]=S[x++],2<(k-=3););k&&(S[r++]=S[x++],1<k&&(S[r++]=S[x++]))}break}}break}}while(i<n&&r<o);i-=k=c>>3,u&=(1<<(c-=k<<3))-1,t.next_in=i,t.next_out=r,t.avail_in=i<n?n-i+5:5-(i-n),t.avail_out=r<o?o-r+257:257-(r-o),a.hold=u,a.bits=c}},{}],11:[function(t,e,a){"use strict";var Z=t("../utils/common"),R=t("./adler32"),C=t("./crc32"),N=t("./inffast"),O=t("./inftrees"),D=1,I=2,U=0,T=-2,F=1,i=852,n=592;function L(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function r(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Z.Buf16(320),this.work=new Z.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function s(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=F,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Z.Buf32(i),e.distcode=e.distdyn=new Z.Buf32(n),e.sane=1,e.back=-1,U):T}function o(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,s(t)):T}function l(t,e){var a,i;return t&&t.state?(i=t.state,e<0?(a=0,e=-e):(a=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?T:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,o(t))):T}function h(t,e){var a,i;return t?(i=new r,(t.state=i).window=null,(a=l(t,e))!==U&&(t.state=null),a):T}var d,f,_=!0;function H(t){if(_){var e;for(d=new Z.Buf32(512),f=new Z.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(O(D,t.lens,0,288,d,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;O(I,t.lens,0,32,f,0,t.work,{bits:5}),_=!1}t.lencode=d,t.lenbits=9,t.distcode=f,t.distbits=5}function j(t,e,a,i){var n,r=t.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new Z.Buf8(r.wsize)),i>=r.wsize?(Z.arraySet(r.window,e,a-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(i<(n=r.wsize-r.wnext)&&(n=i),Z.arraySet(r.window,e,a-i,n,r.wnext),(i-=n)?(Z.arraySet(r.window,e,a-i,i,0),r.wnext=i,r.whave=r.wsize):(r.wnext+=n,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=n))),0}a.inflateReset=o,a.inflateReset2=l,a.inflateResetKeep=s,a.inflateInit=function(t){return h(t,15)},a.inflateInit2=h,a.inflate=function(t,e){var a,i,n,r,s,o,l,h,d,f,_,u,c,b,g,m,w,p,v,k,y,x,z,B,S=0,E=new Z.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return T;12===(a=t.state).mode&&(a.mode=13),s=t.next_out,n=t.output,l=t.avail_out,r=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,f=o,_=l,x=U;t:for(;;)switch(a.mode){case F:if(0===a.wrap){a.mode=13;break}for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(2&a.wrap&&35615===h){E[a.check=0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0),d=h=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=30;break}if(8!=(15&h)){t.msg="unknown compression method",a.mode=30;break}if(d-=4,y=8+(15&(h>>>=4)),0===a.wbits)a.wbits=y;else if(y>a.wbits){t.msg="invalid window size",a.mode=30;break}a.dmax=1<<y,t.adler=a.check=1,a.mode=512&h?10:12,d=h=0;break;case 2:for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(a.flags=h,8!=(255&a.flags)){t.msg="unknown compression method",a.mode=30;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=30;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0)),d=h=0,a.mode=3;case 3:for(;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,E[2]=h>>>16&255,E[3]=h>>>24&255,a.check=C(a.check,E,4,0)),d=h=0,a.mode=4;case 4:for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0)),d=h=0,a.mode=5;case 5:if(1024&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&(E[0]=255&h,E[1]=h>>>8&255,a.check=C(a.check,E,2,0)),d=h=0}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&(o<(u=a.length)&&(u=o),u&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),Z.arraySet(a.head.extra,i,r,u,y)),512&a.flags&&(a.check=C(a.check,i,u,r)),o-=u,r+=u,a.length-=u),a.length))break t;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(0===o)break t;for(u=0;y=i[r+u++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y)),y&&u<o;);if(512&a.flags&&(a.check=C(a.check,i,u,r)),o-=u,r+=u,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(0===o)break t;for(u=0;y=i[r+u++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y)),y&&u<o;);if(512&a.flags&&(a.check=C(a.check,i,u,r)),o-=u,r+=u,y)break t}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;d<16;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=30;break}d=h=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=12;break;case 10:for(;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}t.adler=a.check=L(h),d=h=0,a.mode=11;case 11:if(0===a.havedict)return t.next_out=s,t.avail_out=l,t.next_in=r,t.avail_in=o,a.hold=h,a.bits=d,2;t.adler=a.check=1,a.mode=12;case 12:if(5===e||6===e)break t;case 13:if(a.last){h>>>=7&d,d-=7&d,a.mode=27;break}for(;d<3;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}switch(a.last=1&h,d-=1,3&(h>>>=1)){case 0:a.mode=14;break;case 1:if(H(a),a.mode=20,6!==e)break;h>>>=2,d-=2;break t;case 2:a.mode=17;break;case 3:t.msg="invalid block type",a.mode=30}h>>>=2,d-=2;break;case 14:for(h>>>=7&d,d-=7&d;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=30;break}if(a.length=65535&h,d=h=0,a.mode=15,6===e)break t;case 15:a.mode=16;case 16:if(u=a.length){if(o<u&&(u=o),l<u&&(u=l),0===u)break t;Z.arraySet(n,i,r,u,s),o-=u,r+=u,l-=u,s+=u,a.length-=u;break}a.mode=12;break;case 17:for(;d<14;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,286<a.nlen||30<a.ndist){t.msg="too many length or distance symbols",a.mode=30;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;d<3;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.lens[A[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[A[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,z={bits:a.lenbits},x=O(0,a.lens,0,19,a.lencode,0,a.work,z),a.lenbits=z.bits,x){t.msg="invalid code lengths set",a.mode=30;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;m=(S=a.lencode[h&(1<<a.lenbits)-1])>>>16&255,w=65535&S,!((g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(w<16)h>>>=g,d-=g,a.lens[a.have++]=w;else{if(16===w){for(B=g+2;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(h>>>=g,d-=g,0===a.have){t.msg="invalid bit length repeat",a.mode=30;break}y=a.lens[a.have-1],u=3+(3&h),h>>>=2,d-=2}else if(17===w){for(B=g+3;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}d-=g,y=0,u=3+(7&(h>>>=g)),h>>>=3,d-=3}else{for(B=g+7;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}d-=g,y=0,u=11+(127&(h>>>=g)),h>>>=7,d-=7}if(a.have+u>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=30;break}for(;u--;)a.lens[a.have++]=y}}if(30===a.mode)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=30;break}if(a.lenbits=9,z={bits:a.lenbits},x=O(D,a.lens,0,a.nlen,a.lencode,0,a.work,z),a.lenbits=z.bits,x){t.msg="invalid literal/lengths set",a.mode=30;break}if(a.distbits=6,a.distcode=a.distdyn,z={bits:a.distbits},x=O(I,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,z),a.distbits=z.bits,x){t.msg="invalid distances set",a.mode=30;break}if(a.mode=20,6===e)break t;case 20:a.mode=21;case 21:if(6<=o&&258<=l){t.next_out=s,t.avail_out=l,t.next_in=r,t.avail_in=o,a.hold=h,a.bits=d,N(t,_),s=t.next_out,n=t.output,l=t.avail_out,r=t.next_in,i=t.input,o=t.avail_in,h=a.hold,d=a.bits,12===a.mode&&(a.back=-1);break}for(a.back=0;m=(S=a.lencode[h&(1<<a.lenbits)-1])>>>16&255,w=65535&S,!((g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(m&&0==(240&m)){for(p=g,v=m,k=w;m=(S=a.lencode[k+((h&(1<<p+v)-1)>>p)])>>>16&255,w=65535&S,!(p+(g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=g,d-=g,a.back+=g,a.length=w,0===m){a.mode=26;break}if(32&m){a.back=-1,a.mode=12;break}if(64&m){t.msg="invalid literal/length code",a.mode=30;break}a.extra=15&m,a.mode=22;case 22:if(a.extra){for(B=a.extra;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=23;case 23:for(;m=(S=a.distcode[h&(1<<a.distbits)-1])>>>16&255,w=65535&S,!((g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(0==(240&m)){for(p=g,v=m,k=w;m=(S=a.distcode[k+((h&(1<<p+v)-1)>>p)])>>>16&255,w=65535&S,!(p+(g=S>>>24)<=d);){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}h>>>=p,d-=p,a.back+=p}if(h>>>=g,d-=g,a.back+=g,64&m){t.msg="invalid distance code",a.mode=30;break}a.offset=w,a.extra=15&m,a.mode=24;case 24:if(a.extra){for(B=a.extra;d<B;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=30;break}a.mode=25;case 25:if(0===l)break t;if(u=_-l,a.offset>u){if((u=a.offset-u)>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=30;break}u>a.wnext?(u-=a.wnext,c=a.wsize-u):c=a.wnext-u,u>a.length&&(u=a.length),b=a.window}else b=n,c=s-a.offset,u=a.length;for(l<u&&(u=l),l-=u,a.length-=u;n[s++]=b[c++],--u;);0===a.length&&(a.mode=21);break;case 26:if(0===l)break t;n[s++]=a.length,l--,a.mode=21;break;case 27:if(a.wrap){for(;d<32;){if(0===o)break t;o--,h|=i[r++]<<d,d+=8}if(_-=l,t.total_out+=_,a.total+=_,_&&(t.adler=a.check=a.flags?C(a.check,n,_,s-_):R(a.check,n,_,s-_)),_=l,(a.flags?h:L(h))!==a.check){t.msg="incorrect data check",a.mode=30;break}d=h=0}a.mode=28;case 28:if(a.wrap&&a.flags){for(;d<32;){if(0===o)break t;o--,h+=i[r++]<<d,d+=8}if(h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=30;break}d=h=0}a.mode=29;case 29:x=1;break t;case 30:x=-3;break t;case 31:return-4;case 32:default:return T}return t.next_out=s,t.avail_out=l,t.next_in=r,t.avail_in=o,a.hold=h,a.bits=d,(a.wsize||_!==t.avail_out&&a.mode<30&&(a.mode<27||4!==e))&&j(t,t.output,t.next_out,_-t.avail_out)?(a.mode=31,-4):(f-=t.avail_in,_-=t.avail_out,t.total_in+=f,t.total_out+=_,a.total+=_,a.wrap&&_&&(t.adler=a.check=a.flags?C(a.check,n,_,t.next_out-_):R(a.check,n,_,t.next_out-_)),t.data_type=a.bits+(a.last?64:0)+(12===a.mode?128:0)+(20===a.mode||15===a.mode?256:0),(0===f&&0===_||4===e)&&x===U&&(x=-5),x)},a.inflateEnd=function(t){if(!t||!t.state)return T;var e=t.state;return e.window&&(e.window=null),t.state=null,U},a.inflateGetHeader=function(t,e){var a;return t&&t.state?0==(2&(a=t.state).wrap)?T:((a.head=e).done=!1,U):T},a.inflateSetDictionary=function(t,e){var a,i=e.length;return t&&t.state?0!==(a=t.state).wrap&&11!==a.mode?T:11===a.mode&&R(1,e,i,0)!==a.check?-3:j(t,e,i,i)?(a.mode=31,-4):(a.havedict=1,U):T},a.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":3,"./adler32":5,"./crc32":7,"./inffast":10,"./inftrees":12}],12:[function(t,e,a){"use strict";var D=t("../utils/common"),I=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],U=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],T=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],F=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,a,i,n,r,s,o){var l,h,d,f,_,u,c,b,g,m=o.bits,w=0,p=0,v=0,k=0,y=0,x=0,z=0,B=0,S=0,E=0,A=null,Z=0,R=new D.Buf16(16),C=new D.Buf16(16),N=null,O=0;for(w=0;w<=15;w++)R[w]=0;for(p=0;p<i;p++)R[e[a+p]]++;for(y=m,k=15;1<=k&&0===R[k];k--);if(k<y&&(y=k),0===k)return n[r++]=20971520,n[r++]=20971520,o.bits=1,0;for(v=1;v<k&&0===R[v];v++);for(y<v&&(y=v),w=B=1;w<=15;w++)if(B<<=1,(B-=R[w])<0)return-1;if(0<B&&(0===t||1!==k))return-1;for(C[1]=0,w=1;w<15;w++)C[w+1]=C[w]+R[w];for(p=0;p<i;p++)0!==e[a+p]&&(s[C[e[a+p]]++]=p);if(0===t?(A=N=s,u=19):1===t?(A=I,Z-=257,N=U,O-=257,u=256):(A=T,N=F,u=-1),w=v,_=r,z=p=E=0,d=-1,f=(S=1<<(x=y))-1,1===t&&852<S||2===t&&592<S)return 1;for(;;){for(c=w-z,s[p]<u?(b=0,g=s[p]):s[p]>u?(b=N[O+s[p]],g=A[Z+s[p]]):(b=96,g=0),l=1<<w-z,v=h=1<<x;n[_+(E>>z)+(h-=l)]=c<<24|b<<16|g|0,0!==h;);for(l=1<<w-1;E&l;)l>>=1;if(0!==l?(E&=l-1,E+=l):E=0,p++,0==--R[w]){if(w===k)break;w=e[a+s[p]]}if(y<w&&(E&f)!==d){for(0===z&&(z=y),_+=v,B=1<<(x=w-z);x+z<k&&!((B-=R[x+z])<=0);)x++,B<<=1;if(S+=1<<x,1===t&&852<S||2===t&&592<S)return 1;n[d=E&f]=y<<24|x<<16|_-r|0}}return 0!==E&&(n[_+E]=w-z<<24|64<<16|0),o.bits=y,0}},{"../utils/common":3}],13:[function(t,e,a){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],14:[function(t,e,a){"use strict";var l=t("../utils/common"),o=0,h=1;function i(t){for(var e=t.length;0<=--e;)t[e]=0}var d=0,s=29,f=256,_=f+1+s,u=30,c=19,g=2*_+1,m=15,n=16,b=7,w=256,p=16,v=17,k=18,y=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],x=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],z=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],S=new Array(2*(_+2));i(S);var E=new Array(2*u);i(E);var A=new Array(512);i(A);var Z=new Array(256);i(Z);var R=new Array(s);i(R);var C,N,O,D=new Array(u);function I(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}function r(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function U(t){return t<256?A[t]:A[256+(t>>>7)]}function T(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function F(t,e,a){t.bi_valid>n-a?(t.bi_buf|=e<<t.bi_valid&65535,T(t,t.bi_buf),t.bi_buf=e>>n-t.bi_valid,t.bi_valid+=a-n):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)}function L(t,e,a){F(t,a[2*e],a[2*e+1])}function H(t,e){for(var a=0;a|=1&t,t>>>=1,a<<=1,0<--e;);return a>>>1}function j(t,e,a){var i,n,r=new Array(m+1),s=0;for(i=1;i<=m;i++)r[i]=s=s+a[i-1]<<1;for(n=0;n<=e;n++){var o=t[2*n+1];0!==o&&(t[2*n]=H(r[o]++,o))}}function K(t){var e;for(e=0;e<_;e++)t.dyn_ltree[2*e]=0;for(e=0;e<u;e++)t.dyn_dtree[2*e]=0;for(e=0;e<c;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*w]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?T(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function P(t,e,a,i){var n=2*e,r=2*a;return t[n]<t[r]||t[n]===t[r]&&i[e]<=i[a]}function Y(t,e,a){for(var i=t.heap[a],n=a<<1;n<=t.heap_len&&(n<t.heap_len&&P(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!P(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i}function q(t,e,a){var i,n,r,s,o=0;if(0!==t.last_lit)for(;i=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],n=t.pending_buf[t.l_buf+o],o++,0===i?L(t,n,e):(L(t,(r=Z[n])+f+1,e),0!==(s=y[r])&&F(t,n-=R[r],s),L(t,r=U(--i),a),0!==(s=x[r])&&F(t,i-=D[r],s)),o<t.last_lit;);L(t,w,e)}function G(t,e){var a,i,n,r=e.dyn_tree,s=e.stat_desc.static_tree,o=e.stat_desc.has_stree,l=e.stat_desc.elems,h=-1;for(t.heap_len=0,t.heap_max=g,a=0;a<l;a++)0!==r[2*a]?(t.heap[++t.heap_len]=h=a,t.depth[a]=0):r[2*a+1]=0;for(;t.heap_len<2;)r[2*(n=t.heap[++t.heap_len]=h<2?++h:0)]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=s[2*n+1]);for(e.max_code=h,a=t.heap_len>>1;1<=a;a--)Y(t,r,a);for(n=l;a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],Y(t,r,1),i=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=i,r[2*n]=r[2*a]+r[2*i],t.depth[n]=(t.depth[a]>=t.depth[i]?t.depth[a]:t.depth[i])+1,r[2*a+1]=r[2*i+1]=n,t.heap[1]=n++,Y(t,r,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var a,i,n,r,s,o,l=e.dyn_tree,h=e.max_code,d=e.stat_desc.static_tree,f=e.stat_desc.has_stree,_=e.stat_desc.extra_bits,u=e.stat_desc.extra_base,c=e.stat_desc.max_length,b=0;for(r=0;r<=m;r++)t.bl_count[r]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;a<g;a++)c<(r=l[2*l[2*(i=t.heap[a])+1]+1]+1)&&(r=c,b++),l[2*i+1]=r,h<i||(t.bl_count[r]++,s=0,u<=i&&(s=_[i-u]),o=l[2*i],t.opt_len+=o*(r+s),f&&(t.static_len+=o*(d[2*i+1]+s)));if(0!==b){do{for(r=c-1;0===t.bl_count[r];)r--;t.bl_count[r]--,t.bl_count[r+1]+=2,t.bl_count[c]--,b-=2}while(0<b);for(r=c;0!==r;r--)for(i=t.bl_count[r];0!==i;)h<(n=t.heap[--a])||(l[2*n+1]!==r&&(t.opt_len+=(r-l[2*n+1])*l[2*n],l[2*n+1]=r),i--)}}(t,e),j(r,h,t.bl_count)}function X(t,e,a){var i,n,r=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=s,s=e[2*(i+1)+1],++o<l&&n===s||(o<h?t.bl_tree[2*n]+=o:0!==n?(n!==r&&t.bl_tree[2*n]++,t.bl_tree[2*p]++):o<=10?t.bl_tree[2*v]++:t.bl_tree[2*k]++,r=n,(o=0)===s?(l=138,h=3):n===s?(l=6,h=3):(l=7,h=4))}function W(t,e,a){var i,n,r=-1,s=e[1],o=0,l=7,h=4;for(0===s&&(l=138,h=3),i=0;i<=a;i++)if(n=s,s=e[2*(i+1)+1],!(++o<l&&n===s)){if(o<h)for(;L(t,n,t.bl_tree),0!=--o;);else 0!==n?(n!==r&&(L(t,n,t.bl_tree),o--),L(t,p,t.bl_tree),F(t,o-3,2)):o<=10?(L(t,v,t.bl_tree),F(t,o-3,3)):(L(t,k,t.bl_tree),F(t,o-11,7));r=n,(o=0)===s?(l=138,h=3):n===s?(l=6,h=3):(l=7,h=4)}}i(D);var J=!1;function Q(t,e,a,i){var n,r,s,o;F(t,(d<<1)+(i?1:0),3),r=e,s=a,o=!0,M(n=t),o&&(T(n,s),T(n,~s)),l.arraySet(n.pending_buf,n.window,r,s,n.pending),n.pending+=s}a._tr_init=function(t){J||(function(){var t,e,a,i,n,r=new Array(m+1);for(i=a=0;i<s-1;i++)for(R[i]=a,t=0;t<1<<y[i];t++)Z[a++]=i;for(Z[a-1]=i,i=n=0;i<16;i++)for(D[i]=n,t=0;t<1<<x[i];t++)A[n++]=i;for(n>>=7;i<u;i++)for(D[i]=n<<7,t=0;t<1<<x[i]-7;t++)A[256+n++]=i;for(e=0;e<=m;e++)r[e]=0;for(t=0;t<=143;)S[2*t+1]=8,t++,r[8]++;for(;t<=255;)S[2*t+1]=9,t++,r[9]++;for(;t<=279;)S[2*t+1]=7,t++,r[7]++;for(;t<=287;)S[2*t+1]=8,t++,r[8]++;for(j(S,_+1,r),t=0;t<u;t++)E[2*t+1]=5,E[2*t]=H(t,5);C=new I(S,y,f+1,_,m),N=new I(E,x,0,u,m),O=new I(new Array(0),z,0,c,b)}(),J=!0),t.l_desc=new r(t.dyn_ltree,C),t.d_desc=new r(t.dyn_dtree,N),t.bl_desc=new r(t.bl_tree,O),t.bi_buf=0,t.bi_valid=0,K(t)},a._tr_stored_block=Q,a._tr_flush_block=function(t,e,a,i){var n,r,s=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return o;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return h;for(e=32;e<f;e++)if(0!==t.dyn_ltree[2*e])return h;return o}(t)),G(t,t.l_desc),G(t,t.d_desc),s=function(t){var e;for(X(t,t.dyn_ltree,t.l_desc.max_code),X(t,t.dyn_dtree,t.d_desc.max_code),G(t,t.bl_desc),e=c-1;3<=e&&0===t.bl_tree[2*B[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),n=t.opt_len+3+7>>>3,(r=t.static_len+3+7>>>3)<=n&&(n=r)):n=r=a+5,a+4<=n&&-1!==e?Q(t,e,a,i):4===t.strategy||r===n?(F(t,2+(i?1:0),3),q(t,S,E)):(F(t,4+(i?1:0),3),function(t,e,a,i){var n;for(F(t,e-257,5),F(t,a-1,5),F(t,i-4,4),n=0;n<i;n++)F(t,t.bl_tree[2*B[n]+1],3);W(t,t.dyn_ltree,e-1),W(t,t.dyn_dtree,a-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,s+1),q(t,t.dyn_ltree,t.dyn_dtree)),K(t),i&&M(t)},a._tr_tally=function(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(Z[a]+f+1)]++,t.dyn_dtree[2*U(e)]++),t.last_lit===t.lit_bufsize-1},a._tr_align=function(t){var e;F(t,2,3),L(t,w,S),16===(e=t).bi_valid?(T(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}},{"../utils/common":3}],15:[function(t,e,a){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],"/":[function(t,e,a){"use strict";var i={};(0,t("./lib/utils/common").assign)(i,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=i},{"./lib/deflate":1,"./lib/inflate":2,"./lib/utils/common":3,"./lib/zlib/constants":6}]},{},[])("/")});
// End Pako
//app.Script("/data/user/0/com.smartphoneremote.androidscriptfree/app_Plugins/utils/Html/Pako.js");


app.CreateUtils = function() {
	return app.CreateObject( "\u0055\u0074\u0069\u006c\u0073" );
}

function Utils() {
var self = this;
self.Color = function(){return _utils.Color();};/*{
 "keys": [ "RED", "PINK", "PURPLE", "DEEP_PURPLE", "INDIGO", "BLUE", "LIGHT_BLUE", "CYAN", "TEAL", "GREEN", "LIGHT_GREEN", "LIME", "YELLOW", "AMBER", "ORANGE", "DEEP_ORANGE", "BROWN", "GREY", "BLUE_GREY", "BLACK", "WHITE", "TRANS" ],
 "mask": [ "LIGHT_1", "LIGHT_2", "LIGHT_3", "LIGHT_4", "LIGHT_5", "DARK_1", "DARK_2", "DARK_3", "DARK_4", "ACCENT_1", "ACCENT_2", "ACCENT_3", "ACCENT_4" ],
 "mask_white": [ "DARK_1", "DARK_2", "DARK_3", "DARK_4" ],
 "mask_black": [ "LIGHT_1", "LIGHT_2", "LIGHT_3", "LIGHT_4", "LIGHT_5", "ACCENT_1", "ACCENT_2", "ACCENT_3", "ACCENT_4" ],
 "LIGHT_GREEN_ACCENT_4": "#64dd17",
 "TEAL_ACCENT_4": "#00bfa5",
 "TEAL_ACCENT_3": "#1de9b6",
 "TEAL_ACCENT_2": "#64ffda",
 "TEAL_ACCENT_1": "#a7ffeb",
 "LIGHT_GREEN_ACCENT_3": "#76ff03",
 "GREY_LIGHT_2": "#e0e0e0",
 "DEEP_ORANGE_DARK_4": "#bf360c",
 "INDIGO_LIGHT_5": "#e8eaf6",
 "INDIGO_LIGHT_4": "#c5cae9",
 "INDIGO_LIGHT_3": "#9fa8da",
 "INDIGO_LIGHT_2": "#7986cb",
 "INDIGO_LIGHT_1": "#5c6bc0",
 "GREY_LIGHT_5": "#fafafa",
 "BLUE_GREY_LIGHT_4": "#cfd8dc",
 "BLUE_GREY_LIGHT_5": "#eceff1",
 "BLUE_GREY_LIGHT_2": "#90a4ae",
 "BLUE_GREY_LIGHT_3": "#b0bec5",
 "DEEP_ORANGE_LIGHT_2": "#ff8a65",
 "DEEP_ORANGE_LIGHT_1": "#ff7043",
 "LIGHT_GREEN_ACCENT_1": "#ccff90",
 "TEAL_DARK_4": "#004d40",
 "DEEP_ORANGE_DARK_2": "#e64a19",
 "TEAL_DARK_1": "#00897b",
 "TEAL_DARK_2": "#00796b",
 "TEAL_DARK_3": "#00695c",
 "RED_LIGHT_5": "#FFEBEE",
 "RED_LIGHT_4": "#FFCDD2",
 "CYAN_LIGHT_4": "#b2ebf2",
 "CYAN_LIGHT_5": "#e0f7fa",
 "RED_LIGHT_1": "#EF5350",
 "CYAN_LIGHT_3": "#80deea",
 "RED_LIGHT_3": "#EF9A9A",
 "RED_LIGHT_2": "#E57373",
 "INDIGO_ACCENT_4": "#304ffe",
 "CYAN_ACCENT_4": "#00b8d4",
 "RED_ACCENT_4": "#D50000",
 "RED_ACCENT_3": "#FF1744",
 "RED_ACCENT_2": "#FF5252",
 "INDIGO_ACCENT_3": "#3d5afe",
 "INDIGO_ACCENT_2": "#536dfe",
 "DEEP_ORANGE_LIGHT_4": "#ffccbc",
 "BLUE_DARK_4": "#0D47A1",
 "GREY_LIGHT_1": "#bdbdbd",
 "BLUE_DARK_2": "#1976D2",
 "BLUE_DARK_3": "#1565C0",
 "BLUE_DARK_1": "#1E88E5",
 "GREY_DARK_1": "#757575",
 "GREY_DARK_3": "#424242",
 "BLUE_GREY_DARK_2": "#455a64",
 "GREY_DARK_4": "#212121",
 "LIGHT_GREEN_DARK_3": "#558b2f",
 "LIGHT_GREEN_DARK_2": "#689f38",
 "LIGHT_GREEN_DARK_1": "#7cb342",
 "GREY_LIGHT_4": "#f5f5f5",
 "LIGHT_GREEN_DARK_4": "#33691e",
 "PURPLE_ACCENT_1": "#ea80fc",
 "PURPLE_ACCENT_3": "#d500f9",
 "PURPLE_ACCENT_2": "#e040fb",
 "PURPLE_ACCENT_4": "#aa00ff",
 "RED_DARK_4": "#B71C1C",
 "LIGHT_BLUE": "#03a9f4",
 "LIME_DARK_1": "#c0ca33",
 "GREEN_DARK_1": "#43A047",
 "CYAN_DARK_1": "#00acc1",
 "RED_DARK_1": "#E53935",
 "RED_DARK_2": "#D32F2F",
 "RED_DARK_3": "#C62828",
 "ORANGE_DARK_2": "#f57c00",
 "CYAN_LIGHT_1": "#26c6da",
 "PINK_LIGHT_5": "#fce4ec",
 "PINK_LIGHT_4": "#f8bbd0",
 "PINK_LIGHT_3": "#f48fb1",
 "PINK_LIGHT_2": "#f06292",
 "PINK_LIGHT_1": "#ec407a",
 "TEAL_LIGHT_3": "#80cbc4",
 "BROWN_DARK_4": "#3e2723",
 "INDIGO": "#3f51b5",
 "BROWN_DARK_3": "#4e342e",
 "BROWN_DARK_2": "#5d4037",
 "PINK_ACCENT_1": "#ff80ab",
 "LIGHT_BLUE_DARK_4": "#01579b",
 "PINK_ACCENT_3": "#f50057",
 "PINK_ACCENT_2": "#ff4081",
 "LIGHT_BLUE_DARK_1": "#039be5",
 "PINK_ACCENT_4": "#c51162",
 "LIGHT_BLUE_DARK_3": "#0277bd",
 "LIGHT_BLUE_DARK_2": "#0288d1",
 "DEEP_ORANGE": "#ff5722",
 "INDIGO_DARK_4": "#1a237e",
 "INDIGO_DARK_2": "#303f9f",
 "INDIGO_DARK_3": "#283593",
 "INDIGO_DARK_1": "#3949ab",
 "TEAL_LIGHT_5": "#e0f2f1",
 "TEAL_LIGHT_4": "#b2dfdb",
 "DEEP_PURPLE": "#673ab7",
 "GREEN_DARK_2": "#388E3C",
 "BROWN_DARK_1": "#6d4c41",
 "CYAN_DARK_4": "#006064",
 "DEEP_PURPLE_LIGHT_3": "#b39ddb",
 "DEEP_PURPLE_LIGHT_2": "#9575cd",
 "DEEP_PURPLE_LIGHT_1": "#7e57c2",
 "BLUE_GREY_DARK_1": "#546e7a",
 "LIGHT_BLUE_ACCENT_4": "#0091ea",
 "DEEP_PURPLE_LIGHT_5": "#ede7f6",
 "DEEP_PURPLE_LIGHT_4": "#d1c4e9",
 "YELLOW_LIGHT_5": "#fffde7",
 "YELLOW_LIGHT_4": "#fff9c4",
 "YELLOW_LIGHT_1": "#ffee58",
 "TRANS": "#00ffffff",
 "YELLOW_LIGHT_3": "#fff59d",
 "YELLOW_LIGHT_2": "#fff176",
 "GREEN_ACCENT_1": "#B9F6CA",
 "CYAN_DARK_3": "#00838f",
 "BROWN": "#795548",
 "CYAN_DARK_2": "#0097a7",
 "GREEN_ACCENT_3": "#00E676",
 "CYAN_ACCENT_2": "#18ffff",
 "YELLOW_DARK_1": "#fdd835",
 "YELLOW_DARK_2": "#fbc02d",
 "YELLOW_DARK_3": "#f9a825",
 "YELLOW_DARK_4": "#f57f17",
 "ORANGE_DARK_3": "#ef6c00",
 "LIME": "#cddc39",
 "ORANGE_DARK_1": "#fb8c00",
 "BLUE_GREY_DARK_4": "#263238",
 "ORANGE_LIGHT_2": "#ffb74d",
 "GREY_LIGHT_3": "#eeeeee",
 "ORANGE_DARK_4": "#e65100",
 "AMBER_DARK_4": "#ff6f00",
 "AMBER_DARK_2": "#ffa000",
 "AMBER_DARK_3": "#ff8f00",
 "AMBER_DARK_1": "#ffb300",
 "BLUE_ACCENT_1": "#82B1FF",
 "CYAN_LIGHT_2": "#4dd0e1",
 "BLUE_ACCENT_3": "#2979FF",
 "BLUE_ACCENT_2": "#448AFF",
 "BLUE_ACCENT_4": "#2962FF",
 "GREY": "#9e9e9e",
 "LIGHT_BLUE_ACCENT_2": "#40c4ff",
 "LIGHT_BLUE_ACCENT_3": "#00b0ff",
 "LIGHT_BLUE_ACCENT_1": "#80d8ff",
 "RED": "#F44336",
 "GREEN_LIGHT_3": "#A5D6A7",
 "GREEN_LIGHT_2": "#81C784",
 "GREEN_LIGHT_1": "#66BB6A",
 "GREEN_ACCENT_2": "#69F0AE",
 "GREEN_ACCENT_4": "#00C853",
 "GREEN_LIGHT_5": "#E8F5E9",
 "GREEN_LIGHT_4": "#C8E6C9",
 "CYAN_ACCENT_1": "#84ffff",
 "LIGHT_GREEN": "#8bc34a",
 "ORANGE_ACCENT_1": "#ffd180",
 "ORANGE": "#ff9800",
 "INDIGO_ACCENT_1": "#8c9eff",
 "BROWN_LIGHT_4": "#d7ccc8",
 "BROWN_LIGHT_5": "#efebe9",
 "BROWN_LIGHT_2": "#a1887f",
 "ORANGE_ACCENT_3": "#ff9100",
 "CYAN_ACCENT_3": "#00e5ff",
 "LIME_ACCENT_4": "#aeea00",
 "ORANGE_ACCENT_2": "#ffab40",
 "RED_ACCENT_1": "#FF8A80",
 "LIME_DARK_2": "#afb42b",
 "PURPLE_DARK_2": "#7b1fa2",
 "PURPLE_DARK_3": "#6a1b9a",
 "PURPLE_DARK_1": "#8e24aa",
 "PURPLE_DARK_4": "#4a148c",
 "ORANGE_ACCENT_4": "#ff6d00",
 "YELLOW": "#ffeb3b",
 "DEEP_ORANGE_LIGHT_3": "#ffab91",
 "LIME_LIGHT_1": "#d4e157",
 "LIME_LIGHT_2": "#dce775",
 "LIME_LIGHT_3": "#e6ee9c",
 "LIME_LIGHT_4": "#f0f4c3",
 "LIME_LIGHT_5": "#f9fbe7",
 "DEEP_ORANGE_LIGHT_5": "#fbe9e7",
 "AMBER_LIGHT_2": "#ffd54f",
 "BLUE": "#2196F3",
 "LIGHT_GREEN_LIGHT_1": "#9ccc65",
 "AMBER_LIGHT_1": "#ffca28",
 "LIME_DARK_4": "#827717",
 "BROWN_LIGHT_3": "#bcaaa4",
 "DEEP_ORANGE_ACCENT_4": "#dd2c00",
 "DEEP_ORANGE_DARK_3": "#d84315",
 "DEEP_ORANGE_ACCENT_1": "#ff9e80",
 "DEEP_ORANGE_ACCENT_3": "#ff3d00",
 "DEEP_ORANGE_ACCENT_2": "#ff6e40",
 "BLACK": "#000000",
 "BROWN_LIGHT_1": "#8d6e63",
 "BLUE_GREY_DARK_3": "#37474f",
 "GREEN_DARK_3": "#2E7D32",
 "ORANGE_LIGHT_5": "#fff3e0",
 "DEEP_PURPLE_ACCENT_4": "#6200ea",
 "LIGHT_GREEN_ACCENT_2": "#b2ff59",
 "DEEP_PURPLE_ACCENT_1": "#b388ff",
 "DEEP_PURPLE_ACCENT_3": "#651fff",
 "DEEP_PURPLE_ACCENT_2": "#7c4dff",
 "GREEN": "#4CAF50",
 "LIGHT_BLUE_LIGHT_2": "#4fc3f7",
 "LIGHT_BLUE_LIGHT_3": "#81d4fa",
 "ORANGE_LIGHT_1": "#ffa726",
 "LIGHT_BLUE_LIGHT_1": "#29b6f6",
 "LIGHT_BLUE_LIGHT_4": "#b3e5fc",
 "LIGHT_BLUE_LIGHT_5": "#e1f5fe",
 "PURPLE": "#9c27b0",
 "LIGHT_GREEN_LIGHT_2": "#aed581",
 "DEEP_ORANGE_DARK_1": "#f4511e",
 "BLUE_GREY_LIGHT_1": "#78909c",
 "GREY_DARK_2": "#616161",
 "LIME_DARK_3": "#9e9d24",
 "TEAL": "#009688",
 "DEEP_PURPLE_DARK_2": "#512da8",
 "DEEP_PURPLE_DARK_3": "#4527a0",
 "DEEP_PURPLE_DARK_1": "#5e35b1",
 "CYAN": "#00bcd4",
 "GREEN_DARK_4": "#1B5E20",
 "DEEP_PURPLE_DARK_4": "#311b92",
 "TEAL_LIGHT_1": "#26a69a",
 "ORANGE_LIGHT_3": "#ffcc80",
 "PINK_DARK_4": "#880e4f",
 "TEAL_LIGHT_2": "#4db6ac",
 "PINK_DARK_2": "#c2185b",
 "PINK_DARK_3": "#ad1457",
 "PINK_DARK_1": "#d81b60",
 "YELLOW_ACCENT_4": "#ffd600",
 "YELLOW_ACCENT_3": "#ffea00",
 "YELLOW_ACCENT_2": "#ffff00",
 "YELLOW_ACCENT_1": "#ffff8d",
 "AMBER": "#ffc107",
 "WHITE": "#FFFFFF",
 "PINK": "#e91e63",
 "AMBER_LIGHT_5": "#fff8e1",
 "AMBER_LIGHT_4": "#ffecb3",
 "AMBER_LIGHT_3": "#ffe082",
 "LIME_ACCENT_1": "#f4ff81",
 "LIME_ACCENT_2": "#eeff41",
 "LIME_ACCENT_3": "#c6ff00",
 "AMBER_ACCENT_4": "#ffab00",
 "ORANGE_LIGHT_4": "#ffe0b2",
 "AMBER_ACCENT_1": "#ffe57f",
 "AMBER_ACCENT_3": "#ffc400",
 "AMBER_ACCENT_2": "#ffd740",
 "PURPLE_LIGHT_3": "#ce93d8",
 "PURPLE_LIGHT_2": "#ba68c8",
 "PURPLE_LIGHT_1": "#ab47bc",
 "LIGHT_GREEN_LIGHT_3": "#c5e1a5",
 "LIGHT_GREEN_LIGHT_4": "#dcedc8",
 "LIGHT_GREEN_LIGHT_5": "#f1f8e9",
 "PURPLE_LIGHT_5": "#f3e5f5",
 "PURPLE_LIGHT_4": "#e1bee7",
 "BLUE_LIGHT_5": "#E3F2FD",
 "BLUE_LIGHT_4": "#BBDEFB",
 "BLUE_LIGHT_3": "#90CAF9",
 "BLUE_LIGHT_2": "#64B5F6",
 "BLUE_LIGHT_1": "#42A5F5",
 "BLUE_GREY": "#607d8b",
 "BLACK": "#000000",
 "WHITE": "#ffffff"
};
*/


/*
	+ Get Random Color
	- mask:
	- Values:
	- For white text: White
	- For black text: Black
*/
self.GetRandomColor = function( mask ) { return _utils.GetRandomColor(mask);};
	/*var size, msk, msksize, num, numsk, randclr, randmsk, find;
	do {
	    size = Color.keys.length-3;
	    msk = Color["mask"+(mask?"_"+mask:"")];
	    msksize = msk.length;
	    num = Math.floor(Math.random()*size);
	    numsk = Math.floor(Math.random()*msksize);
	    randclr = Color.keys[num]; 
	    randmsk = msk[numsk];
	    find = Color[randclr+(randmsk?"_"+randmsk:"")];
	} while( !find );
	return find;
};*/
self.Animations = ["NewsPaper","Jelly","Flash","RubberBand","ShakeHorizontal","ShakeVertical","Swing","TaDa","Bounce","BounceLeft","BounceTop","BounceRight","BounceBottom","Fadein","FadeOut","Fall","FallRotate","FlipFromVerticalSwing","FlipFromHorizontal","FlipFromBottom","FlipFromVertical","FlipFromHorizontalSwing","FlipFromTop","FlipFromRight","FlipFromLeft","FlipToHorizontal","FlipToVertical","SlideFromLeft","SlideFromTop","SlideFromRight","SlideFromBottom","SlideToLeft","SlideToTop","SlideToRight","SlideToBottom","ZoominEnter","ZoominExit","ZoominLeft","ZoominTop","ZoominRight","ZoominBottom","ZoomOutExit","ZoomOutLeft","ZoomOutTop","ZoomOutRight","ZoomOutBottom"];
self.LastNames = ["Abbott","Abbott-Beahan","Abernathy","Abernathy-Schmidt","Abshire","Adams","Altenwerth","Anderson","Ankunding","Armstrong","Auer","Aufderhar","Bahringer","Bailey","Balistreri","Barrows","Bartell","Bartell-Prosacco","Bartoletti","Barton","Bashirian","Bashirian-Miller","Batz","Batz-Auer","Bauch","Baumbach","Bayer","Beahan","Beahan-Wiegand","Beatty","Beatty-Parisian","Bechtelar","Bechtelar-Osinski","Becker","Bednar","Beer","Beier","Berge","Bergnaum","Bergstrom","Bergstrom-Doyle","Bernhard","Bernier","Bins","Blanda","Blick","Block","Bode","Bode-Anderson","Boehm","Boehm-Greenfelder","Bogan","Bogisich","Borer","Bosco","Botsford","Boyer","Boyle","Bradtke","Brakus","Braun","Breitenberg","Brekke","Brown","Bruen","Bruen-Dickens","Buckridge","Buckridge-Huels","Buckridge-Rosenbaum","Carroll","Carroll-Gottlieb","Carroll-Gutkowski","Carroll-Skiles","Carter","Cartwright","Casper","Casper-Moore","Cassin","Champlin","Christiansen","Christiansen-Rutherford","Christiansen-Schowalter","Cole","Collier","Collins","Conn","Connelly","Connelly-Gleason","Conroy","Conroy-Mosciski","Considine","Considine-Heller","Corkery","Corkery-Reichel","Cormier","Corwin","Cremin","Crist","Crona","Cronin","Crooks","Crooks-Bechtelar","Cruickshank","Cummerata","Cummings","Cummings-Jacobson","D'Amore","D'Amore-Dicki","Dach","Daniel","Dare","Dare-Heller","Daugherty","Davis","Davis-Stark","Deckow","Denesik","Dibbert","Dickens","Dickens-Ferry","Dickens-Gutkowski","Dickens-Hermann","Dicki","Dicki-Friesen","Dickinson","Dietrich","Donnelly","Dooley","Douglas","Doyle","Doyle-Farrell","DuBuque","DuBuque-Shanahan","Durgan","Ebert","Effertz","Emard","Emmerich","Emmerich-Mante","Erdman","Erdman-Zieme","Ernser","Ernser-Friesen","Fadel","Fahey","Fahey-Donnelly","Farrell","Fay","Feeney","Feest","Feil","Ferry","Fisher","Flatley","Flatley-McGlynn","Flatley-Ruecker","Frami","Franecki","Franey","Franey-Oberbrunner","Friesen","Friesen-Gusikowski","Fritsch","Funk","Gerhold","Gerhold-Jerde","Gerlach","Gibson","Gislason","Gleason","Gleichner","Glover","Goldner","Goldner-Collier","Goodwin","Gorczany","Gorczany-Feil","Gottlieb","Goyette","Goyette-McClure","Grady","Graham","Graham-Herzog","Grant","Green","Green-Kihn","Greenfelder","Greenfelder-Quitzon","Greenholt","Greenholt-Shanahan","Grimes","Grimes-Hamill","Gulgowski","Gusikowski","Gutkowski","Gutkowski-Torphy","Gutmann","Haag","Hackett","Hagenes","Hagenes-Bahringer","Hagenes-Sporer","Hahn","Hahn-Stracke","Haley","Halvorson","Halvorson-Rempel","Hamill","Hamill-Homenick","Hammes","Hand","Hane","Hane-Jakubowski","Hansen","Harber","Harber-Walker","Harris","Hartmann","Harvey","Hauck","Hayes","Heaney","Heathcote","Hegmann","Hegmann-Bode","Hegmann-Schaefer","Heidenreich","Heller","Herman","Hermann","Hermiston","Hermiston-Lemke","Herzog","Hessel","Hessel-Monahan","Hettinger","Hickle","Hilll","Hills","Hills-Pfeffer","Hilpert","Hintz","Hintz-Rath","Hirthe","Hirthe-Hahn","Hodkiewicz","Hoeger","Hoeger-Beahan","Homenick","Homenick-Sipes","Hoppe","Howe","Howe-Bashirian","Howell","Hudson","Hudson-Mante","Hudson-Stroman","Huel","Huels","Hyatt","Jacobi","Jacobs","Jacobson","Jakubowski","Jakubowski-Ernser","Jaskolski","Jaskolski-Wisozk","Jast","Jenkins","Jerde","Johns","Johns-Reilly","Johnson","Johnston","Jones","Jones-Osinski","Kassulke","Kassulke-Hammes","Kautzer","Kautzer-Collier","Keebler","Keeling","Keeling-Wuckert","Kemmer","Kerluke","Kerluke-O'Reilly","Kertzmann","Kessler","Kiehn","Kihn","Kilback","Kilback-Legros","King","Kirlin","Klein","Klein-Langosh","Kling","Klocko","Klocko-Hessel","Koch","Koelpin","Koepp","Kohler","Kohler-Schumm","Konopelski","Konopelski-Grady","Koss","Kovacek","Kozey","Kozey-Gerlach","Krajcik","Kreiger","Kreiger-Hickle","Kris","Kris-Pouros","Kshlerin","Kub","Kuhic","Kuhlman","Kuhn","Kulas","Kunde","Kunze","Kuphal","Kuphal-Bashirian","Kuphal-O'Hara","Kutch","Kutch-Quitzon","Kuvalis","Labadie","Labadie-Hintz","Lakin","Lakin-Ziemann","Lang","Langosh","Langworth","Larkin","Larkin-Schinner","Larkin-Schulist","Larson","Leannon","Lebsack","Ledner","Leffler","Legros","Lehner","Lehner-Mertz","Lehner-Tromp","Lemke","Lesch","Leuschke","Lind","Lindgren","Littel","Little","Lockman","Lockman-Rutherford","Lockman-Wintheiser","Lowe","Lowe-Mitchell","Lubowitz","Lueilwitz","Luettgen","Lynch","MacGyver","Macejkovic","Maggio","Maggio-Blick","Maggio-Wisozk","Mann","Mante","Mante-O'Reilly","Marks","Marks-Torp","Marquardt","Marvin","Mayer","Mayert","McClure","McCullough","McCullough-Kreiger","McDermott","McGlynn","McGlynn-Parisian","McKenzie","McLaughlin","McLaughlin-Windler","Medhurst","Mertz","Mertz-Green","Metz","Miller","Mills","Mitchell","Mitchell-Bauch","Mitchell-Langworth","Mitchell-Leffler","Moen","Mohr","Mohr-Muller","Monahan","Monahan-Morar","Moore","Moore-Schinner","Morar","Morar-Littel","Morissette","Mosciski","Mosciski-Mante","Mraz","Mueller","Muller","Murazik","Murphy","Murray","Nader","Nicolas","Nienow","Nienow-Torphy","Nikolaus","Nitzsche","Nolan","Nolan-Klocko","O'Connell","O'Conner","O'Hara","O'Keefe","O'Kon","O'Kon-Kerluke","O'Reilly","Oberbrunner","Oberbrunner-Kihn","Okuneva","Olson","Ondricka","Orn","Orn-Dicki","Ortiz","Osinski","Osinski-Koepp","Pacocha","Pacocha-Cummerata","Padberg","Pagac","Pagac-D'Amore","Parisian","Parker","Parker-Borer","Paucek","Paucek-Batz","Paucek-Sipes","Pfannerstill","Pfannerstill-Connelly","Pfeffer","Pfeffer-Wuckert","Pollich","Pouros","Pouros-Rogahn","Powlowski","Powlowski-Kirlin","Predovic","Price","Prohaska","Prosacco","Purdy","Purdy-Dibbert","Purdy-Hand","Quigley","Quitzon","Rath","Rath-Abernathy","Rath-Roob","Ratke","Rau","Raynor","Reichel","Reichert","Reichert-Morar","Reilly","Reinger","Rempel-Mante","Rempel-Torp","Renner","Renner-Ernser","Reynolds","Reynolds-Haag","Rice","Rice-Ritchie","Rippin","Ritchie","Ritchie-Hermann","Robel","Robel-Buckridge","Robel-Reichert","Roberts","Rodriguez","Rogahn","Rohan","Rohan-Mertz","Rolfson","Rolfson-Crist","Romaguera","Roob","Rosenbaum","Rosenbaum-Jenkins","Rowe","Ruecker","Runolfsdottir","Runolfsson","Runte","Russel","Rutherford","Ryan","Ryan-Marks","Sanford","Sanford-Cummerata","Satterfield","Satterfield-Haley","Sauer","Sawayn","Schaden","Schaden-Swift","Schaefer","Schaefer-Stokes","Schamberger","Schiller","Schiller-Yost","Schimmel","Schimmel-Sawayn","Schinner","Schmeler","Schmidt","Schmitt","Schneider","Schneider-Rippin","Schoen","Schoen-Hayes","Schoen-Jerde","Schoen-Mitchell","Schowalter","Schroeder","Schroeder-Strosin","Schulist","Schultz","Schumm","Schuppe","Schuster","Schuster-Schroeder","Senger","Senger-Kirlin","Shanahan","Shields","Shields-Champlin","Simonis","Sipes","Skiles","Smith","Smitham","Spencer","Spinka","Sporer","Sporer-Lakin","Stamm","Stanton","Stark","Stark-Price","Stehr","Steuber","Stiedemann","Stokes","Stoltenberg","Stracke","Stracke-Wiegand","Streich","Stroman","Strosin","Swaniawski","Swift","Terry","Thiel","Thompson","Tillman","Torp","Torp-Mann","Torphy","Towne","Toy","Trantow","Tremblay","Treutel","Tromp","Tromp-Price","Turcotte","Turner","Ullrich","Upton","Vandervort","Veum","Volkman","Von","Von-Kris","VonRueden","Waelchi","Walker","Walsh","Walsh-Rohan","Walter","Ward","Waters","Waters-Price","Watsica","Watsica-Mitchell","Watsica-Walter","Weber","Wehner","Weimann","Weissnat","Welch","West","White","Wiegand","Wilderman","Wilkinson","Will","Williamson","Willms","Willms-Krajcik","Willms-Stroman","Windler","Windler-Koelpin","Wintheiser","Wisoky","Wisozk","Witting","Wiza","Wiza-Beier","Wiza-Quigley","Wolf","Wolff","Wuckert","Wunsch","Wunsch-McLaughlin","Wyman","Yost","Yost-Goyette","Yundt","Zboncak","Zboncak-Jenkins","Zemlak","Zemlak-Botsford","Ziemann","Zieme","Zieme-Blick","Zieme-Casper","Zulauf"];
self.FemaleNames =  ["Ada","Adrienne","Agnes","Alberta","Alexandra","Alexis","Alice","Alicia","Alison","Allison","Alma","Alyssa","Amanda","Amber","Amy","Ana","Andrea","Angelica","Angelina","Anita","Ann","Anna","Anne","Annette","Annie","Antonia","Arlene","Ashley","Beatrice","Becky","Belinda","Bernice","Bertha","Beth","Bethany","Betsy","Betty","Beulah","Beverly","Billie","Blanca","Blanche","Bobbie","Bonnie","Brandi","Brandy","Brenda","Bridget","Brittany","Brooke","Camille","Candace","Candice","Carla","Carmen","Carole","Caroline","Carrie","Casey","Cassandra","Catherine","Cathy","Cecelia","Cecilia","Celia","Charlene","Charlotte","Chelsea","Cheryl","Christina","Christine","Christy","Claire","Clara","Claudia","Connie","Constance","Cora","Courtney","Cristina","Crystal","Cynthia","Dana","Danielle","Darla","Darlene","Dawn","Deanna","Debbie","Deborah","Debra","Della","Delores","Denise","Desiree","Diana","Diane","Dianna","Dianne","Donna","Dora","Doreen","Doris","Dorothy","Ebony","Edith","Edna","Eileen","Elaine","Eleanor","Elena","Elisa","Elizabeth","Ella","Eloise","Elsa","Elsie","Elvira","Emily","Erica","Erika","Erin","Erma","Ernestine","Essie","Estelle","Esther","Ethel","Eula","Eunice","Eva","Evelyn","Faith","Fannie","Faye","Flora","Florence","Frances","Francis","Freda","Gail","Gayle","Geneva","Georgia","Gina","Ginger","Gladys","Glenda","Gloria","Gretchen","Guadalupe","Gwendolyn","Hannah","Harriet","Hattie","Hazel","Heidi","Helen","Henrietta","Hilda","Holly","Hope","Ida","Inez","Irene","Iris","Irma","Jackie","Jacqueline","Jacquelyn","Jaime","Jamie","Jan","Jana","Jane","Janet","Janie","Janis","Jasmine","Jean","Jeanne","Jeannie","Jenna","Jennie","Jennifer","Jenny","Jessie","Jill","Jo","Joan","Joann","Joanna","Jodi","Jody","Johanna","Johnnie","Josefina","Joy","Joyce","Juana","Judith","Judy","Julie","June","Kara","Karen","Kari","Karla","Kate","Katherine","Kathleen","Kathryn","Kathy","Katie","Katrina","Kayla","Kelley","Kelli","Kellie","Kelly","Kerry","Kim","Kimberly","Krista","Kristen","Kristi","Kristie","Kristin","Kristina","Kristine","Latoya","Laura","Lauren","Laurie","Laverne","Leah","Lee","Leigh","Lela","Leona","Leslie","Leticia","Lila","Lillian","Lillie","Linda","Lindsay","Lindsey","Lisa","Lois","Lola","Lora","Lorena","Lorene","Loretta","Lori","Lorraine","Louise","Lucia","Lucille","Lucy","Lula","Luz","Lydia","Lynda","Lynette","Lynn","Lynne","Mabel","Madeline","Mae","Maggie","Mamie","Mandy","Marcia","Margaret","Margarita","Margie","Marguerite","Maria","Marian","Marianne","Marie","Marilyn","Marion","Marlene","Marsha","Marta","Martha","Mary","Maryann","Mattie","Maureen","May","Megan","Meghan","Melanie","Melba","Melissa","Melody","Mercedes","Meredith","Michele","Michelle","Mildred","Minnie","Miriam","Misty","Molly","Mona","Monica","Monique","Myra","Myrtle","Nadine","Nancy","Naomi","Natalie","Natasha","Nellie","Nichole","Nicole","Nina","Nora","Norma","Olga","Olive","Ollie","Opal","Ora","Pam","Pamela","Pat","Patricia","Patti","Patty","Paula","Paulette","Pauline","Pearl","Peggy","Penny","Phyllis","Priscilla","Rachel","Ramona","Raquel","Rebecca","Regina","Renee","Rhonda","Rita","Robyn","Rosa","Rose","Rosemarie","Ruby","Sabrina","Sadie","Samantha","Sandra","Sandy","Sara","Sarah","Shari","Sharon","Shawna","Sheila","Shelley","Sheri","Sherry","Sheryl","Shirley","Silvia","Sonja","Sophia","Stacey","Stacy","Stella","Stephanie","Sue","Susan","Susie","Sylvia","Tabitha","Tamara","Tami","Tammy","Tanya","Tara","Tasha","Teresa","Teri","Terri","Terry","Theresa","Tiffany","Tina","Tonya","Tracey","Traci","Tracy","Tricia","Valerie","Vanessa","Velma","Vera","Verna","Veronica","Vicki","Vickie","Vicky","Victoria","Violet","Wanda","Wendy","Whitney","Willie","Wilma","Winifred","Yolanda","Yvette","Yvonne"];
self.MaleNames = ["Abel","Abraham","Adam","Al","Alan","Alberto","Alejandro","Alex","Alexander","Alfonso","Alfred","Alfredo","Allan","Allen","Alonzo","Alton","Alvin","Amos","Andre","Andres","Angel","Angelo","Anthony","Archie","Arnold","Arturo","Austin","Barry","Ben","Benjamin","Bennie","Benny","Bernard","Bert","Bill","Billy","Bob","Bobby","Boyd","Brad","Bradley","Brendan","Brent","Brian","Bruce","Bryan","Bryant","Caleb","Calvin","Cameron","Carl","Carlos","Carlton","Casey","Cecil","Cedric","Cesar","Chad","Charles","Charlie","Christian","Christopher","Clarence","Clark","Clifford","Clifton","Clint","Clinton","Clyde","Colin","Conrad","Cornelius","Cory","Courtney","Craig","Curtis","Dale","Dallas","Damon","Dan","Dana","Daniel","Darin","Darnell","Darrel","Darren","Darrin","Daryl","Dave","David","Dean","Delbert","Derek","Derrick","Devin","Dewey","Dexter","Dominic","Dominick","Don","Donald","Donnie","Doug","Douglas","Drew","Duane","Dwayne","Dwight","Earl","Earnest","Ed","Eddie","Edmond","Edmund","Eduardo","Edward","Edwin","Elbert","Elias","Ellis","Elmer","Emilio","Emmett","Enrique","Eric","Erick","Erik","Ernest","Ernesto","Ervin","Eugene","Everett","Felipe","Fernando","Forrest","Francisco","Frank","Frankie","Franklin","Fred","Freddie","Frederick","Gabriel","Garrett","Gary","Gene","Geoffrey","Gerald","Gerard","Gerardo","Gilbert","Gilberto","Gordon","Grady","Grant","Greg","Gregg","Guillermo","Gustavo","Harold","Harry","Hector","Hubert","Hugh","Hugo","Ian","Ignacio","Irving","Isaac","Ismael","Israel","Ivan","Jack","Jackie","Jacob","Jake","James","Jan","Jared","Jason","Javier","Jean","Jeff","Jeffrey","Jerald","Jeremiah","Jeremy","Jermaine","Jerome","Jerry","Jesse","Jesus","Jimmie","Jimmy","Jody","Joel","Joey","Johnathan","Johnnie","Johnny","Jon","Jonathan","Jonathon","Jordan","Jorge","Jose","Josh","Joshua","Juan","Julian","Julio","Julius","Karl","Kelly","Kelvin","Ken","Kenneth","Kenny","Kerry","Kevin","Kim","Kirk","Kristopher","Kyle","Lamar","Lance","Larry","Laurence","Lawrence","Lee","Leland","Leo","Leon","Leonard","Leroy","Leslie","Lester","Levi","Lewis","Lionel","Lloyd","Lonnie","Loren","Lorenzo","Louis","Lowell","Lucas","Luis","Luke","Luther","Lyle","Mack","Malcolm","Manuel","Marc","Marco","Marcus","Mario","Marion","Mark","Marlon","Marshall","Martin","Marty","Mathew","Matt","Matthew","Maurice","Max","Merle","Michael","Micheal","Miguel","Mike","Milton","Mitchell","Morris","Moses","Myron","Nathan","Nathaniel","Neal","Neil","Nelson","Nicholas","Nick","Nicolas","Norman","Omar","Orlando","Orville","Oscar","Otis","Owen","Pablo","Pat","Patrick","Paul","Pedro","Percy","Perry","Pete","Peter","Phil","Philip","Preston","Rafael","Ralph","Ramiro","Ramon","Randal","Randall","Randolph","Randy","Raul","Raymond","Reginald","Rex","Ricardo","Richard","Rick","Rickey","Ricky","Robert","Roberto","Robin","Rodney","Rodolfo","Rogelio","Roger","Roland","Rolando","Roman","Ron","Ronald","Roosevelt","Ross","Ruben","Rudolph","Rudy","Rufus","Russell","Salvador","Salvatore","Sam","Sammy","Samuel","Santos","Saul","Sean","Sergio","Seth","Shane","Shannon","Shaun","Shawn","Sheldon","Sherman","Sidney","Spencer","Stephen","Steven","Stewart","Stuart","Sylvester","Taylor","Ted","Terence","Terrance","Terrell","Terrence","Terry","Theodore","Thomas","Tim","Timmy","Timothy","Toby","Todd","Tomas","Tommie","Tommy","Tracy","Travis","Trevor","Troy","Tyler","Tyrone","Vernon","Victor","Virgil","Wade","Walter","Warren","Wendell","Wilbert","Wilbur","Wilfred","William","Willie","Willis","Wilson","Winston","Wm","Woodrow","Zachary"];
self.Alert = function( msg ){_utils.Alert(msg);};
self.ForceDownload = function (url, fileName) {  _utils.ForceDownload(url, fileName);}
self.Prompt = function( msg, dflt ){return _utils.Prompt(msg, dflt);};
self.Confirm = function( msg ){return _utils.Confirm(msg);};
self.RealPath = function() {return _utils.RealPath();};
self.GetVersion = function( num, txt ) { return _utils.GetVersion(num, txt);};
self.GetSource = function( ){ return _utils.GetSource(); };
self.Document = function() { return _utils.Document();};
self.Window = function() { return _utils.Window();};
self.Stringify = function( str ) { return _utils.Stringify(str);};
self.Parse = function( str ) { return _utils.Parse(str);};
self.ToUnicode = function( string ) { return _utils.ToUnicode(string);};
self.HexToRgb = function( hex ) { return _utils.HexToRgb(hex);};
self.HexToRgba = function( hex ) { return _utils.HexToRgba(hex);};
self.RgbToHex = function( rgb ) { return _utils.RgbToHex(rgb);};
self.RgbaToHex = function( rgba ) { return _utils.RgbaToHex(rgba);};
self.GetObjectFunctionsParameterNames = function( func ) { return _utils.GetObjectFunctionsParameterNames(func);};
self.GetObjectFunctionsParameterTypes = function( func ) { return _utils.GetObjectFunctionsParameterTypes(func);};
self.GetObjectFunctions = function( objName ) { return _utils.GetObjectFunctions(objName);};
self.Clone = function( obj ) { return _utils.Clone(objName);};
self.Remove = function( array, item ) { return _utils.Remove(array, item);};
self.RemoveAll = function( array ) { return _utils.RemoveAll(array);};
self.GetFileTitle = function( fileName, noExtension ) { return _utils.GetFileTitle(fileName, noExtension);};
self.RandomIntegerRange = function( rFrom, rTo ) { return _utils.RandomIntegerRange(rFrom, rTo);};
self.RandomFloatRange = function( from /* Starting range */, to /* Ending Range*/) { return _utils.RandomFloatRange(from /* Starting range */, to /* Ending Range*/);};
self.RandomHexColor = function( withAlpha ) { return _utils.RandomHexColor(withAlpha);};
self.Shuffle = function( array ) { return _utils.Shuffle(array);};
self.Hex = function( s ) { return _utils.Hex(s);};
self.HSVToRGB = function( hh, ss, vv ) { return _utils.HSVToRGB(hh, ss, vv);};
self.RGBToHSV = function( rr, gg, bb ) { return _utils.RGBToHSV(rr, gg, bb);};
self.Extend = function( o ) { return _utils.Extend(o);};
self.KilometersToMiles= function( kilometers ) { return _utils.KilometersToMiles(kilometers);};
self.MilesToKilometers = function( miles ) { return _utils.MilesToKilometers(miles);};
self.FahrenheitToCelsius = function( fahrenheit ) { return _utils.FahrenheitToCelsius(fahrenheit);};
self.FahrenheitToKelvin = function( fahrenheit ) { return _utils.FahrenheitToKelvin(fahrenheit);};
self.CelsiusToFahrenheit = function( celsius ) { return _utils.CelsiusToFahrenheit(celsius);};
self.CelsiusToKelvin = function( celsius ) { return _utils.CelsiusToKelvin(celsius);};
self.KelvinToCelsius= function( kelvin ) { return _utils.KelvinToCelsius(kelvin);};
self.KelvinToFahrenheit = function( kelvin ) { return _utils.KelvinToFahrenheit(kelvin);};
self.GetType = function() { return _utils.GetType();};
self.GetMethods = function() { return _utils.GetMethods();};
self.ImageToCanvas = function(img) { return _utils.ImageToCanvas(img);};
self.CreateCanvas = function(cont, img) { return _utils.CreateCanvas(cont, img);};
self.GetDecFromHex = function(h) { return _utils.GetDecFromHex(h);};
self.HexToDarkerHex = function(hex, percent) { return _utils.HexToDarkerHex(hex, percent);};
self.HexToLighterHex = function(hex, percent) { return _utils.HexToLighterHex(hex, percent);};
self.Guid = function () { return _utils.Guid();}
self.GuidAlternate = function () { return _utils.GuidAlternate();}
self.GetGradientColors = function (colors) { return _utils.GetGradientColors(colors);}
self.CreatePlugin = function (name) { _utils.CreatePlugin(name);}
self.ZipFolder = function (source, destination) { _utils.ZipFolder(source,destination);}
self.CountMethods = function () { return _utils.CountMethods();}
self.SetTimeout = function (funcName, interval) { return _utils.SetTimeout(funcName, interval);}
self.SetInterval = function (funcName, interval) { return _utils.SetInterval(funcName, interval);}
self.MakePlugin = function ( name ) { _utils.MakePlugin( name );}
self.SetTheme = function ( themeColor ) { _utils.SetTheme( themeColor );}
self.GetCookie = function ( cname ) { return _utils.GetCookie( cname  );}
self.SetCookie = function (cname, cvalue, exdays) { _utils.SetCookie(cname, cvalue, exdays);}
self.GetLocalStorage= function (lsKey, lsIndex) { return _utils.GetLocalStorage(lsKey, lsIndex);}
self.GetSessionStorage= function (lsKey, lsIndex) { return _utils.GetSessionStorage(lsKey, lsIndex);}
self.StringToBinary= function (str) { return _utils.StringToBinary(str);}
self.AddSourceToVideo = function (element, type, dataURI) { _utils.AddSourceToVideo(element, type, dataURI);}
self.Help = function(item){return _utils.Help(item);}
self.CompressString = function( input ){return _utils.CompressString(input);};
self.UncompressString = function( compressed ){return _utils.UncompressString(compressed);};
self.LocalStorageLeftSize = function( ){return _utils.LocalStorageLeftSize();};
self.LocalStorageMaxSize = function( ){return _utils.LocalStorageMaxSize();};
self.SessionStorageLeftSize = function( ){return _utils.SessionStorageLeftSize();};
self.SessionStorageMaxSize = function( ){return _utils.SessionStorageMaxSize();};
self.Vue = function( ){_utils.Vue();};
self.React = function( ){_utils.React();};
//self.ChooseFolder = function(){return _utils.ChooseFolder();};
self.TimeEnum = function(){return _utils.TimeEnum;};
self.Sleep = function(ms) {_utils.Sleep(ms);};
self.SQLite = function(dbname){_utils.SQLite(dbname);};
self.FixPath = function(path) {return _utils.FixPath(path);};
}


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window._utils = require('utils');

},{"utils":2}],2:[function(require,module,exports){
/*
 (c) 1974-????, Luis Ramírez De La Rosa
 Utils is a JavaScript library for using some of the native JavaScript functions intended to use on the browser but you can execute in DroidScript too because is based/created in JavaScript too.
 https://www.luillosoftinc.com/software/DroidScript/ExtraUtils/
*/

(function () { 'use strict';

var Utils = {};
Utils.Color = function() {
return {
 "keys": [ "RED", "PINK", "PURPLE", "DEEP_PURPLE", "INDIGO", "BLUE", "LIGHT_BLUE", "CYAN", "TEAL", "GREEN", "LIGHT_GREEN", "LIME", "YELLOW", "AMBER", "ORANGE", "DEEP_ORANGE", "BROWN", "GREY", "BLUE_GREY", "BLACK", "WHITE", "TRANS" ],
 "mask": [ "LIGHT_1", "LIGHT_2", "LIGHT_3", "LIGHT_4", "LIGHT_5", "DARK_1", "DARK_2", "DARK_3", "DARK_4", "ACCENT_1", "ACCENT_2", "ACCENT_3", "ACCENT_4" ],
 "mask_white": [ "DARK_1", "DARK_2", "DARK_3", "DARK_4" ],
 "mask_black": [ "LIGHT_1", "LIGHT_2", "LIGHT_3", "LIGHT_4", "LIGHT_5", "ACCENT_1", "ACCENT_2", "ACCENT_3", "ACCENT_4" ],
 "LIGHT_GREEN_ACCENT_4": "#64dd17",
 "TEAL_ACCENT_4": "#00bfa5",
 "TEAL_ACCENT_3": "#1de9b6",
 "TEAL_ACCENT_2": "#64ffda",
 "TEAL_ACCENT_1": "#a7ffeb",
 "LIGHT_GREEN_ACCENT_3": "#76ff03",
 "GREY_LIGHT_2": "#e0e0e0",
 "DEEP_ORANGE_DARK_4": "#bf360c",
 "INDIGO_LIGHT_5": "#e8eaf6",
 "INDIGO_LIGHT_4": "#c5cae9",
 "INDIGO_LIGHT_3": "#9fa8da",
 "INDIGO_LIGHT_2": "#7986cb",
 "INDIGO_LIGHT_1": "#5c6bc0",
 "GREY_LIGHT_5": "#fafafa",
 "BLUE_GREY_LIGHT_4": "#cfd8dc",
 "BLUE_GREY_LIGHT_5": "#eceff1",
 "BLUE_GREY_LIGHT_2": "#90a4ae",
 "BLUE_GREY_LIGHT_3": "#b0bec5",
 "DEEP_ORANGE_LIGHT_2": "#ff8a65",
 "DEEP_ORANGE_LIGHT_1": "#ff7043",
 "LIGHT_GREEN_ACCENT_1": "#ccff90",
 "TEAL_DARK_4": "#004d40",
 "DEEP_ORANGE_DARK_2": "#e64a19",
 "TEAL_DARK_1": "#00897b",
 "TEAL_DARK_2": "#00796b",
 "TEAL_DARK_3": "#00695c",
 "RED_LIGHT_5": "#FFEBEE",
 "RED_LIGHT_4": "#FFCDD2",
 "CYAN_LIGHT_4": "#b2ebf2",
 "CYAN_LIGHT_5": "#e0f7fa",
 "RED_LIGHT_1": "#EF5350",
 "CYAN_LIGHT_3": "#80deea",
 "RED_LIGHT_3": "#EF9A9A",
 "RED_LIGHT_2": "#E57373",
 "INDIGO_ACCENT_4": "#304ffe",
 "CYAN_ACCENT_4": "#00b8d4",
 "RED_ACCENT_4": "#D50000",
 "RED_ACCENT_3": "#FF1744",
 "RED_ACCENT_2": "#FF5252",
 "INDIGO_ACCENT_3": "#3d5afe",
 "INDIGO_ACCENT_2": "#536dfe",
 "DEEP_ORANGE_LIGHT_4": "#ffccbc",
 "BLUE_DARK_4": "#0D47A1",
 "GREY_LIGHT_1": "#bdbdbd",
 "BLUE_DARK_2": "#1976D2",
 "BLUE_DARK_3": "#1565C0",
 "BLUE_DARK_1": "#1E88E5",
 "GREY_DARK_1": "#757575",
 "GREY_DARK_3": "#424242",
 "BLUE_GREY_DARK_2": "#455a64",
 "GREY_DARK_4": "#212121",
 "LIGHT_GREEN_DARK_3": "#558b2f",
 "LIGHT_GREEN_DARK_2": "#689f38",
 "LIGHT_GREEN_DARK_1": "#7cb342",
 "GREY_LIGHT_4": "#f5f5f5",
 "LIGHT_GREEN_DARK_4": "#33691e",
 "PURPLE_ACCENT_1": "#ea80fc",
 "PURPLE_ACCENT_3": "#d500f9",
 "PURPLE_ACCENT_2": "#e040fb",
 "PURPLE_ACCENT_4": "#aa00ff",
 "RED_DARK_4": "#B71C1C",
 "LIGHT_BLUE": "#03a9f4",
 "LIME_DARK_1": "#c0ca33",
 "GREEN_DARK_1": "#43A047",
 "CYAN_DARK_1": "#00acc1",
 "RED_DARK_1": "#E53935",
 "RED_DARK_2": "#D32F2F",
 "RED_DARK_3": "#C62828",
 "ORANGE_DARK_2": "#f57c00",
 "CYAN_LIGHT_1": "#26c6da",
 "PINK_LIGHT_5": "#fce4ec",
 "PINK_LIGHT_4": "#f8bbd0",
 "PINK_LIGHT_3": "#f48fb1",
 "PINK_LIGHT_2": "#f06292",
 "PINK_LIGHT_1": "#ec407a",
 "TEAL_LIGHT_3": "#80cbc4",
 "BROWN_DARK_4": "#3e2723",
 "INDIGO": "#3f51b5",
 "BROWN_DARK_3": "#4e342e",
 "BROWN_DARK_2": "#5d4037",
 "PINK_ACCENT_1": "#ff80ab",
 "LIGHT_BLUE_DARK_4": "#01579b",
 "PINK_ACCENT_3": "#f50057",
 "PINK_ACCENT_2": "#ff4081",
 "LIGHT_BLUE_DARK_1": "#039be5",
 "PINK_ACCENT_4": "#c51162",
 "LIGHT_BLUE_DARK_3": "#0277bd",
 "LIGHT_BLUE_DARK_2": "#0288d1",
 "DEEP_ORANGE": "#ff5722",
 "INDIGO_DARK_4": "#1a237e",
 "INDIGO_DARK_2": "#303f9f",
 "INDIGO_DARK_3": "#283593",
 "INDIGO_DARK_1": "#3949ab",
 "TEAL_LIGHT_5": "#e0f2f1",
 "TEAL_LIGHT_4": "#b2dfdb",
 "DEEP_PURPLE": "#673ab7",
 "GREEN_DARK_2": "#388E3C",
 "BROWN_DARK_1": "#6d4c41",
 "CYAN_DARK_4": "#006064",
 "DEEP_PURPLE_LIGHT_3": "#b39ddb",
 "DEEP_PURPLE_LIGHT_2": "#9575cd",
 "DEEP_PURPLE_LIGHT_1": "#7e57c2",
 "BLUE_GREY_DARK_1": "#546e7a",
 "LIGHT_BLUE_ACCENT_4": "#0091ea",
 "DEEP_PURPLE_LIGHT_5": "#ede7f6",
 "DEEP_PURPLE_LIGHT_4": "#d1c4e9",
 "YELLOW_LIGHT_5": "#fffde7",
 "YELLOW_LIGHT_4": "#fff9c4",
 "YELLOW_LIGHT_1": "#ffee58",
 "TRANS": "#00ffffff",
 "YELLOW_LIGHT_3": "#fff59d",
 "YELLOW_LIGHT_2": "#fff176",
 "GREEN_ACCENT_1": "#B9F6CA",
 "CYAN_DARK_3": "#00838f",
 "BROWN": "#795548",
 "CYAN_DARK_2": "#0097a7",
 "GREEN_ACCENT_3": "#00E676",
 "CYAN_ACCENT_2": "#18ffff",
 "YELLOW_DARK_1": "#fdd835",
 "YELLOW_DARK_2": "#fbc02d",
 "YELLOW_DARK_3": "#f9a825",
 "YELLOW_DARK_4": "#f57f17",
 "ORANGE_DARK_3": "#ef6c00",
 "LIME": "#cddc39",
 "ORANGE_DARK_1": "#fb8c00",
 "BLUE_GREY_DARK_4": "#263238",
 "ORANGE_LIGHT_2": "#ffb74d",
 "GREY_LIGHT_3": "#eeeeee",
 "ORANGE_DARK_4": "#e65100",
 "AMBER_DARK_4": "#ff6f00",
 "AMBER_DARK_2": "#ffa000",
 "AMBER_DARK_3": "#ff8f00",
 "AMBER_DARK_1": "#ffb300",
 "BLUE_ACCENT_1": "#82B1FF",
 "CYAN_LIGHT_2": "#4dd0e1",
 "BLUE_ACCENT_3": "#2979FF",
 "BLUE_ACCENT_2": "#448AFF",
 "BLUE_ACCENT_4": "#2962FF",
 "GREY": "#9e9e9e",
 "LIGHT_BLUE_ACCENT_2": "#40c4ff",
 "LIGHT_BLUE_ACCENT_3": "#00b0ff",
 "LIGHT_BLUE_ACCENT_1": "#80d8ff",
 "RED": "#F44336",
 "GREEN_LIGHT_3": "#A5D6A7",
 "GREEN_LIGHT_2": "#81C784",
 "GREEN_LIGHT_1": "#66BB6A",
 "GREEN_ACCENT_2": "#69F0AE",
 "GREEN_ACCENT_4": "#00C853",
 "GREEN_LIGHT_5": "#E8F5E9",
 "GREEN_LIGHT_4": "#C8E6C9",
 "CYAN_ACCENT_1": "#84ffff",
 "LIGHT_GREEN": "#8bc34a",
 "ORANGE_ACCENT_1": "#ffd180",
 "ORANGE": "#ff9800",
 "INDIGO_ACCENT_1": "#8c9eff",
 "BROWN_LIGHT_4": "#d7ccc8",
 "BROWN_LIGHT_5": "#efebe9",
 "BROWN_LIGHT_2": "#a1887f",
 "ORANGE_ACCENT_3": "#ff9100",
 "CYAN_ACCENT_3": "#00e5ff",
 "LIME_ACCENT_4": "#aeea00",
 "ORANGE_ACCENT_2": "#ffab40",
 "RED_ACCENT_1": "#FF8A80",
 "LIME_DARK_2": "#afb42b",
 "PURPLE_DARK_2": "#7b1fa2",
 "PURPLE_DARK_3": "#6a1b9a",
 "PURPLE_DARK_1": "#8e24aa",
 "PURPLE_DARK_4": "#4a148c",
 "ORANGE_ACCENT_4": "#ff6d00",
 "YELLOW": "#ffeb3b",
 "DEEP_ORANGE_LIGHT_3": "#ffab91",
 "LIME_LIGHT_1": "#d4e157",
 "LIME_LIGHT_2": "#dce775",
 "LIME_LIGHT_3": "#e6ee9c",
 "LIME_LIGHT_4": "#f0f4c3",
 "LIME_LIGHT_5": "#f9fbe7",
 "DEEP_ORANGE_LIGHT_5": "#fbe9e7",
 "AMBER_LIGHT_2": "#ffd54f",
 "BLUE": "#2196F3",
 "LIGHT_GREEN_LIGHT_1": "#9ccc65",
 "AMBER_LIGHT_1": "#ffca28",
 "LIME_DARK_4": "#827717",
 "BROWN_LIGHT_3": "#bcaaa4",
 "DEEP_ORANGE_ACCENT_4": "#dd2c00",
 "DEEP_ORANGE_DARK_3": "#d84315",
 "DEEP_ORANGE_ACCENT_1": "#ff9e80",
 "DEEP_ORANGE_ACCENT_3": "#ff3d00",
 "DEEP_ORANGE_ACCENT_2": "#ff6e40",
 "BLACK": "#000000",
 "BROWN_LIGHT_1": "#8d6e63",
 "BLUE_GREY_DARK_3": "#37474f",
 "GREEN_DARK_3": "#2E7D32",
 "ORANGE_LIGHT_5": "#fff3e0",
 "DEEP_PURPLE_ACCENT_4": "#6200ea",
 "LIGHT_GREEN_ACCENT_2": "#b2ff59",
 "DEEP_PURPLE_ACCENT_1": "#b388ff",
 "DEEP_PURPLE_ACCENT_3": "#651fff",
 "DEEP_PURPLE_ACCENT_2": "#7c4dff",
 "GREEN": "#4CAF50",
 "LIGHT_BLUE_LIGHT_2": "#4fc3f7",
 "LIGHT_BLUE_LIGHT_3": "#81d4fa",
 "ORANGE_LIGHT_1": "#ffa726",
 "LIGHT_BLUE_LIGHT_1": "#29b6f6",
 "LIGHT_BLUE_LIGHT_4": "#b3e5fc",
 "LIGHT_BLUE_LIGHT_5": "#e1f5fe",
 "PURPLE": "#9c27b0",
 "LIGHT_GREEN_LIGHT_2": "#aed581",
 "DEEP_ORANGE_DARK_1": "#f4511e",
 "BLUE_GREY_LIGHT_1": "#78909c",
 "GREY_DARK_2": "#616161",
 "LIME_DARK_3": "#9e9d24",
 "TEAL": "#009688",
 "DEEP_PURPLE_DARK_2": "#512da8",
 "DEEP_PURPLE_DARK_3": "#4527a0",
 "DEEP_PURPLE_DARK_1": "#5e35b1",
 "CYAN": "#00bcd4",
 "GREEN_DARK_4": "#1B5E20",
 "DEEP_PURPLE_DARK_4": "#311b92",
 "TEAL_LIGHT_1": "#26a69a",
 "ORANGE_LIGHT_3": "#ffcc80",
 "PINK_DARK_4": "#880e4f",
 "TEAL_LIGHT_2": "#4db6ac",
 "PINK_DARK_2": "#c2185b",
 "PINK_DARK_3": "#ad1457",
 "PINK_DARK_1": "#d81b60",
 "YELLOW_ACCENT_4": "#ffd600",
 "YELLOW_ACCENT_3": "#ffea00",
 "YELLOW_ACCENT_2": "#ffff00",
 "YELLOW_ACCENT_1": "#ffff8d",
 "AMBER": "#ffc107",
 "WHITE": "#FFFFFF",
 "PINK": "#e91e63",
 "AMBER_LIGHT_5": "#fff8e1",
 "AMBER_LIGHT_4": "#ffecb3",
 "AMBER_LIGHT_3": "#ffe082",
 "LIME_ACCENT_1": "#f4ff81",
 "LIME_ACCENT_2": "#eeff41",
 "LIME_ACCENT_3": "#c6ff00",
 "AMBER_ACCENT_4": "#ffab00",
 "ORANGE_LIGHT_4": "#ffe0b2",
 "AMBER_ACCENT_1": "#ffe57f",
 "AMBER_ACCENT_3": "#ffc400",
 "AMBER_ACCENT_2": "#ffd740",
 "PURPLE_LIGHT_3": "#ce93d8",
 "PURPLE_LIGHT_2": "#ba68c8",
 "PURPLE_LIGHT_1": "#ab47bc",
 "LIGHT_GREEN_LIGHT_3": "#c5e1a5",
 "LIGHT_GREEN_LIGHT_4": "#dcedc8",
 "LIGHT_GREEN_LIGHT_5": "#f1f8e9",
 "PURPLE_LIGHT_5": "#f3e5f5",
 "PURPLE_LIGHT_4": "#e1bee7",
 "BLUE_LIGHT_5": "#E3F2FD",
 "BLUE_LIGHT_4": "#BBDEFB",
 "BLUE_LIGHT_3": "#90CAF9",
 "BLUE_LIGHT_2": "#64B5F6",
 "BLUE_LIGHT_1": "#42A5F5",
 "BLUE_GREY": "#607d8b",
 "BLACK": "#000000",
 "WHITE": "#ffffff"
};
};



/*
	+ Get Random Color
	- mask:
	- Values:
	- For white text: White
	- For black text: Black
*/
Utils.GetRandomColor = function( mask ) { 
	var size, msk, msksize, num, numsk, randclr, randmsk, find;
	do {
	    size = this.Color().keys.length-3;
	    msk = this.Color()["mask"+(mask?"_"+mask:"")];
	    msksize = msk.length;
	    num = Math.floor(Math.random()*size);
	    numsk = Math.floor(Math.random()*msksize);
	    randclr = this.Color().keys[num]; 
	    randmsk = msk[numsk];
	    find = this.Color()[randclr+(randmsk?"_"+randmsk:"")];
	} while( !find );
	return find;
};
Utils.Animations = ["NewsPaper","Jelly","Flash","RubberBand","ShakeHorizontal","ShakeVertical","Swing","TaDa","Bounce","BounceLeft","BounceTop","BounceRight","BounceBottom","Fadein","FadeOut","Fall","FallRotate","FlipFromVerticalSwing","FlipFromHorizontal","FlipFromBottom","FlipFromVertical","FlipFromHorizontalSwing","FlipFromTop","FlipFromRight","FlipFromLeft","FlipToHorizontal","FlipToVertical","SlideFromLeft","SlideFromTop","SlideFromRight","SlideFromBottom","SlideToLeft","SlideToTop","SlideToRight","SlideToBottom","ZoominEnter","ZoominExit","ZoominLeft","ZoominTop","ZoominRight","ZoominBottom","ZoomOutExit","ZoomOutLeft","ZoomOutTop","ZoomOutRight","ZoomOutBottom"];
Utils.LastNames = ["Abbott","Abbott-Beahan","Abernathy","Abernathy-Schmidt","Abshire","Adams","Altenwerth","Anderson","Ankunding","Armstrong","Auer","Aufderhar","Bahringer","Bailey","Balistreri","Barrows","Bartell","Bartell-Prosacco","Bartoletti","Barton","Bashirian","Bashirian-Miller","Batz","Batz-Auer","Bauch","Baumbach","Bayer","Beahan","Beahan-Wiegand","Beatty","Beatty-Parisian","Bechtelar","Bechtelar-Osinski","Becker","Bednar","Beer","Beier","Berge","Bergnaum","Bergstrom","Bergstrom-Doyle","Bernhard","Bernier","Bins","Blanda","Blick","Block","Bode","Bode-Anderson","Boehm","Boehm-Greenfelder","Bogan","Bogisich","Borer","Bosco","Botsford","Boyer","Boyle","Bradtke","Brakus","Braun","Breitenberg","Brekke","Brown","Bruen","Bruen-Dickens","Buckridge","Buckridge-Huels","Buckridge-Rosenbaum","Carroll","Carroll-Gottlieb","Carroll-Gutkowski","Carroll-Skiles","Carter","Cartwright","Casper","Casper-Moore","Cassin","Champlin","Christiansen","Christiansen-Rutherford","Christiansen-Schowalter","Cole","Collier","Collins","Conn","Connelly","Connelly-Gleason","Conroy","Conroy-Mosciski","Considine","Considine-Heller","Corkery","Corkery-Reichel","Cormier","Corwin","Cremin","Crist","Crona","Cronin","Crooks","Crooks-Bechtelar","Cruickshank","Cummerata","Cummings","Cummings-Jacobson","D'Amore","D'Amore-Dicki","Dach","Daniel","Dare","Dare-Heller","Daugherty","Davis","Davis-Stark","Deckow","Denesik","Dibbert","Dickens","Dickens-Ferry","Dickens-Gutkowski","Dickens-Hermann","Dicki","Dicki-Friesen","Dickinson","Dietrich","Donnelly","Dooley","Douglas","Doyle","Doyle-Farrell","DuBuque","DuBuque-Shanahan","Durgan","Ebert","Effertz","Emard","Emmerich","Emmerich-Mante","Erdman","Erdman-Zieme","Ernser","Ernser-Friesen","Fadel","Fahey","Fahey-Donnelly","Farrell","Fay","Feeney","Feest","Feil","Ferry","Fisher","Flatley","Flatley-McGlynn","Flatley-Ruecker","Frami","Franecki","Franey","Franey-Oberbrunner","Friesen","Friesen-Gusikowski","Fritsch","Funk","Gerhold","Gerhold-Jerde","Gerlach","Gibson","Gislason","Gleason","Gleichner","Glover","Goldner","Goldner-Collier","Goodwin","Gorczany","Gorczany-Feil","Gottlieb","Goyette","Goyette-McClure","Grady","Graham","Graham-Herzog","Grant","Green","Green-Kihn","Greenfelder","Greenfelder-Quitzon","Greenholt","Greenholt-Shanahan","Grimes","Grimes-Hamill","Gulgowski","Gusikowski","Gutkowski","Gutkowski-Torphy","Gutmann","Haag","Hackett","Hagenes","Hagenes-Bahringer","Hagenes-Sporer","Hahn","Hahn-Stracke","Haley","Halvorson","Halvorson-Rempel","Hamill","Hamill-Homenick","Hammes","Hand","Hane","Hane-Jakubowski","Hansen","Harber","Harber-Walker","Harris","Hartmann","Harvey","Hauck","Hayes","Heaney","Heathcote","Hegmann","Hegmann-Bode","Hegmann-Schaefer","Heidenreich","Heller","Herman","Hermann","Hermiston","Hermiston-Lemke","Herzog","Hessel","Hessel-Monahan","Hettinger","Hickle","Hilll","Hills","Hills-Pfeffer","Hilpert","Hintz","Hintz-Rath","Hirthe","Hirthe-Hahn","Hodkiewicz","Hoeger","Hoeger-Beahan","Homenick","Homenick-Sipes","Hoppe","Howe","Howe-Bashirian","Howell","Hudson","Hudson-Mante","Hudson-Stroman","Huel","Huels","Hyatt","Jacobi","Jacobs","Jacobson","Jakubowski","Jakubowski-Ernser","Jaskolski","Jaskolski-Wisozk","Jast","Jenkins","Jerde","Johns","Johns-Reilly","Johnson","Johnston","Jones","Jones-Osinski","Kassulke","Kassulke-Hammes","Kautzer","Kautzer-Collier","Keebler","Keeling","Keeling-Wuckert","Kemmer","Kerluke","Kerluke-O'Reilly","Kertzmann","Kessler","Kiehn","Kihn","Kilback","Kilback-Legros","King","Kirlin","Klein","Klein-Langosh","Kling","Klocko","Klocko-Hessel","Koch","Koelpin","Koepp","Kohler","Kohler-Schumm","Konopelski","Konopelski-Grady","Koss","Kovacek","Kozey","Kozey-Gerlach","Krajcik","Kreiger","Kreiger-Hickle","Kris","Kris-Pouros","Kshlerin","Kub","Kuhic","Kuhlman","Kuhn","Kulas","Kunde","Kunze","Kuphal","Kuphal-Bashirian","Kuphal-O'Hara","Kutch","Kutch-Quitzon","Kuvalis","Labadie","Labadie-Hintz","Lakin","Lakin-Ziemann","Lang","Langosh","Langworth","Larkin","Larkin-Schinner","Larkin-Schulist","Larson","Leannon","Lebsack","Ledner","Leffler","Legros","Lehner","Lehner-Mertz","Lehner-Tromp","Lemke","Lesch","Leuschke","Lind","Lindgren","Littel","Little","Lockman","Lockman-Rutherford","Lockman-Wintheiser","Lowe","Lowe-Mitchell","Lubowitz","Lueilwitz","Luettgen","Lynch","MacGyver","Macejkovic","Maggio","Maggio-Blick","Maggio-Wisozk","Mann","Mante","Mante-O'Reilly","Marks","Marks-Torp","Marquardt","Marvin","Mayer","Mayert","McClure","McCullough","McCullough-Kreiger","McDermott","McGlynn","McGlynn-Parisian","McKenzie","McLaughlin","McLaughlin-Windler","Medhurst","Mertz","Mertz-Green","Metz","Miller","Mills","Mitchell","Mitchell-Bauch","Mitchell-Langworth","Mitchell-Leffler","Moen","Mohr","Mohr-Muller","Monahan","Monahan-Morar","Moore","Moore-Schinner","Morar","Morar-Littel","Morissette","Mosciski","Mosciski-Mante","Mraz","Mueller","Muller","Murazik","Murphy","Murray","Nader","Nicolas","Nienow","Nienow-Torphy","Nikolaus","Nitzsche","Nolan","Nolan-Klocko","O'Connell","O'Conner","O'Hara","O'Keefe","O'Kon","O'Kon-Kerluke","O'Reilly","Oberbrunner","Oberbrunner-Kihn","Okuneva","Olson","Ondricka","Orn","Orn-Dicki","Ortiz","Osinski","Osinski-Koepp","Pacocha","Pacocha-Cummerata","Padberg","Pagac","Pagac-D'Amore","Parisian","Parker","Parker-Borer","Paucek","Paucek-Batz","Paucek-Sipes","Pfannerstill","Pfannerstill-Connelly","Pfeffer","Pfeffer-Wuckert","Pollich","Pouros","Pouros-Rogahn","Powlowski","Powlowski-Kirlin","Predovic","Price","Prohaska","Prosacco","Purdy","Purdy-Dibbert","Purdy-Hand","Quigley","Quitzon","Rath","Rath-Abernathy","Rath-Roob","Ratke","Rau","Raynor","Reichel","Reichert","Reichert-Morar","Reilly","Reinger","Rempel-Mante","Rempel-Torp","Renner","Renner-Ernser","Reynolds","Reynolds-Haag","Rice","Rice-Ritchie","Rippin","Ritchie","Ritchie-Hermann","Robel","Robel-Buckridge","Robel-Reichert","Roberts","Rodriguez","Rogahn","Rohan","Rohan-Mertz","Rolfson","Rolfson-Crist","Romaguera","Roob","Rosenbaum","Rosenbaum-Jenkins","Rowe","Ruecker","Runolfsdottir","Runolfsson","Runte","Russel","Rutherford","Ryan","Ryan-Marks","Sanford","Sanford-Cummerata","Satterfield","Satterfield-Haley","Sauer","Sawayn","Schaden","Schaden-Swift","Schaefer","Schaefer-Stokes","Schamberger","Schiller","Schiller-Yost","Schimmel","Schimmel-Sawayn","Schinner","Schmeler","Schmidt","Schmitt","Schneider","Schneider-Rippin","Schoen","Schoen-Hayes","Schoen-Jerde","Schoen-Mitchell","Schowalter","Schroeder","Schroeder-Strosin","Schulist","Schultz","Schumm","Schuppe","Schuster","Schuster-Schroeder","Senger","Senger-Kirlin","Shanahan","Shields","Shields-Champlin","Simonis","Sipes","Skiles","Smith","Smitham","Spencer","Spinka","Sporer","Sporer-Lakin","Stamm","Stanton","Stark","Stark-Price","Stehr","Steuber","Stiedemann","Stokes","Stoltenberg","Stracke","Stracke-Wiegand","Streich","Stroman","Strosin","Swaniawski","Swift","Terry","Thiel","Thompson","Tillman","Torp","Torp-Mann","Torphy","Towne","Toy","Trantow","Tremblay","Treutel","Tromp","Tromp-Price","Turcotte","Turner","Ullrich","Upton","Vandervort","Veum","Volkman","Von","Von-Kris","VonRueden","Waelchi","Walker","Walsh","Walsh-Rohan","Walter","Ward","Waters","Waters-Price","Watsica","Watsica-Mitchell","Watsica-Walter","Weber","Wehner","Weimann","Weissnat","Welch","West","White","Wiegand","Wilderman","Wilkinson","Will","Williamson","Willms","Willms-Krajcik","Willms-Stroman","Windler","Windler-Koelpin","Wintheiser","Wisoky","Wisozk","Witting","Wiza","Wiza-Beier","Wiza-Quigley","Wolf","Wolff","Wuckert","Wunsch","Wunsch-McLaughlin","Wyman","Yost","Yost-Goyette","Yundt","Zboncak","Zboncak-Jenkins","Zemlak","Zemlak-Botsford","Ziemann","Zieme","Zieme-Blick","Zieme-Casper","Zulauf"];
Utils.FemaleNames =  ["Ada","Adrienne","Agnes","Alberta","Alexandra","Alexis","Alice","Alicia","Alison","Allison","Alma","Alyssa","Amanda","Amber","Amy","Ana","Andrea","Angelica","Angelina","Anita","Ann","Anna","Anne","Annette","Annie","Antonia","Arlene","Ashley","Beatrice","Becky","Belinda","Bernice","Bertha","Beth","Bethany","Betsy","Betty","Beulah","Beverly","Billie","Blanca","Blanche","Bobbie","Bonnie","Brandi","Brandy","Brenda","Bridget","Brittany","Brooke","Camille","Candace","Candice","Carla","Carmen","Carole","Caroline","Carrie","Casey","Cassandra","Catherine","Cathy","Cecelia","Cecilia","Celia","Charlene","Charlotte","Chelsea","Cheryl","Christina","Christine","Christy","Claire","Clara","Claudia","Connie","Constance","Cora","Courtney","Cristina","Crystal","Cynthia","Dana","Danielle","Darla","Darlene","Dawn","Deanna","Debbie","Deborah","Debra","Della","Delores","Denise","Desiree","Diana","Diane","Dianna","Dianne","Donna","Dora","Doreen","Doris","Dorothy","Ebony","Edith","Edna","Eileen","Elaine","Eleanor","Elena","Elisa","Elizabeth","Ella","Eloise","Elsa","Elsie","Elvira","Emily","Erica","Erika","Erin","Erma","Ernestine","Essie","Estelle","Esther","Ethel","Eula","Eunice","Eva","Evelyn","Faith","Fannie","Faye","Flora","Florence","Frances","Francis","Freda","Gail","Gayle","Geneva","Georgia","Gina","Ginger","Gladys","Glenda","Gloria","Gretchen","Guadalupe","Gwendolyn","Hannah","Harriet","Hattie","Hazel","Heidi","Helen","Henrietta","Hilda","Holly","Hope","Ida","Inez","Irene","Iris","Irma","Jackie","Jacqueline","Jacquelyn","Jaime","Jamie","Jan","Jana","Jane","Janet","Janie","Janis","Jasmine","Jean","Jeanne","Jeannie","Jenna","Jennie","Jennifer","Jenny","Jessie","Jill","Jo","Joan","Joann","Joanna","Jodi","Jody","Johanna","Johnnie","Josefina","Joy","Joyce","Juana","Judith","Judy","Julie","June","Kara","Karen","Kari","Karla","Kate","Katherine","Kathleen","Kathryn","Kathy","Katie","Katrina","Kayla","Kelley","Kelli","Kellie","Kelly","Kerry","Kim","Kimberly","Krista","Kristen","Kristi","Kristie","Kristin","Kristina","Kristine","Latoya","Laura","Lauren","Laurie","Laverne","Leah","Lee","Leigh","Lela","Leona","Leslie","Leticia","Lila","Lillian","Lillie","Linda","Lindsay","Lindsey","Lisa","Lois","Lola","Lora","Lorena","Lorene","Loretta","Lori","Lorraine","Louise","Lucia","Lucille","Lucy","Lula","Luz","Lydia","Lynda","Lynette","Lynn","Lynne","Mabel","Madeline","Mae","Maggie","Mamie","Mandy","Marcia","Margaret","Margarita","Margie","Marguerite","Maria","Marian","Marianne","Marie","Marilyn","Marion","Marlene","Marsha","Marta","Martha","Mary","Maryann","Mattie","Maureen","May","Megan","Meghan","Melanie","Melba","Melissa","Melody","Mercedes","Meredith","Michele","Michelle","Mildred","Minnie","Miriam","Misty","Molly","Mona","Monica","Monique","Myra","Myrtle","Nadine","Nancy","Naomi","Natalie","Natasha","Nellie","Nichole","Nicole","Nina","Nora","Norma","Olga","Olive","Ollie","Opal","Ora","Pam","Pamela","Pat","Patricia","Patti","Patty","Paula","Paulette","Pauline","Pearl","Peggy","Penny","Phyllis","Priscilla","Rachel","Ramona","Raquel","Rebecca","Regina","Renee","Rhonda","Rita","Robyn","Rosa","Rose","Rosemarie","Ruby","Sabrina","Sadie","Samantha","Sandra","Sandy","Sara","Sarah","Shari","Sharon","Shawna","Sheila","Shelley","Sheri","Sherry","Sheryl","Shirley","Silvia","Sonja","Sophia","Stacey","Stacy","Stella","Stephanie","Sue","Susan","Susie","Sylvia","Tabitha","Tamara","Tami","Tammy","Tanya","Tara","Tasha","Teresa","Teri","Terri","Terry","Theresa","Tiffany","Tina","Tonya","Tracey","Traci","Tracy","Tricia","Valerie","Vanessa","Velma","Vera","Verna","Veronica","Vicki","Vickie","Vicky","Victoria","Violet","Wanda","Wendy","Whitney","Willie","Wilma","Winifred","Yolanda","Yvette","Yvonne"];
Utils.MaleNames = ["Abel","Abraham","Adam","Al","Alan","Alberto","Alejandro","Alex","Alexander","Alfonso","Alfred","Alfredo","Allan","Allen","Alonzo","Alton","Alvin","Amos","Andre","Andres","Angel","Angelo","Anthony","Archie","Arnold","Arturo","Austin","Barry","Ben","Benjamin","Bennie","Benny","Bernard","Bert","Bill","Billy","Bob","Bobby","Boyd","Brad","Bradley","Brendan","Brent","Brian","Bruce","Bryan","Bryant","Caleb","Calvin","Cameron","Carl","Carlos","Carlton","Casey","Cecil","Cedric","Cesar","Chad","Charles","Charlie","Christian","Christopher","Clarence","Clark","Clifford","Clifton","Clint","Clinton","Clyde","Colin","Conrad","Cornelius","Cory","Courtney","Craig","Curtis","Dale","Dallas","Damon","Dan","Dana","Daniel","Darin","Darnell","Darrel","Darren","Darrin","Daryl","Dave","David","Dean","Delbert","Derek","Derrick","Devin","Dewey","Dexter","Dominic","Dominick","Don","Donald","Donnie","Doug","Douglas","Drew","Duane","Dwayne","Dwight","Earl","Earnest","Ed","Eddie","Edmond","Edmund","Eduardo","Edward","Edwin","Elbert","Elias","Ellis","Elmer","Emilio","Emmett","Enrique","Eric","Erick","Erik","Ernest","Ernesto","Ervin","Eugene","Everett","Felipe","Fernando","Forrest","Francisco","Frank","Frankie","Franklin","Fred","Freddie","Frederick","Gabriel","Garrett","Gary","Gene","Geoffrey","Gerald","Gerard","Gerardo","Gilbert","Gilberto","Gordon","Grady","Grant","Greg","Gregg","Guillermo","Gustavo","Harold","Harry","Hector","Hubert","Hugh","Hugo","Ian","Ignacio","Irving","Isaac","Ismael","Israel","Ivan","Jack","Jackie","Jacob","Jake","James","Jan","Jared","Jason","Javier","Jean","Jeff","Jeffrey","Jerald","Jeremiah","Jeremy","Jermaine","Jerome","Jerry","Jesse","Jesus","Jimmie","Jimmy","Jody","Joel","Joey","Johnathan","Johnnie","Johnny","Jon","Jonathan","Jonathon","Jordan","Jorge","Jose","Josh","Joshua","Juan","Julian","Julio","Julius","Karl","Kelly","Kelvin","Ken","Kenneth","Kenny","Kerry","Kevin","Kim","Kirk","Kristopher","Kyle","Lamar","Lance","Larry","Laurence","Lawrence","Lee","Leland","Leo","Leon","Leonard","Leroy","Leslie","Lester","Levi","Lewis","Lionel","Lloyd","Lonnie","Loren","Lorenzo","Louis","Lowell","Lucas","Luis","Luke","Luther","Lyle","Mack","Malcolm","Manuel","Marc","Marco","Marcus","Mario","Marion","Mark","Marlon","Marshall","Martin","Marty","Mathew","Matt","Matthew","Maurice","Max","Merle","Michael","Micheal","Miguel","Mike","Milton","Mitchell","Morris","Moses","Myron","Nathan","Nathaniel","Neal","Neil","Nelson","Nicholas","Nick","Nicolas","Norman","Omar","Orlando","Orville","Oscar","Otis","Owen","Pablo","Pat","Patrick","Paul","Pedro","Percy","Perry","Pete","Peter","Phil","Philip","Preston","Rafael","Ralph","Ramiro","Ramon","Randal","Randall","Randolph","Randy","Raul","Raymond","Reginald","Rex","Ricardo","Richard","Rick","Rickey","Ricky","Robert","Roberto","Robin","Rodney","Rodolfo","Rogelio","Roger","Roland","Rolando","Roman","Ron","Ronald","Roosevelt","Ross","Ruben","Rudolph","Rudy","Rufus","Russell","Salvador","Salvatore","Sam","Sammy","Samuel","Santos","Saul","Sean","Sergio","Seth","Shane","Shannon","Shaun","Shawn","Sheldon","Sherman","Sidney","Spencer","Stephen","Steven","Stewart","Stuart","Sylvester","Taylor","Ted","Terence","Terrance","Terrell","Terrence","Terry","Theodore","Thomas","Tim","Timmy","Timothy","Toby","Todd","Tomas","Tommie","Tommy","Tracy","Travis","Trevor","Troy","Tyler","Tyrone","Vernon","Victor","Virgil","Wade","Walter","Warren","Wendell","Wilbert","Wilbur","Wilfred","William","Willie","Willis","Wilson","Winston","Wm","Woodrow","Zachary"];
Utils.TimeEnum = {
   second: 1000,               // 1000 milliseconds
   minute: 1000 * 60,
   hour: (1000 * 60) * 60,
   day: ((1000 * 60) * 60) * 24,
   week: (((1000 * 60) * 60) * 24) * 7,
   year: (((1000 * 60) * 60) * 24) * 365.25
};

Utils.Sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

Utils.SQLite = function(dbname){
	app.WriteFile(dbname, "SQLite format 3   @                                                                    .C" + "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             W--ctableandroid_metadataandroid_metadataCREATE TABLE android_metadata (locale TEXT)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               " + "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              en_US", "ASCII");
};

/*Utils.ChooseFolder() {
    app.SendIntent(null, null, "android.intent.action.OPEN_DOCUMENT_TREE", null, null, null, null, "result", (result, data)=>{if (result == -1 && data && data.data) {return [data.data,app.Uri2Path(data.data)];} else if (result == 0) { app.ShowPopup("Folder selection was canceled."); return [null, null];} else {app.ShowPopup("Error: " + JSON.stringify(data)); return [null, null];}})
};
*/

Utils.Vue = function(){
	app.Execute( "app.Script('https://cdn.jsdelivr.net/npm/vue@2');" );
};

Utils.React = function(){
	app.Execute( "app.Script('https://unpkg.com/react-dom@17/umd/react-dom.development.js');");
};

Utils.LocalStorageLeftSize = function() {
    var itemBackup = localStorage.getItem("");
    var increase = true;
    var data = "1";
    var totalData = "";
    var trytotalData = "";
    while (true) {
        try {
            trytotalData = totalData + data;
            localStorage.setItem("", trytotalData);
            totalData = trytotalData;
            if (increase) data += data;
        } catch (e) {
            if (data.length < 2) break;
            increase = false;
            data = data.substr(data.length / 2);
        }
    }
    localStorage.setItem("", itemBackup);
    return totalData.length;
};

Utils.LocalStorageMaxSize = function(){
   localStorage.clear();
   var storageMax = this.LocalStorageLeftSize();
};

Utils.SessionStorageLeftSize = function() {
    var itemBackup = sessionStorage.getItem("");
    var increase = true;
    var data = "1";
    var totalData = "";
    var trytotalData = "";
    while (true) {
        try {
            trytotalData = totalData + data;
            sessionStorage.setItem("", trytotalData);
            totalData = trytotalData;
            if (increase) data += data;
        } catch (e) {
            if (data.length < 2) break;
            increase = false;
            data = data.substr(data.length / 2);
        }
    }
    sessionStorage.setItem("", itemBackup);
    return totalData.length;
};

Utils.SessionStorageMaxSize = function(){
   sessionStorage.clear();
   var storageMax = this.SessionStorageLeftSize();
};

Utils.StringToBinary = function(str) {
    return str.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
};

Utils.CompressString = function(input) {
    const binaryString = new TextEncoder().encode(input);
    const compressed = pako.deflate(binaryString);
    return btoa(String.fromCharCode(...compressed)); // Convert to Base64
};

Utils.UncompressString = function(compressed) {
    const binaryString = Uint8Array.from(atob(compressed), c => c.charCodeAt(0));
    const decompressed = pako.inflate(binaryString);
    return new TextDecoder().decode(decompressed);
};

Utils.AddSourceToVideo = function(element, type, dataURI) {
    var source = this.Document.createElement('source');
    source.src = dataURI;
    source.type = "video/" + type;
    element.appendChild(source);
};
  
Utils.Alert = function(msg) {
	alert(msg);
};

Utils.GetType = function() {
	return "Utils";
};

Utils.RealPath = function() {
	return "/storage/emulated/0/";
};

Utils.FixPath = function(path) {
		return path.replace("/sdcard","/storage/emulated/0");
};

Utils.ZipFolder = function( source, destination ) {
    function add( folder, name="" ) {
        app.ListFolder( folder, null, null, "AlphaSort" )
            .forEach( function (item) {
                if ( !app.IsFolder( folder+"/"+item )) {
                    zu.AddFile( name+item, folder+"/"+item )
                } else {
                    add( folder+"/"+item, name+item+"/" )
                }
            })
    }
    const zu = app.CreateZipUtil(  )
    zu.Create( destination )
    add( source )
    zu.Close()
};

Utils.GetLocalStorage = function(lsKey, lsIndex) {
        var ls = localStorage;
        if(ls && ls.getItem(lsKey) ) {
            var lsValue = ls.getItem(lsKey);
            var lsArray = JSON.parse(lsValue);
            if( lsArray['data'] != undefined && lsArray['data'][lsIndex] != undefined){
                return lsArray['data'][lsIndex];
            }
        }
        return '';
}

Utils.GetSessionStorage = function(lsKey, lsIndex) {
        var ls = sessionStorage;
        if(ls && ls.getItem(lsKey) ) {
            var lsValue = ls.getItem(lsKey);
            var lsArray = JSON.parse(lsValue);
            if( lsArray['data'] != undefined && lsArray['data'][lsIndex] != undefined){
                return lsArray['data'][lsIndex];
            }
        }
        return '';
}

Utils.CreatePlugin = function(name) {
if(!app.FileExists(  app.GetAppPath() + "/" +  name + ".js")) {
var template = app.ReadFile( "/data/user/0/com.smartphoneremote.androidscriptfree/app_Plugins/utils/Misc/PluginTemplate.txt" );
template = template.replace("#TOUNICODE#", Utils.ToUnicode(name));
for(var c=0;c<10;c++) {
template = template.replace("#NAME#", name);
  template = template.replace("#name#", name.toLowerCase());
}
app.WriteFile(app.GetAppPath() + "/" +  name + ".js", template );
ide.MakePlugin(name);
} else {
ide.MakePlugin(name);
}
};

Utils.GuidAlternate = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};  

Utils.Help = function(item){
	if(item == "Prompt") return "\r\n\r\nShows a dialog box with a title and an input box for the answer. Also has an ok and cancel buttons. The results are saved in a variable calling the method. \r\n\r\nThe parameters are [msg] which is the question and [dflt] that is a default response.";
if(item == "msg") return "String variable used as the prompt or question.";
};


Utils.Prompt = function(msg, dflt) {
	return prompt(msg, dflt);
};

Utils.Confirm = function(msg) {
	return confirm(msg);
};

Utils.SetTimeout = function(funcName, interval) {
	setTimeout(funcName, interval);
};

Utils.SetInterval = function(funcName, interval) {
	return setInterval(funcName, interval);
};

Utils.GetVersion = function( num, txt ) {
	return "1.69.71";
};

Utils.GetSource = function() {
	return app.ReadFile( "/data/user/0/com.smartphoneremote.androidscriptfree/app_Plugins/utils/Utils.js" );
};

Utils.Document = function() {
	return document ? document : 'document object not exist';
};

Utils.Window = function() {
	return window ? window : 'window object not exist';
};

Utils.Stringify = function(str) {
	return JSON.stringify(str);
};

Utils.Parse = function(str) {
	return JSON.parse(str);
};

Utils.SetCookie = function(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  this.Document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

Utils.GetCookie = function(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};


Utils.ToUnicode = function( string ) {
    return string.replace(/[\s\S]/g, function (escape) {
       return '\\u' + ('0000' + escape.charCodeAt().toString(16)).slice(-4);
    });
};
 
Utils.HexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
};
 
Utils.HexToRgba = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + parseInt(result[4], 16) + "," + parseInt(result[1], 16) + ")";
};
 
Utils.RgbToHex = function(rgb) {
    var result = rgb.match(/\d+/g);
    function hex(x) {
        var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
        return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
    };
    return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
};
 
Utils.RgbaToHex = function(rgba) {
    var result = rgba.match(/\d+/g);
    function hex(x) {
        var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
        return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
    };
    return "#" + hex(result[3]) + hex(result[0]) + hex(result[1]) + hex(result[2]);
};

Utils.GetGradientColors = function(color) {
let r = parseInt(color.slice(1,3), 16);
let g = parseInt(color.slice(3,5), 16);
  let b = parseInt(color.slice(5,7), 16);
  let lightR = Math.min(r + 50, 255);
  let lightG = Math.min(g + 50, 255);
  let lightB = Math.min(b + 50, 255);
  let darkR = Math.max(r - 50, 0);
  let darkG = Math.max(g - 50, 0);
  let darkB = Math.max(b - 50, 0);
  let lightColor = Utils.RgbToHex(`rgb(${lightR}, ${lightG}, ${lightB})`);
  let darkColor = Utils.RgbToHex(`rgb(${darkR}, ${darkG}, ${darkB})`);
  return [lightColor, darkColor];
};

Utils.GetObjectFunctionsParameterNames = function( func ) {
  if( func ) {
      var STRIP_COMMENTS =  /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var ARGUMENT_NAMES = /([^\s,]+)/g;
      var fnStr = func.toString().replace(STRIP_COMMENTS, '');
      var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if(result === null) result = [];
      return result;
    }
};
Utils.GetObjectFunctionsParameterTypes = function( func ) {
  if( func ) {
      var STRIP_COMMENTS =  /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var ARGUMENT_NAMES = /([^\s,]+)/g;
      var fnStr = func.toString().replace(STRIP_COMMENTS, '');
      var result = typeof fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if(result === null) result = [];
      return result;
    }
};

Utils.GetObjectFunctions = function( objName ) {
  var obj;
    if(typeof objName === 'object') {
    obj = objName;
    } else {
obj = eval("new "+objName+"()") ? eval("new "+objName+"()") : eval(objName);
}
var list = [];
    for (var Key in obj) {
      if (obj.hasOwnProperty(Key) && (typeof obj[Key] === 'function')) {
        list.push(Key);
      }
    }
    list.sort();
    return list;
};

Utils.Clone = function( obj ) {
  return JSON.parse(JSON.stringify(obj));
};

Utils.Remove = function( array, item ) {
    var i = array.indexOf( item );
    if( i>-1 ) array.splice( i, 1 );
};

Utils.RemoveAll = function( array ) {
while(array.length>0) {
array.pop();
}
};

Utils.GetFileTitle = function( fileName, noExtension ) {
var title = fileName.substr( fileName.lastIndexOf("/")+1 );
    if( noExtension ) title = title.substr( 0, title.lastIndexOf(".") );
    return title;
};

Utils.RandomIntegerRange = function(rFrom, rTo) {
return rFrom + Math.floor(Math.random() * (rTo - rFrom));
};

Utils.RandomFloatRange = function(from /* Starting range */, to /* Ending Range*/) {
return from + (Math.random() * (to - from));
};

Utils.RandomHexColor = function(withAlpha) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var j = 6;
    if(withAlpha) j = 8;
for (var i = 0; i < j; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

Utils.Shuffle = function( array ) {
var count = array.length,
randomnumber,
temp;
while( count ){
randomnumber = Math.random() * count-- | 0;
temp = array[count];
array[count] = array[randomnumber];
array[randomnumber] = temp;
}
};

Utils.Hex = function(s) {
var string = "";
string=s.toString(16).toLowerCase().slice(0,2);
if(string.length<2||string[1]==".")
string="0"+string[0];
return string;
};

Utils.HSVToRGB = function (hh,ss,vv) {
var nr=0;
var ng=0;
var nb=0;

if(hh>360)hh=hh-(360*Math.floor(hh/360));
if(hh<0)hh=hh+(360*Math.ceil(-hh/360));

//Hue
if((hh>=0&&hh<60)||hh==360)
{
nr=255;
ng=hh*(255/60);
if(hh==360)
ng=0;
}
if(hh>=60&&hh<120)
{
nr=(120-hh)*(255/60);
ng=255;
}
if(hh>=120&&hh<180)
{
ng=255;
nb=(hh-120)*(255/60);
}
if(hh>=180&&hh<240)
{
nb=255;
ng=(240-hh)*(255/60);
}
if(hh>=240&&hh<300)
{
nb=255;
nr=(hh-240)*(255/60);
}
if(hh>=300&&hh<360)
{
nr=255;
nb=(360-hh)*(255/60);
}

//Saturation
nr=(255-nr)/255*(255-ss)+nr;
ng=(255-ng)/255*(255-ss)+ng;
nb=(255-nb)/255*(255-ss)+nb;

//Variance
nr=nr*(vv/255);
ng=ng*(vv/255);
nb=nb*(vv/255);

return [nr.toFixed(0)*1, ng.toFixed(0)*1, nb.toFixed(0)*1];

};

//Converts RGB to HSV. Values from 0-255. Returns array of values.
Utils.RGBToHSV = function(rr,gg,bb)
{
var nh=0;
var ns=0;
var nv=0;

var v1 = Math.max(rr,gg,bb);
var v2 = 0;
var v3 = Math.min(rr,gg,bb);
if(rr!=v1&&rr!=v3)v2=rr;
if(gg!=v1&&gg!=v3)v2=gg;
if(bb!=v1&&bb!=v3)v2=bb;

if(rr==gg&&v1==rr)v2=gg;
if(gg==bb&&v1==gg)v2=bb;
if(rr==bb&&v1==rr)v2=bb;

var R = 1;

var ov1 = v1;
var ov2 = v2;
var ov3 = v3;

//Finding Hue p1
if(v1==rr&&v2==gg)nh=0;
if(v1==gg&&v2==rr)nh=60;
if(v1==gg&&v2==bb)nh=120;
if(v1==bb&&v2==gg)nh=180;
if(v1==bb&&v2==rr)nh=240;
if(v1==rr&&v2==bb)nh=300;

//Finding Value
R = 255/v1;
v2=v2*R;
v3=v3*R;
nv = v1;
v1=255;

//nr=((nr1-255+S)*255)/S
//Finding Saturation
R=255/v3;
ns=255-v3;
//v2=(255*R-v2)/(R-1);
v2=((v2-255+ns)*255)/ns;
v3=0;

//Finding Hue p2
if(ov1==rr&&ov2==gg)nh=nh+((v2/255)*60);
if(ov1==gg&&ov2==rr)nh=nh+(((255-v2)/255)*60);
if(ov1==gg&&ov2==bb)nh=nh+((v2/255)*60);
if(ov1==bb&&ov2==gg)nh=nh+(((255-v2)/255)*60);
if(ov1==bb&&ov2==rr)nh=nh+((v2/255)*60);
if(ov1==rr&&ov2==bb)nh=nh+(((255-v2)/255)*60);

if(rr==gg&&ov1==rr)nh=60;
if(gg==bb&&ov1==gg)nh=180;
if(bb==rr&&ov1==bb)nh=300;
if(ov1==rr&&v2==0)nh=0;
if(ov1==gg&&v2==0)nh=120;
if(ov1==bb&&v2==0)nh=240;

if(rr==gg&&gg==bb)
{
nh=0;
ns=0;
nv=rr;
}

return [nh,ns,nv];
};
 
Utils.Extend = function(o) {
    Reflect.ownKeys(o)
        .filter(m => /^Set|Add/.test(m))
        .forEach(
            function (method) {
                const str = o[method].toString()
                const aStart = str.indexOf("(") + 1
                const aEnd = str.indexOf(")") - 1
                const bStart = str.indexOf("{") + 1
                const bEnd = str.lastIndexOf("}")
                const args = str.slice(aStart, aEnd).split(",")
                const body = str.slice(bStart, bEnd).replace(/obj.id/g, "this.id").concat(" return this;")
                args.push(body)
                o[method] = new Function(...args)
            })
    return o
};

Utils.KilometersToMiles = function(kilometers) {
return kilometers * 0.621371;
};

Utils.MilesToKilometers = function(miles) {
return miles * 1.609344;
};

Utils.FahrenheitToCelsius = function(fahrenheit) {
return (fahrenheit - 32) * 5 / 9;
};

Utils.FahrenheitToKelvin = function(fahrenheit) {
return (fahrenheit - 32) * 5 / 9 + 273.15;
};

Utils.CelsiusToFahrenheit = function(celsius) {
return (celsius * 9 / 5) + 32;
};

Utils.CelsiusToKelvin= function(celsius) {
return celsius + 273.15;
};

Utils.KelvinToFahrenheit = function(kelvin) {
return (kelvin - 273.15) * 9 / 5 + 32;
};

Utils.KelvinToCelsius = function(kelvin) {
return kelvin - 273.15;
};

Utils.ImageToCanvas = function( image ) {
var width = image.width;
var height = image.height;
var canvas = this.Document.createElement( 'canvas' );
canvas.width = width;
canvas.height = height;
var context = canvas.getContext( '2d' );
context.drawImage( image, 0, 0, width, height );
return canvas;
};

Utils.CreateCanvas = function(container, image) {
var elem = self.imageToCanvas(image);
this.Document.getElementById(container).appendChild(elem);
};

Utils.GetDecFromHex = function(h) {
return eval("0x" + h.replace("#",""));
};

Utils.HexToDarkerHex = function(hex, percent) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
var value = parseInt(255 * percent);
    return this.RgbToHex("rgb(" + (parseInt(result[1], 16) - value ? parseInt(result[1], 16) - value : "00") + "," + (parseInt(result[2], 16) - value ? parseInt(result[2], 16) - value : "00") + "," + (parseInt(result[3], 16) - value ? parseInt(result[3], 16) - value : "00") + ")");
};

Utils.HexToLighterHex = function(hex, percent) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
var value = parseInt(255 * percent);
var r = parseInt(result[1], 16) + value; if(r>=255) r = 255;
var g = parseInt(result[2], 16) + value; if(g>=255) g = 255;
var b = parseInt(result[3], 16) + value; if(b >=255) b = 255;
    var ret = this.RgbToHex("rgb(" + (r ? r : "00") + "," + (g ? g : "00") + "," + (b ? b : "00") + ")");
return ret;
};
Utils.Guid = function () {
  let guid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      guid += '-';
    } else if (i === 14) {
      guid += '4';
    } else {
      guid += Math.floor(Math.random() * 15).toString(16);
    }
  }
  return guid;
};


Utils.GetMethods = function() {
	return this.GetObjectFunctions(this).join(",");
};

Utils.CountMethods = function () {
	return this.GetMethods().split(",").length;
};

Utils.ForceDownload = function (url, fileName) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "blob";
	xhr.onload = function() {
		var urlCreator = this.Window.URL || this.Window.webkitURL;
		var imageUrl = urlCreator.createObjectURL(this.response);
		var tag = this.Document.createElement("a");
		tag.href = imageUrl;
		tag.download = fileName;
		this.Document.body.appendChild(tag);
		tag.click();
		this.Document.body.removeChild(tag);
	};
	xhr.send();
};

Utils.SetTheme = function(themeColor){
	app.SetStatusBarColor(  themeColor);
	app.SetNavBarColor( themeColor );
};

//Build and install a plugin using current project.
Utils.MakePlugin = function( name ) {
    //Do nothing in APKs.
    if( app.IsAPK() ) return
   
    //Check for name clash.
    if( name.toLowerCase() == app.GetAppName().toLowerCase() ) {
        alert( "Plugin name cannot be same as App name!" )
        return
    }
   
    //Remove spaces from name.
    name = name.replaceAll(" ","")
    var lname = name.toLowerCase()
   
    //Get plugin dir and app dir.
    app.ShowProgress()
    var plugDir = app.GetPrivateFolder("Plugins")+"/"+lname
    app.MakeFolder( plugDir )
    var appDir = app.GetAppPath()
   
    //Add important missing files.
    var refresh = false
    if( !app.FileExists( appDir+"/Version.txt" ) ) {
        app.WriteFile( appDir+"/Version.txt","1.0")
        refresh = true
    }
    if( !app.FileExists( appDir+"/"+name+".html" ) ) {
        var s = app.ReadFile( "/Sys/ide/plugin.html" );
        s = s.replaceAll( "%NAME%", name )
        app.WriteFile( appDir+"/"+name+".html", s )
        refresh = true
    }
    if( !app.FileExists( appDir+"/"+name+".js" ) ) {
        var s = app.ReadFile( "/Sys/ide/plugin.js" );
        s = s.replaceAll( "%NAME%", name )
        app.WriteFile( appDir+"/"+name+".js", s )
        refresh = true
    }
    if( !app.FileExists( appDir+"/Img/"+name+".png" ) ) {
        app.MakeFolder( appDir+"/Img" )
        app.CopyFile( "/Sys/ide/plugin.png", appDir+"/Img/"+name+".png" )
        refresh = true
    }
    if( refresh ) {
        alert( "Some missing plugin files were auto-generated." +
            " Please refresh this project to see them, then re-run it" )
        app.Exit()
		return
    }
           
    //Copy files to plugins dir.
    app.CopyFolder( appDir, plugDir, true )
    app.DeleteFile( plugDir+"/"+app.GetAppName()+".js" )
   
    //Build plugin zip file.
    var ppkDir = app.GetPath()+"/PPKs"
    app.MakeFolder( ppkDir )
    app.ZipFolder( plugDir, ppkDir+"/"+name+".ppk" )
   
    //Copy plugin docs to wifi editor.
	var docsDir = app.GetPath()+"/.edit/docs/plugins/"+lname;
	app.CopyFolder( plugDir, docsDir, true );
	var implFiles = app.ListFolder(docsDir, ".*\.jar|.\.*inc|.*\.dat|.*\.zip",
		   null, "regex,files,fullpath");
	for(var i in implFiles) app.DeleteFile( implFiles[i] );
   
    //Show finished message and exit.
    app.HideProgress()
    app.ShowPopup( "Plugin installed\n\n"+ name
        + ".ppk created in folder:\n /DroidScript/PPKs", "long" )
};

// export as AMD module / Node module / browser variable
if (typeof define === 'function' && define.amd) define(Utils);
else if (typeof module !== 'undefined') module.exports = Utils;
else window.Utils = Utils;

}());

},{}]},{},[1]);