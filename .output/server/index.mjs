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
  "/assets/academics-CZ4QgsEk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6e60-9B/hbAFJcosprwbo+G2pYVZOQLA"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 28256,
    "path": "../public/assets/academics-CZ4QgsEk.js"
  },
  "/assets/apple-play-logo-AeDlmOUk.jpg": {
    "type": "image/jpeg",
    "etag": '"dfce-LH1usyUusi/quB8pAbhIN+t7Abo"',
    "mtime": "2026-06-13T13:51:13.550Z",
    "size": 57294,
    "path": "../public/assets/apple-play-logo-AeDlmOUk.jpg"
  },
  "/assets/apple-play-logo-Z67aeMmS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6f-7wxJF5RyczsPpjiMm9Lec0nuTyU"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 111,
    "path": "../public/assets/apple-play-logo-Z67aeMmS.js"
  },
  "/assets/apple-tree-logo-BD2Xyq_m.jpg": {
    "type": "image/jpeg",
    "etag": '"245b-+lzmMaR+Htmn8++wPJkly7XbxAw"',
    "mtime": "2026-06-13T13:51:13.540Z",
    "size": 9307,
    "path": "../public/assets/apple-tree-logo-BD2Xyq_m.jpg"
  },
  "/assets/button-DlyqhJMO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7e81-F+mlrX5cdN9WyAA2jvFwhfkkgu4"',
    "mtime": "2026-06-13T13:51:13.553Z",
    "size": 32385,
    "path": "../public/assets/button-DlyqhJMO.js"
  },
  "/assets/calendar-days-Cyt36qHy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1fa-1iAaeCV0cDodB48s311e93TMuxw"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 506,
    "path": "../public/assets/calendar-days-Cyt36qHy.js"
  },
  "/assets/calendar-RnriO310.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b45-hmYRcXfF09QyZeT0Lb8u6FV+ZNQ"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 6981,
    "path": "../public/assets/calendar-RnriO310.js"
  },
  "/assets/card-BtNiAA5u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3df-JXTwk2B1JkM27GGNWNLdr/ScpMs"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 991,
    "path": "../public/assets/card-BtNiAA5u.js"
  },
  "/assets/createLucideIcon-CW3UjWiD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4b2-aopJquqEbxhWiziJBN37UhOefRk"',
    "mtime": "2026-06-13T13:51:13.553Z",
    "size": 1202,
    "path": "../public/assets/createLucideIcon-CW3UjWiD.js"
  },
  "/assets/calendar-CGIjnJ5K.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11cb9-Shc+zcIpssSFA8TxqlWSBkzapSA"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 72889,
    "path": "../public/assets/calendar-CGIjnJ5K.js"
  },
  "/assets/download-DGJXpUDT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f4-80xIFJ4P8BVcutwPawZmDf7q7kQ"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 244,
    "path": "../public/assets/download-DGJXpUDT.js"
  },
  "/assets/dashboard-D3k0jVSm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1c05-6D6MWw9+AhAGXOL4CdRiKCBn5KE"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 7173,
    "path": "../public/assets/dashboard-D3k0jVSm.js"
  },
  "/assets/constants-CDFpIFSh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3c9-y67hnVIOxHDX2GlTgci9ngWdFy8"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 969,
    "path": "../public/assets/constants-CDFpIFSh.js"
  },
  "/assets/dialog-DlHi65Lo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b77-oeXMs+864e1CrchZsy8w/oAehlo"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 7031,
    "path": "../public/assets/dialog-DlHi65Lo.js"
  },
  "/assets/index-DB35Fbfa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18b-uQ0mqbin6zPW+nxnAJhsYOM3pTs"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 395,
    "path": "../public/assets/index-DB35Fbfa.js"
  },
  "/assets/input-BkVvo2_4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24f-xdM+9rJEOPjzT6KDjVTaA9IKtq8"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 591,
    "path": "../public/assets/input-BkVvo2_4.js"
  },
  "/assets/label-DaBSif4v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22e-wqv40pOcGh0JbqTZlUxSAsRwEK4"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 558,
    "path": "../public/assets/label-DaBSif4v.js"
  },
  "/assets/login--JLtmt_u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1765-EQU3j9VTR9fi931V1JJoAXBDkZs"',
    "mtime": "2026-06-13T13:51:13.550Z",
    "size": 5989,
    "path": "../public/assets/login--JLtmt_u.js"
  },
  "/assets/loader-circle-tmQNCmqw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"97-dyGv703yg/KIuOXek0QhrOzTpBE"',
    "mtime": "2026-06-13T13:51:13.550Z",
    "size": 151,
    "path": "../public/assets/loader-circle-tmQNCmqw.js"
  },
  "/assets/other-fees-D-URg7tp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18fa-UhtHuhf1Y0fNg7xtPfYKYM2TzJk"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 6394,
    "path": "../public/assets/other-fees-D-URg7tp.js"
  },
  "/assets/reset-password-CPO15sOE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"554-pLd/M79ZfEq2+Z8SfnFA39aR3F4"',
    "mtime": "2026-06-13T13:51:13.550Z",
    "size": 1364,
    "path": "../public/assets/reset-password-CPO15sOE.js"
  },
  "/assets/import-CzgtkJjd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"683cc-dNxbofHAZ3F0LwI5+OjkIaUnH1M"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 426956,
    "path": "../public/assets/import-CzgtkJjd.js"
  },
  "/assets/search-CeiZJoX2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b5-hY16z3mmAujGkN0CW+EIb32Z3+k"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 181,
    "path": "../public/assets/search-CeiZJoX2.js"
  },
  "/assets/select-kcCxZZA0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"128a0-RbBjOfNauU5WwIoyFknJsLdZg90"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 75936,
    "path": "../public/assets/select-kcCxZZA0.js"
  },
  "/assets/index-C33S0Rkk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"91a77-blf/cGztZKuj3w1ORN0yRUFyNPg"',
    "mtime": "2026-06-13T13:51:13.553Z",
    "size": 596599,
    "path": "../public/assets/index-C33S0Rkk.js"
  },
  "/assets/settings-BHOYucip.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8c8-UyrPqkWX9TpDH0+hktpQ9/Mpoek"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 2248,
    "path": "../public/assets/settings-BHOYucip.js"
  },
  "/assets/students-BuZrjNGQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"36a2-JCXHdOIOj9Lv06UwseI8wJ7knAI"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 13986,
    "path": "../public/assets/students-BuZrjNGQ.js"
  },
  "/assets/tuition-fees-9cw_3UPY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"294c-W36nsluCR4r7iP5PJpPoe9f/B5Q"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 10572,
    "path": "../public/assets/tuition-fees-9cw_3UPY.js"
  },
  "/assets/useQuery-DmgTBQJY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2276-N/bsAS7IxtGNnHSmsyMuyim3Kr0"',
    "mtime": "2026-06-13T13:51:13.553Z",
    "size": 8822,
    "path": "../public/assets/useQuery-DmgTBQJY.js"
  },
  "/assets/styles-P_BSv9ci.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"14e3e-dq2g8zX1+/K1dOZFO0RyBq7XPDc"',
    "mtime": "2026-06-13T13:51:13.549Z",
    "size": 85566,
    "path": "../public/assets/styles-P_BSv9ci.css"
  },
  "/assets/trash-2-DJ9RrWJ3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1bd-nZj3Pf/dbigu2r1cm4/IEF9KMfU"',
    "mtime": "2026-06-13T13:51:13.552Z",
    "size": 445,
    "path": "../public/assets/trash-2-DJ9RrWJ3.js"
  },
  "/assets/wallet-2vFFIBrb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22c-vflGiZIfk0EzHWspCfDB0ScAhk8"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 556,
    "path": "../public/assets/wallet-2vFFIBrb.js"
  },
  "/assets/_authenticated-NhJRDh7D.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"bbbb-1nh2mCL1NMYVsAycg9GrdS5VXwQ"',
    "mtime": "2026-06-13T13:51:13.551Z",
    "size": 48059,
    "path": "../public/assets/_authenticated-NhJRDh7D.js"
  },
  "/assets/students._id-CN1IZz8j.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5c723-4zLsp3JmWaLCEp2Sj7T7IkwkujI"',
    "mtime": "2026-06-13T13:51:13.553Z",
    "size": 378659,
    "path": "../public/assets/students._id-CN1IZz8j.js"
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
const _lazy_XZyu87 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_XZyu87 };
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
