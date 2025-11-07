fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const photoGallery = document.getElementById('photo-gallery');
    const videoGallery = document.getElementById('video-gallery');

    // Load Photos
    data.photos.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.title;
      photoGallery.appendChild(img);
    });

    // Load Videos
    data.videos.forEach(video => {
      const vid = document.createElement('video');
      vid.src = video.url;
      vid.controls = true;
      videoGallery.appendChild(vid);
    });
  });
