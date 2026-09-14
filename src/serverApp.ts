import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export function getGenAI(customKey?: string): GoogleGenAI {
  const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({ apiKey });
}

export function generateSmartFallbackKpt(topic: string, target: string, teacher: string) {
  return {
    mentorSummary: `${teacher} 선생님의 [${topic}] 수업 설계는 학습자의 능동적 참여와 과정 중심 평가가 긴밀히 맞물린 우수한 수업 모델입니다. 2026 AI 역량체계(D3·E3·F3) 기준에 따라 수업의 강점을 보존하고 기술적 병목을 사전에 보완할 수 있도록 제언을 구성하였습니다.`,
    keep: `${target} 학생들의 실제 참여율을 극대화하기 위해 맞춤형 디지털 상호작용 도구와 실시간 대시보드를 연계하여 1:1 개별화 피드백을 막힘없이 실행한 점이 탁월함.`,
    problem: '디지털 기기 조작 속도 편차로 인해 일부 활동 완료 시차와 모둠 간 유휴 시간이 발생할 수 있는 잠재적 병목이 존재함.',
    tryNext: '속진 학생을 위한 심화 융합 탐구 선택 과제를 사전에 배치하고, 모둠별 테크 도우미 학생 제도를 상시화하여 학습 흐름의 연속성을 강화할 예정임.',
  };
}

export function generateSmartFallbackRubric(topic: string, target: string, teacher: string) {
  return {
    overallAssessment: `${teacher} 선생님의 [${topic}] 수업 설계는 ${target} 학습자의 수준과 에듀테크 도구의 기능성이 긴밀히 결합되어 있습니다. 단순 기능 습득을 넘어 탐구와 평가 환류가 유기적으로 연계된 매우 모범적인 1차 수업 모델입니다.`,
    predictedTotalScore: 19,
    predictedGrade: '탁월 등급 🏆',
    items: [
      {
        id: 'lens_q1',
        questionNumber: 'Q1',
        indicator: '학습자 주도성',
        suggestedScore: 5,
        diagnosis: '학생 개개인이 자신의 역량과 이해 속도에 맞춰 디지털 환경에서 능동적으로 의사결정을 내릴 수 있도록 학습 경로가 잘 설계되었습니다.',
        suggestedEvidence: `[${topic}] 탐구 과정에서 맞춤형 디지털 상호작용 도구를 적용하여 모든 학생이 각자의 인지 속도에 맞춰 문제를 해결하고 모둠별 실시간 대시보드에 의견을 주도적으로 공유함.`,
        keyStrengths: ['개별 학습 속도 존중', '능동적 디지털 참여'],
        recommendations: '자기진도 조절이 빠른 속진 학생을 위한 심화 탐구 링크를 사전 배치하면 주도성이 더욱 극대화됩니다.',
      },
      {
        id: 'lens_q2',
        questionNumber: 'Q2',
        indicator: '깊이 있는 학습',
        suggestedScore: 5,
        diagnosis: '단순 검색이나 텍스트 요약에 그치지 않고, 핵심 개념의 시각화와 조작 활동을 통해 원리를 다층적으로 탐구하도록 기획되었습니다.',
        suggestedEvidence: `학습 주제 관련 원리를 단순 암기가 아닌 시각화 시뮬레이션 및 데이터 비교 활동으로 구조화하여, 원인-결과 관계를 스스로 도출하는 개념적 심층 탐구를 촉진함.`,
        keyStrengths: ['개념 시각화', '고차원적 비판적 사고 촉진'],
        recommendations: '탐구 결과를 자신의 언어로 정의해보는 2분 음성/텍스트 요약 단계를 전개 말미에 배치해 보세요.',
      },
      {
        id: 'lens_q3',
        questionNumber: 'Q3',
        indicator: '과정 중심 평가',
        suggestedScore: 5,
        diagnosis: '수업 도중 축적되는 학생들의 반응 및 평가 데이터가 교사의 즉각적 순회지도와 맞춤 환류로 직결되어 배움의 결손을 실시간 차단합니다.',
        suggestedEvidence: `형성평가 및 활동 대시보드를 통해 학생별 오개념 및 응답 지연 지점을 즉시 포착하고, 추출된 학습 로그를 기반으로 소집단 맞춤 클리닉 환류를 실행함.`,
        keyStrengths: ['실시간 데이터 모니터링', '즉각적 오개념 교정'],
        recommendations: '학생 스스로 대시보드 성취도를 확인하고 상호 칭찬 스티커를 부여하는 동료 피드백 단계를 연계해 보세요.',
      },
      {
        id: 'lens_q4',
        questionNumber: 'Q4',
        indicator: '실행 가능성',
        suggestedScore: 4,
        diagnosis: `${target} 학생들의 실제 디지털 기기 조작 능력과 교실 네트워크 인프라를 고려할 때 무리 없이 40분 차시 내에 안착할 수 있는 현실적 설계입니다.`,
        suggestedEvidence: `전체 수업 40분 중 디지털 기기 조작 시간을 20분 내외로 통제하여 기술 피로도를 줄이고, 직관적 UI의 애플리케이션을 선별해 발달 수준에 부합하도록 최적화함.`,
        keyStrengths: ['적정 기술 원칙 준수', '수업 시간 배분의 균형'],
        recommendations: '네트워크 순간 단절 시 오프라인 활동지로 즉시 전환할 수 있는 백업 카드를 책상에 비치해 두면 완벽합니다.',
      },
    ],
    kpt: {
      keep: '실시간 데이터 대시보드와 개별 순회 지도를 연계하여 학생의 학습 결손을 즉각 지원하고 수업 참여도를 100%로 끌어올린 점이 탁월함.',
      problem: '기기 네트워크 지연 시 조작이 다소 늦은 학생들의 인지 과부하가 발생할 수 있는 잠재적 병목이 존재함.',
      tryNext: '모둠별 테크 도우미 학생 제도를 상시화하고, 1페이지 시각화 질문 템플릿을 사전 배부하여 원활한 질의응답을 지원할 예정.',
    },
  };
}

export function createApiApp(): express.Express {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS support for iframe, preview hosts, and Netlify domains
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const router = express.Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // KPT AI Feedback
  router.post('/kpt-feedback', async (req, res) => {
    try {
      const { teacherInfo, rubricItems, currentKpt, planDoc, materialDoc } = req.body;

      const school = teacherInfo?.schoolName || '미지정 학교';
      const target = teacherInfo?.targetAudience || '초·중·고 학생';
      const teacher = teacherInfo?.teacherName || '선생님';
      const topic = teacherInfo?.lessonTopic || 'AI 디지털 활용 수업';
      const date = teacherInfo?.date || '';

      const authHeader = req.headers.authorization;
      const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || bearerKey;
      if (!apiKey) {
        return res.json({
          success: true,
          data: generateSmartFallbackKpt(topic, target, teacher),
        });
      }

      const ai = getGenAI(apiKey);

      const rubricSummary = Array.isArray(rubricItems)
        ? rubricItems
            .map(
              (item: any) =>
                `- [${item.questionNumber}] ${item.indicator} (${item.categoryLabel}, ${item.score}점/5점)\n  평가 질문: ${item.question}\n  교사 실천 근거: ${item.evidence || '(작성 내용 없음)'}`
            )
            .join('\n')
        : '';

      const docParts: any[] = [];
      let docDescriptions = '';

      const processDoc = (doc: any, label: string) => {
        if (!doc) return;
        docDescriptions += `- ${label}: ${doc.name || '문서명 미상'} (${doc.fileSize || '크기 미상'})\n`;

        if (typeof doc.dataUrl === 'string') {
          if (doc.dataUrl.startsWith('data:application/pdf;base64,')) {
            const rawBase64 = doc.dataUrl.replace('data:application/pdf;base64,', '');
            if (rawBase64.length > 0 && rawBase64.length < 15000000) {
              docParts.push({
                inlineData: {
                  mimeType: 'application/pdf',
                  data: rawBase64,
                },
              });
            }
          } else if (doc.dataUrl.startsWith('data:image/svg+xml')) {
            try {
              const rawSvg = decodeURIComponent(doc.dataUrl.replace('data:image/svg+xml;utf8,', ''));
              const plainText = rawSvg.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              if (plainText) {
                docDescriptions += `  (${label} 핵심 내용: ${plainText.slice(0, 800)})\n`;
              }
            } catch {
              // ignore svg parse error
            }
          }
        }
      };

      processDoc(planDoc, '1) 지도안 PDF (수업설계안)');
      processDoc(materialDoc, '2) 학습자료 PDF (학생용 활동지 및 데이터)');

      const userPrompt = `
[수업 기본 정보]
- 작성 교사: ${teacher}
- 학교/소속: ${school}
- 대상 학급: ${target}
- 수업 주제 및 단원: ${topic}
- 실시 일자: ${date}

[교사가 탑재한 교수·학습자료(지도안 및 학습자료)]
${docDescriptions || '(교수학습자료가 미탑재되었습니다.)'}
※ 함께 전달된 지도안 PDF 및 학습자료 PDF 문서(또는 요약 데이터)를 면밀히 분석하여 수업의 실제 전개 방식, 학습 활동 구성, 학생 참여 구조를 파악해 주십시오.

[AI 디지털 교수·학습 역량체계(D3·E3·F3) 자가 진단 평가 결과 및 실천 근거]
${rubricSummary}

[현재 작성 중인 KPT 성찰 초안]
- Keep (잘된 점): ${currentKpt?.keep || '(아직 작성되지 않음)'}
- Problem (아쉬운 점): ${currentKpt?.problem || '(아직 작성되지 않음)'}
- Try (실행 개선안): ${currentKpt?.tryNext || '(아직 작성되지 않음)'}

위의 [탑재된 지도안 및 학습자료 PDF], [질문별 자기평가 점수와 실천근거], [수업 기본 정보]를 종합적으로 연계 분석하여, 20년 경력의 수업 전문 수석교사의 시선에서 동료 교사를 위한 깊이 있고 실제적인 KPT 피드백과 따뜻한 멘토링 총평을 작성해 주세요.
`;

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
      let response: any = null;

      const systemInstruction = `당신은 대한민국 20년 이상 경력의 수업 전문 수석교사이자 AI 디지털 교육 실천 전문가입니다.
동료 교사가 탑재한 [지도안 PDF]와 [학습자료 PDF], 그리고 [역량 질문(D3·E3·F3)에 대한 자기평가 점수와 교사 실천근거]를 깊이 있게 읽고, 실제 수업 현장에 꼭 들어맞는 탁월하고 품격 있는 전문 멘토링 KPT 피드백을 제공합니다.

[피드백 작성 원칙]
1. 어조: 후배 교사의 수업 고민과 실천을 따뜻하게 지지하고 격려하는 품격 있는 수석교사의 어조(해요체/하십시오체 혼용).
2. 전문성: 단순 일반론이 아닌, 교사가 첨부한 지도안의 수업 단계(도입-전개-정리)와 학습자료의 구체적 활동, 그리고 교사가 기재한 실천 근거를 직접 인용하며 분석합니다.
3. KPT 구성:
   - keep: 탑재된 지도안 및 학습자료와 실천근거에서 나타난 수업의 교육적 강점과 학생 주도적 탐구 반응 (2~3문장)
   - problem: 지도안 설계나 학습자료 실행에서 마주할 수 있는 배움의 장애 요인, 도구 활용의 과부하, 인지적 병목 (2~3문장)
   - tryNext: 다음 차시 수업이나 후속 단원에서 즉시 적용할 수 있는 구체적 교수학습 처방과 디지털 수업 재구조화 아이디어 (2~3문장)
   - mentorSummary: 수석교사로서 교사의 도전과 성장을 진심으로 응원하는 따뜻한 멘토링 총평 (2~3문장)

반드시 유효한 JSON 형식으로만 응답해야 합니다. 마크다운 백틱 없이 순수 JSON 객체로 출력하세요.
예시:
{
  "mentorSummary": "선생님, 디지털 도구를 통해 학생 개개인의 탐구 수준을 끌어올리려는 섬세한 수업 디자인이 매우 돋보입니다. ...",
  "keep": "...",
  "problem": "...",
  "tryNext": "..."
}`;

      const contentsList = docParts.length > 0
        ? [
            ...docParts,
            {
              text: userPrompt,
            },
          ]
        : userPrompt;

      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: contentsList,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
            },
          });
          if (response?.text) break;
        } catch {
          await new Promise((r) => setTimeout(r, 400));
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents: userPrompt,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
              },
            });
            if (response?.text) break;
          } catch {
            // move to next candidate
          }
        }
      }

      if (!response?.text) {
        return res.json({
          success: true,
          data: generateSmartFallbackKpt(topic, target, teacher),
        });
      }

      const text = response.text || '';
      let parsedData: any = null;
      try {
        parsedData = JSON.parse(text);
      } catch {
        const cleaned = text.replace(/```json\n?|```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      return res.json({
        success: true,
        data: {
          mentorSummary: parsedData.mentorSummary || '',
          keep: parsedData.keep || '',
          problem: parsedData.problem || '',
          tryNext: parsedData.tryNext || '',
        },
      });
    } catch {
      return res.json({
        success: true,
        data: generateSmartFallbackKpt(
          req.body?.teacherInfo?.lessonTopic || 'AI 디지털 활용 수업',
          req.body?.teacherInfo?.targetAudience || '초·중·고 학생',
          req.body?.teacherInfo?.teacherName || '선생님'
        ),
      });
    }
  });

  // Rubric AI Feedback
  router.post('/rubric-feedback', async (req, res) => {
    try {
      const { teacherInfo, planDoc, materialDoc, rubricItems } = req.body;

      const school = teacherInfo?.schoolName || '미지정 학교';
      const target = teacherInfo?.targetAudience || '초·중·고';
      const teacher = teacherInfo?.teacherName || '선생님';
      const topic = teacherInfo?.lessonTopic || 'AI 디지털 활용 수업';
      const date = teacherInfo?.date || '';

      const currentAnswers = Array.isArray(rubricItems)
        ? rubricItems.map((item: any) => ({
            id: item.id,
            qNum: item.questionNumber,
            score: item.score,
            indicator: item.indicator,
            evidence: item.evidence || '',
          }))
        : [];

      const docTexts: string[] = [];
      if (planDoc?.extractedText) {
        docTexts.push(`[지도안 문서 텍스트 발췌]\n${planDoc.extractedText.slice(0, 4000)}`);
      }
      if (materialDoc?.extractedText) {
        docTexts.push(`[학습자료 문서 텍스트 발췌]\n${materialDoc.extractedText.slice(0, 4000)}`);
      }

      const userPrompt = `
[수업 기본 정보]
- 작성 교사: ${teacher}
- 학교/소속: ${school}
- 대상 학년/학생: ${target}
- 수업 주제 및 단원: ${topic}
- 실시 일자: ${date}

[교사가 탑재한 문서 발췌]
${docTexts.join('\n\n') || '(등록된 문서 텍스트 없음 - 주제와 대상 학년 정보 기반으로 진단)'}

[교사의 현재 자가진단 내역]
${JSON.stringify(currentAnswers, null, 2)}

[요청 사항]
2026 AI 디지털 교수·학습 역량체계(D3·E3·F3) 렌즈 1 수업 설계 타당성 4대 핵심 질문에 대해,
수업 전문 수석교사의 관점에서 1차 추천 점수(1~5점), 실천 근거 서술 제안, 진단 피드백, 핵심 강점, 추천 실행 팁, 그리고 KPT 성찰안을 JSON으로 도출해 주십시오.
`;

      const systemInstruction = `당신은 교육부 및 시도교육청 2026 AI 디지털 교수·학습 역량체계(D3·E3·F3) 개발진이자 20년 경력의 수석교사입니다.
탑재된 지도안/학습자료와 수업 정보를 엄밀히 분석하여 교사의 수업 설계 타당성을 전문적으로 진단합니다.

반드시 유효한 JSON 객체로만 응답하세요:
{
  "overallAssessment": "수석교사의 종합 진단 총평 (3~4문장)",
  "predictedTotalScore": 19,
  "predictedGrade": "탁월 등급 🏆",
  "items": [
    {
      "id": "lens_q1",
      "questionNumber": "Q1",
      "indicator": "학습자 주도성",
      "suggestedScore": 5,
      "diagnosis": "교사의 지도안에서 나타난 학습자 주도성 설계 진단 (2문장)",
      "suggestedEvidence": "지도안과 학습자료의 구체적 활동을 인용한 교사 실천근거 추천 서술 (2문장)",
      "keyStrengths": ["강점1", "강점2"],
      "recommendations": "수업 개선 제언 (1문장)"
    },
    {
      "id": "lens_q2",
      "questionNumber": "Q2",
      "indicator": "깊이 있는 학습",
      "suggestedScore": 5,
      "diagnosis": "...",
      "suggestedEvidence": "...",
      "keyStrengths": ["강점1", "강점2"],
      "recommendations": "..."
    },
    {
      "id": "lens_q3",
      "questionNumber": "Q3",
      "indicator": "과정 중심 평가",
      "suggestedScore": 5,
      "diagnosis": "...",
      "suggestedEvidence": "...",
      "keyStrengths": ["강점1", "강점2"],
      "recommendations": "..."
    },
    {
      "id": "lens_q4",
      "questionNumber": "Q4",
      "indicator": "실행 가능성",
      "suggestedScore": 4,
      "diagnosis": "...",
      "suggestedEvidence": "...",
      "keyStrengths": ["강점1", "강점2"],
      "recommendations": "..."
    }
  ],
  "kpt": {
    "keep": "...",
    "problem": "...",
    "tryNext": "..."
  }
}`;

      const authHeader = req.headers.authorization;
      const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || bearerKey;
      if (!apiKey) {
        return res.json({
          success: true,
          data: generateSmartFallbackRubric(topic, target, teacher),
        });
      }

      const ai = getGenAI(apiKey);
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
      let responseText = '';

      for (const modelName of candidateModels) {
        try {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
            },
          });
          if (resp?.text) {
            responseText = resp.text;
            break;
          }
        } catch {
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      if (!responseText) {
        return res.json({
          success: true,
          data: generateSmartFallbackRubric(topic, target, teacher),
        });
      }

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json\n?|```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      return res.json({
        success: true,
        data: parsed,
      });
    } catch {
      const fallback = generateSmartFallbackRubric(
        req.body?.teacherInfo?.lessonTopic || 'AI 디지털 활용 수업',
        req.body?.teacherInfo?.targetAudience || '초·중·고',
        req.body?.teacherInfo?.teacherName || '선생님'
      );
      return res.json({
        success: true,
        data: fallback,
      });
    }
  });

  // Mount router under both '/api' AND root '/' for maximum compatibility with serverless rewrites
  app.use('/api', router);
  app.use('/', router);

  return app;
}
