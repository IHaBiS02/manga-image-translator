// Default config from config.json
const DEFAULT_CONFIG = {
  "filter_text": null,
  "render": {
    "renderer": "manga2eng_pillow",
    "alignment": "auto",
    "disable_font_border": false,
    "font_size_offset": 0,
    "font_size_minimum": -1,
    "direction": "auto",
    "uppercase": false,
    "lowercase": false,
    "gimp_font": "Sans-serif",
    "no_hyphenation": false,
    "font_color": "000000:FFFFFF"
  },
  "upscale": {
    "upscaler": "esrgan",
    "revert_upscaling": false
  },
  "translator": {
    "translator": "gemini_2stage",
    "target_lang": "ENG",
    "no_text_lang_skip": false
  },
  "detector": {
    "detector": "default",
    "detection_size": 2048,
    "text_threshold": 0.5,
    "det_rotate": false,
    "det_auto_rotate": false,
    "det_invert": false,
    "det_gamma_correct": false,
    "box_threshold": 0.7,
    "unclip_ratio": 2.3
  },
  "colorizer": {
    "colorization_size": 576,
    "denoise_sigma": 30,
    "colorizer": "none"
  },
  "inpainter": {
    "inpainter": "lama_large",
    "inpainting_size": 2048,
    "inpainting_precision": "bf16"
  },
  "ocr": {
    "use_mocr_merge": false,
    "ocr": "48px",
    "min_text_length": 0,
    "ignore_bubble": 0,
    "prob": -1
  },
  "kernel_size": 3,
  "mask_dilation_offset": 40
};

const DEFAULT_SERVER_URL = 'http://localhost:5000';

// Load saved settings
document.addEventListener('DOMContentLoaded', async () => {
  const serverUrlInput = document.getElementById('serverUrl');
  const configTextarea = document.getElementById('config');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // Load saved data
  const result = await chrome.storage.sync.get(['serverUrl', 'translatorConfig']);

  serverUrlInput.value = result.serverUrl || DEFAULT_SERVER_URL;
  configTextarea.value = JSON.stringify(
    result.translatorConfig || DEFAULT_CONFIG,
    null,
    2
  );

  // Save button handler
  saveBtn.addEventListener('click', async () => {
    const serverUrl = serverUrlInput.value.trim();
    const configText = configTextarea.value.trim();

    // Validate inputs
    if (!serverUrl) {
      showStatus('서버 URL을 입력해주세요.', 'error');
      return;
    }

    let config;
    try {
      config = JSON.parse(configText);
    } catch (error) {
      showStatus('설정 JSON 형식이 올바르지 않습니다.', 'error');
      return;
    }

    // Save to storage
    await chrome.storage.sync.set({
      serverUrl: serverUrl,
      translatorConfig: config
    });

    showStatus('설정이 저장되었습니다!', 'success');

    // Auto-hide success message after 2 seconds
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
  }
});
