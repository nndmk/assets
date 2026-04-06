(function () {
  console.log("âœ… Tumblr script started");

  function runTumblr() {
    const container = document.getElementById("tumblr-feed");
    const popup = document.getElementById("tumblr-popup");

    if (!container) {
      console.log("âŒ tumblr-feed not found");
      return;
    }

    if (!popup) {
      console.log("âŒ popup not found");
      return;
    }

    // ðŸ”¥ MOVE POPUP OUTSIDE ELEMENTOR (CRITICAL FIX)
    document.body.appendChild(popup);

    const popupContent = popup.querySelector(".popup-content");

    const apiKey = "9kGkJbaNvoKWemjE77YLgn74ullAmqEoInADgG91mCT6SQwhwQ";
    const tag = "nonatizedbook";

    fetch(`https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${apiKey}&filter=raw`)
      .then(res => res.json())
      .then(data => {
        const posts = data.response;

        if (!posts || posts.length === 0) {
          console.log("âŒ No posts found");
          return;
        }

        posts.forEach(post => {
          let content = post.trail?.[0]?.content_raw || post.body || "";

          const temp = document.createElement("div");
          temp.innerHTML = content;

          // ðŸ§  METADATA EXTRACTION
          let rating = "";
          let bookTitle = "";
          let author = "";
          let status = "";

          temp.querySelectorAll("blockquote").forEach(bq => {
            if (bq.querySelector(".npf_color_chandler")) {
              rating = bq.querySelector(".npf_color_chandler")?.textContent.trim() || "";

              const monica = bq.querySelectorAll(".npf_color_monica");
              if (monica.length > 0) {
                bookTitle = monica[0].textContent.trim();
                if (monica[1]) author = monica[1].textContent.trim();
              }

              status = bq.querySelector(".npf_color_ross")?.textContent.trim() || "";

              bq.remove(); // remove from popup
            }
          });

          // ðŸ–¼ IMAGE
          const img = temp.querySelector("img");
          const image = img ? img.src : "";

          // ðŸŸ¦ CARD
          const card = document.createElement("div");
          card.className = "tumblr-card";

          card.innerHTML = `
            ${image ? `<img src="${image}">` : ""}
            <div class="card-overlay">
              <h3>${post.summary}</h3>
              ${bookTitle ? `<p class="meta-title">${bookTitle}</p>` : ""}
              ${author ? `<p class="meta-author">${author}</p>` : ""}
              ${rating ? `<span class="rating">${rating}</span>` : ""}
              ${status ? `<span class="status">${status}</span>` : ""}
            </div>
          `;

          container.appendChild(card);

          // ðŸŸ£ OPEN POPUP
          card.addEventListener("click", () => {
            popupContent.innerHTML = temp.innerHTML;
            popup.classList.add("active");
          });
        });
      })
      .catch(err => {
        console.error("âŒ Fetch error:", err);
      });

    // ðŸ”´ CLOSE POPUP
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("close") || e.target.id === "tumblr-popup") {
        popup.classList.remove("active");
      }
    });
  }

  // ðŸ” Wait until Elementor is ready
  let tries = 0;
  const interval = setInterval(() => {
    if (document.getElementById("tumblr-feed") || tries > 10) {
      clearInterval(interval);
      runTumblr();
    }
    tries++;
  }, 300);
})();
