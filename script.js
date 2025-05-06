const ADMIN_CODE = "tapaksuci9";

function verifyAccess() {
  const input = document.getElementById("accessCode").value;
  if (input === ADMIN_CODE) {
    document.getElementById("login").style.display = "none";
    document.getElementById("main").style.display = "block";
  } else {
    alert("Kode salah!");
  }
}

function updateAverage(input) {
  const row = input.parentElement.parentElement;
  const inputs = row.querySelectorAll("input[type='number']");
  let total = 0;
  let count = 0;
  inputs.forEach(inp => {
    const val = parseFloat(inp.value);
    if (!isNaN(val)) {
      total += val;
      count++;
    }
  });
  const avgCell = row.querySelector(".average");
  avgCell.textContent = count === 3 ? (total / 3).toFixed(2) : "-";
}

function exportToExcel() {
  const table = document.getElementById("nilaiTable");
  const workbook = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table);
  XLSX.utils.book_append_sheet(workbook, ws, "Penilaian");
  XLSX.writeFile(workbook, "Penilaian_Tapak_Suci.xlsx");
}
