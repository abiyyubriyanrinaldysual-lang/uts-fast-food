const buka = true;
const menu= [
    {nama: "Burger", harga: 25000, img:"Photo.jpg/burger.jpg"},
    {nama: "kentang", harga: 15000, img:"Photo.jpg/kentang.jpg"},
    {nama: "Soda", harga: 25000, img:"Photo.jpg/cocacola.jpg"},
    {nama: "Es Krim", harga: 10000, img:"Photo.jpg/esKrim.jpg"}
];

const daftar = document.getElementById("daftar-menu");
const pilih = document.getElementById("item");
const hasil = document.getElementById("hasil");

menu.forEach((m, i) => {
    daftar.innerHTML += `<div class="kartu"><img src="${m.img}" alt="${m.nama}"><h3>${m.nama}</h3><p>Rp ${m.harga}</p></div>`;
    pilih.innerHTML += `<option value="${i}">${m.nama}</option>`;
});

function hitungTotal(harga, jumlah) {
  let total = harga * jumlah;
  if (jumlah >= 5) {
    total = total * 0.9;
  }
  else if (jumlah >= 10){
    total = total *0.8;
  }
  return total;
}

const totalHargaMenu = menu.reduce((total, m) => total + m.harga, 0);
const murah = menu.filter(m => m.harga < 20000).map(m => m.nama);
console.log("Total harga satu dari tiap menu:", totalHargaMenu);
console.log("Menu murah:", murah);

document.getElementById("form-pesan").addEventListener("submit", function(e) {
    e.preventDefault();
    if (!buka) { 
        hasil.textContent = "Mohon maaf, toko tutup."; 
        return; 
    }
    
    const m = menu[Number(pilih.value)];
    const jumlah = Number(document.getElementById("jumlah").value);
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 50) {
        hasil.textContent = "Jumlah pesanan harus antara 1 sampai 50";
        return;
    }
    const total = hitungTotal(m.harga, jumlah);
    hasil.textContent = `Total Belanja, ${jumlah} ${m.nama} = Rp ${total.toLocaleString("id-ID")}`;
});