let chart; 

function handleCSV() {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("⚠️ Please upload a CSV file.");
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;

      if (!data.length) {
        alert("❌ CSV file appears to be empty or incorrectly formatted.");
        return;
      }

      const sample = data[0];
      const dateKey = Object.keys(sample).find(k => /date/i.test(k)) || Object.keys(sample)[0];
      const priceKey = Object.keys(sample).find(k => /close|price/i.test(k)) || Object.keys(sample)[1];

      const labels = data.map(row => row[dateKey]);
      const values = data.map(row => parseFloat(row[priceKey]));

      const validIndices = values.map((v, i) => (!isNaN(v) && labels[i]) ? i : -1).filter(i => i !== -1);
      const cleanedLabels = validIndices.map(i => labels[i]);
      const cleanedValues = validIndices.map(i => values[i]);

      if (chart) chart.destroy(); 

      const ctx = document.getElementById("stockChart").getContext("2d");
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: cleanedLabels,
          datasets: [{
            label: "Stock Price",
            data: cleanedValues,
            borderColor: "#00ffc3",
            backgroundColor: "rgba(0, 255, 195, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 5
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: { color: "white" }
            }
          },
          scales: {
            x: {
              ticks: { color: "white" },
              grid: { color: "rgba(255, 255, 255, 0.05)" }
            },
            y: {
              ticks: { color: "white" },
              grid: { color: "rgba(255, 255, 255, 0.05)" }
            }
          }
        }
      });

      document.getElementById("stock-name").textContent = `📊 ${file.name.replace(/\.[^/.]+$/, "")}`;
    }
  });
}

async function askAI() {
  const userMessage = document.getElementById("user-input").value.trim();
  const responseDiv = document.getElementById("ai-response");

  if (!userMessage) {
    responseDiv.textContent = "⚠️ Please enter a question.";
    return;
  }

  responseDiv.textContent = "🤖 Thinking...";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const json = await res.json();
    console.log("📦 Full AI Response:", json);

    const aiMessage = json.choices?.[0]?.message?.content;

    if (!aiMessage) {
      responseDiv.textContent = "⚠️ No response from AI.";
    } else {
      responseDiv.textContent = aiMessage;
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
    responseDiv.textContent = "❌ Error contacting AI.";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("stockChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "Sample Data",
        data: [120, 125, 119, 130, 128],
        borderColor: "#888",
        backgroundColor: "rgba(136, 136, 136, 0.1)",
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
});
