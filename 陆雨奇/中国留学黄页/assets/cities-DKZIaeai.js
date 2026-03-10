import{f as n}from"./http-C3dk6mDk.js";const s="/data";async function i(){return await n(`${s}/cities.json`)}async function e(t){return(await i()).find(a=>a.slug===t)??null}export{e as a,i as g};
