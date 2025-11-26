// Versão estática do protótipo — sem backend.
// Dados persistidos em localStorage para demonstração em trabalho universitário.

const INITIAL_HORTAS = [
  {id:1, nome:"Horta Piloto - Escola", descricao:"Horta comunitária na escola municipal", latitude:-23.55052, longitude:-46.633308, bairro:"Centro", cidade:"São Paulo", plantas:["Alface","Tomate"]},
  {id:2, nome:"Horta Bairro Verde", descricao:"Horta colaborativa do bairro", latitude:-23.545, longitude:-46.64, bairro:"Vila", cidade:"São Paulo", plantas:["Cenoura","Coentro"]}
];

const PLANTAS = [
  {id:1, nome_comum:"Alface", nome_cientifico:"Lactuca sativa", necessidades:"Solo fértil, rega moderada; meia-sombra", epoca_plantio:"Mar–Out", adubacao:"NPK 4-14-8; cobertura orgânica"},
  {id:2, nome_comum:"Cenoura", nome_cientifico:"Daucus carota", necessidades:"Solo solto e profundo, luz plena", epoca_plantio:"Abr–Set", adubacao:"Adubação fosfatada na semeadura"},
  {id:3, nome_comum:"Tomate", nome_cientifico:"Solanum lycopersicum", necessidades:"Solo bem drenado, luz plena", epoca_plantio:"Set–Jan", adubacao:"NPK equilibrado; suporte e poda"}
];

// Utils localStorage
function loadHortas(){
  const raw = localStorage.getItem('hortas_v1');
  if(!raw) {
    localStorage.setItem('hortas_v1', JSON.stringify(INITIAL_HORTAS));
    return INITIAL_HORTAS.slice();
  }
  try{ return JSON.parse(raw); } catch(e){ localStorage.setItem('hortas_v1', JSON.stringify(INITIAL_HORTAS)); return INITIAL_HORTAS.slice(); }
}
function saveHortas(hortas){ localStorage.setItem('hortas_v1', JSON.stringify(hortas)); }

// Map setup
const map = L.map('map').setView([-23.55, -46.63], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(map);
let markers = L.layerGroup().addTo(map);

function renderMarkers(){
  markers.clearLayers();
  const hortas = loadHortas();
  hortas.forEach(h => {
    const m = L.marker([h.latitude, h.longitude]).addTo(markers);
    const popup = `<strong>${h.nome}</strong><br/>${h.bairro || ''} - ${h.cidade || ''}<br/>Plantas: ${h.plantas ? h.plantas.join(', ') : ''}`;
    m.bindPopup(popup);
  });
}
renderMarkers();

// Hortas list UI
function renderHortasList(){
  const list = document.getElementById('hortasList');
  list.innerHTML='';
  const hortas = loadHortas();
  hortas.forEach(h => {
    const div = document.createElement('div'); div.className='item';
    const left = document.createElement('div');
    left.innerHTML = `<strong>${h.nome}</strong><div class="meta">${h.bairro || ''} - ${h.cidade || ''}</div><div class="meta">${h.plantas ? h.plantas.join(', ') : ''}</div>`;
    const right = document.createElement('div');
    const btn = document.createElement('button'); btn.className='btn btn-ghost'; btn.textContent='Ver no mapa';
    btn.onclick = () => { map.setView([h.latitude, h.longitude], 16); };
    right.appendChild(btn);
    div.appendChild(left); div.appendChild(right);
    list.appendChild(div);
  });
}
renderHortasList();

// Form actions
document.getElementById('hortaForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const bairro = document.getElementById('bairro').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const plantas = document.getElementById('plantas').value.split(',').map(s=>s.trim()).filter(Boolean);

  if(!nome || Number.isNaN(latitude) || Number.isNaN(longitude)){ alert('Preencha nome, latitude e longitude corretamente.'); return; }
  const hortas = loadHortas();
  const id = hortas.length ? Math.max(...hortas.map(h=>h.id))+1 : 1;
  hortas.push({id, nome, descricao, latitude, longitude, bairro, cidade, plantas});
  saveHortas(hortas);
  renderMarkers(); renderHortasList();
  e.target.reset();
  alert('Horta cadastrada (persistida no navegador).');
});

document.getElementById('clearBtn').addEventListener('click', ()=>{ document.getElementById('hortaForm').reset(); });

// Reset to initial data
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('Restaurar dados iniciais e apagar alterações locais?')){
    localStorage.removeItem('hortas_v1');
    renderMarkers(); renderHortasList();
    location.reload();
  }
});

// Locate user
document.getElementById('locateBtn').addEventListener('click', ()=>{
  if(navigator.geolocation) navigator.geolocation.getCurrentPosition(pos=> map.setView([pos.coords.latitude, pos.coords.longitude], 15));
  else alert('Geolocalização não suportada neste navegador.');
});

// Plant manual UI
function renderPlantList(filter=''){
  const list = document.getElementById('plantList'); list.innerHTML='';
  PLANTAS.filter(p => p.nome_comum.toLowerCase().includes(filter.toLowerCase())).forEach(p => {
    const d = document.createElement('div'); d.className='plant-card'; d.textContent = p.nome_comum + ' — ' + p.nome_cientifico;
    d.onclick = ()=> showPlantDetail(p.id);
    list.appendChild(d);
  });
}
function showPlantDetail(id){
  const p = PLANTAS.find(x=>x.id===id);
  const el = document.getElementById('plantDetail');
  el.innerHTML = `<h4>${p.nome_comum} <small class="meta">(${p.nome_cientifico})</small></h4>
    <p><strong>Necessidades:</strong> ${p.necessidades}</p>
    <p><strong>Época de plantio:</strong> ${p.epoca_plantio}</p>
    <p><strong>Adubação:</strong> ${p.adubacao}</p>`;
}
document.getElementById('searchPlant').addEventListener('input', (e)=> renderPlantList(e.target.value));

// Inicializa
renderPlantList();