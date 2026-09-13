const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion.matches) {
      document.documentElement.classList.add("motion");

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealElements.forEach(element => observer.observe(element));
    }

    // Scroll progress and subtle hero parallax.
    const progress = document.querySelector(".progress");
    const heroImage = document.querySelector("#hero-image");
    const heroVisual = document.querySelector(".hero-visual");
    let scrollQueued = false;

    function updateScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0}%`;

      if (!reducedMotion.matches && heroVisual.getBoundingClientRect().bottom > 0) {
        heroImage.style.transform = `translateY(${Math.min(window.scrollY * 0.12, 65)}px)`;
      } else if (reducedMotion.matches) {
        heroImage.style.transform = "";
      }

      scrollQueued = false;
    }

    function queueScrollUpdate() {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(updateScroll);
      }
    }

    window.addEventListener("scroll", queueScrollUpdate, { passive: true });
    window.addEventListener("resize", queueScrollUpdate);
    window.addEventListener("load", updateScroll);
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        revealElements.forEach(element => element.classList.add("visible"));
      }
      updateScroll();
    });
    updateScroll();

    // Mobile navigation.
    const menuButton = document.querySelector(".menu-button");
    const navigation = document.querySelector("#main-nav");

    function closeMenu() {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    }

    menuButton.addEventListener("click", () => {
      const open = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "Close" : "Menu";
    });

    navigation.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && navigation.classList.contains("open")) {
        closeMenu();
        menuButton.focus();
      }
    });

    // Demo product catalog and persistent shopping bag.
    const catalog = {
      serum: {
        name: "Dew Drops",
        price: 38,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=160&q=80"
      },
      cream: {
        name: "Cloud Nine",
        price: 44,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=160&q=80"
      },
      cleanser: {
        name: "Fresh Start",
        price: 28,
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=160&q=80"
      }
    };

    let bag = {};
    try {
      const saved = JSON.parse(localStorage.getItem("luma-bag") || "{}");
      if (saved && typeof saved === "object") {
        Object.keys(catalog).forEach(id => {
          if (Number.isInteger(saved[id]) && saved[id] > 0 && saved[id] <= 99) {
            bag[id] = saved[id];
          }
        });
      }
    } catch {
      // Storage may be unavailable; the bag still works for this visit.
    }

    const cart = document.querySelector("#cart");
    const cartItems = document.querySelector(".cart-items");
    const toast = document.querySelector(".toast");
    const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    let toastTimer;

    function notify(message) {
      clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add("show");
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
    }

    function renderBag(focusId) {
      let total = 0;
      let count = 0;
      cartItems.replaceChildren();

      Object.entries(bag).forEach(([id, quantity]) => {
        const product = catalog[id];
        total += product.price * quantity;
        count += quantity;

        const row = document.createElement("article");
        row.className = "cart-item";
        row.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <p>Qty: ${quantity} · ${money.format(product.price)}</p>
            <button class="remove-item" data-remove="${id}" aria-label="Remove one ${product.name}">Remove one</button>
          </div>
          <span>${money.format(product.price * quantity)}</span>
        `;
        cartItems.append(row);
      });

      if (!count) {
        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "Your bag is waiting for a little glow. Explore the essentials and find your favorites.";
        cartItems.append(empty);
      }

      document.querySelector(".bag-count").textContent = count;
      document.querySelector("#open-cart").setAttribute("aria-label", `Open shopping bag, ${count} items`);
      document.querySelector("#subtotal").textContent = money.format(total);

      try {
        localStorage.setItem("luma-bag", JSON.stringify(bag));
      } catch {}

      if (focusId) {
        const nextFocus = cartItems.querySelector(`[data-remove="${focusId}"]`)
          || cartItems.querySelector(".remove-item")
          || document.querySelector(".close-cart");
        nextFocus.focus();
      }
    }

    document.querySelectorAll("[data-product]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.product;
        if ((bag[id] || 0) >= 99) {
          notify("You’ve reached the limit for this item.");
          return;
        }

        bag[id] = (bag[id] || 0) + 1;
        renderBag();
        notify(`${catalog[id].name} added to your bag`);
      });
    });

    cartItems.addEventListener("click", event => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      const id = button.dataset.remove;
      bag[id] -= 1;
      if (bag[id] <= 0) delete bag[id];
      renderBag(id);
    });

    document.querySelector("#open-cart").addEventListener("click", () => {
      closeMenu();
      cart.showModal();
      document.body.classList.add("locked");
    });

    document.querySelector(".close-cart").addEventListener("click", () => cart.close());
    cart.addEventListener("close", () => document.body.classList.remove("locked"));

    cart.addEventListener("click", event => {
      const bounds = cart.getBoundingClientRect();
      if (
        event.target === cart &&
        (event.clientX < bounds.left || event.clientX > bounds.right ||
         event.clientY < bounds.top || event.clientY > bounds.bottom)
      ) cart.close();
    });

    document.querySelector("#year").textContent = new Date().getFullYear();
    renderBag();