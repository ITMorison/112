// Subcategory analysis — standalone .cjs (CommonJS) script
// Run with: node analyze-subcategories.cjs
// Source: src/data.js, price*.json, new-products.json, src/data/*.js

const fs   = require('fs');
const path = require('path');

const SRC = 'src';

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(SRC, file), 'utf8'));
}

// ── HEADER_CATEGORIES  (from src/data.js lines 11–177) ──────────────────────
const HEADER_CATEGORIES = [
  { id:1, title:"Видеонаблюдение",                    slug:"videonablyudenie", subcategories:[
    { slug:"analogovye-videokamery",       name:"Аналоговые видеокамеры" },
    { slug:"ip-videokamery",               name:"IP видеокамеры" },
    { slug:"gibridnye-videoregistratory",  name:"Гибридные видеорегистраторы" },
    { slug:"ip-videoregistratory",         name:"IP видеорегистраторы" }
  ]},
  { id:2, title:"Домофония",                         slug:"domofoniya", subcategories:[
    { slug:"komplekty",          name:"Комплекты" },
    { slug:"vyzyvnye-paneli",    name:"Вызывные панели" },
    { slug:"monitory",           name:"Мониторы" },
    { slug:"zamki-i-dovodnye",   name:"Замки и доводчики" },
    { slug:"klavishi-i-perekhody",name:"Кнопки и переходы" }
  ]},
  { id:3, title:"Системы контроля доступа",           slug:"sistemy-kontrolya-dostupa", subcategories:[
    { slug:"kontrollery",  name:"Контроллеры" },
    { slug:"schityvateli", name:"Считыватели" },
    { slug:"turnikety",    name:"Турникеты" },
    { slug:"shlagbaummy",  name:"Шлагбаумы" }
  ]},
  { id:4, title:"IP-телефония",                       slug:"ip-telefony", subcategories:[
    { slug:"nastolnye-telefony", name:"Настольные телефоны" },
    { slug:"besprovodnye-telefony", name:"Беспроводные телефоны" },
    { slug:"otelnye-telefony", name:"Отельные телефоны" },
    { slug:"videotelefonы",    name:"Видео-телефоны" },
    { slug:"konferenciya",     name:"Конференция" },
    { slug:"mini-ats",         name:"Мини АТС" },
    { slug:"fxo-shpuli",       name:"FXO шлюзы" },
    { slug:"fxs-shpuli",       name:"FXS шлюзы" },
    { slug:"gsm-shpuli",       name:"GSM шлюзы" }
  ]},
  { id:5, title:"Пожарная сигнализация",              slug:"pozharnaya-signalizaciya", subcategories:[
    { slug:"priemno-kontolnye-pribory",name:"Приемо-контрольные приборы" },
    { slug:"izveshchateli-pozharnyе",  name:"Извещатели пожарные" },
    { slug:"izveshchateli-ohrannye",   name:"Извещатели охранные" },
    { slug:"opoveschateli-sveto-zvukovye",name:"Оповещатели свето-звуковые" }
  ]},
  { id:6, title:"Сетевое оборудование",               slug:"setevoe-oborudovanie", subcategories:[
    { slug:"marshrutizatory",name:"Маршрутизаторы" },
    { slug:"kommutatory-lan",name:"Коммутаторы LAN" },
    { slug:"kommutatory-poe",name:"Коммутаторы PoE" },
    { slug:"mediakonvertory",name:"Медиаконвертеры" },
    { slug:"sfp-moduli",     name:"SFP-модули" },
    { slug:"inzhektory-poe", name:"Инжекторы PoE" }
  ]},
  { id:7, title:"Пассивное сетевое",                  slug:"passivnoe-setevoe", subcategories:[
    { slug:"vitaya-para",               name:"Витая пара" },
    { slug:"patchkordy",                name:"Патчкорды" },
    { slug:"rozetki",                   name:"Розетки" },
    { slug:"konnektory",                name:"Коннекторы" },
    { slug:"moduli",                    name:"Модули" },
    { slug:"kabelno-provodnaya-produkciya",name:"Кабельно-проводниковая продукция" }
  ]},
  { id:8, title:"Источники бесперебойного питания",   slug:"istochniki-besperebojnogo-pitaniya", subcategories:[
    { slug:"smart-ups",       name:"Smart UPS" },
    { slug:"online-ups",      name:"Online UPS" },
    { slug:"trekhfaznye-ups", name:"Трёхфазные UPS" },
    { slug:"batareynye-bloki",name:"Батарейные блоки" },
    { slug:"akkumulyatory-dlya-ibp",name:"Аккумуляторы для ИБП" },
    { slug:"shkafi-dlya-akkumulyatorov",name:"Шкафы для аккумуляторов" }
  ]},
  { id:9, title:"Серверные шкафы",                    slug:"servernye-shkafi", subcategories:[
    { slug:"nastolnye-shkafi",       name:"Настенные" },
    { slug:"napolnye-shkafi",        name:"Напольные" },
    { slug:"komplektuyushchie-k-shkafam",name:"Комплектующие к шкафам" },
    { slug:"klimaticheskie-shkafi",  name:"Климатические шкафы" }
  ]},
  { id:10, title:"Гарнитура",                         slug:"garnitura", subcategories:[
    { slug:"provodnaya",   name:"Проводная" },
    { slug:"besprovodnaya",name:"Беспроводная" },
    { slug:"mesh-sistemy", name:"MESH-системы" }
  ]},
  { id:11, title:"WiFi оборудование",                 slug:"wifi-oborudovanie", subcategories:[
    { slug:"wifi-routery",           name:"WiFi роутеры" },
    { slug:"tochki-dostupa-wifi",     name:"Точки доступа WiFi" },
    { slug:"wifi-mosty",              name:"WiFi мосты" },
    { slug:"mesh-sistemy",            name:"MESH-системы" }
  ]},
  { id:12, title:"Радиооборудование",                 slug:"radiooborudovanie", subcategories:[
    { slug:"radiostancii",    name:"Радиостанции" },
    { slug:"antenny",         name:"Антенны" },
    { slug:"povtoriteli-svyazi",name:"Повторители связи" },
    { slug:"matchi",          name:"Мачты" }
  ]},
  { id:13, title:"Оптоволоконная продукция",          slug:"optovolokonaya-produkciya", subcategories:[
    { slug:"optovolokonnyy-kabel",name:"Оптоволоконный кабель" },
    { slug:"opticheskie-patch-kordy",name:"Оптические патч корды" },
    { slug:"adaptry-i-rozetki",   name:"Адаптеры и розетки" }
  ]}
];

// ── CATEGORY MAP  (from src/data.js lines 181–336) ──────────────────────────
const categoryMap = {
  "Аналоговые видеокамеры":                     {category:"videonablyudenie",subcategory:"analogovye-videokamery"},
  "IP видеокамеры":                             {category:"videonablyudenie",subcategory:"ip-videokamery"},
  "Гибридные видеорегистраторы":                {category:"videonablyudenie",subcategory:"gibridnye-videoregistratory"},
  "IP видеорегистраторы":                       {category:"videonablyudenie",subcategory:"ip-videoregistratory"},
  "2 мегапиксельные IP видеокамеры":            {category:"videonablyudenie",subcategory:"ip-videokamery"},
  "4 мегапиксельные IP видеокамеры":            {category:"videonablyudenie",subcategory:"ip-videokamery"},
  "5 мегапиксельные IP видеокамеры":            {category:"videonablyudenie",subcategory:"ip-videokamery"},
  "8 мегапиксельные IP видеокамеры":            {category:"videonablyudenie",subcategory:"ip-videokamery"},
  "4 канальные видеорегистраторы":              {category:"videonablyudenie",subcategory:"ip-videoregistratory"},
  "8 канальные видеорегистраторы":              {category:"videonablyudenie",subcategory:"ip-videoregistratory"},
  "16 канальные видеорегистраторы":             {category:"videonablyudenie",subcategory:"ip-videoregistratory"},
  "32 канальные видеорегистраторы":             {category:"videonablyudenie",subcategory:"ip-videoregistratory"},

  "Комплекты":                                  {category:"domofoniya",subcategory:"komplekty"},
  "Вызывные панели":                            {category:"domofoniya",subcategory:"vyzyvnye-paneli"},
  "Мониторы":                                   {category:"domofoniya",subcategory:"monitory"},
  "Замки и доводчики":                          {category:"domofoniya",subcategory:"zamki-i-dovodnye"},
  "Клавиши и переходы":                         {category:"domofoniya",subcategory:"klavishi-i-perekhody"},

  "Контроллеры":                                {category:"sistemy-kontrolya-dostupa",subcategory:"kontrollery"},
  "Считыватели":                                {category:"sistemy-kontrolya-dostupa",subcategory:"schityvateli"},
  "Турникеты":                                  {category:"sistemy-kontrolya-dostupa",subcategory:"turnikety"},
  "Шлагбаумы":                                  {category:"sistemy-kontrolya-dostupa",subcategory:"shlagbaummy"},

  "Настольные телефоны":                        {category:"ip-telefony",subcategory:"nastolnye-telefony"},
  "Беспроводные телефоны":                      {category:"ip-telefony",subcategory:"besprovodnye-telefony"},
  "Отельные телефоны":                          {category:"ip-telefony",subcategory:"otelnye-telefony"},
  "Видео-телефоны":                             {category:"ip-telefony",subcategory:"videotelefonы"},
  "Конференция":                                {category:"ip-telefony",subcategory:"konferenciya"},
  "Мини АТС":                                   {category:"ip-telefony",subcategory:"mini-ats"},
  "FXO шлюзы":                                  {category:"ip-telefony",subcategory:"fxo-shpuli"},
  "FXS шлюзы":                                  {category:"ip-telefony",subcategory:"fxs-shpuli"},
  "GSM шлюзы":                                  {category:"ip-telefony",subcategory:"gsm-shpuli"},
  "IP Телефоны":                                {category:"ip-telefony",subcategory:"nastolnye-telefony"},
  "IP АТС и шлюзы":                             {category:"ip-telefony",subcategory:"mini-ats"},
  "dect":                                       {category:"ip-telefony",subcategory:"nastolnye-telefony"},

  "Приемо-контрольные приборы":                 {category:"pozharnaya-signalizaciya",subcategory:"priemno-kontolnye-pribory"},
  "Извещатели пожарные":                        {category:"pozharnaya-signalizaciya",subcategory:"izveshchateli-pozharnyе"},
  "Извещатели охранные":                        {category:"pozharnaya-signalizaciya",subcategory:"izveshchateli-ohrannye"},
  "Оповещатели свето-звуковые":                 {category:"pozharnaya-signalizaciya",subcategory:"opoveschateli-sveto-zvukovye"},
  "GSM сигнализаторы":                          {category:"pozharnaya-signalizaciya",subcategory:"izveshchateli-ohrannye"},
  "Приемно-контрольные приборы":                {category:"pozharnaya-signalizaciya",subcategory:"priemno-kontolnye-pribory"},

  "Маршрутизаторы":                             {category:"setevoe-oborudovanie",subcategory:"marshrutizatory"},
  "Коммутаторы LAN":                            {category:"setevoe-oborudovanie",subcategory:"kommutatory-lan"},
  "Коммутаторы PoE":                            {category:"setevoe-oborudovanie",subcategory:"kommutatory-poe"},
  "Медиаконвертеры":                            {category:"setevoe-oborudovanie",subcategory:"mediakonvertory"},
  "SFP-модули":                                 {category:"setevoe-oborudovanie",subcategory:"sfp-moduli"},
  "Инжекторы PoE":                              {category:"setevoe-oborudovanie",subcategory:"inzhektory-poe"},
  "Неуправляемые SOHO":                         {category:"setevoe-oborudovanie",subcategory:"kommutatory-lan"},
  "Управляемые SOHO":                           {category:"setevoe-oborudovanie",subcategory:"kommutatory-lan"},
  "SOHO маршрутизаторы":                        {category:"setevoe-oborudovanie",subcategory:"marshrutizatory"},
  "Корпоративные маршрутизаторы":               {category:"setevoe-oborudovanie",subcategory:"marshrutizatory"},
  "GSM LTE Модемы Роутеры":                     {category:"setevoe-oborudovanie",subcategory:"marshrutizatory"},
  "Mesh системы":                               {category:"setevoe-oborudovanie",subcategory:"kommutatory-lan"},

  "Витая пара":                                 {category:"passivnoe-setevoe",subcategory:"vitaya-para"},
  "Патчкорды":                                  {category:"passivnoe-setevoe",subcategory:"patchkordy"},
  "Розетки":                                    {category:"passivnoe-setevoe",subcategory:"rozetki"},
  "Коннекторы":                                 {category:"passivnoe-setevoe",subcategory:"konnektory"},
  "Модули":                                     {category:"passivnoe-setevoe",subcategory:"moduli"},
  "Кабельно-проводниковая продукция":           {category:"passivnoe-setevoe",subcategory:"kabelno-provodnaya-produkciya"},
  "Кабели витая пара":                          {category:"passivnoe-setevoe",subcategory:"vitaya-para"},
  "Сетевые патч корды":                         {category:"passivnoe-setevoe",subcategory:"patchkordy"},
  "Колпачки (буты)":                            {category:"passivnoe-setevoe",subcategory:"konnektory"},
  "Соединительные панели и муфты":              {category:"passivnoe-setevoe",subcategory:"rozetki"},
  "Лицевые панели":                             {category:"passivnoe-setevoe",subcategory:"rozetki"},
  "Розетки настенные":                          {category:"passivnoe-setevoe",subcategory:"rozetki"},
  "Силовой кабель и провод":                    {category:"passivnoe-setevoe",subcategory:"kabelno-provodnaya-produkciya"},
  "Патч-Панели":                                {category:"passivnoe-setevoe",subcategory:"rozetki"},

  "Smart UPS":                                  {category:"istochniki-besperebojnogo-pitaniya",subcategory:"smart-ups"},
  "Online UPS":                                 {category:"istochniki-besperebojnogo-pitaniya",subcategory:"online-ups"},
  "Трёхфазные UPS":                             {category:"istochniki-besperebojnogo-pitaniya",subcategory:"trekhfaznye-ups"},
  "Батарейные блоки":                           {category:"istochniki-besperebojnogo-pitaniya",subcategory:"batareynye-bloki"},
  "Аккумуляторы для ИБП":                       {category:"istochniki-besperebojnogo-pitaniya",subcategory:"akkumulyatory-dlya-ibp"},
  "Шкафы для аккумуляторов":                    {category:"istochniki-besperebojnogo-pitaniya",subcategory:"shkafi-dlya-akkumulyatorov"},

  "Настольные":                                 {category:"servernye-shkafi",subcategory:"nastolnye-shkafi"},
  "Напольные":                                  {category:"servernye-shkafi",subcategory:"napolnye-shkafi"},
  "Комплектующие к шкафам":                     {category:"servernye-shkafi",subcategory:"komplektuyushchie-k-shkafam"},
  "Климатические шкафы":                        {category:"servernye-shkafi",subcategory:"klimaticheskie-shkafi"},
  "Шкафы напольные, серверные":                 {category:"servernye-shkafi",subcategory:"napolnye-shkafi"},
  "Шкафы навесные, настенные":                  {category:"servernye-shkafi",subcategory:"nastolnye-shkafi"},
  "Аксессуары для шкафов и стоек":              {category:"servernye-shkafi",subcategory:"komplektuyushchie-k-shkafam"},

  "Проводная":                                  {category:"garnitura",subcategory:"provodnaya"},
  "Беспроводная":                               {category:"garnitura",subcategory:"besprovodnaya"},
  "MESH-системы":                               {category:"garnitura",subcategory:"mesh-sistemy"},
  "Проводные мыши":                             {category:"garnitura",subcategory:"provodnaya"},
  "Беспроводные мыши":                          {category:"garnitura",subcategory:"besprovodnaya"},
  "Гарнитуры и микрофоны":                      {category:"garnitura",subcategory:"provodnaya"},
  "Офисные наушники и гарнитуры":               {category:"garnitura",subcategory:"provodnaya"},

  "WiFi роутеры":                               {category:"wifi-oborudovanie",subcategory:"wifi-routery"},
  "Точки доступа WiFi":                         {category:"wifi-oborudovanie",subcategory:"tochki-dostupa-wifi"},
  "WiFi мосты":                                 {category:"wifi-oborudovanie",subcategory:"wifi-mosty"},
  "Корпоративный Wi-Fi":                        {category:"wifi-oborudovanie",subcategory:"tochki-dostupa-wifi"},
  "Wi-Fi радио мосты":                          {category:"wifi-oborudovanie",subcategory:"wifi-mosty"},
  "Репитеры/усилители Wi-Fi":                   {category:"wifi-oborudovanie",subcategory:"tochki-dostupa-wifi"},

  "Радиостанции":                               {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Антенны":                                    {category:"radiooborudovanie",subcategory:"antenny"},
  "Повторители связи":                          {category:"radiooborudovanie",subcategory:"povtoriteli-svyazi"},
  "Матчи":                                      {category:"radiooborudovanie",subcategory:"matchi"},
  "Подавители связи":                           {category:"radiooborudovanie",subcategory:"antenny"},
  "Мачты":                                      {category:"radiooborudovanie",subcategory:"antenny"},
  "Аккумуляторы":                               {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Зарядные устройства":                        {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Ретрансляторы":                              {category:"radiooborudovanie",subcategory:"povtoriteli-svyazi"},
  "Дуплексеры":                                 {category:"radiooborudovanie",subcategory:"matchi"},
  "Инверторы":                                  {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Преобразователи":                            {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Репитеры":                                   {category:"radiooborudovanie",subcategory:"povtoriteli-svyazi"},
  "GPS-трекеры":                                {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Кронштейны":                                 {category:"radiooborudovanie",subcategory:"antenny"},
  "Кабели":                                     {category:"radiooborudovanie",subcategory:"antenny"},
  "Громкоговорители":                           {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Сплиттеры":                                  {category:"radiooborudovanie",subcategory:"matchi"},
  "Усилители":                                  {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Блоки питания":                              {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Программаторы":                              {category:"radiooborudovanie",subcategory:"radiostancii"},
  "5.4. GSM-маяки":                             {category:"radiooborudovanie",subcategory:"povtoriteli-svyazi"},
  "7.4. Источники питания":                     {category:"radiooborudovanie",subcategory:"radiostancii"},
  "Радиосинхронизаторы":                        {category:"radiooborudovanie",subcategory:"povtoriteli-svyazi"},

  "Оптоволоконный кабель":                      {category:"optovolokonaya-produkciya",subcategory:"optovolokonnyy-kabel"},
  "Оптические патч корды":                      {category:"optovolokonaya-produkciya",subcategory:"opticheskie-patch-kordy"},
  "Адаптеры и розетки":                         {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"},
  "Оптические модули 1G SFP":                   {category:"optovolokonaya-produkciya",subcategory:"optovolokonnyy-kabel"},
  "Оптические модули 10G SFP+":                 {category:"optovolokonaya-produkciya",subcategory:"optovolokonnyy-kabel"},
  "Оптические модули 25G SFP28":                {category:"optovolokonaya-produkciya",subcategory:"optovolokonnyy-kabel"},
  "Оптические модули 40G QSFP+":                {category:"optovolokonaya-produkciya",subcategory:"optovolokonnyy-kabel"},
  "Оптические модули 100G QSFP28":              {category:"optovolokonaya-produkciya",subcategory:"optovolokonnyy-kabel"},
  "Оптические муфты":                           {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"},
  "Оптические полки и кроссы":                   {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"},
  "Оптоволоконные адаптеры и розетки":           {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"},
  "Оптоволоконные сплиттеры":                   {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"},
  "Оборудование xPON":                          {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"},
  "РОЗЕТКИ АБОНЕНТСКИЕ":                        {category:"optovolokonaya-produkciya",subcategory:"adaptry-i-rozetki"}
};

// ── Category-to-slug lookup  ────────────────────────────────────────────────
function normalizeKey(s) {
  return String(s||'').toLowerCase().replace(/[^a-z0-9а-яё]+/g, ' ').trim();
}
const normMap = Object.fromEntries(
  Object.entries(categoryMap).map(([k,v]) => [normalizeKey(k), v])
);
const catKeys    = Object.keys(categoryMap);
const catKeysLow = catKeys.map(k => k.toLowerCase());

// Same heuristic mapping as in src/data.js
function resolveMapping(rawKey, name, fullName) {
  let m = categoryMap[rawKey];
  if (!m) {
    const txt = (String(name||'')+' '+String(fullName||'')+' '+String(rawKey||'')).toLowerCase();
    const hasVideo   = /видеокам|видеокамера|видеорегистрат|видеодомофон|видеодомоф/i.test(txt);
    const hasAnalog  = /аналог|cvbs|hdcvi|tvi|ahd/i.test(txt);
    const hasIpVid   = /ip\b|ip\s|ip-/i.test(txt);
    const hasHybrid  = /гибрид|hybrid/i.test(txt);
    if (hasVideo) {
      if (hasAnalog || hasHybrid) m = {category:'videonablyudenie',subcategory:'analogovye-videokamery'};
      else if (hasIpVid)          m = {category:'videonablyudenie',subcategory:'ip-videokamery'};
      else                        m = {category:'videonablyudenie',subcategory:'ip-videokamery'};
    }
    if (!m && /видеорегистрат|регистратор/i.test(txt)) {
      m = (hasHybrid||hasAnalog)
        ? {category:'videonablyudenie',subcategory:'gibridnye-videoregistratory'}
        : {category:'videonablyudenie',subcategory:'ip-videoregistratory'};
    }
  }
  if (!m) m = normMap[normalizeKey(rawKey)];
  if (!m) {
    const lo = String(rawKey).toLowerCase();
    for (const k of catKeys) {
      if (!k) continue;
      if (lo.includes(k.toLowerCase())) { m = categoryMap[k]; break; }
    }
  }
  if (!m) {
    const lo = String(rawKey).toLowerCase();
    for (const k of catKeys) {
      if (!k) continue;
      if (k.toLowerCase().includes(lo) && lo.length > 2) { m = categoryMap[k]; break; }
    }
  }
  return m;  // may be undefined
}

// ── Build subcategory index from HEADER_CATEGORIES ───────────────────────────
const subIndex = {};   // slug -> { categorySlug, subcategorySlug, name, categoryTitle }
HEADER_CATEGORIES.forEach(hc => {
  hc.subcategories.forEach(sc => {
    subIndex[sc.slug] = { categorySlug:hc.slug, subcategorySlug:sc.slug, name:sc.name, categoryTitle:hc.title };
  });
});

// ── Count products from JSON price files ─────────────────────────────────────
const JSON_FILES = ['new-products.json','price1-products.json','price2-products.json','price3-products.json'];
const subcnt = {};   // subcategorySlug -> count

JSON_FILES.forEach(fname => {
  try {
    const data = loadJson(fname);
    data.forEach(p => {
      const rawKey = p.category_raw || p.category || '';
      const mapping = resolveMapping(rawKey, p.name, p.fullName);
      if (mapping && mapping.subcategory) {
        subcnt[mapping.subcategory] = (subcnt[mapping.subcategory] || 0) + 1;
      }
    });
  } catch(e) {
    console.log('  [warn] Could not load', fname, e.message);
  }
});

// ── Count products from src/data/*.js files ──────────────────────────────────
const dataDir = path.join(SRC, 'data');
const jsFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));

const jsSubcatCnt = {};   // subcategorySlug -> count  (only from data JS files)

function getSubcatFromJsFile(fname) {
  const fullPath = path.join(dataDir, fname);
  const content  = fs.readFileSync(fullPath, 'utf8');
  // Prefer explicit "category" field on the first product object
  const m = content.match(/"category"\s*:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

jsFiles.forEach(fname => {
  const slug = getSubcatFromJsFile(fname);
  if (!slug) return;

  const fullPath = path.join(dataDir, fname);
  const content  = fs.readFileSync(fullPath, 'utf8');

  // Count items: find the exported array and count articul entries
  const exportArrMatch = content.match(/export\s+const\s+\w+\s*=\s*\[([\s\S]*?)\];/);
  let count = 0;
  if (exportArrMatch) {
    count = (exportArrMatch[1].match(/"articul"/g) || []).length;
  } else {
    count = (content.match(/\{["']articul["']/g) || []).length;
  }
  if (count > 0) {
    jsSubcatCnt[slug] = (jsSubcatCnt[slug] || 0) + count;
  }
});

// ── Union of all seen subcategory slugs ──────────────────────────────────────
const allPriceSlugs    = new Set(Object.keys(subcnt));
const allJsFileSlugs   = new Set(Object.keys(jsSubcatCnt));
// Also slugs from categoryMap not yet in HEADER_CATEGORIES
Object.values(categoryMap).forEach(m => {
  if (m.subcategory && !subIndex[m.subcategory]) allPriceSlugs.add(m.subcategory);
});

// ── Output ───────────────────────────────────────────────────────────────────
console.log();
console.log('═'.repeat(70));
console.log('  SUBCATEGORY ANALYSIS   (data.js  +  price{1,2,3}-products.json  +  new-products.json  +  src/data/*.js)');
console.log('═'.repeat(70));

// A. HEADER_CATEGORIES subcategories with NO products
console.log();
console.log('── HEADER_CATEGORIES subcategories with NO products ──────────────────');
const missing = [];
HEADER_CATEGORIES.forEach(hc => {
  hc.subcategories.forEach(sc => {
    const total = (subcnt[sc.slug]||0) + (jsSubcatCnt[sc.slug]||0);
    if (total === 0) missing.push({ ...subIndex[sc.slug] });
  });
});
if (!missing.length) {
  console.log('  ✓ All header subcategories have at least one product.');
} else {
  console.log(`  ✗  ${missing.length} subcategory(s) have NO products:\n`);
  missing.forEach(sc => console.log(`    [${sc.categorySlug}/${sc.subcategorySlug}]  ${sc.name}`));
}

// B. HEADER_CATEGORIES subcategories WITH products
console.log();
console.log('── HEADER_CATEGORIES subcategories with products ─────────────────────');
const present = [];
HEADER_CATEGORIES.forEach(hc => {
  hc.subcategories.forEach(sc => {
    const priceCnt = subcnt[sc.slug] || 0;
    const jsCnt    = jsSubcatCnt[sc.slug] || 0;
    const total    = priceCnt + jsCnt;
    if (total > 0) present.push({ ...subIndex[sc.slug], priceCount:priceCnt, jsCount:jsCnt, total });
  });
});
present.sort((a, b) => b.total - a.total);
console.log(`  Total: ${present.length} / ${Object.keys(subIndex).length} header subcategories have products\n`);
present.forEach(sc => {
  console.log(`    ${sc.name}  (${sc.categorySlug} / ${sc.subcategorySlug})`);
  console.log(`        price files: ${sc.priceCount}   js data files: ${sc.jsCount}   total: ${sc.total}`);
});
const grandTotal = present.reduce((s, c) => s + c.total, 0);
console.log(`  ──────────────────────────────────────────────────────────────`);
console.log(`  Grand total products mapped to header subcategories: ${grandTotal}`);

// C. Subcategories in data sources but NOT in HEADER_CATEGORIES
console.log();
console.log('── Subcategories in data but NOT in HEADER_CATEGORIES ─────────────────');
const notInHdr = [...new Set([
  ...[...allPriceSlugs].filter(s => !subIndex[s]),
  ...[...allJsFileSlugs].filter(s => !subIndex[s])
])].sort();

if (!notInHdr.length) {
  console.log('  ✓ No extraneous subcategories found outside HEADER_CATEGORIES.');
} else {
  console.log(`  ✗  ${notInHdr.length} subcategory(s) exist in data sources but are NOT in HEADER_CATEGORIES:\n`);
  notInHdr.forEach(slug => {
    const priceCnt = subcnt[slug] || 0;
    const jsCnt    = jsSubcatCnt[slug] || 0;
    const total    = priceCnt + jsCnt;
    // Show which categoryMap keys point to this slug
    const mapKeys  = catKeys.filter(k => categoryMap[k].subcategory === slug);
    const extra    = mapKeys.length ? mapKeys.map(k => `"${k}"`).join(', ') : '(not in categoryMap)';
    console.log(`    "${slug}"   → ${total} products  (price: ${priceCnt}, js: ${jsCnt})`);
    if (mapKeys.length) console.log(`        categoryMap keys: ${extra}`);
  });
}

// D. Per-file breakdown
console.log();
console.log('── Products per source file ────────────────────────────────────────');
JSON_FILES.forEach(fname => {
  try {
    const data = loadJson(fname);
    const cats = {};
    data.forEach(p => {
      const rawKey = p.category_raw || p.category || '';
      const mapping = resolveMapping(rawKey, p.name, p.fullName);
      if (mapping && mapping.subcategory) cats[mapping.subcategory] = (cats[mapping.subcategory]||0)+1;
    });
    console.log(`  ${fname}   (${data.length} rows → ${Object.keys(cats).length} subcategories)`);
    Object.entries(cats)
      .sort((a,b) => b[1]-a[1])
      .forEach(([slug, cnt]) => console.log(`    ${String(cnt).padStart(4)}  ${slug}`));
  } catch(e) {
    console.log(`  ${fname}   (error: ${e.message})`);
  }
});

console.log();
console.log('═'.repeat(70));
console.log();
