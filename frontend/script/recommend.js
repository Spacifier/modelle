function showOptions(optionId) {
    const options = document.querySelectorAll('.options');
    options.forEach(option => {
      if (option.id === optionId) {
        option.style.display = option.style.display === 'none' ? 'flex' : 'none';
        const container = document.getElementById('recommendations-container');
        container.innerHTML = ''; // Clear existing recommendations
      } else {
        option.style.display = 'none';
      }
    });
  }

function scrollToRecommendations() {
  const recommendationsContainer = document.getElementById('recommendations-container');
  if (recommendationsContainer) {
    recommendationsContainer.scrollIntoView({ behavior: 'smooth' });
  }
}

function getUserIdFromToken(token) {
  try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id; 
  } catch (error) {
      console.error("Invalid token:", error);
      return null;
  }
}

let currentPage = 1;
let currentArticleType = '';

//calling model
async function getRecommendations(articleType, isLoadMore = false) {
  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);
  
  // Update current article type if it's a new request
  if (!isLoadMore) {
    currentPage = 1;
    currentArticleType = articleType;
  } else {
    currentPage++;
  }
 
  try {
    const data = {
      articleType: currentArticleType,
      page: currentPage
    };
    
    const response = await fetch(`https://modelle-backend.onrender.com/api/profile/${userId}/getData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result.recommendations);
    
    // Pass the isLoadMore flag to displayRecommendations
    displayRecommendations(result.recommendations, isLoadMore);
    
    // Scroll to recommendations after initial load (not for load more)
    if (!isLoadMore) {
      scrollToRecommendations();
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
}

//------------------------------------------display recommendations------------------------------------

function displayRecommendations(recommendations, isLoadMore = false) {
  const container = document.getElementById('recommendations-container');
  
  // Only clear and create structure if this is not a "load more" request
  if (!isLoadMore) {
    container.innerHTML = ''; // Clear existing content
    
    // Create main layout structure
    const layout = `
      <div class="modelle-wrapper">
        <header class="modelle-collections-header">
          <h1 class="collection-title">Curated For You</h1>
          <div class="collection-subtitle">Personalized recommendations based on your style profile</div>
        </header>
        
        <div class="modelle-filter-bar">
          <div class="filter-label">Filter by:</div>
          <div class="filter-options">
            <button class="filter-btn active" data-filter="all">All Items</button>
            <button class="filter-btn" data-filter="new">New Arrivals</button>
            <button class="filter-btn" data-filter="trending">Trending</button>
            <button class="filter-btn" data-filter="essentials">Essentials</button>
          </div>
          <div class="sort-wrapper">
            <select class="sort-select">
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
        
        <div class="modelle-products-grid" id="products-grid"></div>
        
        <div class="modelle-pagination">
          <button class="load-more-btn">Load More Recommendations</button>
        </div>
      </div>
    `;
    
    container.innerHTML = layout;
  }
  
  // Get reference to products grid
  const productsGrid = document.getElementById('products-grid');
  
  // For load more, we append products instead of replacing them
  if (isLoadMore) {
    renderAdditionalProducts(recommendations, productsGrid);
  } else {
    renderProducts(recommendations, productsGrid);
  }
  
  // Set up event listeners
  setupEventListeners(recommendations, productsGrid);
}

function renderProducts(products, container) {
  container.innerHTML = ''; // Clear grid
  
  products.forEach(product => {
    addProductToGrid(product, container);
  });
}

function renderAdditionalProducts(products, container) {
  // Don't clear the grid, just append new products
  products.forEach(product => {
    addProductToGrid(product, container);
  });
}

function addProductToGrid(product, container) {
  // Generate random price if not provided
  const price = product.price || Math.floor(Math.random() * 100) + 29.99;
  const discounted = Math.random() > 0.7; // 30% chance of discount
  const newArrival = Math.random() > 0.8; // 20% chance of new arrival
  const originalPrice = discounted ? price * 1.2 : null;
  
  // Create product card
  const productCard = document.createElement('div');
  productCard.className = 'modelle-product';
  productCard.dataset.id = product.id;
  
  productCard.innerHTML = `
    <div class="product-image-container">
      <img 
        src="${product.link}" 
        alt="${product.productDisplayName}" 
        class="product-image"
      >
      ${newArrival ? '<span class="product-badge new">New</span>' : ''}
      ${discounted ? '<span class="product-badge sale">Sale</span>' : ''}
      <div class="product-actions">
        <button class="quick-view-btn">Quick View</pbutton>
        <button class="add-to-bag-btn">Add to Bag</button>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.productDisplayName}</h3>
      <div class="product-usage">${product.usage || 'Casual'}</div>
      <div class="product-price-wrapper">
        ${originalPrice ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
        <span class="current-price${discounted ? ' sale-price' : ''}">$${price.toFixed(2)}</span>
      </div>
      <div class="color-options">
        <span class="color-option" style="background-color: #333"></span>
        <span class="color-option" style="background-color: #6b8ba4"></span>
        <span class="color-option" style="background-color: #d4c8be"></span>
      </div>
    </div>
  `;
  
  container.appendChild(productCard);
}

function setupEventListeners(products, productsGrid) {
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply filtering (placeholder - would integrate with real filters)
      const filterType = button.dataset.filter;
      // In a real application, this would filter the products
      // For now, we'll just show an animation
      
      productsGrid.classList.add('filtering');
      setTimeout(() => {
        productsGrid.classList.remove('filtering');
      }, 300);
    });
  });
  
  // Setup quick view and add to bag buttons
  document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.modelle-product');
      const productId = productCard.dataset.id;
      alert(`Quick view opened for product ID: ${productId}`);
    });
  });
  
  document.querySelectorAll('.add-to-bag-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.target;
      const productCard = btn.closest('.modelle-product');
      const productId = productCard.dataset.id;
      
      btn.innerHTML = 'Added ✓';
      btn.classList.add('added');
      
      setTimeout(() => {
        btn.innerHTML = 'Add to Bag';
        btn.classList.remove('added');
      }, 2000);
    });
  });
  
  // Load more button - Modified to use the current article type
  document.querySelector('.load-more-btn').addEventListener('click', () => {
    const loadingText = document.querySelector('.load-more-btn');
    loadingText.textContent = 'Loading...';
    
    // Call getRecommendations with the current article type and loadMore flag
    getRecommendations(currentArticleType, true);
    
    setTimeout(() => {
      loadingText.textContent = 'Load More Recommendations';
    }, 1500);
  });
  
  // Color options
  document.querySelectorAll('.color-option').forEach(color => {
    color.addEventListener('click', (e) => {
      const colorContainer = e.target.closest('.color-options');
      colorContainer.querySelectorAll('.color-option').forEach(c => {
        c.classList.remove('selected');
      });
      e.target.classList.add('selected');
    });
  });
}