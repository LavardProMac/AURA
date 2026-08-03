document.addEventListener('DOMContentLoaded', () => {
    
    // Cart State
    let cart = [];

    // ==========================================================================
    // 0. SCROLL-BASED ANIMATION (Intersection Observer)
    // ==========================================================================
    const scrollBlocks = document.querySelectorAll('.scroll-block');

    const scrollObserverOptions = {
        root: null,
        threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, scrollObserverOptions);

    scrollBlocks.forEach(block => scrollObserver.observe(block));


    // ==========================================================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================================================
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Tự động đóng menu khi chọn mục
        document.querySelectorAll('.nav-links .nav-item').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    // ==========================================================================
    // 2. HERO AUTOMATED SLIDER
    // ==========================================================================
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideTimer = null;

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startSlider() {
        slideTimer = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        if (slideTimer) clearInterval(slideTimer);
    }

    if (slides.length > 0) {
        startSlider();

        indicators.forEach((indicator, idx) => {
            indicator.addEventListener('click', () => {
                stopSlider();
                goToSlide(idx);
                startSlider();
            });
        });
    }


    // ==========================================================================
    // 3. SLIDER 4 PRODUCTS (BATCHES)
    // ==========================================================================
    const prevBatchBtn = document.getElementById('prevBatchBtn');
    const nextBatchBtn = document.getElementById('nextBatchBtn');
    const currentPageNumEl = document.getElementById('currentPageNum');
    const productsTrack = document.getElementById('productsTrack');
    
    let currentPage = 1;
    const totalPages = 2;

    function updateProductSlider() {
        if (productsTrack) {
            const offset = (currentPage - 1) * 50; 
            productsTrack.style.transform = `translateX(-${offset}%)`;
        }

        if (currentPageNumEl) {
            currentPageNumEl.textContent = currentPage;
        }

        if (prevBatchBtn && nextBatchBtn) {
            if (currentPage === 1) {
                prevBatchBtn.style.display = 'none';
                nextBatchBtn.style.display = 'flex';
            } else if (currentPage === totalPages) {
                prevBatchBtn.style.display = 'flex';
                nextBatchBtn.style.display = 'none';
            }
        }
    }

    if (prevBatchBtn && nextBatchBtn) {
        prevBatchBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateProductSlider();
            }
        });

        nextBatchBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateProductSlider();
            }
        });

        updateProductSlider();
    }


    // ==========================================================================
    // 4. CART MANAGEMENT & INTERACTION
    // ==========================================================================
    const cartBadge = document.getElementById('cartBadge');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const toast = document.getElementById('toast');

    function openCartDrawer() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('active');
    }

    function closeCartDrawer() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('active');
    }

    function toggleCartDrawer() {
        if (cartDrawer.classList.contains('open')) {
            closeCartDrawer();
        } else {
            openCartDrawer();
        }
    }

    if (cartBtn) cartBtn.addEventListener('click', toggleCartDrawer);
    if (closeCart) closeCart.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    // Hàm đồng bộ hiển thị số lượng trên Product Card ngoài trang
    function syncProductCardUI(id, quantity) {
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if (!card) return;

        const quickAddBtn = card.querySelector('.quick-add-btn');
        const qtyControl = card.querySelector('.quantity-control');
        const qtyCount = card.querySelector('.qty-count');

        if (quantity > 0) {
            if (quickAddBtn) quickAddBtn.classList.add('hidden');
            if (qtyControl) qtyControl.classList.remove('hidden');
            if (qtyCount) qtyCount.textContent = quantity;
        } else {
            if (qtyControl) qtyControl.classList.add('hidden');
            if (quickAddBtn) quickAddBtn.classList.remove('hidden');
        }
    }

    // Cập nhật giao diện Giỏ hàng
    function updateCartUI() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cartBadge) cartBadge.textContent = totalQty;
        if (cartTotalItems) cartTotalItems.textContent = totalQty;
        if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotal);

        if (cartItemsList) {
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p class="empty-cart-msg">Your shopping cart is empty.</p>';
            } else {
                cartItemsList.innerHTML = cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">${formatCurrency(item.price)}</p>
                            <div class="cart-item-actions">
                                <div class="cart-qty-control">
                                    <button class="qty-btn cart-minus-btn" data-id="${item.id}">-</button>
                                    <span class="qty-count">${item.quantity}</span>
                                    <button class="qty-btn cart-plus-btn" data-id="${item.id}">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Event Delegation: Xử lý bấm nút + / - trực tiếp trong giỏ hàng
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            const target = e.target;
            if (!target.classList.contains('qty-btn')) return;

            const id = target.getAttribute('data-id');
            const item = cart.find(i => i.id === id);
            if (!item) return;

            if (target.classList.contains('cart-plus-btn')) {
                item.quantity++;
                syncProductCardUI(id, item.quantity);
                updateCartUI();
            } else if (target.classList.contains('cart-minus-btn')) {
                item.quantity--;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== id);
                    showToast(`Removed "${item.name}" from cart.`);
                    syncProductCardUI(id, 0);
                } else {
                    syncProductCardUI(id, item.quantity);
                }
                updateCartUI();
            }
        });
    }

    // Xử lý nút bấm trên các thẻ sản phẩm (Product Cards) ngoài trang
    const allProducts = document.querySelectorAll('.product-card');
    allProducts.forEach(card => {
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price'));
        const img = card.getAttribute('data-img');

        const quickAddBtn = card.querySelector('.quick-add-btn');
        const minusBtn = card.querySelector('.minus-btn');
        const plusBtn = card.querySelector('.plus-btn');

        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', () => {
                cart.push({ id, name, price, img, quantity: 1 });
                syncProductCardUI(id, 1);
                updateCartUI();
                showToast(`Added "${name}" to cart!`);
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    syncProductCardUI(id, item.quantity);
                    updateCartUI();
                }
            });
        }

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity--;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                        showToast(`Removed "${name}" from cart.`);
                        syncProductCardUI(id, 0);
                    } else {
                        syncProductCardUI(id, item.quantity);
                    }
                    updateCartUI();
                }
            });
        }
    });

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing to AURA!');
            newsletterForm.reset();
        });
    }


    // ==========================================================================
    // 5. SEARCH OVERLAY LOGIC
    // ==========================================================================
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchModal = document.querySelector('.search-modal');

    // 1. Dynamically create a results container so index.html stays completely untouched
    const searchResults = document.createElement('div');
    searchResults.style.marginTop = '24px';
    searchResults.style.maxHeight = '60vh';
    searchResults.style.overflowY = 'auto';
    searchResults.style.display = 'none'; 
    
    if (searchModal) {
        searchModal.appendChild(searchResults);
    }

    function openSearchOverlay() {
        if (!searchOverlay) return;
        searchOverlay.classList.add('active');
        if (searchInput) {
            searchInput.value = ''; // Reset input on open
            searchResults.innerHTML = ''; // Clear old results
            searchResults.style.display = 'none';
            setTimeout(() => searchInput.focus(), 100);
        }
    }

    function closeSearchOverlay() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('active');
    }

    function toggleSearchOverlay() {
        if (!searchOverlay) return;
        if (searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        } else {
            openSearchOverlay();
        }
    }

    if (searchBtn) searchBtn.addEventListener('click', toggleSearchOverlay);
    if (closeSearch) closeSearch.addEventListener('click', closeSearchOverlay);

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearchOverlay();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartDrawer(); 
            closeSearchOverlay();
        }
    });

    // 2. Real-time Prefix Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            searchResults.innerHTML = ''; // Clear results on every keystroke

            if (searchTerm === '') {
                searchResults.style.display = 'none';
                return;
            }

            searchResults.style.display = 'block';
            const allProducts = document.querySelectorAll('.product-card');
            let hasResults = false;

            allProducts.forEach(card => {
                const productName = card.getAttribute('data-name').toLowerCase();
                
                // Show product ONLY if the name starts with the exact typed prefix
                if (productName.startsWith(searchTerm)) {
                    hasResults = true;
                    
                    const imgSrc = card.getAttribute('data-img');
                    const name = card.getAttribute('data-name');
                    const price = parseFloat(card.getAttribute('data-price')).toFixed(2);

                    // Create a minimalist result row that matches your site's aesthetic
                    const resultItem = document.createElement('div');
                    resultItem.style.display = 'flex';
                    resultItem.style.alignItems = 'center';
                    resultItem.style.gap = '16px';
                    resultItem.style.padding = '12px 0';
                    resultItem.style.borderBottom = '1px solid #f0f0f0';

                    resultItem.innerHTML = `
                        <img src="${imgSrc}" alt="${name}" style="width: 50px; height: 65px; object-fit: cover; border-radius: 2px;">
                        <div>
                            <h4 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; font-family: 'Plus Jakarta Sans', sans-serif; color: #111;">${name}</h4>
                            <p style="font-size: 0.9rem; color: #555;">$${price}</p>
                        </div>
                    `;
                    searchResults.appendChild(resultItem);
                }
            });

            if (!hasResults) {
                searchResults.innerHTML = '<p style="color: #777; font-size: 0.9rem; text-align: center; padding: 20px 0;">No matching products found.</p>';
            }
        });
    }

    // ==========================================================================
    // 6. SCROLLSPY & NAVBAR CLICK HANDLER
    // ==========================================================================
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    
    let isClickScrolling = false; // Cờ đánh dấu người dùng vừa click menu
    let scrollTimeout = null;

    // Bắt sự kiện Click vào các mục Navbar
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // 1. Tạm khóa ScrollSpy để không bị nhảy gạch chân khi đang cuộn mượt
            isClickScrolling = true;

            // 2. Chuyển class 'active' thẳng đến mục vừa click ngay lập tức
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // 3. Xóa bộ đếm thời gian cũ (nếu có)
            if (scrollTimeout) clearTimeout(scrollTimeout);

            // 4. Bật lại ScrollSpy sau khi hoàn tất cuộn mượt (sau 800ms)
            scrollTimeout = setTimeout(() => {
                isClickScrolling = false;
            }, 800);
        });
    });

    // Hàm kiểm tra vị trí cuộn trang tự động
    function updateActiveNavOnScroll() {
        // Nếu vừa click vào menu, bỏ qua việc kiểm tra vị trí cuộn
        if (isClickScrolling) return;

        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Trường hợp đã cuộn sát đáy trang -> Kích hoạt 'about'
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);
        if (isAtBottom) {
            currentSectionId = 'about';
        }

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    // Kích hoạt khi cuộn trang
    window.addEventListener('scroll', updateActiveNavOnScroll);
});
