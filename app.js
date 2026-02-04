const WORKER_URL = "https://YOUR_WORKER_URL/generate";

const elOutline = document.getElementById("outline");
const elOutput  = document.getElementById("output");
const elStatus  = document.getElementById("status");

document.getElementById("generate").addEventListener("click", async () => {
  const outline = elOutline.value.trim();
  const minutes = Number(document.getElementById("length").value || 90);
  const level   = Number(document.getElementById("level").value || 7);

  if (!outline) {
    elStatus.textContent = "Paste an outline first.";
    return;
  }

  elStatus.textContent = "Forging…";
  elOutput.textContent = "";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outline, minutes, level })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || `Request failed: ${res.status}`);
    }

    const data = await res.json();
    elOutput.textContent = data.markdown || "(No output returned)";
    elStatus.textContent = "Done.";
  } catch (e) {
    elStatus.textContent = "Error: " + e.message;
  }
});

document.getElementById("copy").addEventListener("click", async () => {
  const txt = elOutput.textContent.trim();
  if (!txt) return;
  await navigator.clipboard.writeText(txt);
  elStatus.textContent = "Copied to clipboard.";
});
