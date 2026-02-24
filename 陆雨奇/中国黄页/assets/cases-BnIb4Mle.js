import{f as n}from"./http-m-LeLakT.js";const t="/data";async function e(){return await n(`${t}/cases.json`)}async function l(a){return(await e()).find(s=>s.slug===a)??null}export{l as a,e as g};
