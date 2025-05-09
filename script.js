const siswaList = [
  "Abdul Malik", "Aidil Faturrahman", "Airil Pika Saputra", "Andi Febriani", "Andira Ritalia.P", "Asmaul Husna", "Dirham",
  "Fauziah Nur Insani", "Hairul Putra Abadi", "Helwa Nuralam", "Indira", "Irfandi", "Jusma", "Kharisma Nur Annafisah",
  "M Ridho Rizki Ilahi", "Mardiana", "Muh Adriansyah", "Muh. Arif Mapparenta", "Muhammad Rezky Aditya", "Muhammad Yunus",
  "Muhammad Yusuf. S", "Mutmainnah", "Nurdayana", "Nurlinda", "Nurul Khatimah Anwar", "Putri", "Putri Damayanti", "Reza",
  "Rezky", "Adam Halilu", "Ainun Hikma", "Andi Aufar", "Farhan Sumayyah .Ar", "Fika Nur Aulia", "Khumairah", "M.Nasrul R",
  "M.Zain Nurichsan", "Marsya Sri Aulia", "Muh. Ilyas. M", "Muh. Wahyu Nur Ilahi", "Muh.Ifdal Al Amin", "Muhammad Ikram",
  "Nattan Alghi Fahri", "Nur Islamia Arwani", "Nur Rahmah", "Nursalam", "Riska", "Riska Arfah", "Siti Hawa. M",
  "Siti Magfirah Jumakari", "Vira Damayanti", "Wahyullah Pratama", "Yatmi"
];

window.onload = function () {
  const tbody = document.getElementById("tableBody");
  siswaList.forEach((nama, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${nama}" onchange="hitung(this)"></td>
      <td><input type="number" onchange="hitung(this)"></td>
      <td><input type="number" onchange="hitung(this)"></td>
      <td><input type="number" onchange="hitung(this)"></td>
      <td></td>
      <td></td>
    `;
    tbody.appendChild(row);
  });

  siswaList.forEach(async (nama, i) => {
    const ref = firestore.doc(firestore.db, "nilai", nama);
    const snap = await firestore.getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const row = tbody.children[i];
      row.cells[2].children[0].value = data.jurus;
      row.cells[3].children[0].value = data.fisik;
      row.cells[4].children[0].value = data.aik;
      row.cells[5].innerText = data.rata;
      row.cells[6].innerText = data.huruf;
    }
  });
};

async function hitung(input) {
  const row = input.parentElement.parentElement;
  const nama = row.cells[1].children[0].value;
  const jurus = parseFloat(row.cells[2].children[0].value) || 0;
  const fisik = parseFloat(row.cells[3].children[0].value) || 0;
  const aik = parseFloat(row.cells[4].children[0].value) || 0;

  if (jurus && fisik && aik) {
    const rata = ((jurus + fisik + aik) / 3).toFixed(2);
    let huruf = "D";
    if (rata >= 85) huruf = "A";
    else if (rata >= 75) huruf = "B";
    else if (rata >= 65) huruf = "C";

    row.cells[5].innerText = rata;
    row.cells[6].innerText = huruf;

    await firestore.setDoc(firestore.doc(firestore.db, "nilai", nama), {
      nama, jurus, fisik, aik, rata, huruf
    });
  } else {
    row.cells[5].innerText = "";
    row.cells[6].innerText = "";
  }
}

function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [
    ["No", "Nama", "Jurus", "Fisik", "AIK", "Rata-Rata", "Nilai Huruf"]
  ];

  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((tr, i) => {
    const nama = tr.cells[1].children[0].value;
    const jurus = tr.cells[2].children[0].value;
    const fisik = tr.cells[3].children[0].value;
    const aik = tr.cells[4].children[0].value;
    const rata = tr.cells[5].innerText;
    const huruf = tr.cells[6].innerText;

    ws_data.push([i + 1, nama, jurus, fisik, aik, rata, huruf]);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Nilai Praktek");
  XLSX.writeFile(wb, "Nilai_Praktek_Tapak_Suci.xlsx");
}
