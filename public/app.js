const msgs=document.getElementById('messages'),input=document.getElementById('prompt'),btn=document.getElementById('send');
let loading=false;
function addMsg(role,text){
const d=document.createElement('div');d.className='msg '+role;
const bubble=document.createElement('div');bubble.className='bubble';bubble.textContent=text;
const avatar=document.createElement('div');avatar.className='avatar';avatar.textContent=role==='assistant'?'AI':'You';
if(role==='assistant'){d.appendChild(avatar);d.appendChild(bubble);}
else{d.appendChild(bubble);d.appendChild(avatar);}
msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;}
function showTyping(){const d=document.createElement('div');d.className='msg assistant';d.id='typing';
const av=document.createElement('div');av.className='avatar';av.textContent='AI';
const t=document.createElement('div');t.className='typing';
for(let i=0;i<3;i++){const s=document.createElement('span');t.appendChild(s);}
d.appendChild(av);d.appendChild(t);msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
function removeTyping(){const t=document.getElementById('typing');if(t)t.remove();}
input.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,120)+'px';
const has=this.value.trim();btn.className=has?'active':'inactive';btn.disabled=!has||loading;});
input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
btn.addEventListener('click',send);
function agentToken(){let t='';try{t=localStorage.getItem('agentToken')||'';}catch{/* storage blocked: fall through to prompt */}if(!t){t=prompt('Agent API token')||'';try{localStorage.setItem('agentToken',t);}catch{/* storage blocked: token kept for this call only */}}return t;}
async function send(){const text=input.value.trim();if(!text||loading)return;
loading=true;btn.disabled=true;btn.className='inactive';addMsg('user',text);input.value='';input.style.height='auto';
showTyping();
try{const r=await fetch('/agent',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+agentToken()},body:JSON.stringify({prompt:text})});
const d=await r.json();removeTyping();
if(d.response)addMsg('assistant',d.response);else if(d.error)addMsg('assistant','Error: '+d.error);
else addMsg('assistant',JSON.stringify(d));}
catch(e){removeTyping();addMsg('assistant','Error: '+e.message);}
loading=false;const has=input.value.trim();btn.className=has?'active':'inactive';btn.disabled=!has;input.focus();}
input.focus();
