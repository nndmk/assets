(function () {
  console.log("✅ Tumblr script started");

  function runTumblr() {
    const container = document.getElementById("tumblr-feed");

    if (!container) {
      console.log("❌ tumblr-feed not found");
      return;
    }

    console.log("✅ tumblr-feed found");

    const apiKey = "9kGkJbaNvoKWemjE77YLgn74ullAmqEoInADgG91mCT6SQwhwQ";
    const tag = "nonatizedbook";

    fetch(`https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${apiKey}&filter=raw`)
      .then(res => res.json())
      .then(data => {
        console.log("📦 API:", data);

        const posts = data.response;

        if (!posts || posts.length === 0) {
          console.log("❌ No posts found");
          return;
        }

        posts.forEach(post => {
          let content = post.trail?.[0]?.content || post.body || "";

          const temp = document.createElement("div");
          temp.innerHTML = content;

          // 🧠 extract metadata
          let rating = "";
          let title = post.summary;
          let status = "";

          temp.querySelectorAll("blockquote").forEach(bq => {
            if (bq.querySelector(".npf_color_chandler")) {
              rating = bq.querySelector(".npf_color_chandler")?.textContent || "";
              title = bq.querySelector(".npf_color_monica")?.textContent || title;
              status = bq.querySelector(".npf_color_ross")?.textContent || "";

              bq.remove();
            }
          });

          // 🖼 image
          const img = temp.querySelector("img");
          const image = img ? img.src : "";

          // 🟦 create card
          const card = document.createElement("div");
          card.className = "tumblr-card";

          card.innerHTML = `
            ${image ? `<img src="${image}">` : ""}
            <div class="card-overlay">
              <h3>${title}</h3>
              <span>${rating}</span>
              <span>${status}</span>
            </div>
          `;

          container.appendChild(card);

          // popup
          card.addEventListener("click", () => {
            const popup = document.getElementById("tumblr-popup");
            const popupContent = document.querySelector(".popup-content");

            popupContent.innerHTML = temp.innerHTML;
            popup.style.display = "flex";
          });
        });
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
      });
  }

  // 🔥 wait until Elementor is ready
  let tries = 0;
  const interval = setInterval(() => {
    if (document.getElementById("tumblr-feed") || tries > 10) {
      clearInterval(interval);
      runTumblr();
    }
    tries++;
  }, 300);
})();
