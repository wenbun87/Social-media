module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18520,e=>e.a(async(t,a)=>{try{let t=await e.y("@libsql/client-6da938047d5fc1cd");e.n(t),a()}catch(e){a(e)}},!0),43793,e=>e.a(async(t,a)=>{try{var r=e.i(18520),n=t([r]);[r]=n.then?(await n)():n;let i=(0,r.createClient)({url:process.env.TURSO_DATABASE_URL||"file:local.db",authToken:process.env.TURSO_AUTH_TOKEN});async function s(){await i.executeMultiple(`
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
  `)}e.s(["default",0,i,"initializeDatabase",0,s]),a()}catch(e){a(e)}},!1),47381,e=>e.a(async(t,a)=>{try{var r=e.i(43793),n=e.i(89171),s=t([r]);async function i(){try{await (0,r.initializeDatabase)();let e=(await r.default.execute("SELECT * FROM analytics_entries ORDER BY recorded_at DESC")).rows.map(e=>({id:e.id,contentPieceId:e.content_piece_id,impressions:e.impressions,engagement:e.engagement,clicks:e.clicks,shares:e.shares,saves:e.saves,comments:e.comments,recordedAt:e.recorded_at}));return n.NextResponse.json(e)}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}async function o(e){try{await (0,r.initializeDatabase)();let{id:t,contentPieceId:a,impressions:s,engagement:i,clicks:o,shares:l,saves:d,comments:T,recordedAt:c}=await e.json();return await r.default.execute({sql:`INSERT INTO analytics_entries (id, content_piece_id, impressions, engagement, clicks, shares, saves, comments, recorded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,args:[t,a,s||0,i||0,o||0,l||0,d||0,T||0,c||new Date().toISOString()]}),n.NextResponse.json({ok:!0},{status:201})}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}[r]=s.then?(await s)():s,e.s(["GET",0,i,"POST",0,o]),a()}catch(e){a(e)}},!1),32424,e=>e.a(async(t,a)=>{try{var r=e.i(47909),n=e.i(74017),s=e.i(96250),i=e.i(59756),o=e.i(61916),l=e.i(74677),d=e.i(69741),T=e.i(16795),c=e.i(87718),u=e.i(95169),p=e.i(47587),E=e.i(66012),N=e.i(70101),L=e.i(26937),R=e.i(10372),h=e.i(93695);e.i(52474);var U=e.i(220),A=e.i(47381),O=t([A]);[A]=O.then?(await O)():O;let v=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/analytics/route",pathname:"/api/analytics",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/analytics/route.ts",nextConfigOutput:"standalone",userland:A,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:m,serverHooks:f}=v;async function x(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),v.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/analytics/route";r=r.replace(/\/index$/,"")||"/";let s=await v.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,params:O,nextConfig:x,parsedUrl:g,isDraftMode:m,prerenderManifest:f,routerServerContext:y,isOnDemandRevalidate:_,revalidateOnlyGenerated:w,resolvedPathname:C,clientReferenceManifest:I,serverActionsManifest:S}=s,D=(0,d.normalizeAppPath)(r),X=!!(f.dynamicRoutes[D]||f.routes[C]),F=async()=>((null==y?void 0:y.render404)?await y.render404(e,t,g,!1):t.end("This page could not be found"),null);if(X&&!m){let e=!!f.routes[C],t=f.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await F();throw new h.NoFallbackError}}let b=null;!X||v.isDev||m||(b=C,b="/index"===b?"/":b);let P=!0===v.isDev||!X,k=X&&!P;S&&I&&(0,l.setManifestsSingleton)({page:r,clientReferenceManifest:I,serverActionsManifest:S});let q=e.method||"GET",j=(0,o.getTracer)(),M=j.getActiveScopeSpan(),H=!!(null==y?void 0:y.isWrappedByNextServer),K=!!(0,i.getRequestMeta)(e,"minimalMode"),G=(0,i.getRequestMeta)(e,"incrementalCache")||await v.getIncrementalCache(e,x,f,K);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let B={params:O,previewProps:f.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:P,incrementalCache:G,cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>v.onRequestError(e,t,r,n,y)},sharedContext:{buildId:A}},Y=new T.NodeNextRequest(e),$=new T.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(Y,(0,c.signalFromNodeResponse)(t));try{let s,i=async e=>v.handle(V,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${q} ${r}`)}),l=async s=>{var o,l;let d=async({previousCacheEntry:n})=>{try{if(!K&&_&&w&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await i(s);e.fetchMetrics=B.renderOpts.fetchMetrics;let o=B.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=B.renderOpts.collectedTags;if(!X)return await (0,E.sendResponse)(Y,$,r,B.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(r.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:U.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:_})},!1,y),t}},T=await v.handleResponse({req:e,nextConfig:x,cacheKey:b,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:_,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:K});if(!X)return null;if((null==T||null==(o=T.value)?void 0:o.kind)!==U.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==T||null==(l=T.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",_?"REVALIDATED":T.isMiss?"MISS":T.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,N.fromNodeOutgoingHttpHeaders)(T.value.headers);return K&&X||c.delete(R.NEXT_CACHE_TAGS_HEADER),!T.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,L.getCacheControlHeader)(T.cacheControl)),await (0,E.sendResponse)(Y,$,new Response(T.value.body,{headers:c,status:T.value.status||200})),null};H&&M?await l(M):(s=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(u.BaseServerSpan.handleRequest,{spanName:`${q} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!H))}catch(t){if(t instanceof h.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:_})},!1,y),X)throw t;return await (0,E.sendResponse)(Y,$,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:m})},"routeModule",0,v,"serverHooks",0,f,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,m]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__093g7x_._.js.map