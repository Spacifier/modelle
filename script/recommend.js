function showOptions(optionId) {
    const options = document.querySelectorAll('.options');
    options.forEach(option => {
      if (option.id === optionId) {
        option.style.display = option.style.display === 'none' ? 'flex' : 'none';
      } else {
        option.style.display = 'none';
      }
    });
  }
//calling ml model
async function getRecommendations(articleType) {
  try {
      const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: 'USER_ID_FROM_SESSION', articleType })
      });
      const data = await response.json();
      displayRecommendations(data.recommendations);
  } catch (error) {
      console.error('Error fetching recommendations:', error);
  }
}

function displayRecommendations(recommendations) {
  const container = document.getElementById('recommendations-container');
  container.innerHTML = ''; // Clear existing recommendations
  recommendations.forEach(item => {
      const card = `
          <div class="recommendation-card">
              <h3>${item.productDisplayName}</h3>
              <p>Usage: ${item.usage}</p>
              <img src="../recommendation/images/${item.id}.jpg">
              <p>ID: ${item.id}</p>
          </div>
      `;
      container.innerHTML += card;
  });
}
