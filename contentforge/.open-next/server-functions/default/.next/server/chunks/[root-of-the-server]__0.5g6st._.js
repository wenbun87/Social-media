module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18520,e=>e.a(async(t,r)=>{try{let t=await e.y("@libsql/client-6da938047d5fc1cd");e.n(t),r()}catch(e){r(e)}},!0),43793,e=>e.a(async(t,r)=>{try{var a=e.i(18520),n=t([a]);[a]=n.then?(await n)():n;let s=(0,a.createClient)({url:process.env.TURSO_DATABASE_URL||"file:local.db",authToken:process.env.TURSO_AUTH_TOKEN});async function i(){await s.executeMultiple(`
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      rating INTEGER NOT NULL DEFAULT 3,
      platforms TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'raw',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS voice_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      tone TEXT NOT NULL DEFAULT '[]',
      brand_statement TEXT NOT NULL DEFAULT '',
      target_audience TEXT NOT NULL DEFAULT '',
      niche TEXT NOT NULL DEFAULT '[]',
      recurring_themes TEXT NOT NULL DEFAULT '[]',
      topics_to_avoid TEXT NOT NULL DEFAULT '[]',
      sample_content TEXT NOT NULL DEFAULT ''
    );

    INSERT OR IGNORE INTO voice_profile (id) VALUES (1);

    CREATE TABLE IF NOT EXISTS content_pieces (
      id TEXT PRIMARY KEY,
      idea_id TEXT,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      format TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      scheduled_date TEXT,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trending_topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      engagement_score INTEGER NOT NULL DEFAULT 50,
      velocity TEXT NOT NULL DEFAULT 'rising',
      related_keywords TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_entries (
      id TEXT PRIMARY KEY,
      content_piece_id TEXT NOT NULL,
      impressions INTEGER NOT NULL DEFAULT 0,
      engagement INTEGER NOT NULL DEFAULT 0,
      clicks INTEGER NOT NULL DEFAULT 0,
      shares INTEGER NOT NULL DEFAULT 0,
      saves INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      recorded_at TEXT NOT NULL
    );
  `)}e.s(["default",0,s,"initializeDatabase",0,i]),r()}catch(e){r(e)}},!1),27377,e=>e.a(async(t,r)=>{try{var a=e.i(43793),n=e.i(89171),i=t([a]);async function s(){try{await (0,a.initializeDatabase)();let e=await a.default.execute("SELECT * FROM voice_profile WHERE id = 1");if(0===e.rows.length)return n.NextResponse.json({tone:[],brandStatement:"",targetAudience:"",niche:[],recurringThemes:[],topicsToAvoid:[],sampleContent:""});let t=e.rows[0];return n.NextResponse.json({tone:JSON.parse(t.tone),brandStatement:t.brand_statement,targetAudience:t.target_audience,niche:JSON.parse(t.niche),recurringThemes:JSON.parse(t.recurring_themes),topicsToAvoid:JSON.parse(t.topics_to_avoid),sampleContent:t.sample_content})}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}async function o(e){try{await (0,a.initializeDatabase)();let{tone:t,brandStatement:r,targetAudience:i,niche:s,recurringThemes:o,topicsToAvoid:l,sampleContent:d}=await e.json();return await a.default.execute({sql:"UPDATE voice_profile SET tone = ?, brand_statement = ?, target_audience = ?, niche = ?, recurring_themes = ?, topics_to_avoid = ?, sample_content = ? WHERE id = 1",args:[JSON.stringify(t||[]),r||"",i||"",JSON.stringify(s||[]),JSON.stringify(o||[]),JSON.stringify(l||[]),d||""]}),n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}[a]=i.then?(await i)():i,e.s(["GET",0,s,"PUT",0,o]),r()}catch(e){r(e)}},!1),81660,e=>e.a(async(t,r)=>{try{var a=e.i(47909),n=e.i(74017),i=e.i(96250),s=e.i(59756),o=e.i(61916),l=e.i(74677),d=e.i(69741),T=e.i(16795),c=e.i(87718),u=e.i(95169),p=e.i(47587),E=e.i(66012),N=e.i(70101),L=e.i(26937),R=e.i(10372),h=e.i(93695);e.i(52474);var U=e.i(220),A=e.i(27377),O=t([A]);[A]=O.then?(await O)():O;let g=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/voice/route",pathname:"/api/voice",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/voice/route.ts",nextConfigOutput:"standalone",userland:A,...{}}),{workAsyncStorage:x,workUnitAsyncStorage:m,serverHooks:f}=g;async function v(e,t,r){r.requestMeta&&(0,s.setRequestMeta)(e,r.requestMeta),g.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/voice/route";a=a.replace(/\/index$/,"")||"/";let i=await g.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:A,params:O,nextConfig:v,parsedUrl:x,isDraftMode:m,prerenderManifest:f,routerServerContext:_,isOnDemandRevalidate:w,revalidateOnlyGenerated:y,resolvedPathname:S,clientReferenceManifest:C,serverActionsManifest:X}=i,D=(0,d.normalizeAppPath)(a),I=!!(f.dynamicRoutes[D]||f.routes[S]),b=async()=>((null==_?void 0:_.render404)?await _.render404(e,t,x,!1):t.end("This page could not be found"),null);if(I&&!m){let e=!!f.routes[S],t=f.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(v.adapterPath)return await b();throw new h.NoFallbackError}}let F=null;!I||g.isDev||m||(F=S,F="/index"===F?"/":F);let P=!0===g.isDev||!I,q=I&&!P;X&&C&&(0,l.setManifestsSingleton)({page:a,clientReferenceManifest:C,serverActionsManifest:X});let k=e.method||"GET",j=(0,o.getTracer)(),M=j.getActiveScopeSpan(),H=!!(null==_?void 0:_.isWrappedByNextServer),K=!!(0,s.getRequestMeta)(e,"minimalMode"),G=(0,s.getRequestMeta)(e,"incrementalCache")||await g.getIncrementalCache(e,v,f,K);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let B={params:O,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:P,incrementalCache:G,cacheLifeProfiles:v.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>g.onRequestError(e,t,a,n,_)},sharedContext:{buildId:A}},Y=new T.NodeNextRequest(e),$=new T.NodeNextResponse(t),J=c.NextRequestAdapter.fromNodeNextRequest(Y,(0,c.signalFromNodeResponse)(t));try{let i,s=async e=>g.handle(J,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${k} ${a}`)}),l=async i=>{var o,l;let d=async({previousCacheEntry:n})=>{try{if(!K&&w&&y&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(i);e.fetchMetrics=B.renderOpts.fetchMetrics;let o=B.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let l=B.renderOpts.collectedTags;if(!I)return await (0,E.sendResponse)(Y,$,a,B.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:U.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await g.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:w})},!1,_),t}},T=await g.handleResponse({req:e,nextConfig:v,cacheKey:F,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:w,revalidateOnlyGenerated:y,responseGenerator:d,waitUntil:r.waitUntil,isMinimalMode:K});if(!I)return null;if((null==T||null==(o=T.value)?void 0:o.kind)!==U.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==T||null==(l=T.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",w?"REVALIDATED":T.isMiss?"MISS":T.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,N.fromNodeOutgoingHttpHeaders)(T.value.headers);return K&&I||c.delete(R.NEXT_CACHE_TAGS_HEADER),!T.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,L.getCacheControlHeader)(T.cacheControl)),await (0,E.sendResponse)(Y,$,new Response(T.value.body,{headers:c,status:T.value.status||200})),null};H&&M?await l(M):(i=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(u.BaseServerSpan.handleRequest,{spanName:`${k} ${a}`,kind:o.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},l),void 0,!H))}catch(t){if(t instanceof h.NoFallbackError||await g.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:w})},!1,_),I)throw t;return await (0,E.sendResponse)(Y,$,new Response(null,{status:500})),null}}e.s(["handler",0,v,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:m})},"routeModule",0,g,"serverHooks",0,f,"workAsyncStorage",0,x,"workUnitAsyncStorage",0,m]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.5g6st._.js.map