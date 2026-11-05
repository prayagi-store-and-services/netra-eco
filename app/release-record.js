/* Audited release record, never represented as proof of the newest release. */
(function(root){"use strict";function validate(x,now){
 if(!x||x.schema!==1||x.repo!=="prayagi-store-and-services/netra-eco-app"||x.package!=="com.prayagi.netraeco"||!/^v\d+\.\d+\.\d+$/.test(x.tag)||x.versionName!==x.tag.slice(1)||!Number.isSafeInteger(x.versionCode)||x.versionCode<1||!Number.isSafeInteger(x.size)||x.size<1||!Number.isSafeInteger(x.minSdk)||x.minSdk<1||!/^[a-f0-9]{64}$/.test(x.sha256))return null;
 var t=Date.parse(x.verifiedAt),p=Date.parse(x.publishedAt);if(!Number.isFinite(t)||!Number.isFinite(p)||p>t||t>now||now-t>86400000)return null;
 var base="https://github.com/"+x.repo+"/releases/";if(x.source!==base+"tag/"+x.tag||x.apk!==base+"download/"+x.tag+"/app-release.apk")return null;return x;
}root.NetraVerifiedRelease=validate;if(typeof module!=="undefined")module.exports=validate;})(typeof window!=="undefined"?window:globalThis);
