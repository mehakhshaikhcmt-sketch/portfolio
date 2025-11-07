// 🌙 Load photo & video data from data.json dynamically
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const photoGallery = document.getElementById('photo-gallery');
    const videoGallery = document.getElementById('video-gallery');

    // Load Photos
    data.photos.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.title || 'Photo';
      img.title = photo.title || '';
      photoGallery.appendChild(img);
    });

    // Load Videos
    data.videos.forEach(video => {
      const vid = document.createElement('video');
      vid.src = video.url;
      vid.controls = true;
      vid.title = video.title || '';
      videoGallery.appendChild(vid);
    });
  })
  .catch(err => console.error('Error loading data.json:', err));


// 🎬 Handle tab switching between Photos and Videos
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    // Add active to selected tab and its content
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});
