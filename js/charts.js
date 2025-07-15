let myChart;

window.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("stockChart").getContext("2d");

  // Optional: initialize with dummy chart
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Stock Price",
        data: [],
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.1)",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" } }
      },
      scales: {
        x: { ticks: { color: "white" }, title: { display: true, text: "Date", color: "white" } },
        y: { ticks: { color: "white" }, title: { display: true, text: "Price", color: "white" } }
      }
    }
  });
});

function handleCSV() {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first.");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data;

      // Extract stock name (assumes same in all rows)
      const stockName = data[0]["StockName"] || "Unknown Stock";
      document.getElementById("stock-name").textContent = `📈 ${stockName}`;

      // Parse chart data
      const labels = data.map(row => row["Date"]);
      const prices = data.map(row => parseFloat(row["Close"]));

      // Update chart
      myChart.data.labels = labels;
      myChart.data.datasets[0].data = prices;
      myChart.update();
    }
  });
}
