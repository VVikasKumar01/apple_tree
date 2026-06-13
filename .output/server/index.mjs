globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as defineLazyEventHandler, H as HTTPError, a as H3Core } from "./_libs/h3.mjs";
import { a as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/assets/calendar-BDruvw9w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1667-6FunjHj0mn8Z+AgusWwnOSaIa3c"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 5735,
    "path": "../public/assets/calendar-BDruvw9w.js"
  },
  "/assets/academics-k18P9fqO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5a65-1zeHhSoSBSnOzBaR3eVgi1yWWtE"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 23141,
    "path": "../public/assets/academics-k18P9fqO.js"
  },
  "/assets/constants-HNLEfXPm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b5-hsdsDtYFyQWHcOZXZF4aP59XlFw"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 181,
    "path": "../public/assets/constants-HNLEfXPm.js"
  },
  "/assets/card-DWhF-ICV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3df-a5paPj++sz3VmwbCBB5hfI35ihc"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 991,
    "path": "../public/assets/card-DWhF-ICV.js"
  },
  "/assets/button-C78ejQzA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7cca-5ljV39XhNo1Ob4NLBAQNee5sHJg"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 31946,
    "path": "../public/assets/button-C78ejQzA.js"
  },
  "/assets/calendar-DGnzw9k8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11cb9-a19bJX02rY338xaxuJbrjOWj8L0"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 72889,
    "path": "../public/assets/calendar-DGnzw9k8.js"
  },
  "/assets/createLucideIcon-D7IhSoex.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4b2-0dtwhTGHynmYTxnlWH58tSCd9+g"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 1202,
    "path": "../public/assets/createLucideIcon-D7IhSoex.js"
  },
  "/assets/dashboard-ew7fVkSl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"141b-UjqtR/AkxsdekKsNma0VOzmlLsE"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 5147,
    "path": "../public/assets/dashboard-ew7fVkSl.js"
  },
  "/assets/dialog-BlbFsl_K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b8f-7150A7RdtSnyQMWTb0fqs4r0Vok"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 7055,
    "path": "../public/assets/dialog-BlbFsl_K.js"
  },
  "/assets/import-CCjwAbLx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"683cc-IuZHxTeX6N2qgxb6u+Mqu8IoI4c"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 426956,
    "path": "../public/assets/import-CCjwAbLx.js"
  },
  "/assets/download-o9v4Mtu1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f4-At8e99+eQ1EsSQ0OUrPX/BF079I"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 244,
    "path": "../public/assets/download-o9v4Mtu1.js"
  },
  "/assets/index-DWIrIjSj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"212-7xvxPV1F0Z+9TCg8EXmUVIBw7TE"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 530,
    "path": "../public/assets/index-DWIrIjSj.js"
  },
  "/assets/index-NmcHYzIL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18b-iwHM0youRwT885rjLpqHtJOOwn8"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 395,
    "path": "../public/assets/index-NmcHYzIL.js"
  },
  "/assets/input-CTe2IfQx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-Aswmn6sRnRrNho4inZNwei9HLXM"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 591,
    "path": "../public/assets/input-CTe2IfQx.js"
  },
  "/assets/index-CTuwcY9S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ce89-HI4sA8g+WnRHL+UKS3NsjDluGRE"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 52873,
    "path": "../public/assets/index-CTuwcY9S.js"
  },
  "/assets/loader-circle-CL8Meb1i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"97-APvP9nHxeF9LsqE741RtrQuUBv4"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 151,
    "path": "../public/assets/loader-circle-CL8Meb1i.js"
  },
  "/assets/reset-password-BOazxi4K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"570-c2b3eOdjB8DIGktod1yINRSHTyo"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 1392,
    "path": "../public/assets/reset-password-BOazxi4K.js"
  },
  "/assets/login-lHZQLOLJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"151a-G6Ar/DJwx5nxadcYrexopyyu0nI"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 5402,
    "path": "../public/assets/login-lHZQLOLJ.js"
  },
  "/assets/label-DgCPVUIt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-mOYiPmdoq2Ag9Ya7rXiW/p/1LVc"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 591,
    "path": "../public/assets/label-DgCPVUIt.js"
  },
  "/assets/school-BRR-mVxa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1cb-/J8wX5uXFCt01jBDQPhulTOZXWA"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 459,
    "path": "../public/assets/school-BRR-mVxa.js"
  },
  "/assets/other-fees-E0jPHWTf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18c3-j6WI9DcruTpVFBTka0/kk+k7wRI"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 6339,
    "path": "../public/assets/other-fees-E0jPHWTf.js"
  },
  "/assets/search-CwszHfn_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b5-TTbkcDABkmb90RyCQT5VIeeCMD0"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 181,
    "path": "../public/assets/search-CwszHfn_.js"
  },
  "/assets/select-BUZ8lERZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5b27-rdjzhh2PvM0c/xvimpT4Ofh5tw0"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 23335,
    "path": "../public/assets/select-BUZ8lERZ.js"
  },
  "/assets/settings-BGiMnN7D.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8e4-xrIJiqJvFrA2WAByPWdrZ5L8kkA"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 2276,
    "path": "../public/assets/settings-BGiMnN7D.js"
  },
  "/assets/index-hB6lHD-s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"91ab8-OvvVGUFqZ2TkHw4e2/GNxxmXT/c"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 596664,
    "path": "../public/assets/index-hB6lHD-s.js"
  },
  "/assets/students-DiE_uSX7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"34b6-yiKT6JJhCJH7xMQ16rr27pGVUoA"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 13494,
    "path": "../public/assets/students-DiE_uSX7.js"
  },
  "/assets/styles-C8j0AQ1G.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"14f0c-E7unbxPEAk8YTl9HnXdQrV1XTJc"',
    "mtime": "2026-06-12T16:08:55.622Z",
    "size": 85772,
    "path": "../public/assets/styles-C8j0AQ1G.css"
  },
  "/assets/types-obIg9RbA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11c-m8O6c/cuuUCbrz6BrwwempmNIY8"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 284,
    "path": "../public/assets/types-obIg9RbA.js"
  },
  "/assets/trash-2-DOWNfw1v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1bd-t6W50MaDtfdwAcZxHnDVG7xFgV4"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 445,
    "path": "../public/assets/trash-2-DOWNfw1v.js"
  },
  "/assets/useQuery-Df5yet9V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2276-b5f5lj5TjiqAm0MoJ5GrNcddBjc"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 8822,
    "path": "../public/assets/useQuery-Df5yet9V.js"
  },
  "/assets/tuition-fees-pMsupei9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"295c-OzJP56rpXglpMcyGwG4QE/qNm7g"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 10588,
    "path": "../public/assets/tuition-fees-pMsupei9.js"
  },
  "/assets/wallet-ByQjBYgT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22c-5Eq3LFAX3eGkxEptAhbcHgxnD2Q"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 556,
    "path": "../public/assets/wallet-ByQjBYgT.js"
  },
  "/assets/_authenticated-BsVNBEp1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b39b-8rKZNqqGmKOMSVxlmrdncMjsWlE"',
    "mtime": "2026-06-12T16:08:55.629Z",
    "size": 45979,
    "path": "../public/assets/_authenticated-BsVNBEp1.js"
  },
  "/assets/students._id-CJgax2p0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5c29d-3Rb7VVXdbNwE9bioZhlVy29L8H4"',
    "mtime": "2026-06-12T16:08:55.630Z",
    "size": 377501,
    "path": "../public/assets/students._id-CJgax2p0.js"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_x0CxDh = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_x0CxDh };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
