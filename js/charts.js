let myChart;

window.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("stockChart").getContext("2d");

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

      const stockName = data[0]["StockName"] || "Unknown Stock";
      document.getElementById("stock-name").textContent = `📈 ${stockName}`;

      const labels = data.map(row => row["Date"]);
      const prices = data.map(row => parseFloat(row["Close"]));

      myChart.data.labels = labels;
      myChart.data.datasets[0].data = prices;
      myChart.update();
    }
  });
}

// 🎯 AI Integration Below — Using OpenRouter API
async function askAI() {
  const userMessage = document.getElementById("user-input").value;
  const responseBox = document.getElementById("ai-response");

  if (!userMessage.trim()) {
    responseBox.textContent = "Please type a question.";
    return;
  }

  responseBox.textContent = "Thinking...";

  try {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    })
  });


    const data = await res.json();
    const aiReply = data.choices[0].message.content;

    responseBox.textContent = aiReply;
  } catch (error) {
    responseBox.textContent = "Error: Unable to get response.";
    console.error(error);
  }
}
