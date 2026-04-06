// 🟢 POPUP LENIS STATE
let popupLenis = null;
let popupRAF = null;

// 🟢 START POPUP SCROLL
function startPopupScroll() {
  const popupInner = document.querySelector(".popup-inner");
  if (!popupInner) return;

  // stop main Lenis
  if (window.lenis) window.lenis.stop();

  // prevent background scroll
  document.body.style.overflow = "hidden";

  // create popup Lenis
  popupLenis = new Lenis({
    wrapper: popupInner,
    content: popupInner,
    smooth: true,
    wheelMultiplier: 1,
    touchMultiplier: 1
  });

  function raf(time) {
    popupLenis.raf(time);
    popupRAF = requestAnimationFrame(raf);
  }

  popupRAF = requestAnimationFrame(raf);
}

// 🔴 STOP POPUP SCROLL
function stopPopupScroll() {
  if (popupLenis) {
    popupLenis.destroy();
    popupLenis = null;
  }

  if (popupRAF) {
    cancelAnimationFrame(popupRAF);
    popupRAF = null;
  }

  // resume main Lenis
  if (window.lenis) window.lenis.start();

  document.body.style.overflow = "";
}

(function () {
  console.log("Tumblr script started");

  function runTumblr() {
    const container = document.getElementById("tumblr-feed");
    const popup = document.getElementById("tumblr-popup");

    if (!container) {
      console.log("tumblr-feed not found");
      return;
    }

    if (!popup) {
      console.log("popup not found");
      return;
    }

    // 🔥 Move popup outside Elementor (ONLY ONCE)
    if (!popup.dataset.moved) {
      document.body.appendChild(popup);
      popup.dataset.moved = "true";
    }

    const popupContent = popup.querySelector(".popup-content");

    const apiKey = "9kGkJbaNvoKWemjE77YLgn74ullAmqEoInADgG91mCT6SQwhwQ";
    const tag = "nonatizedbook";

    fetch(`https://api.tumblr.com/v2/tagged?tag=${tag}&api_key=${apiKey}&filter=raw`)
      .then(res => res.json())
      .then(data => {
        const posts = data.response;

        if (!posts || posts.length === 0) {
          console.log("No posts found");
          return;
        }

        posts.forEach(post => {
          let content = post.trail?.[0]?.content_raw || post.body || "";

          const temp = document.createElement("div");
          temp.innerHTML = content;

          // 🧠 METADATA EXTRACTION
          let rating = "";
          let titleLine = "";
          let publisher = "";
          let status = "";
          let remarks = "";

          temp.querySelectorAll("blockquote").forEach(bq => {
            if (bq.querySelector(".npf_color_chandler")) {

              rating = bq.querySelector(".npf_color_chandler")?.textContent.trim() || "";

              const monicaNodes = bq.querySelectorAll(".npf_color_monica");
              if (monicaNodes.length > 0) {
                titleLine = Array.from(monicaNodes)
                  .map(el => el.textContent.trim())
                  .join(" ");
              }

              publisher = bq.querySelector(".npf_color_rachel")?.textContent.trim() || "";
              status = bq.querySelector(".npf_color_ross")?.textContent.trim() || "";
              remarks = bq.querySelector(".npf_color_niles")?.textContent.trim() || "";

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

              ${(titleLine || publisher) ? `
                <div class="book-info">
                  ${titleLine ? `<p class="meta-title">${titleLine}</p>` : ""}
                  ${publisher ? `<p class="meta-publisher">${publisher}</p>` : ""}
                </div>
              ` : ""}

              ${(rating || status) ? `
                <div class="book-info-2nd">
                  ${rating ? `<span class="rating">${rating}</span>` : ""}
                  ${status ? `<span class="status">${status}</span>` : ""}
                </div>
              ` : ""}

              ${remarks ? `<p class="remarks">${remarks}</p>` : ""}
            </div>
          `;

          container.appendChild(card);

          // 🟣 OPEN POPUP
          card.addEventListener("click", () => {
            popupContent.innerHTML = temp.innerHTML;
            popup.classList.add("active");
            startPopupScroll();
          });
        });
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });

    // 🔴 CLOSE POPUP (ONLY ONCE)
    if (!window.popupListenerAdded) {
      window.popupListenerAdded = true;

      document.addEventListener("click", function (e) {
        if (
          e.target.classList.contains("close") ||
          e.target.id === "tumblr-popup"
        ) {
          popup.classList.remove("active");
          stopPopupScroll();
        }
      });
    }
  }

  // 🔁 Wait for Elementor
  let tries = 0;
  const interval = setInterval(() => {
    if (document.getElementById("tumblr-feed") || tries > 10) {
      clearInterval(interval);
      runTumblr();
    }
    tries++;
  }, 300);
})();
