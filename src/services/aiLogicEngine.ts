import { GoogleGenAI } from '@google/genai';
import { RubricEvaluation, FallacyItem, ToulminUpgrade } from '../types';

// Fallacy patterns for offline/heuristic engine
const FALLACY_PATTERNS = [
  {
    regex: /(giết chết toàn bộ|hủy diệt|kết liễu|làm sụp đổ hoàn toàn|chắc chắn sẽ dẫn đến thảm họa|hậu quả khôn lường)/i,
    name: 'Slippery Slope',
    viName: 'Ngụy biện Dốc trượt',
    explanation: 'Giả định một chuỗi phản ứng cực đoan không thể đảo ngược mà không đưa ra bằng chứng cho từng bước chuyển tiếp.',
    severity: 'medium' as const
  },
  {
    regex: /(những kẻ|thiển cận|ấu trĩ|ngu ngốc|không có kiến thức|vô lương tâm|đồ phản động)/i,
    name: 'Ad Hominem',
    viName: 'Ngụy biện Công kích cá nhân',
    explanation: 'Tấn công vào nhân phẩm, tư cách hoặc năng lực của người tranh biện thay vì bẻ gãy luận điểm.',
    severity: 'high' as const
  },
  {
    regex: /(chỉ có hai lựa chọn|hoặc là|nếu không làm thế thì chỉ có chết|hoặc ủng hộ hoặc là kẻ thù)/i,
    name: 'False Dilemma',
    viName: 'Ngụy biện Nhị nguyên giả',
    explanation: 'Thu hẹp các khả năng phức tạp về chỉ hai thái cực đối lập, phớt lờ các phương án dung hòa thứ ba.',
    severity: 'medium' as const
  },
  {
    regex: /(ai cũng biết là|tất cả mọi người đều|không ai có thể phủ nhận|rõ như ban ngày)/i,
    name: 'Bandwagon / Popularity',
    viName: 'Ngụy biện Đám đông / Dĩ nhiên',
    explanation: 'Dùng ý kiến số đông hoặc cảm giác hiển nhiên để khẳng định tính chân lý mà không có dẫn chứng kiểm chứng.',
    severity: 'low' as const
  },
  {
    regex: /(tôi thấy một người|hôm trước bạn tôi|trường hợp này chứng minh tất cả)/i,
    name: 'Hasty Generalization',
    viName: 'Ngụy biện Khái quát hóa vội vã',
    explanation: 'Rút ra kết luận phổ quát áp dụng cho toàn bộ quần thể chỉ dựa trên một số ít giai thoại cá nhân đơn lẻ.',
    severity: 'medium' as const
  }
];

export async function evaluateArgument(
  userText: string,
  topicTitle: string,
  role: 'Pro' | 'Con' | 'Independent',
  isOffline: boolean = false
): Promise<RubricEvaluation> {
  // If online and API key exists, try Gemini
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  if (!isOffline && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là Giám khảo Tranh biện Quốc tế chuẩn WUDC & Giảng viên Tư duy Phản biện Đại học hàng đầu.
Đánh giá bài lập luận sau theo Khung Rubric 5 Chiều Chuẩn Quốc tế (thang điểm 0 - 100).
Chủ đề: "${topicTitle}"
Phe: ${role}
Nội dung bài làm của sinh viên:
"""
${userText}
"""

Hãy trả về DUY NHẤT một chuỗi JSON chuẩn (không có markdown backticks hoặc văn bản thừa) với cấu trúc sau:
{
  "overallScore": number,
  "dimensionScores": {
    "logic": number,
    "evidence": number,
    "rebuttal": number,
    "toulmin": number,
    "multiPerspective": number
  },
  "dimensionFeedback": {
    "logic": "nhận xét sâu sắc",
    "evidence": "nhận xét dẫn chứng",
    "rebuttal": "nhận xét phản biện",
    "toulmin": "nhận xét cấu trúc",
    "multiPerspective": "nhận xét góc nhìn"
  },
  "fallaciesDetected": [
    {
      "name": "Tên tiếng Anh",
      "viName": "Tên tiếng Việt",
      "quote": "trích dẫn cụ thể",
      "explanation": "tại sao là ngụy biện",
      "severity": "high" | "medium" | "low"
    }
  ],
  "toulminRecommendation": {
    "claim": "Luận điểm rõ ràng",
    "grounds": "Dữ kiện số liệu vững chắc",
    "warrant": "Cầu nối logic tất yếu",
    "backing": "Học thuyết/Cơ sở pháp lý nền tảng",
    "rebuttal": "Điều kiện giới hạn và ngoại lệ"
  },
  "devilsAdvocateChallenge": "Một câu hỏi/đòn phản biện hiểm hóc nhất từ phe đối nghịch",
  "microExercises": ["bài tập 1", "bài tập 2", "bài tập 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return parsed as RubricEvaluation;
    } catch (err) {
      console.warn('Gemini API call fell back to local heuristic logic engine:', err);
    }
  }

  // Fallback / Offline Heuristic Engine
  return evaluateWithHeuristicEngine(userText, topicTitle, role);
}

export function evaluateWithHeuristicEngine(
  userText: string,
  topicTitle: string,
  role: 'Pro' | 'Con' | 'Independent'
): RubricEvaluation {
  const text = userText.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Fallacy detection
  const detectedFallacies: FallacyItem[] = [];
  FALLACY_PATTERNS.forEach(pat => {
    const match = text.match(pat.regex);
    if (match) {
      detectedFallacies.push({
        name: pat.name,
        viName: pat.viName,
        quote: match[0],
        explanation: pat.explanation,
        severity: pat.severity
      });
    }
  });

  // 2. Score calculations based on heuristics
  let logicScore = 72;
  let evidenceScore = 70;
  let rebuttalScore = 68;
  let toulminScore = 70;
  let multiPerspectiveScore = 71;

  // Word length heuristics
  if (wordCount >= 50) {
    logicScore += 8;
    evidenceScore += 6;
  }
  if (wordCount >= 100) {
    logicScore += 6;
    evidenceScore += 8;
    toulminScore += 6;
  }
  if (wordCount >= 180) {
    logicScore += 4;
    multiPerspectiveScore += 8;
  }

  // Connectives and structure detection
  if (/(bởi vì|do đó|nguyên nhân là|dẫn tới|hệ quả)/i.test(text)) {
    logicScore += 5;
    toulminScore += 5;
  }
  if (/(số liệu|nghiên cứu|thống kê|báo cáo|dữ liệu|năm \d{4}|%)/i.test(text)) {
    evidenceScore += 8;
  }
  if (/(tuy nhiên|mặc dù|trái lại|ngược lại|phe đối lập|phản bác)/i.test(text)) {
    rebuttalScore += 10;
    multiPerspectiveScore += 7;
  }
  if (/(ngoại lệ|trừ trường hợp|chỉ khi|trong phạm vi)/i.test(text)) {
    toulminScore += 8;
  }

  // Deductions for fallacies
  if (detectedFallacies.length > 0) {
    const deduction = detectedFallacies.length * 4;
    logicScore = Math.max(50, logicScore - deduction);
  }

  // Clamping scores
  logicScore = Math.min(96, Math.max(55, logicScore));
  evidenceScore = Math.min(95, Math.max(50, evidenceScore));
  rebuttalScore = Math.min(96, Math.max(50, rebuttalScore));
  toulminScore = Math.min(95, Math.max(55, toulminScore));
  multiPerspectiveScore = Math.min(95, Math.max(52, multiPerspectiveScore));

  const overallScore = Math.round(
    logicScore * 0.25 +
    evidenceScore * 0.2 +
    rebuttalScore * 0.2 +
    toulminScore * 0.2 +
    multiPerspectiveScore * 0.15
  );

  return {
    overallScore,
    dimensionScores: {
      logic: logicScore,
      evidence: evidenceScore,
      rebuttal: rebuttalScore,
      toulmin: toulminScore,
      multiPerspective: multiPerspectiveScore
    },
    dimensionFeedback: {
      logic: logicScore >= 80 
        ? 'Chuỗi suy luận chặt chẽ, tiền đề được liên kết mạch lạc với kết luận không tạo bước nhảy vọt.' 
        : 'Cần làm rõ mối liên hệ nhân quả giữa nguyên nhân gốc và kết luận đưa ra.',
      evidence: evidenceScore >= 80 
        ? 'Dẫn chứng có tính kiểm chứng cao, trích dẫn số liệu hoặc tiền lệ học thuật tương thích.' 
        : 'Bài viết chủ yếu dựa vào lập luận lý thuyết; nên bổ sung khảo sát thực nghiệm hoặc án lệ điển hình.',
      rebuttal: rebuttalScore >= 80 
        ? 'Đã dự đoán và bẻ gãy đòn tấn công của đối thủ một cách trực diện.' 
        : 'Cần chủ động đặt mình vào góc nhìn của phe đối lập để thiết lập phòng thủ trước các đòn chất vấn.',
      toulmin: toulminScore >= 80 
        ? 'Đáp ứng xuất sắc mô hình Toulmin (Claim, Grounds, Warrant, Rebuttal).' 
        : 'Thiếu thành phần Warrant (cầu nối giải thích tại sao dữ kiện lại dẫn đến luận điểm) hoặc Rebuttal ngoại lệ.',
      multiPerspective: multiPerspectiveScore >= 80 
        ? 'Khả năng quan sát toàn diện, bao quát lợi ích của nhiều nhóm chủ thể khác nhau.' 
        : 'Còn mang tính đơn tuyến; hãy xem xét tác động đối với các nhóm yếu thế trong chuỗi giá trị.'
    },
    fallaciesDetected: detectedFallacies,
    toulminRecommendation: {
      claim: `Cần chuẩn hóa lại luận điểm trọng tâm cho phe ${role} đối với chủ đề "${topicTitle.slice(0, 45)}...": Khẳng định giải pháp có tính tối ưu dựa trên cân bằng quyền lợi.`,
      grounds: 'Đưa ra báo cáo thống kê chính thức từ tổ chức quốc tế hoặc nghiên cứu của các trường đại học uy tín.',
      warrant: 'Nguyên lý: Một chính sách công bền vững phải tối đa hóa phúc lợi xã hội đồng thời bảo vệ các quyền cơ bản không thể tước đoạt.',
      backing: 'Học thuyết pháp lý quốc tế và tiêu chuẩn đạo đức nghề nghiệp đã được thừa nhận rộng rãi.',
      rebuttal: 'Ngoại lệ: Quy định áp dụng linh hoạt trong các tình huống khẩn cấp hoặc dự án phi thương mại vì mục đích nhân đạo.'
    },
    devilsAdvocateChallenge: `Phản biện thách thức: "Nếu áp dụng giải pháp của bạn, làm thế nào để ngăn chặn các bên có nguồn lực lớn lợi dụng kẽ hở chính sách để chèn ép các chủ thể độc lập?"`,
    microExercises: [
      'Bài tập 1: Viết lại đoạn văn trên bằng cách bổ sung 1 số liệu định lượng cụ thể.',
      'Bài tập 2: Xác định và bổ sung một thành phần ngoại lệ (Rebuttal / Qualifier) theo mô hình Toulmin.',
      'Bài tập 3: Đóng vai đối thủ để đưa ra 2 câu hỏi Point of Information (POI) phản pháo vào điểm yếu nhất.'
    ]
  };
}

export function generateAIOpponentSpeech(
  topicTitle: string,
  round: 1 | 2 | 3,
  userSpeech: string,
  userRole: 'Pro' | 'Con'
): { speech: string; poiQuestion?: string } {
  const opponentRole = userRole === 'Pro' ? 'Phe Phản đối (Opposition)' : 'Phe Ủng hộ (Proposition)';
  
  if (round === 1) {
    return {
      speech: `Kính thưa Chủ tọa và Hội đồng giám khảo! Đại diện cho ${opponentRole}, tôi xin bác bỏ luận điểm khởi đầu mà đối phương vừa nêu. Lập luận của bạn đã mắc phải sai lầm cơ bản khi quá lạc quan về tính khả thi mà bỏ qua các rủi ro hệ thống. Chúng tôi thiết lập 2 tiền đề phản bác cốt lõi: Thứ nhất, giải pháp của bạn tạo ra chi phí tuân thủ khổng lồ; thứ hai, nó vi phạm nguyên tắc công bằng phân phối trong xã hội.`,
      poiQuestion: 'Xin hỏi đối phương: Bạn có giải pháp cụ thể nào để kiểm soát chi phí phát sinh mà không chuyển gánh nặng lên vai người tiêu dùng?'
    };
  }

  if (round === 2) {
    return {
      speech: `Bước vào Hiệp 2, chúng tôi nhận thấy đối thủ vẫn chưa thể bảo vệ được lỗ hổng logic mà chúng tôi đã chỉ ra ở hiệp trước. Bạn đã đánh tráo khái niệm giữa "mục tiêu lý tưởng" và "công cụ thực thi". Trong khi bạn nhắc đến lợi ích dài hạn, thực tế các dữ liệu kiểm toán độc lập cho thấy 82% các trường hợp tương tự đều rơi vào bẫy chi phí chìm và thất bại trong việc bảo vệ các bên liên đới.`,
      poiQuestion: 'Điểm chất vấn chéo (POI): Đối phương có thể chỉ ra duy nhất một tiền lệ quốc tế nào áp dụng thành công mô hình này mà không cần trợ cấp chính phủ?'
    };
  }

  return {
    speech: `Kính thưa Hội đồng, đây là bài phát biểu tổng kết (Whip Speech) của chúng tôi. Trận tranh biện hôm nay quy tụ về 2 câu hỏi sinh tử: Thứ nhất, bên nào đưa ra giải pháp bền vững và ít rủi ro hơn? Thứ hai, bên nào bảo vệ được giá trị đạo đức cốt lõi? Bằng việc chứng minh đối phương không có cơ chế chế tài khả thi và vướng vào ngụy biện khái quát vội vã, ${opponentRole} chúng tôi xứng đáng nhận được phán quyết thắng cuộc hôm nay!`,
    poiQuestion: undefined
  };
}
