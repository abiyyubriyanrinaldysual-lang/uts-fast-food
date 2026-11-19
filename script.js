/* =============================================
   DATA MENU
============================================= */
const buka = true;

const menu = [
    { nama: "Burger",  harga: 25000, img: "Photo.jpg/burger.jpg"  },
    { nama: "Kentang", harga: 15000, img: "Photo.jpg/kentang.jpg" },
    { nama: "Soda",    harga: 25000, img: "Photo.jpg/cocacola.jpg"},
    { nama: "Es Krim", harga: 10000, img: "Photo.jpg/esKrim.jpg"  }
];

/* =============================================
   RENDER MENU CARDS
============================================= */
const daftar = document.getElementById("daftar-menu");
const pilih  = document.getElementById("item");
const hasil  = document.getElementById("hasil");

menu.forEach((m, i) => {
    // Grid card
    daftar.innerHTML += `
        <div class="kartu" onclick="quickSelect(${i})">
            <img src="${m.img}" alt="${m.nama}" onerror="this.src='https://via.placeholder.com/300x160?text=${encodeURIComponent(m.nama)}'">
            <h3>${m.nama}</h3>
            <p class="harga">Rp ${m.harga.toLocaleString("id-ID")}</p>
            <button class="btn-kartu" onclick="event.stopPropagation(); quickSelect(${i})">+ Pesan</button>
        </div>`;

    // Dropdown option
    pilih.innerHTML += `<option value="${i}">${m.nama} – Rp ${m.harga.toLocaleString("id-ID")}</option>`;
});

/** Scroll to form and pre-select a menu item */
function quickSelect(index) {
    pilih.value = index;
    document.getElementById("pesan").scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   PRICING LOGIC
============================================= */
function hitungTotal(harga, jumlah) {
    let total = harga * jumlah;
    if      (jumlah >= 10) total *= 0.80;
    else if (jumlah >= 5)  total *= 0.90;
    return total;
}

// Console stats
const totalHargaMenu = menu.reduce((t, m) => t + m.harga, 0);
const murah          = menu.filter(m => m.harga < 20000).map(m => m.nama);
console.log("Total harga satu dari tiap menu:", totalHargaMenu);
console.log("Menu murah:", murah);

/* =============================================
   ORDER FORM
============================================= */
document.getElementById("form-pesan").addEventListener("submit", function (e) {
    e.preventDefault();
    hasil.className = "";

    if (!buka) {
        hasil.textContent = "Mohon maaf, toko sedang tutup.";
        hasil.className   = "error";
        return;
    }

    const nama   = document.getElementById("nama").value.trim();
    const m      = menu[Number(pilih.value)];
    const jumlah = Number(document.getElementById("jumlah").value);
    const catatan= document.getElementById("catatan").value.trim();

    if (!nama) {
        hasil.textContent = "⚠️ Harap isi nama pemesan.";
        hasil.className   = "error";
        return;
    }

    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 50) {
        hasil.textContent = "⚠️ Jumlah pesanan harus antara 1 sampai 50.";
        hasil.className   = "error";
        return;
    }

    const total   = hitungTotal(m.harga, jumlah);
    const diskon  = jumlah >= 10 ? " (diskon 20%)" : jumlah >= 5 ? " (diskon 10%)" : "";
    const catatanTeks = catatan ? `\nCatatan: ${catatan}` : "";

    hasil.innerHTML = `✅ Pesanan berhasil!<br>
        👤 ${nama} memesan <strong>${jumlah}× ${m.nama}</strong>${diskon}<br>
        💰 Total: <strong>Rp ${total.toLocaleString("id-ID")}</strong>${catatan ? `<br>📝 ${catatan}` : ""}`;
    hasil.className = "success";
});

/* =============================================
   CHATBOT
============================================= */
const API_URL = "http://localhost:7860/api/v1/run/3582949e-fb35-4bbb-ad67-84a2b30b95ae";
const API_KEY = "sk-s6rUkqvj_b2Wcfl53nJLLahPbSoBrnuZ-TiQs-Yi3H8";

/** Generate a UUID (v4-compatible) without Node's crypto */
function generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

// Reuse session ID across messages
const SESSION_ID = generateUUID();

const chatToggle  = document.getElementById("chat-toggle");
const chatWindow  = document.getElementById("chat-window");
const chatClose   = document.getElementById("chat-close");
const chatMessages= document.getElementById("chat-messages");
const chatInput   = document.getElementById("chat-input");
const chatSend    = document.getElementById("chat-send");
const chatIcon    = document.getElementById("chat-icon");

// Toggle open/close
chatToggle.addEventListener("click", () => {
    const isHidden = chatWindow.classList.toggle("hidden");
    chatIcon.textContent = isHidden ? "💬" : "✖";
    if (!isHidden) chatInput.focus();
});

chatClose.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
    chatIcon.textContent = "💬";
});

// Send on Enter key
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

chatSend.addEventListener("click", sendMessage);

/** Append a message bubble to the chat */
function appendMessage(role, text) {
    const msgEl = document.createElement("div");
    msgEl.className = `msg ${role}`;

    const avatar = document.createElement("span");
    avatar.className = "msg-avatar";
    avatar.textContent = role === "bot" ? "🤖" : "🧑";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = text;

    msgEl.appendChild(avatar);
    msgEl.appendChild(bubble);
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgEl;
}

/** Show animated typing indicator */
function showTyping() {
    const msgEl = document.createElement("div");
    msgEl.className = "msg bot typing";
    msgEl.id = "typing-indicator";

    const avatar = document.createElement("span");
    avatar.className = "msg-avatar";
    avatar.textContent = "🤖";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

    msgEl.appendChild(avatar);
    msgEl.appendChild(bubble);
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/** Remove typing indicator */
function hideTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
}

/** Extract bot reply text from Langflow response */
function extractReply(data) {
    try {
        // Langflow v1 response shape
        const outputs = data.outputs;
        if (outputs && outputs.length > 0) {
            const inner = outputs[0].outputs;
            if (inner && inner.length > 0) {
                const result = inner[0].results;
                if (result && result.message && result.message.text) {
                    return result.message.text;
                }
                // Alternative paths
                const msgs = inner[0].messages;
                if (msgs && msgs.length > 0) return msgs[0].message;
            }
        }
        // Generic fallback – stringify what we got
        return JSON.stringify(data);
    } catch {
        return "Maaf, respons tidak dapat dibaca.";
    }
}

/** Send a user message to the Langflow API */
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = "";
    chatInput.disabled = true;
    chatSend.disabled  = true;

    appendMessage("user", text);
    showTyping();

    const payload = {
        output_type: "chat",
        input_type:  "chat",
        input_value: text,
        session_id:  SESSION_ID
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify(payload)
        });

        hideTyping();

        if (!response.ok) {
            appendMessage("bot", `⚠️ Server error: ${response.status} ${response.statusText}. Pastikan Langflow sudah berjalan di localhost:7860.`);
        } else {
            const data = await response.json();
            const reply = extractReply(data);
            appendMessage("bot", reply);
        }
    } catch (err) {
        hideTyping();
        console.error("Chat error:", err);
        appendMessage("bot", "⚠️ Tidak dapat terhubung ke server. Pastikan Langflow berjalan di http://localhost:7860.");
    } finally {
        chatInput.disabled = false;
        chatSend.disabled  = false;
        chatInput.focus();
    }
}

/* =============================================
   WHATSAPP POPUP TOGGLE
============================================= */
function toggleWAPopup() {
    const popup = document.getElementById("wa-popup");
    popup.classList.toggle("hidden");
}

// Close WA popup when clicking outside of it
document.addEventListener("click", function (e) {
    const widget = document.getElementById("wa-widget");
    if (widget && !widget.contains(e.target)) {
        const popup = document.getElementById("wa-popup");
        if (popup) popup.classList.add("hidden");
    }
});
