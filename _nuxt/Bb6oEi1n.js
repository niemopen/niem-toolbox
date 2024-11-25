import{e as i,x as a,o as p,c as m,a as o,d as l,t as d,f}from"./IfM_cEiG.js";import{C as u}from"./C0e8eNHv.js";const c={class:"m-5"},k=i({__name:"test",async setup(y){let e,t;console.log("HERE");let r=([e,t]=a(()=>fetch(u.baseURL+"stewards/niem/models/model/versions/5.0/properties/nc:PersonGivenName")),e=await e,t(),e),n="";return r.ok?n=([e,t]=a(()=>r.json()),e=await e,t(),e):console.error("Property request failed",r),(_,s)=>(p(),m("div",c,[s[2]||(s[2]=o("p",{class:"mb-5"},[o("a",{href:"/"},"Back")],-1)),s[3]||(s[3]=o("h2",null,"TEST",-1)),o("pre",null,[s[0]||(s[0]=l("      ")),o("code",null,`
`+d(JSON.stringify(f(n),void 0,2))+`
      `,1),s[1]||(s[1]=l(`
    `))])]))}});export{k as default};
