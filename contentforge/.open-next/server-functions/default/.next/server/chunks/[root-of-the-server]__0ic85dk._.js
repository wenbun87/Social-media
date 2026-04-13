module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18520,e=>e.a(async(t,a)=>{try{let t=await e.y("@libsql/client-6da938047d5fc1cd");e.n(t),a()}catch(e){a(e)}},!0),43793,e=>e.a(async(t,a)=>{try{var r=e.i(18520),n=t([r]);[r]=n.then?(await n)():n;let s=(0,r.createClient)({url:process.env.TURSO_DATABASE_URL||"file:local.db",authToken:process.env.TURSO_AUTH_TOKEN});async function i(){await s.executeMultiple(`
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
  `)}e.s(["default",0,s,"initializeDatabase",0,i]),a()}catch(e){a(e)}},!1),7268,e=>e.a(async(t,a)=>{try{var r=e.i(43793),n=e.i(89171),i=t([r]);async function s(e,{params:t}){try{await (0,r.initializeDatabase)();let{id:e}=await t;return await r.default.execute({sql:"DELETE FROM analytics_entries WHERE id = ?",args:[e]}),n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}[r]=i.then?(await i)():i,e.s(["DELETE",0,s]),a()}catch(e){a(e)}},!1),62020,e=>e.a(async(t,a)=>{try{var r=e.i(47909),n=e.i(74017),i=e.i(96250),s=e.i(59756),o=e.i(61916),l=e.i(74677),T=e.i(69741),d=e.i(16795),c=e.i(87718),u=e.i(95169),E=e.i(47587),p=e.i(66012),N=e.i(70101),L=e.i(26937),R=e.i(10372),U=e.i(93695);e.i(52474);var h=e.i(220),A=e.i(7268),O=t([A]);[A]=O.then?(await O)():O;let v=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/analytics/[id]/route",pathname:"/api/analytics/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/analytics/[id]/route.ts",nextConfigOutput:"standalone",userland:A,...{}}),{workAsyncStorage:g,workUnitAsyncStorage:f,serverHooks:y}=v;async function x(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),v.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/analytics/[id]/route";r=r.replace(/\/index$/,"")||"/";let i=await v.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,params:O,nextConfig:x,parsedUrl:g,isDraftMode:f,prerenderManifest:y,routerServerContext:m,isOnDemandRevalidate:w,revalidateOnlyGenerated:_,resolvedPathname:C,clientReferenceManifest:X,serverActionsManifest:D}=i,I=(0,T.normalizeAppPath)(r),F=!!(y.dynamicRoutes[I]||y.routes[C]),S=async()=>((null==m?void 0:m.render404)?await m.render404(e,t,g,!1):t.end("This page could not be found"),null);if(F&&!f){let e=!!y.routes[C],t=y.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await S();throw new U.NoFallbackError}}let b=null;!F||v.isDev||f||(b=C,b="/index"===b?"/":b);let P=!0===v.isDev||!F,q=F&&!P;D&&X&&(0,l.setManifestsSingleton)({page:r,clientReferenceManifest:X,serverActionsManifest:D});let k=e.method||"GET",M=(0,o.getTracer)(),H=M.getActiveScopeSpan(),j=!!(null==m?void 0:m.isWrappedByNextServer),K=!!(0,s.getRequestMeta)(e,"minimalMode"),G=(0,s.getRequestMeta)(e,"incrementalCache")||await v.getIncrementalCache(e,x,y,K);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let B={params:O,previewProps:y.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:P,incrementalCache:G,cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>v.onRequestError(e,t,r,n,m)},sharedContext:{buildId:A}},Y=new d.NodeNextRequest(e),$=new d.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(Y,(0,c.signalFromNodeResponse)(t));try{let i,s=async e=>v.handle(V,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=M.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${k} ${r}`)}),l=async i=>{var o,l;let T=async({previousCacheEntry:n})=>{try{if(!K&&w&&_&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(i);e.fetchMetrics=B.renderOpts.fetchMetrics;let o=B.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=B.renderOpts.collectedTags;if(!F)return await (0,p.sendResponse)(Y,$,r,B.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(r.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:w})},!1,m),t}},d=await v.handleResponse({req:e,nextConfig:x,cacheKey:b,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:w,revalidateOnlyGenerated:_,responseGenerator:T,waitUntil:a.waitUntil,isMinimalMode:K});if(!F)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",w?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,N.fromNodeOutgoingHttpHeaders)(d.value.headers);return K&&F||c.delete(R.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,L.getCacheControlHeader)(d.cacheControl)),await (0,p.sendResponse)(Y,$,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};j&&H?await l(H):(i=M.getActiveScopeSpan(),await M.withPropagatedContext(e.headers,()=>M.trace(u.BaseServerSpan.handleRequest,{spanName:`${k} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},l),void 0,!j))}catch(t){if(t instanceof U.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:w})},!1,m),F)throw t;return await (0,p.sendResponse)(Y,$,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:f})},"routeModule",0,v,"serverHooks",0,y,"workAsyncStorage",0,g,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ic85dk._.js.map