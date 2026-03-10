import{f as n}from"./http-C3dk6mDk.js";const s="/data";async function l(){return await n(`${s}/articles.json`)}async function e(t){return(await l()).find(a=>a.slug===t)??null}export{e as a,l as g};
