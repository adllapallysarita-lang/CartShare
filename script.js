let user = "", roomCode = "";
let cart = JSON.parse(localStorage.getItem("cartshare_cart") || "[]");
let logs = JSON.parse(localStorage.getItem("cartshare_logs") || "[]");
let members = JSON.parse(localStorage.getItem("cartshare_members") || "[]");

function joinRoom() {
  user = document.getElementById("userName").value.trim();
  if(!user) return alert("Name daal pehle");
  roomCode = document.getElementById("roomInput").value.trim() || "CART-" + Math.floor(1000 + Math.random()*9000);
  if(!members.includes(user)) members.push(user);
  saveAll();
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("appScreen").style.display = "block";
  document.getElementById("displayRoom").innerText = roomCode;
  document.getElementById("displayCode").innerText = roomCode;
  render();
}

function saveAll() {
  localStorage.setItem("cartshare_cart", JSON.stringify(cart));
  localStorage.setItem("cartshare_logs", JSON.stringify(logs));
  localStorage.setItem("cartshare_members", JSON.stringify(members));
  localStorage.setItem("cartshare_room", roomCode);
}

function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = Number(document.getElementById("itemPrice").value);
  const qty = Number(document.getElementById("itemQty").value) || 1;
  if(!name || !price) return alert("Item aur Price daal");
  cart.push({name, price, qty, addedBy: user});
  logs.unshift(`${user} added ${name} - ${new Date().toLocaleTimeString()}`);
  document.getElementById("itemName").value = ""; document.getElementById("itemPrice").value = "";
  saveAll(); render();
}

function removeItem(i) {
  logs.unshift(`${user} removed ${cart[i].name} - ${new Date().toLocaleTimeString()}`);
  cart.splice(i,1); saveAll(); render();
}

function render() {
  document.getElementById("members").innerText = members.join(", ");
  let total = 0;
  document.getElementById("cartList").innerHTML = cart.map((it,i)=>{
    total += it.price*it.qty;
    return `<div class="cart-item"><span>${it.name} x${it.qty} - $${it.price} <small>by ${it.addedBy}</small></span><button class="btn btn-sm btn-danger" onclick="removeItem(${i})">Remove</button></div>`;
  }).join("") || "Cart khali hai";
  document.getElementById("total").innerText = total.toFixed(2);
  let pct = Math.min(100, (total/75)*100);
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressText").innerText = total >= 75 ? "🎉 Free Delivery Unlocked!" : `$${total.toFixed(2)} / $75 - $${(75-total).toFixed(2)} aur chahiye free delivery ke liye`;
  document.getElementById("activityLog").innerHTML = logs.map(l=>`<div>• ${l}</div>`).join("") || "No activity yet";
}

function generateReceipt() {
  let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  if(!total) return alert("Cart khali hai");
  let per = (total / members.length).toFixed(2);
  document.getElementById("receipt").style.display = "block";
  document.getElementById("receipt").innerHTML = `
    <h3>CartShare - Receipt</h3><p>Room: ${roomCode} | Date: ${new Date().toLocaleString()}</p><hr>
    ${cart.map(i=>`<div>${i.name} x${i.qty} - $${(i.price*i.qty).toFixed(2)} (by ${i.addedBy})</div>`).join("")}
    <hr><b>Total: $${total.toFixed(2)}</b><br><b>Split (${members.length} members): $${per} each</b>
    <br><button class="btn btn-success mt-2" onclick="window.print()">Print Receipt</button>`;
}

function copyCode(){ navigator.clipboard.writeText(roomCode); alert("Copied: "+roomCode); }
function leaveRoom(){ location.reload(); }

// Collaboration: Doosri tab me change hoga to ye tab auto-update hoga
window.addEventListener("storage", (e)=>{
  cart = JSON.parse(localStorage.getItem("cartshare_cart") || "[]");
  logs = JSON.parse(localStorage.getItem("cartshare_logs") || "[]");
  members = JSON.parse(localStorage.getItem("cartshare_members") || "[]");
  render();
});

// Agar pehle se room hai to auto-login
if(localStorage.getItem("cartshare_room")){
  document.getElementById("roomInput").value = localStorage.getItem("cartshare_room");
}