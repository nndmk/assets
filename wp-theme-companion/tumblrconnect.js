(function () {
  console.log("✅ Tumblr script started");

  function runTumblr() {
    const container = document.getElementById("tumblr-feed");
    const popup = document.getElementById("tumblr-popup");

    if (!container) {
      console.log("❌ tumblr-feed not found");
      return;
    }

    if (!popup) {
      console.log("❌ popup not found");
      return;
    }

    // 🔥 Move popup outside Elementor (CRITICAL)
    document.body.appendChild(popup);

    const popupContent = popup.querySelector(".popup-content");

    const apiKey = "9kGkJbaNvoKWemjE77YLgn74ullAmqEoInADgG91mCT6SQwhwQ";
    const tag = "nonatizedbook";

    fetch(`https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${apiKey}&filter=raw`)
      .then(res => res.json())
      .then(data => {
        const posts = data.response;

        if (!posts || posts.length === 0) {
          console.log("❌ No posts found");
          return;
        }

        posts.forEach(post => {
          let content = post.trail?.[0]?.content_raw || post.body || "";

          const temp = document.createElement("div");
          temp.innerHTML = content;

          // 🧠 METADATA EXTRACTION (FINAL STRUCTURE)
          let rating = "";
          let titleLine = "";
          let publisher = "";
          let status = "";
          let remarks = "";

          temp.querySelectorAll("blockquote").forEach(bq => {
            if (bq.querySelector(".npf_color_chandler")) {

              // ⭐ Rating
              rating = bq.querySelector(".npf_color_chandler")?.textContent.trim() || "";

              // 📚 Title + Author (merge all monica spans)
              const monicaNodes = bq.querySelectorAll(".npf_color_monica");
              if (monicaNodes.length > 0) {
                titleLine = Array.from(monicaNodes)
                  .map(el => el.textContent.trim())
                  .join("");
              }

              // 🏢 Publisher
              publisher = bq.querySelector(".npf_color_rachel")?.textContent.trim() || "";

              // 📦 Status
              status = bq.querySelector(".npf_color_ross")?.textContent.trim() || "";

              // ✍️ Remarks
              remarks = bq.querySelector(".npf_color_niles")?.textContent.trim() || "";

              // ❌ remove metadata from popup
              bq.remove();
            }
          });

          // 🖼 IMAGE
          const img = temp.querySelector("img");
          const image = img ? img.src : "";

          // 🟦 CARD
          const card = document.createElement("div");
          card.className = "tumblr-card";

          card.innerHTML = `
            ${image ? `<img src="${image}">` : ""}
            <div class="card-overlay">
              <h3>${post.summary}</h3>
              
              <div class="book-info">
              ${titleLine ? `<p class="meta-title">${titleLine}</p>` : ""}
              ${publisher ? `<p class="meta-publisher">${publisher}</p>` : ""}
              </div>
              <div class="book-info-2nd">
              ${rating ? `<span class="rating">${rating}</span>` : ""}
              ${status ? `<span class="status">${status}</span>` : ""}
              </div>
              <div class="remarks">
              ${remarks ? `<span>${remarks}</span>` : ""}
              </div>
            </div>
          `;

          container.appendChild(card);

          // 🟣 OPEN POPUP
          card.addEventListener("click", () => {
            popupContent.innerHTML = temp.innerHTML;
            popup.classList.add("active");
          });
        });
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
      });

    // 🔴 CLOSE POPUP
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("close") || e.target.id === "tumblr-popup") {
        popup.classList.remove("active");
      }
    });
  }

  // 🔁 Wait until Elementor is ready
  let tries = 0;
  const interval = setInterval(() => {
    if (document.getElementById("tumblr-feed") || tries > 10) {
      clearInterval(interval);
      runTumblr();
    }
    tries++;
  }, 300);
})();
