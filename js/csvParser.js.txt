document.getElementById("csvFile").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log("Parsed CSV Data:", results.data);
      alert("CSV uploaded successfully!");
      // You can pass data to chart.js here
    },
    error: function (err) {
      console.error("CSV Parse Error:", err.message);
    }
  });
});
