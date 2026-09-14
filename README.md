# 🌟 2026 AI 디지털 수업 성장 리포트 (AIDT Lesson Growth Report)

2026 AI 디지털 교수·학습 역량체계(D3·E3·F3)에 기반한 교사용 수업 설계 자가진단 및 수석교사 멘토링 AI 피드백 웹 애플리케이션입니다.

---

## 🚀 GitHub Push & Netlify 배포 가이드

이 프로젝트는 **Netlify Serverless Functions** 및 정적 호스팅(`netlify.toml`)이 완벽하게 사전 구성되어 있어, GitHub에 푸시하고 Netlify에 연동하기만 하면 즉시 전 세계에 배포됩니다.

### 1단계: GitHub에 코드 Push하기
터미널에서 아래 명령어를 순서대로 실행합니다:

```bash
# 1. git 초기화 (이미 되어 있다면 생략)
git init

# 2. 모든 변경사항 스테이징 (.gitignore에 따라 불필요한 파일 자동 제외)
git add .

# 3. 커밋 생성
git commit -m "feat: 2026 AI lesson report with Netlify serverless functions & Gemini API"

# 4. 기본 브랜치 이름을 main으로 설정
git branch -M main

# 5. 나의 깃허브 원격 저장소 주소 연결 (GitHub에서 생성한 본인 Repository URL 입력)
git remote add origin https://github.com/사용자계정/저장소이름.git

# 6. 깃허브로 푸시
git push -u origin main
```

---

### 2단계: Netlify에서 프로젝트 연동 및 환경변수 설정

1. **Netlify 로그인**
   - [Netlify (https://app.netlify.com)](https://app.netlify.com)에 접속하여 **GitHub 계정으로 로그인**합니다.

2. **GitHub 저장소 가져오기**
   - 대시보드에서 **`Add new site`** > **`Import an existing project`** 클릭
   - **`GitHub`** 선택 후 방금 푸시한 저장소를 선택합니다.

3. **빌드 설정 확인 (`netlify.toml`로 이미 자동 감지됨)**
   - **Base directory**: (공란 또는 `./`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
   *(프로젝트에 포함된 `netlify.toml` 파일에 의해 자동으로 설정됩니다.)*

4. **환경변수 (Gemini API Key) 입력**
   - 배포 전 하단의 **`Environment variables`** (또는 배포 후 `Site configuration` > `Environment variables`) 메뉴로 이동합니다.
   - **`Add a variable`** 버튼을 클릭하고 다음 정보를 입력합니다:
     - **Key (변수명)**: `GEMINI_API_KEY`
     - **Value (값)**: 본인의 구글 제미나이 API 키 입력 (`AIza...`)
     - *(선택사항: 클라이언트 빌드 시 함께 주입하려면 `VITE_GEMINI_API_KEY`로 동일한 키를 추가 등록하셔도 됩니다.)*
   - **`Save`**를 눌러 저장합니다.

5. **Deploy Site (배포 시작)**
   - **`Deploy site`** 버튼을 누르면 약 1~2분 후 배포가 완료되며 고유한 무료 URL(`https://랜덤이름.netlify.app`)이 생성됩니다!

---

## 🛠️ 기술 구성 요약

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, html2canvas, jspdf, pdfjs-dist
- **Backend / Serverless**:
  - 로컬/컨테이너 실행: Express (`server.ts`, 포트 3000)
  - Netlify 배포: Netlify Serverless Functions (`netlify/functions/api.ts` + `serverless-http`)
- **AI 엔진**: Google Gemini (`@google/genai` - `gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-flash-latest`)
- **안전장치**: API 키가 없거나 네트워크 지연 시에도 100% 정상 작동하는 **2026 AI 역량체계 스마트 폴백 진단 시스템** 내장
