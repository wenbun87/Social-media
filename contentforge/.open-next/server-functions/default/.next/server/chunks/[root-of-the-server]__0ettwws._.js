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
  `)}e.s(["default",0,s,"initializeDatabase",0,i]),a()}catch(e){a(e)}},!1),90870,e=>e.a(async(t,a)=>{try{var r=e.i(43793),n=e.i(89171),i=t([r]);async function s(e,{params:t}){try{await (0,r.initializeDatabase)();let{id:a}=await t,{title:i,platform:s,category:o,engagementScore:l,velocity:d,relatedKeywords:T}=await e.json();return await r.default.execute({sql:"UPDATE trending_topics SET title = ?, platform = ?, category = ?, engagement_score = ?, velocity = ?, related_keywords = ? WHERE id = ?",args:[i,s,o||"",l||50,d||"rising",JSON.stringify(T||[]),a]}),n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}async function o(e,{params:t}){try{await (0,r.initializeDatabase)();let{id:e}=await t;return await r.default.execute({sql:"DELETE FROM trending_topics WHERE id = ?",args:[e]}),n.NextResponse.json({ok:!0})}catch(e){return n.NextResponse.json({error:String(e)},{status:500})}}[r]=i.then?(await i)():i,e.s(["DELETE",0,o,"PUT",0,s]),a()}catch(e){a(e)}},!1),60412,e=>e.a(async(t,a)=>{try{var r=e.i(47909),n=e.i(74017),i=e.i(96250),s=e.i(59756),o=e.i(61916),l=e.i(74677),d=e.i(69741),T=e.i(16795),c=e.i(87718),u=e.i(95169),E=e.i(47587),p=e.i(66012),N=e.i(70101),L=e.i(26937),R=e.i(10372),U=e.i(93695);e.i(52474);var h=e.i(220),A=e.i(90870),g=t([A]);[A]=g.then?(await g)():g;let O=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/trending/[id]/route",pathname:"/api/trending/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/trending/[id]/route.ts",nextConfigOutput:"standalone",userland:A,...{}}),{workAsyncStorage:v,workUnitAsyncStorage:f,serverHooks:w}=O;async function x(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),O.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/trending/[id]/route";r=r.replace(/\/index$/,"")||"/";let i=await O.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,params:g,nextConfig:x,parsedUrl:v,isDraftMode:f,prerenderManifest:w,routerServerContext:m,isOnDemandRevalidate:y,revalidateOnlyGenerated:_,resolvedPathname:C,clientReferenceManifest:D,serverActionsManifest:X}=i,I=(0,d.normalizeAppPath)(r),S=!!(w.dynamicRoutes[I]||w.routes[C]),F=async()=>((null==m?void 0:m.render404)?await m.render404(e,t,v,!1):t.end("This page could not be found"),null);if(S&&!f){let e=!!w.routes[C],t=w.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await F();throw new U.NoFallbackError}}let b=null;!S||O.isDev||f||(b=C,b="/index"===b?"/":b);let P=!0===O.isDev||!S,k=S&&!P;X&&D&&(0,l.setManifestsSingleton)({page:r,clientReferenceManifest:D,serverActionsManifest:X});let q=e.method||"GET",j=(0,o.getTracer)(),M=j.getActiveScopeSpan(),H=!!(null==m?void 0:m.isWrappedByNextServer),K=!!(0,s.getRequestMeta)(e,"minimalMode"),G=(0,s.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,x,w,K);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let B={params:g,previewProps:w.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:P,incrementalCache:G,cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>O.onRequestError(e,t,r,n,m)},sharedContext:{buildId:A}},Y=new T.NodeNextRequest(e),$=new T.NodeNextResponse(t),W=c.NextRequestAdapter.fromNodeNextRequest(Y,(0,c.signalFromNodeResponse)(t));try{let i,s=async e=>O.handle(W,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",n),i.updateName(t))}else e.updateName(`${q} ${r}`)}),l=async i=>{var o,l;let d=async({previousCacheEntry:n})=>{try{if(!K&&y&&_&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(i);e.fetchMetrics=B.renderOpts.fetchMetrics;let o=B.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let l=B.renderOpts.collectedTags;if(!S)return await (0,p.sendResponse)(Y,$,r,B.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,N.toNodeOutgoingHttpHeaders)(r.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:y})},!1,m),t}},T=await O.handleResponse({req:e,nextConfig:x,cacheKey:b,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:w,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:_,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:K});if(!S)return null;if((null==T||null==(o=T.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==T||null==(l=T.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});K||t.setHeader("x-nextjs-cache",y?"REVALIDATED":T.isMiss?"MISS":T.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,N.fromNodeOutgoingHttpHeaders)(T.value.headers);return K&&S||c.delete(R.NEXT_CACHE_TAGS_HEADER),!T.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,L.getCacheControlHeader)(T.cacheControl)),await (0,p.sendResponse)(Y,$,new Response(T.value.body,{headers:c,status:T.value.status||200})),null};H&&M?await l(M):(i=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(u.BaseServerSpan.handleRequest,{spanName:`${q} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l),void 0,!H))}catch(t){if(t instanceof U.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:y})},!1,m),S)throw t;return await (0,p.sendResponse)(Y,$,new Response(null,{status:500})),null}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:f})},"routeModule",0,O,"serverHooks",0,w,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,f]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ettwws._.js.map