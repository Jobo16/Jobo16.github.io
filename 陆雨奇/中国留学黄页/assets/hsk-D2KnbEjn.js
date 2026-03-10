import{f as n}from"./http-C3dk6mDk.js";const s="/data";async function l(){return await n(`${s}/hsk.json`)}async function r(t){return(await l()).find(a=>a.slug===t)??null}export{r as a,l as g};
