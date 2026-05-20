import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { AnalysisResult } from './types';

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-6';

const SYSTEM_PROMPT = `당신은 SH 서울주택도시공사의 임대/분양 공고문 PDF를 분석하는 전문가입니다.

PDF 공고문을 분석하여 다음 JSON 형식으로 구조화된 데이터를 추출해주세요:

{
  "announcements": [
    {
      "seq": "공고 고유 번호",
      "title": "공고 제목",
      "housing_type": "장기전세 | 국민임대 | 행복주택 | 공공분양 등",
      "supply_category": "임대 | 분양",
      "status": "진행중 | 예정",
      "application_start": "YYYY-MM-DD 또는 null",
      "application_end": "YYYY-MM-DD 또는 null",
      "unit_count": 공급세대수(숫자),
      "source_url": null
    }
  ],
  "qa_state_machine": {
    "initial": "q1",
    "meta": { "total_questions": 질문수 },
    "states": {
      "q1": {
        "type": "question",
        "text": "질문 내용",
        "input": "boolean | number | choice",
        "unit": "단위(숫자일 경우)",
        "options": ["선택지(choice일 경우)"],
        "profile_key": "프로필 매핑 키 또는 null",
        "help": { "ref": "용어사전 참조키" },
        "transitions": [
          { "condition": { "op": "eq|gt|lt|gte|lte", "value": 값 }, "next": "다음상태ID" }
        ]
      },
      "result_eligible": {
        "type": "result",
        "result": "적합",
        "units": [
          {
            "complex_name": "단지명",
            "location": "소재지",
            "unit_type": "평형타입",
            "area_sqm": 전용면적,
            "supply_count": 공급세대수,
            "track": "일반공급 | 특별공급(유형)",
            "cost": [{ "label": "항목명", "amount": 금액(원), "period": "monthly|once|null" }]
          }
        ]
      },
      "result_ineligible": {
        "type": "result",
        "result": "부적합",
        "reason": "탈락 사유"
      }
    }
  },
  "glossary": [
    {
      "term": "용어명",
      "category": "소득기준 | 주택정보 | 자격요건 | 공급유형",
      "description": "쉬운 설명",
      "related": ["관련 용어"]
    }
  ]
}

규칙:
1. 금액은 모두 원(KRW) 단위 숫자로 변환
2. Q&A 상태 머신은 사용자가 자격 여부를 판단할 수 있도록 설계
3. profile_key는 다음 중 해당하는 것만 사용: district, household_size, no_house, monthly_income, asset_range
4. transitions의 condition은 순서대로 평가하며 첫 매칭 적용
5. 용어 사전은 공고문에 등장하는 전문 용어를 비전문가가 이해할 수 있도록 설명
6. 반드시 유효한 JSON만 출력하세요. 설명이나 마크다운 없이 JSON만 반환하세요.`;

export async function analyzePdfWithBedrock(
  pdfBuffer: Buffer,
  filename: string
): Promise<AnalysisResult> {
  const pdfBase64 = pdfBuffer.toString('base64');

  const requestBody = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64
            }
          },
          {
            type: 'text',
            text: `위 PDF 공고문(${filename})을 분석하여 지정된 JSON 형식으로 구조화해주세요.`
          }
        ]
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody)
  });

  const response = await bedrock.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  // Claude 응답에서 텍스트 추출
  const textContent = responseBody.content?.find(
    (block: { type: string }) => block.type === 'text'
  );

  if (!textContent?.text) {
    throw new Error('No text content in Bedrock response');
  }

  // JSON 파싱 (코드블록 제거)
  let jsonText = textContent.text.trim();
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const result: AnalysisResult = JSON.parse(jsonText);
  return result;
}
