// Track currently translating images
const translatingImages = new Set();

// Create loading spinner element
function createLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'manga-translator-spinner';
  spinner.innerHTML = `
    <div class="manga-translator-spinner-content">
      <div class="manga-translator-spinner-circle"></div>
      <div class="manga-translator-spinner-text">Translating...</div>
    </div>
  `;
  return spinner;
}

// Show loading spinner
function showLoadingSpinner() {
  // Remove existing spinner if any
  hideLoadingSpinner();

  const spinner = createLoadingSpinner();
  document.body.appendChild(spinner);

  // Trigger animation
  setTimeout(() => {
    spinner.classList.add('manga-translator-spinner-visible');
  }, 10);
}

// Hide loading spinner
function hideLoadingSpinner() {
  const existing = document.querySelector('.manga-translator-spinner');
  if (existing) {
    existing.classList.remove('manga-translator-spinner-visible');
    setTimeout(() => {
      existing.remove();
    }, 300);
  }
}

// Show error notification
function showErrorNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector('.manga-translator-notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'manga-translator-notification manga-translator-notification-error';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('manga-translator-notification-visible');
  }, 10);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('manga-translator-notification-visible');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Replace image with translated version
function replaceImage(originalUrl, translatedUrl) {
  // Find all images with the original URL
  const images = document.querySelectorAll(`img[src="${originalUrl}"]`);

  images.forEach(img => {
    img.src = translatedUrl;
  });

  // Also check for images with srcset
  const imagesWithSrcset = document.querySelectorAll('img[srcset]');
  imagesWithSrcset.forEach(img => {
    if (img.currentSrc === originalUrl) {
      img.src = translatedUrl;
      img.removeAttribute('srcset');
    }
  });

  // Check for background images
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const bgImage = window.getComputedStyle(element).backgroundImage;
    if (bgImage && bgImage.includes(originalUrl)) {
      element.style.backgroundImage = `url("${translatedUrl}")`;
    }
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'TRANSLATION_START':
      translatingImages.add(message.imageUrl);
      showLoadingSpinner();
      break;

    case 'TRANSLATION_COMPLETE':
      translatingImages.delete(message.imageUrl);
      hideLoadingSpinner();
      replaceImage(message.imageUrl, message.translatedImageUrl);
      break;

    case 'TRANSLATION_ERROR':
      if (message.imageUrl) {
        translatingImages.delete(message.imageUrl);
      }
      hideLoadingSpinner();
      showErrorNotification(message.error);
      break;
  }
});

// Log when content script is loaded
console.log('Manga Image Translator content script loaded');
