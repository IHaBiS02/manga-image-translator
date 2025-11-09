// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translateImage',
    title: 'Translate Image',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'translateImage' && info.srcUrl) {
    try {
      // Get settings from storage
      const { serverUrl, translatorConfig } = await chrome.storage.sync.get([
        'serverUrl',
        'translatorConfig'
      ]);

      if (!serverUrl) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TRANSLATION_ERROR',
          error: '서버 URL이 설정되지 않았습니다. 확장프로그램 아이콘을 클릭하여 설정해주세요.'
        });
        return;
      }

      // Notify content script to show loading spinner
      chrome.tabs.sendMessage(tab.id, {
        type: 'TRANSLATION_START',
        imageUrl: info.srcUrl
      });

      // Fetch the image
      const imageResponse = await fetch(info.srcUrl);
      const imageBlob = await imageResponse.blob();

      // Prepare form data
      const formData = new FormData();
      formData.append('file', imageBlob, 'image.png');

      // Add config parameters if available
      if (translatorConfig) {
        formData.append('config', JSON.stringify(translatorConfig));
      }

      // Send to translation server
      const translationResponse = await fetch(`${serverUrl}/translate`, {
        method: 'POST',
        body: formData
      });

      if (!translationResponse.ok) {
        throw new Error(`서버 오류: ${translationResponse.status} ${translationResponse.statusText}`);
      }

      // Get translated image
      const translatedBlob = await translationResponse.blob();
      const translatedImageUrl = URL.createObjectURL(translatedBlob);

      // Send translated image to content script
      chrome.tabs.sendMessage(tab.id, {
        type: 'TRANSLATION_COMPLETE',
        imageUrl: info.srcUrl,
        translatedImageUrl: translatedImageUrl
      });
    } catch (error) {
      console.error('Translation error:', error);
      chrome.tabs.sendMessage(tab.id, {
        type: 'TRANSLATION_ERROR',
        imageUrl: info.srcUrl,
        error: error.message || '번역 중 오류가 발생했습니다.'
      });
    }
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['serverUrl', 'translatorConfig'], (result) => {
      sendResponse(result);
    });
    return true; // Keep the message channel open for async response
  }
});
