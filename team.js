// Edita linkedin o portfolio para incorporar los enlaces personales.
// Deja "" si aún no hay enlace: el botón no se muestra.
const teamMembers = [
  { name: 'Inmer Sebastian Hernández Contreras', id: 'HC220343', initials: 'IH', linkedin: '', portfolio: '' },
  { name: 'Angel Alexander Peraza González', id: 'PG250296', initials: 'AP', linkedin: 'https://www.linkedin.com/in/angelperaza', portfolio: '' },
  { name: 'Jose Daniel Menjivar Lemus', id: 'ML210413', initials: 'JM', linkedin: '', portfolio: '' },
  { name: 'Luis Eduardo Cañas Santos', id: 'CS171609', initials: 'LC', linkedin: '', portfolio: '' }
];
const career = 'Ingeniería en Ciencias de la Computación';
const teamGrid = document.querySelector('#team-grid');
teamMembers.forEach(member => {
  const email = `${member.id}@alumno.udb.edu.sv`;
  const article = document.createElement('article');
  article.className = 'person-card';
  article.id = `persona-${member.id.toLowerCase()}`;
  article.innerHTML = `<div class="person-top"><span class="person-initials" aria-hidden="true">${member.initials}</span><img src="assets/udb-logo.jpeg" alt="Universidad Don Bosco" width="80" height="80" loading="lazy"></div><span class="person-role">Desarrollador</span><h3>${member.name}</h3><p class="person-career">${career}</p><p class="person-id">${member.id}</p><a class="person-email" href="mailto:${email}">${email}</a><div class="person-links"></div><button class="btn btn-outline-dark download-card" type="button">Descargar tarjeta PNG</button><span class="card-status" role="status"></span>`;
  const links = article.querySelector('.person-links');
  [['LinkedIn', member.linkedin], ['Portafolio', member.portfolio]].forEach(([label, url]) => {
    if (!url || !/^https?:\/\//.test(url)) return;
    const a = document.createElement('a'); a.textContent = label; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; links.append(a);
  });
  article.querySelector('button').addEventListener('click', async event => {
    const button = event.currentTarget, status = article.querySelector('.card-status');
    button.disabled = true; status.textContent = 'Preparando tarjeta…';
    try { await downloadCard(member, email); status.textContent = 'Tarjeta preparada.'; }
    catch { status.textContent = 'No se pudo descargar. Intenta nuevamente.'; }
    finally { button.disabled = false; }
  });
  teamGrid.append(article);
});
async function downloadCard(member, email) {
  const canvas = document.createElement('canvas'); canvas.width = 1050; canvas.height = 600;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 1050, 600);
  ctx.fillStyle = '#142033'; ctx.fillRect(0, 0, 260, 600);
  ctx.fillStyle = '#219444'; ctx.fillRect(260, 0, 790, 9);
  const logo = new Image(); logo.src = 'assets/udb-logo.jpeg'; await logo.decode();
  ctx.drawImage(logo, 60, 46, 140, 141);
  ctx.fillStyle = '#219444'; ctx.beginPath(); ctx.arc(130, 330, 65, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = 'bold 42px Arial'; ctx.fillText(member.initials, 130, 345);
  ctx.font = '18px Arial'; ctx.fillStyle = '#cad5e4'; ctx.fillText(member.id, 130, 437);
  ctx.textAlign = 'left';
  const write = (text, x, y, size, color, bold=false) => { ctx.font = `${bold ? 'bold ' : ''}${size}px Arial`; ctx.fillStyle = color; ctx.fillText(text, x, y); };
  const wrap = (text, y, size, color, bold=false) => {
    ctx.font = `${bold ? 'bold ' : ''}${size}px Arial`; const words = text.split(' '); let line = '';
    for (const word of words) { const next = line ? `${line} ${word}` : word; if (ctx.measureText(next).width > 715 && line) { write(line,300,y,size,color,bold);y+=size*1.25;line=word; } else line=next; }
    write(line,300,y,size,color,bold); return y;
  };
  write('DESARROLLADOR',300,64,18,'#77d89a',true);
  const bottom=wrap(member.name,119,36,'#fff',true);
  wrap(career,bottom+49,23,'#d5dfed');
  ctx.fillStyle='#445266';ctx.fillRect(300,251,700,1);
  write('GESTIÓN INTEGRAL',300,292,19,'#77d89a',true);
  write('CRM · Inventario · Administración',300,326,23,'#fff');
  write('CONTACTO',300,384,16,'#cad5e4',true);
  write(email,300,420,24,'#fff');
  if(member.linkedin) write(member.linkedin.replace(/^https?:\/\//,''),300,460,21,'#fff');
  else if(member.portfolio) wrap(member.portfolio.replace(/^https?:\/\//,''),460,21,'#fff');
  write('Universidad Don Bosco',300,554,18,'#cad5e4');
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG unavailable');
  const url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=`Tarjeta_${member.id}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
