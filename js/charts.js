let chart; // global

function handleCSV() {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a CSV file.");
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      const data = results.data;

      const labels = data.map(row => row.Date || row.date);
      const values = data.map(row => row.Close || row.close || row.Price);

      if (chart) chart.destroy();

      const ctx = document.getElementById("stockChart").getContext("2d");
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "Stock Price",
            data: values,
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
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" } }
          }
        }
      });

      document.getElementById("stock-name").textContent = `📈 ${file.name.split(".")[0]}`;
    }
  });
}

async function askAI() {
  const userMessage = document.getElementById("user-input").value;
  const responseDiv = document.getElementById("ai-response");

  if (!userMessage.trim()) {
    responseDiv.textContent = "Please enter a question.";
    return;
  }

  responseDiv.textContent = "Thinking...";

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

    const json = await res.json();
    const aiMessage = json.choices?.[0]?.message?.content || "No response.";
    responseDiv.textContent = aiMessage;
  } catch (err) {
    console.error(err);
    responseDiv.textContent = "Error contacting AI.";
  }
}
