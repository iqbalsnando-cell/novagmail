const messages = [
  {sender:"NovaMail Team", initial:"N", color:"lavender", title:"Selamat datang di workspace demo", time:"09:41", body:"Halo! Selamat datang di NovaMail Demo. Kamu bisa menjelajahi menu, melihat pesan contoh, dan mencoba pengaturan. Ini hanya simulasi antarmuka dan tidak terhubung ke layanan email."},
  {sender:"Demo Updates", initial:"D", color:"peach", title:"Fitur baru yang bisa kamu coba", time:"Kemarin", body:"Coba buka menu Aktivitas untuk melihat log simulasi, atau Pengaturan untuk mengubah preferensi lokal. Semua data di halaman ini hanyalah contoh."},
  {sender:"Sample Notification", initial:"S", color:"mint", title:"Preferensi workspace berhasil disimulasikan", time:"Senin", body:"Pemberitahuan ini adalah pesan contoh. Pengaturan yang kamu ubah hanya digunakan untuk demonstrasi di halaman ini."},
  {sender:"NovaMail Guide", initial:"N", color:"lavender", title:"Tips menggunakan dashboard", time:"Minggu lalu", body:"Gunakan navigasi di sebelah kiri untuk menjelajahi halaman. Tombol aksi cepat bisa menambahkan catatan demo ke riwayat aktivitas."}
];
const activity = [
  ["Workspace demo dibuka","Sesi pratinjau dimulai di browser ini.","Baru saja"],
  ["Kotak masuk demo tersedia","Empat pesan contoh dimuat secara lokal.","09:41"],
  ["Preferensi awal disiapkan","Pengaturan contoh siap digunakan.","09:40"]
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let currentView = "overview";
let toastTimer;
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
function setView(view){
  if(!$("#view-"+view)) view="overview";
  currentView=view;
  $$(".view").forEach(el=>el.classList.toggle("active-view",el.id==="view-"+view));
  $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));
  const labels={overview:"Ringkasan",accounts:"Kotak masuk demo",activity:"Aktivitas",settings:"Pengaturan",help:"Panduan"};
  $("#crumbTitle").textContent=labels[view]||"Ringkasan";
  if(view==="overview"){ $("#pageTitle").innerHTML='Selamat datang, Demo User <span>✦</span>';$("#pageSubtitle").textContent="Ini adalah ruang kerja contoh untuk menjelajahi fitur NovaMail."; }
  else { $("#pageTitle").textContent=labels[view];$("#pageSubtitle").textContent=({accounts:"Jelajahi pesan contoh yang tersimpan di halaman ini.",activity:"Riwayat interaksi simulasi dalam workspace demo.",settings:"Kelola preferensi untuk pratinjau lokal.",help:"Panduan menggunakan workspace demo."})[view]||"Jelajahi workspace NovaMail."; }
  $("#sidebar").classList.remove("open");
}
function renderMessages(filter=""){
  const list=$("#allMessages");list.innerHTML="";
  const matched=messages.map((m,i)=>({...m,index:i})).filter(m=>(m.sender+" "+m.title+" "+m.body).toLowerCase().includes(filter.toLowerCase()));
  if(!matched.length){list.innerHTML='<p class="muted">Tidak ada pesan yang cocok.</p>';return}
  matched.forEach(m=>{const button=document.createElement("button");button.className="message-row";button.dataset.message=m.index;button.innerHTML=`<span class="sender-avatar ${m.color}">${m.initial}</span><span class="message-copy"><b></b><span></span></span><time></time><span class="arrow">↗</span>`;$(".message-copy b",button).textContent=m.sender;$(".message-copy span",button).textContent=m.title;button.querySelector("time").textContent=m.time;button.addEventListener("click",()=>openMessage(m.index));list.appendChild(button)});
}
function openMessage(index){const m=messages[index];if(!m)return;$("#modalTitle").textContent=m.title;$("#modalFrom").textContent=`Dari: ${m.sender} • ${m.time}`;$("#modalBody").textContent=m.body;$("#messageModal").classList.add("open");$("#messageModal").setAttribute("aria-hidden","false")}
function closeModal(){$("#messageModal").classList.remove("open");$("#messageModal").setAttribute("aria-hidden","true")}
function renderActivity(){const list=$("#timeline");list.innerHTML="";activity.forEach(([title,desc,time])=>{const row=document.createElement("div");row.className="timeline-item";row.innerHTML='<span class="timeline-mark">✓</span><div><b></b><p></p><time></time></div>';row.querySelector("b").textContent=title;row.querySelector("p").textContent=desc;row.querySelector("time").textContent=time;list.appendChild(row)})}
document.addEventListener("click",e=>{
 const viewButton=e.target.closest("[data-view]");if(viewButton){setView(viewButton.dataset.view);return}
 const msg=e.target.closest("[data-message]");if(msg){openMessage(Number(msg.dataset.message));return}
});
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");showToast(document.body.classList.contains("dark")?"Tema gelap diaktifkan":"Tema terang diaktifkan")});
$("#quickAction").addEventListener("click",()=>{const stamp=new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});activity.unshift(["Catatan demo dibuat","Kamu menambahkan aktivitas contoh baru.",stamp]);renderActivity();setView("activity");showToast("Aktivitas demo berhasil ditambahkan.")});
$("#messageSearch").addEventListener("input",e=>renderMessages(e.target.value));
$("#closeModal").addEventListener("click",closeModal);$("#modalDone").addEventListener("click",closeModal);
$("#messageModal").addEventListener("click",e=>{if(e.target===$("#messageModal"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#saveSettings").addEventListener("click",()=>showToast("Preferensi demo disimpan untuk sesi ini."));
$("#notifications").addEventListener("change",e=>showToast(e.target.checked?"Notifikasi demo aktif":"Notifikasi demo nonaktif"));
$("#weekly").addEventListener("change",e=>showToast(e.target.checked?"Ringkasan mingguan aktif":"Ringkasan mingguan nonaktif"));
renderMessages();renderActivity();
