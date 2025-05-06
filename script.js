const siswaList = Array.from({ length: 53 }, (_, i) => `Siswa ${i + 1}`);

window.onload = function () {
  const tbody = document.getElementById("tableBody");
  siswaList.forEach((nama, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" value="${nama}" style="width: 100px;"></td>
      <td><input type="number" min="60" max="90" oninput="hitung(this)"></td>
      <td><input type="number" min="60" max="90" oninput="hitung(this)"></td>
      <td><input type="number" min="60" max="90" oninput="hitung(this)"></td>
      <td class="rata"></td>
      <td class="huruf"></td>
    `;
    tbody.appendChild(row);
  });
};

function hitung(input) {
  const row = input.parentElement.parentElement;
  const jurus = parseFloat(row.cells[2].children[0].value) || 0;
  const fisik = parseFloat(row.cells[3].children[0].value) || 0;
  const aik = parseFloat(row.cells[4].children[0].value) || 0;

  if (jurus && fisik && aik) {
    const rata = ((jurus + fisik + aik) / 3).toFixed(2);
    row.cells[5].innerText = rata;
    let huruf = "D";
    if (rata >= 85) huruf = "A";
    else if (rata >= 75) huruf = "B";
    else if (rata >= 65) huruf = "C";
    row.cells[6].innerText = huruf;
  } else {
    row.cells[5].innerText = "";
    row.cells[6].innerText = "";
  }
}

function unduhExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [["No", "Nama", "Jurus", "Fisik", "AIK", "Rata-rata", "Nilai Huruf"]];
  const table = document.getElementById("nilaiTable");

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const data = [
      row.cells[0].innerText,
      row.cells[1].children[0].value, // Ambil nama dari input text
      row.cells[2].children[0].value,
      row.cells[3].children[0].value,
      row.cells[4].children[0].value,
      row.cells[5].innerText,
      row.cells[6].innerText
    ];
    ws_data.push(data);
  }

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Penilaian");
  XLSX.writeFile(wb, "Penilaian_Tapak_Suci.xlsx");
}
