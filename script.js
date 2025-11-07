// Load data dynamically
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Gallery Carousel
    const carousel = document.getElementById('carouselContainer');
    data.gallery.forEach(img => {
      const image = document.createElement('img');
      image.src = img.url;
      image.alt = img.title;
      carousel.appendChild(image);
    });

    // Albums
    const albumGrid = document.getElementById('albumGrid');
    data.albums.forEach(album => {
      const card = document.createElement('div');
      card.className = 'album-card';
      card.innerHTML = `<h3>${album.name}</h3>`;
      albumGrid.appendChild(card);
    });

    // Filters
    const filterGrid = document.getElementById('filterGrid');
    data.filters.forEach(f => {
      const filter = document.createElement('div');
      filter.className = 'filter-card';
      filter.textContent = f.name;
      filterGrid.appendChild(filter);
    });

    // Stories
    const storyGrid = document.getElementById('storyGrid');
    data.stories.forEach(s => {
      const story = document.createElement('div');
      story.className = 'story-card';
      story.innerHTML = `<img src="${s.url}" alt="${s.title}"><p>${s.caption}</p>`;
      storyGrid.appendChild(story);
    });
  });
