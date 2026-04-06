window.addEventListener("load", function () {
  const apiKey = "9kGkJbaNvoKWemjE77YLgn74ullAmqEoInADgG91mCT6SQwhwQ";
  const tag = "nonatizedbook";

  const container = document.getElementById("tumblr-feed");
  const popup = document.getElementById("tumblr-popup");
  const popupContent = document.querySelector(".popup-content");

  if (!container) return;

  fetch(`https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${apiKey}&filter=raw`)
    .then(res => res.json())
    .then(data => {
      const posts = data.response;

      posts.forEach(post => {
        let content = "";

        // ✅ GET CONTENT
        if (post.trail && post.trail.length > 0) {
          content = post.trail[0].content;
        } else if (post.body) {
          content = post.body;
        }

        const temp = document.createElement("div");
        temp.innerHTML = content;

        // 🧠 METADATA STORAGE (ALL COLORS)
        let meta = {
          rating: "",
          title: "",
          author: "",
          publisher: "",
          status: "",
          finished: ""
        };

        // 🔥 FIND METADATA BLOCK (no reliance on class)
        const blockquotes = temp.querySelectorAll("blockquote");

        blockquotes.forEach(bq => {
          if (bq.querySelector(".npf_color_chandler")) {

            // ✅ extract ALL npf colors
            meta.rating = bq.querySelector(".npf_color_chandler")?.textContent.trim() || "";

            const monica = bq.querySelectorAll(".npf_color_monica");
            if (monica.length > 0) {
              meta.title = monica[0].textContent.trim();
              if (monica[1]) meta.author = monica[1].textContent.trim();
            }

            meta.publisher = bq.querySelector(".npf_color_rachel")?.textContent.trim() || "";
            meta.status = bq.querySelector(".npf_color_ross")?.textContent.trim() || "";
            meta.finished = bq.querySelector(".npf_color_niles")?.textContent.trim() || "";

            // ❌ REMOVE metadata block from content
            bq.remove();
          }
        });

        // 🖼️ IMAGE
        let image = "";
        const img = temp.querySelector("img");
        if (img) image = img.src;

        // 🧹 CLEAN EMPTY TAGS
        temp.querySelectorAll("p").forEach(p => {
          if (p.innerHTML.trim() === "" || p.innerHTML.trim() === "<br>") {
            p.remove();
          }
        });

        const cleanContent = temp.innerHTML;

        // 🟦 GRID CARD
        const div = document.createElement("div");
        div.className = "tumblr-card";

        div.innerHTML = `
          ${image ? `<img src="${image}">` : ""}
          <div class="card-overlay">
            <h3>${post.summary}</h3>

            ${meta.title ? `<p class="meta-title">${meta.title}</p>` : ""}
            ${meta.author ? `<p class="meta-author">${meta.author}</p>` : ""}

            ${meta.rating ? `<span class="rating">${meta.rating}</span>` : ""}
            ${meta.status ? `<span class="status">${meta.status}</span>` : ""}
          </div>
        `;

        // STORE CONTENT
        div.dataset.content = cleanContent;

        container.appendChild(div);

        // CLICK → POPUP
        div.addEventListener("click", () => {
          popupContent.innerHTML = cleanContent;
          popup.style.display = "flex";
        });
      });
    });

  // CLOSE POPUP
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("close") || e.target.id === "tumblr-popup") {
      popup.style.display = "none";
    }
  });
});
