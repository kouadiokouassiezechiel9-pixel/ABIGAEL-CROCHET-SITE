const fmt=n=>n.toLocaleString("fr-FR");
const cards=[...document.querySelectorAll(".card")],chips=[...document.querySelectorAll(".chips button")];
chips.forEach(b=>b.addEventListener("click",()=>{chips.forEach(c=>c.setAttribute("aria-pressed",c===b));cards.forEach(c=>c.hidden=b.dataset.f!=="all"&&c.dataset.cat!==b.dataset.f)}));

// Lightbox
const lb=document.getElementById("lb"),li=lb.querySelector("img");
document.querySelectorAll(".ph").forEach(p=>p.addEventListener("click",()=>{li.src=p.firstElementChild.src;li.alt=p.firstElementChild.alt;lb.classList.add("on")}));
lb.addEventListener("click",()=>lb.classList.remove("on"));

// Prix selon la taille
document.querySelectorAll(".size-select").forEach(s=>s.addEventListener("change",()=>{
  const v=parseInt(s.selectedOptions[0].dataset.price),p=s.closest(".card").querySelector(".pr");
  p.dataset.price=v;p.textContent=fmt(v)+" FCFA";
}));

// Panier
let cart=[];
const itemsEl=document.getElementById("cart-items"),totalEl=document.getElementById("cart-total"),countEl=document.getElementById("cart-count"),emptyEl=document.getElementById("cart-empty");
const total=()=>cart.reduce((s,i)=>s+i.price*i.qty,0);
const label=i=>i.name+(i.size?" ("+i.size+")":"")+(i.qty>1?" x "+i.qty:"");
function render(){
  itemsEl.innerHTML="";
  cart.forEach((it,idx)=>{
    const row=document.createElement("div");row.className="cart-item";
    const t=document.createElement("span");t.textContent=label(it)+" — "+fmt(it.price*it.qty)+" FCFA";
    const b=document.createElement("button");b.textContent="Retirer";b.setAttribute("aria-label","Retirer "+it.name);
    b.addEventListener("click",()=>{it.qty>1?it.qty--:cart.splice(idx,1);render()});
    row.append(t,b);itemsEl.append(row);
  });
  totalEl.textContent=fmt(total());
  countEl.textContent=cart.reduce((n,i)=>n+i.qty,0);
  emptyEl.hidden=cart.length>0;
}
document.querySelectorAll(".add").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".card"),name=card.querySelector("h3").textContent,price=parseInt(card.querySelector(".pr").dataset.price);
  const sel=card.querySelector(".size-select"),size=sel?sel.value:"";
  const ex=cart.find(i=>i.name===name&&i.size===size);
  ex?ex.qty++:cart.push({name,size,price,qty:1});
  render();
  btn.textContent="Ajouté ✓";setTimeout(()=>btn.textContent="Ajouter au panier",1200);
}));
render();

// Commande par WhatsApp
const modal=document.getElementById("modal");
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){alert("Votre panier est vide !");return}
  modal.classList.add("on");
});
modal.querySelector(".x").addEventListener("click",()=>modal.classList.remove("on"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("on")});
document.getElementById("order-form").addEventListener("submit",e=>{
  e.preventDefault();
  const msg="Bonjour, je suis "+document.getElementById("name").value+".\n"+
    "Téléphone : "+document.getElementById("phone").value+"\n"+
    "Email : "+document.getElementById("email").value+"\n\n"+
    "Commande : "+cart.map(i=>label(i)+" ("+fmt(i.price*i.qty)+" FCFA)").join(", ")+"\n"+
    "Total : "+fmt(total())+" FCFA";
  window.open("https://wa.me/2250161334977?text="+encodeURIComponent(msg),"_blank");
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){lb.classList.remove("on");modal.classList.remove("on")}});
