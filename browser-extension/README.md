# Manga Image Translator Browser Extension

이 브라우저 확장프로그램은 웹 페이지의 이미지를 우클릭하여 번역할 수 있게 해줍니다.

## 기능

- 이미지 우클릭 시 "Translate Image" 메뉴 표시
- 번역 진행 중 오른쪽 하단에 로딩 스피너 표시
- 번역 완료 시 원본 이미지를 번역된 이미지로 자동 교체
- 설정 UI를 통한 서버 URL 및 config.json 설정

## 설치 방법

### Chrome/Edge

1. Chrome/Edge에서 `chrome://extensions` 또는 `edge://extensions` 접속
2. 우측 상단의 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `browser-extension` 폴더 선택

### Firefox

1. Firefox에서 `about:debugging` 접속
2. "임시 추가 기능 로드" 클릭
3. `browser-extension` 폴더의 `manifest.json` 파일 선택

## 사용 방법

### 1. 서버 설정

1. 브라우저 툴바의 확장프로그램 아이콘 클릭
2. 서버 URL 입력 (예: `http://localhost:5000`)
3. config.json 내용 입력 (필요한 경우 수정)
4. "저장" 버튼 클릭

### 2. 이미지 번역

1. 번역하고 싶은 이미지에 마우스 우클릭
2. "Translate Image" 메뉴 선택
3. 오른쪽 하단에 로딩 스피너가 표시됨
4. 번역 완료 시 이미지가 자동으로 교체됨

## 필요한 아이콘

다음 크기의 아이콘 파일을 `browser-extension/icons/` 폴더에 추가해야 합니다:

- `icon16.png` (16x16)
- `icon32.png` (32x32)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

## 서버 API 요구사항

이 확장프로그램은 다음과 같은 API 엔드포인트를 필요로 합니다:

- **POST** `/translate`
  - 요청: `multipart/form-data`
    - `file`: 이미지 파일
    - `config`: JSON 문자열 (선택사항)
  - 응답: 번역된 이미지 파일 (binary)

## 문제 해결

- 번역이 시작되지 않는 경우: 서버 URL이 올바르게 설정되어 있는지 확인
- 오류 메시지가 표시되는 경우: 서버가 실행 중인지, API 엔드포인트가 올바른지 확인
- 이미지가 교체되지 않는 경우: 브라우저 콘솔에서 오류 메시지 확인
