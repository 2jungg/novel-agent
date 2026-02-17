# ✍️ Novel-Agent (@2jungg/novel-agent)

AI 기반 웹소설 자동 생성 및 관리 에이전트입니다. 세계관 설정부터 캐릭터 관리, 에피소드 집필까지 한 번에 관리하세요.

## 🚀 설치 방법 (Coming Soon to NPM)

현재는 로컬에서 다음과 같이 설치 및 실행할 수 있습니다:

```bash
git clone https://github.com/2jungg/novel-agent.git
cd novel-agent
npm install
npm link # 'novel' 명령어를 어디서나 사용할 수 있게 등록합니다.
```

## 🛠 주요 명령어 사용법

### 1. 프로젝트 시작 및 설정
- `novel auth`: Google/OpenAI 계정 연동 (OAuth 인증).
- `novel config -m <model>`: 사용할 기본 모델을 설정합니다. (기본값: `gemini-3-flash`)
- `novel init <프로젝트명>`: 새로운 소설 프로젝트 폴더를 만들고, AI가 추천하는 5가지 컨셉 중 하나를 선택하여 시작합니다.

### 2. 기획 및 설정 변경
- `novel plan "추가 메시지"`: 전체 스토리라인과 에피소드 아크를 구성합니다.
- `novel change "요청사항"`: "주인공을 더 차갑게 바꿔줘"와 같이 세계관이나 캐릭터 설정을 수정합니다.
- `novel relations`: 현재 등록된 캐릭터들의 목록과 관계를 확인합니다.

### 3. 집필 및 피드백
- `novel write`: 다음 화(n+1)를 자동으로 작성합니다.
- `novel write <번호>`: 특정 화를 작성합니다.
- `novel write <번호> --edit "지시사항"`: 이미 작성된 화를 특정 지시사항에 맞춰 수정합니다.
- `novel critique <번호>`: 특정 화에 대해 AI의 객관적인 비평(설정 오류, 전개 속도 등)을 받습니다.

### 4. 출판
- `novel export [format]`: 지금까지 쓴 모든 원고를 하나의 파일(`.txt` 등)로 합쳐서 내보냅니다.

## 🤖 기본 설정 모델
기본 모델은 **`gemini-3-flash`**로 설정되어 있습니다. 
`novel config -m <모델명>` 명령어를 통해 `gpt-5.2-codex`, `gemini-3-pro` 등으로 자유롭게 변경할 수 있습니다.

## 🛡 보안
본 에이전트는 **Path Validation Sandbox**가 적용되어 있어, 프로젝트 폴더 외부의 파일에 접근하거나 수정하는 것을 엄격히 차단합니다.
