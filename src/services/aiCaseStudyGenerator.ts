import { GoogleGenAI } from '@google/genai';
import { CaseStudy } from '../types';

export interface CasePresetTopic {
  id: string;
  title: string;
  category: 'academic' | 'student_life' | 'current_affairs';
  categoryLabel: string;
  industry: string;
  brief: string;
  defaultCase: CaseStudy;
}

export const PRESET_CASE_TOPICS: CasePresetTopic[] = [
  // 1. HỌC TẬP & HỌC THUẬT ĐẠI HỌC
  {
    id: 'case-ai-thesis',
    title: 'AI Viết Khóa Luận Tốt Nghiệp: Đạo Văn Hay Đồng Sáng Tạo Học Thuật?',
    category: 'academic',
    categoryLabel: 'Học Tập & Học Thuật',
    industry: 'Giáo Dục Đại Học & Công Nghệ',
    brief: 'Tranh cãi gay gắt khi sinh viên sử dụng ChatGPT/DeepSeek viết 70% nội dung khóa luận tốt nghiệp đạt điểm xuất sắc.',
    defaultCase: {
      id: 'case-ai-thesis',
      title: 'AI Viết Khóa Luận Tốt Nghiệp: Đạo Văn Hay Đồng Sáng Tạo Học Thuật?',
      industry: 'Giáo Dục Đại Học & Trí Tuệ Nhân Tạo',
      context: 'Tại một trường đại học hàng đầu, một nhóm sinh viên ngành Khoa học dữ liệu đã sử dụng mô hình ngôn ngữ lớn (LLM) để sinh mã nguồn, tổng quan tài liệu và viết bản thảo luận văn tốt nghiệp. Hội đồng chấm thi phát hiện 65% câu từ trùng khớp với phong cách AI nhưng các kết quả thực nghiệm hoàn toàn chính xác. Giảng viên hướng dẫn ủng hộ vì "đây là kỹ năng tận dụng công nghệ tương lai", trong khi Ban Thanh tra Học vụ yêu cầu hủy kết quả thi và kỷ luật cảnh cáo sinh viên vì vi phạm liêm chính học thuật.',
      stakeholders: [
        { group: 'Nhóm Sinh viên Làm Khóa Luận', interest: 'Bảo vệ kết quả đồ án, được công nhận kỹ năng ứng dụng công nghệ và tốt nghiệp đúng hạn', powerLevel: 'Thấp', concern: 'Bị đình chỉ học tập, hủy bằng tốt nghiệp và mang tiếng gian lận' },
        { group: 'Giảng viên Hướng dẫn', interest: 'Khuyến khích sinh viên áp dụng công nghệ mới, nâng cao năng suất nghiên cứu', powerLevel: 'Trung bình', concern: 'Quy chế đào tạo lạc hậu kìm hãm sự đổi mới sáng tạo' },
        { group: 'Ban Thanh tra Học vụ & Hội đồng Đạo đức', interest: 'Duy trì uy tín học hiệu, đảm bảo sự công bằng cho các sinh viên làm thủ công', powerLevel: 'Cao', concern: 'Tiền lệ xấu khiến bằng cấp mất giá trị và bị nhà tuyển dụng nghi ngờ' },
        { group: 'Doanh nghiệp Tuyển dụng', interest: 'Cần nhân sự biết cách phối hợp với AI hiệu quả nhưng phải hiểu bản chất vấn đề', powerLevel: 'Cao', concern: 'Tuyển phải kỹ sư "thùng rỗng kêu to", chỉ biết copy prompt mà không có tư duy phản biện' }
      ],
      ethicalDilemma: 'Liệu việc sử dụng AI như một trợ lý viết lách có đồng nghĩa với đạo văn trí tuệ, hay đã đến lúc định nghĩa lại chuẩn mực liêm chính học thuật trong kỷ nguyên AI?',
      guidingQuestions: [
        '1. Đâu là ranh giới giữa việc dùng AI để gợi ý tư liệu và để AI làm thay tư duy cá nhân?',
        '2. Tiêu chí đánh giá luận văn đại học nên chuyển từ "nội dung câu chữ" sang "khả năng phản biện và bảo vệ trực tiếp" như thế nào?',
        '3. Nhà trường nên ban hành quy chuẩn trích dẫn AI (AI Citation) ra sao để minh bạch hóa?'
      ],
      suggestedBiases: ['Thiên kiến vị kỹ thuật (Pro-innovation Bias)', 'Ngụy biện Dốc trượt (Slippery Slope)', 'Hiệu ứng Nhị nguyên giả (False Dilemma)']
    }
  },
  {
    id: 'case-free-rider',
    title: 'Khủng Hoảng "Gánh Team" & Ký Sinh Học Tập (Free-Riding) Trong Đồ Án Nhóm',
    category: 'academic',
    categoryLabel: 'Học Tập & Học Thuật',
    industry: 'Tâm Lý Học Đường & Quản Trị Nhóm',
    brief: 'Xung đột gay gắt khi 1 thành viên không làm bài nhưng đòi ghi tên chia đều điểm 10 của toàn đội.',
    defaultCase: {
      id: 'case-free-rider',
      title: 'Khủng Hoảng "Gánh Team" & Ký Sinh Học Tập (Free-Riding) Trong Đồ Án Nhóm',
      industry: 'Quản Trị Nhân Sự & Văn Hóa Giảng Đường',
      context: 'Trong môn học Quản trị Dự án, một nhóm 5 sinh viên được giao thực hiện đề án kinh doanh chiếm 40% điểm tổng kết. Trưởng nhóm cùng 2 bạn khác thức trắng đêm 3 tuần liền để hoàn thành dự án đạt điểm A+. Trong khi đó, thành viên thứ 5 liên tục vắng mặt với lý do bận gia đình và làm thêm. Khi nộp bài, trưởng nhóm quyết định gạch tên thành viên này ra khỏi danh sách đóng góp. Thành viên bị gạch tên đến gặp giảng viên khóc lóc, cho rằng mình bị cô lập và tố cáo nhóm thiếu tinh thần đồng đội.',
      stakeholders: [
        { group: 'Trưởng nhóm & Các thành viên nỗ lực', interest: 'Được ghi nhận công sức xứng đáng, bảo vệ tính công bằng học thuật', powerLevel: 'Trung bình', concern: 'Bị giảng viên trừ điểm "kỹ năng làm việc nhóm" vì để xảy ra bất hòa nội bộ' },
        { group: 'Thành viên bị gạch tên (Free-rider)', interest: 'Qua môn để không bị nợ tín chỉ và giữ học bổng khuyến khích', powerLevel: 'Thấp', concern: 'Rớt môn, phải học lại đóng học phí đắt đỏ và bị bạn bè tẩy chay' },
        { group: 'Giảng viên Giảng dạy', interest: 'Đánh giá chính xác năng lực cá nhân trong sản phẩm tập thể, giữ hòa khí sinh viên', powerLevel: 'Cao', concern: 'Khó kiểm chứng tỷ lệ đóng góp thực tế nếu không có nhật ký làm việc (log work)' },
        { group: 'Nhà tuyển dụng tương lai', interest: 'Tuyển ứng viên có tinh thần trách nhiệm và kỹ năng giải quyết mâu thuẫn', powerLevel: 'Cao', concern: 'Thói quen ỷ lại thời sinh viên sẽ biến thành nhân viên độc hại trong doanh nghiệp' }
      ],
      ethicalDilemma: 'Trừng phạt dứt khoát người không đóng góp để duy trì công lý, hay mở cơ hội cứu xét nhân văn để giúp bạn không bị rớt môn?',
      guidingQuestions: [
        '1. Đánh giá nhóm theo cơ chế "cào bằng điểm số" có phải là nguồn gốc sinh ra hiện tượng ký sinh học tập?',
        '2. Trách nhiệm của trưởng nhóm trong việc phân chia nhiệm vụ và cảnh báo sớm trước khi gạch tên là gì?',
        '3. Làm thế nào để thiết kế rubric đánh giá chéo (Peer Review) ẩn danh và định lượng hóa?'
      ],
      suggestedBiases: ['Thiên kiến tự đề cao (Egocentric Bias)', 'Hiệu ứng Chi phí chìm (Sunk Cost Fallacy)', 'Ngụy biện Khái quát hóa vội vã (Hasty Generalization)']
    }
  },

  // 2. ĐỜI SỐNG SINH VIÊN & GIỚI TRẺ
  {
    id: 'case-unpaid-internship',
    title: 'Thực Tập Không Lương Tại Doanh Nghiệp Lớn: Tích Lũy Kinh Nghiệm Hay Bóc Lột Sức Lao Động?',
    category: 'student_life',
    categoryLabel: 'Đời Sống Sinh Viên',
    industry: 'Luật Lao Động & Phát Triển Nghề Nghiệp',
    brief: 'Sinh viên năm 3 làm việc 45 giờ/tuần không trợ cấp dưới danh nghĩa "học việc lấy kinh nghiệm làm đẹp CV".',
    defaultCase: {
      id: 'case-unpaid-internship',
      title: 'Thực Tập Không Lương Tại Doanh Nghiệp Lớn: Tích Lũy Kinh Nghiệm Hay Bóc Lột Sức Lao Động?',
      industry: 'Thị Trường Lao Động & Đạo Đức Kinh Doanh',
      context: 'Một tập đoàn truyền thông đa phương tiện danh tiếng mở đợt tuyển thực tập sinh mùa hè dành cho sinh viên năm 3 và năm 4. Hơn 300 sinh viên nộp đơn để tranh 10 suất thực tập. Tuy nhiên, hợp đồng quy định: thời gian làm việc toàn thời gian (44 giờ/tuần), thời hạn 6 tháng, không có lương hay trợ cấp cơm trưa, đi lại, với lý do "doanh nghiệp bỏ chi phí đào tạo thực chiến". Nhiều sinh viên chấp nhận vay tiền người thân để trang trải chi phí sinh hoạt chỉ nhằm lấy chứng chỉ thực tập danh giá, dẫn đến phản ứng dữ dội từ các diễn đàn sinh viên.',
      stakeholders: [
        { group: 'Sinh viên thực tập', interest: 'Tích lũy kinh nghiệm thực tế, có thư giới thiệu từ lãnh đạo cấp cao để xin việc sau này', powerLevel: 'Thấp', concern: 'Kiệt quệ tài chính, cảm giác bị bóc lột và bất bình đẳng so với nhân viên chính thức' },
        { group: 'Tập đoàn tuyển dụng', interest: 'Tối ưu chi phí vận hành, tận dụng nguồn lao động trẻ nhiệt huyết để giải quyết công việc áp lực', powerLevel: 'Cao', concern: 'Bị tẩy chay trên mạng xã hội, ảnh hưởng danh tiếng thương hiệu tuyển dụng' },
        { group: 'Khoa/Trường Đại học', interest: 'Đạt chỉ tiêu 100% sinh viên có nơi thực tập doanh nghiệp trước khi tốt nghiệp', powerLevel: 'Trung bình', concern: 'Ký thỏa thuận liên kết với doanh nghiệp có chính sách lao động gây tranh cãi' },
        { group: 'Cơ quan Quản lý Lao động', interest: 'Bảo vệ quyền lợi tối thiểu của người lao động trẻ, chống lợi dụng kẽ hở pháp lý', powerLevel: 'Cao', concern: 'Khung pháp lý hiện hành chưa quy định rõ ràng về vị trí thực tập sinh học nghề' }
      ],
      ethicalDilemma: 'Thỏa thuận "tự nguyện trao đổi kinh nghiệm lấy sức lao động" có hợp đạo đức không khi một bên nắm ưu thế tuyệt đối và bên kia chịu áp lực sinh tồn?',
      guidingQuestions: [
        '1. Có phải chính tâm lý "chấp nhận chịu khổ để đổi lấy CV đẹp" của sinh viên đã nuôi dưỡng văn hóa thực tập không lương?',
        '2. Thực tập không lương tạo ra sự bất bình đẳng xã hội ra sao đối với những sinh viên có hoàn cảnh kinh tế khó khăn?',
        '3. Nhà trường cần có bộ tiêu chí thẩm định đối tác doanh nghiệp tiếp nhận thực tập sinh như thế nào?'
      ],
      suggestedBiases: ['Thiên kiến kẻ sống sót (Survivorship Bias)', 'Ngụy biện Khái quát hóa (Hasty Generalization)', 'Hiệu ứng Mỏ neo danh tiếng (Anchoring Effect)']
    }
  },
  {
    id: 'case-student-debt-app',
    title: 'Bẫy Ứng Dụng Tín Dụng Nhanh Học Phí & Khủng Hoảng Tài Chính Sinh Viên',
    category: 'student_life',
    categoryLabel: 'Đời Sống Sinh Viên',
    industry: 'Tài Chính Tiêu Dùng & Pháp Luật',
    brief: 'Ứng dụng cho vay sinh viên giải ngân trong 5 phút với lãi suất ngầm 45%/năm khiến nhiều bạn rơi vào vòng xoáy nợ nần.',
    defaultCase: {
      id: 'case-student-debt-app',
      title: 'Bẫy Ứng Dụng Tín Dụng Nhanh Học Phí & Khủng Hoảng Tài Chính Sinh Viên',
      industry: 'Công Nghệ Tài Chính (Fintech) & Xã Hội',
      context: 'Đến hạn đóng học phí kỳ 2, nhiều sinh viên có hoàn cảnh gia đình khó khăn không kịp xoay xở và đứng trước nguy cơ bị cấm thi. Một ứng dụng Fintech xuất hiện ngay cổng trường và trên các hội nhóm sinh viên với lời mời: "Ứng tiền học phí 0 đồng, duyệt sau 5 phút chỉ cần thẻ sinh viên". Tuy nhiên, sau các khoản phí dịch vụ, phí tư vấn và phí trễ hạn, lãi suất thực tế lên tới hơn 40%/năm. Khi sinh viên trễ hạn 1 tuần, app tự động nhắn tin đòi nợ tới toàn bộ danh bạ giảng viên, bạn bè và người thân.',
      stakeholders: [
        { group: 'Sinh viên vay nợ', interest: 'Kịp đóng học phí để được dự thi, bảo vệ danh dự và thông tin cá nhân', powerLevel: 'Thấp', concern: 'Khủng hoảng tâm lý, bị khủng bố tinh thần và nguy cơ bỏ học' },
        { group: 'Công ty Fintech / App cho vay', interest: 'Tối đa hóa lợi nhuận tài chính, thu hồi cả gốc lẫn các loại phí phạt', powerLevel: 'Cao', concern: 'Rủi ro pháp lý và nợ xấu từ đối tượng chưa có thu nhập ổn định' },
        { group: 'Phòng Công tác Sinh viên Đại học', interest: 'Bảo vệ an toàn cho người học, duy trì môi trường giáo dục lành mạnh', powerLevel: 'Trung bình', concern: 'Quỹ học bổng và hỗ trợ khẩn cấp có hạn, không đủ bao phủ mọi trường hợp' },
        { group: 'Gia đình & Phụ huynh', interest: 'Con cái an toàn học hành, bảo toàn danh dự dòng họ', powerLevel: 'Thấp', concern: 'Bất ngờ gánh khoản nợ khổng lồ vượt ngoài khả năng chi trả' }
      ],
      ethicalDilemma: 'Cung cấp tín dụng tức thì cho người thiếu hiểu biết tài chính là giải pháp hỗ trợ cứu cánh hay hành vi trục lợi thiếu nhân văn?',
      guidingQuestions: [
        '1. Trách nhiệm giáo dục kỹ năng tài chính cá nhân thuộc về gia đình hay chương trình đào tạo đại học?',
        '2. Nhà trường nên có cơ chế giãn thời gian đóng học phí linh hoạt như thế nào để ngăn chặn sinh viên tìm đến app vay?',
        '3. Biện pháp pháp lý nào bảo vệ thông tin danh bạ và quyền riêng tư của sinh viên trước các app đòi nợ kiểu xã hội đen?'
      ],
      suggestedBiases: ['Thiên kiến hiện tại (Present Bias)', 'Hiệu ứng Đám đông (Bandwagon Effect)', 'Thiên kiến lạc quan túng quẫn (Optimism Bias)']
    }
  },

  // 3. THỜI SỰ & XÃ HỘI HIỆN TẠI (2025 - 2026)
  {
    id: 'case-deepfake-scam',
    title: 'Deepfake Giảng Viên & Lừa Đảo Chuyển Khoản Trực Tuyến Trong Môi Trường Số',
    category: 'current_affairs',
    categoryLabel: 'Thời Sự & Công Nghệ',
    industry: 'An Ninh Mạng & Trí Tuệ Nhân Tạo',
    brief: 'Kẻ xấu giả mạo giọng nói và khuôn mặt của Trưởng khoa gọi video yêu cầu sinh viên chuyển tiền "lệ phí hội thảo quốc tế".',
    defaultCase: {
      id: 'case-deepfake-scam',
      title: 'Deepfake Giảng Viên & Lừa Đảo Chuyển Khoản Trực Tuyến Trong Môi Trường Số',
      industry: 'An Toàn Thông Tin & Quản Trị Khủng Hoảng',
      context: 'Lợi dụng các video bài giảng công khai của một Phó Giáo sư nổi tiếng trên cổng học tập trực tuyến, nhóm tội phạm công nghệ cao đã huấn luyện mô hình Voice Clone và Video Deepfake. Chúng gọi video trực tiếp qua Zalo cho hơn 50 sinh viên trong lớp nghiên cứu, thông báo sinh viên được chọn tham gia hội thảo tại Singapore và yêu cầu nộp ngay 15 triệu đồng lệ phí bảo lãnh visa. Do hình ảnh và giọng nói quá giống giảng viên, 12 sinh viên đã chuyển tiền trước khi vụ việc vỡ lở.',
      stakeholders: [
        { group: 'Nạn nhân (Sinh viên bị lừa)', interest: 'Lấy lại tài sản đã mất, làm rõ trách nhiệm cảnh báo từ phía nhà trường', powerLevel: 'Thấp', concern: 'Mất mát tài chính lớn và mất niềm tin vào các kênh thông báo chính thống' },
        { group: 'Giảng viên bị giả mạo danh tính', interest: 'Bảo vệ uy tín học thuật, danh dự nghề giáo và an toàn pháp lý cá nhân', powerLevel: 'Trung bình', concern: 'Tài liệu bài giảng tâm huyết bị biến thành công cụ lừa đảo' },
        { group: 'Ban Giám hiệu & Bộ phận CNTT trường', interest: 'Kiểm soát khủng hoảng truyền thông, siết chặt quy trình xác thực thông tin học vụ', powerLevel: 'Cao', concern: 'Hạ tầng bảo mật và cơ chế xác thực đa yếu tố (MFA) chưa theo kịp tốc độ tội phạm AI' },
        { group: 'Cơ quan Điều tra An ninh mạng (A05)', interest: 'Truy quét triệt để đường dây tội phạm xuyên biên giới, ngăn chặn các chiêu thức tinh vi mới', powerLevel: 'Cao', concern: 'Dòng tiền lừa đảo được rửa qua ví tiền mã hóa khó truy vết' }
      ],
      ethicalDilemma: 'Cân bằng giữa việc mở rộng nguồn học liệu số mở (Open Courseware) và việc bảo vệ dữ liệu sinh trắc học cá nhân của cán bộ, sinh viên?',
      guidingQuestions: [
        '1. Khi công nghệ deepfake đạt độ chân thực 99%, quy trình xác minh mệnh lệnh học thuật và tài chính cần thay đổi thế nào?',
        '2. Trách nhiệm bồi thường và hỗ trợ tâm lý cho nạn nhân nên được phân bổ ra sao giữa các bên?',
        '3. Làm thế nào để trang bị "bộ lọc tư duy phản biện số" giúp sinh viên nhận diện các dấu hiệu thao túng nhận thức?'
      ],
      suggestedBiases: ['Thiên kiến phục tùng uy quyền (Authority Bias)', 'Hiệu ứng Nhìn thấy là tin (Confirmation Bias)', 'Ngụy biện Khái quát hóa (Hasty Generalization)']
    }
  },
  {
    id: 'case-smart-campus-privacy',
    title: 'Điểm Danh Nhận Diện Khuôn Mặt (Camera AI) Tại Smart Campus: An Toàn Hay Xâm Phạm Đời Tư?',
    category: 'current_affairs',
    categoryLabel: 'Thời Sự & Xã Hội',
    industry: 'Chuyển Đổi Số Giáo Dục & Luật Quyền Riêng Tư',
    brief: 'Trường lắp đặt 200 camera AI quét khuôn mặt điểm danh tự động và theo dõi mức độ tập trung của sinh viên trong giảng đường.',
    defaultCase: {
      id: 'case-smart-campus-privacy',
      title: 'Điểm Danh Nhận Diện Khuôn Mặt (Camera AI) Tại Smart Campus: An Toàn Hay Xâm Phạm Đời Tư?',
      industry: 'Chính Sách Công & Nhân Quyền Số',
      context: 'Trong dự án "Khuôn viên Đại học Thông minh 2026", trường đại học đầu tư hệ thống 200 camera AI tích hợp tính năng tự động nhận diện sinh viên khi bước vào cổng, tự động điểm danh khi vào lớp, và phân tích cảm xúc (vui vẻ, lơ đãng, buồn ngủ) để gửi báo cáo thời gian thực cho giảng viên. Một nhóm sinh viên khởi xướng phong trào phản đối, cho rằng việc bị giám sát từng cử chỉ vi phạm nghiêm trọng quyền riêng tư cá nhân và biến giảng đường thành một nhà tù vô hình (Panopticon).',
      stakeholders: [
        { group: 'Sinh viên phản đối', interest: 'Bảo vệ quyền riêng tư, quyền kiểm soát dữ liệu sinh trắc học và sự tự do học thuật', powerLevel: 'Trung bình', concern: 'Dữ liệu khuôn mặt bị rò rỉ hoặc bán cho bên thứ ba, bị đánh giá hạnh kiểm dựa trên thuật toán cảm xúc' },
        { group: 'Ban Lãnh đạo Nhà trường', interest: 'Tự động hóa quản trị, giảm tải công việc điểm danh cho giảng viên, nâng cao an ninh học đường', powerLevel: 'Cao', concern: 'Dự án đầu tư hàng chục tỷ đồng bị đình trệ và mang tiếng là trường học độc đoán' },
        { group: 'Doanh nghiệp Cung cấp Giải pháp AI', interest: 'Khai thác tập dữ liệu lớn để hoàn thiện thuật toán, thương mại hóa sản phẩm', powerLevel: 'Trung bình', concern: 'Bị siết chặt quy định về bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP' },
        { group: 'Phụ huynh sinh viên', interest: 'Biết con em có đến trường đầy đủ hay không, bảo đảm an toàn thân thể trong trường', powerLevel: 'Thấp', concern: 'An ninh trường học trước các sự vụ bạo lực hoặc xâm nhập trái phép' }
      ],
      ethicalDilemma: 'Sự tiện lợi và an ninh của tập thể có quyền đánh đổi quyền tự do cá nhân và cảm giác an toàn tinh thần của người học?',
      guidingQuestions: [
        '1. Đánh giá mức độ tập trung của sinh viên bằng camera AI có thực sự đo lường được hiệu quả tiếp thu kiến thức?',
        '2. Quyền đồng ý (Consent) của sinh viên có thực chất hay không khi họ bắt buộc phải học tại trường để tốt nghiệp?',
        '3. Khung kiểm soát dữ liệu độc lập nào cần được thành lập để giám sát việc lưu trữ và xóa bỏ dữ liệu sinh trắc học?'
      ],
      suggestedBiases: ['Ngụy biện Nhị nguyên giả (False Dilemma)', 'Hiệu ứng Đám đông (Bandwagon Effect)', 'Thiên kiến Mù điểm nhận thức (Blind Spot Bias)']
    }
  },
  {
    id: 'case-tech-layoffs-ai',
    title: 'Làn Sóng Cắt Giảm Việc Làm Do AI & Khủng Hoảng Định Hướng Nghề Nghiệp Gen Z (2025-2026)',
    category: 'current_affairs',
    categoryLabel: 'Thời Sự & Công Nghệ',
    industry: 'Thị Trường Lao Động & Trí Tuệ Nhân Tạo',
    brief: 'Các tập đoàn công nghệ lớn liên tục sa thải vị trí Junior do AI tự viết mã và thiết kế đồ họa, khiến sinh viên mới ra trường đối mặt nguy cơ thất nghiệp diện rộng.',
    defaultCase: {
      id: 'case-tech-layoffs-ai',
      title: 'Làn Sóng Cắt Giảm Việc Làm Do AI & Khủng Hoảng Định Hướng Nghề Nghiệp Gen Z (2025-2026)',
      industry: 'Kinh Tế Số & Chiến Lược Hướng Nghiệp',
      context: 'Năm 2025-2026 chứng kiến bước nhảy vọt của AI tác tử (AI Agents) có khả năng tự động hóa 80% công việc lập trình cơ bản, kiểm thử phần mềm, sáng tạo nội dung và dịch thuật. Hàng loạt doanh nghiệp công nghệ đóng băng tuyển dụng vị trí thực tập sinh và nhân viên sơ cấp (Junior), ưu tiên giữ lại các chuyên gia cấp cao biết điều khiển AI. Sinh viên các ngành CNTT, Truyền thông và Thiết kế rơi vào khủng hoảng hiện sinh khi nhận ra tấm bằng cử nhân 4 năm với học phí hàng trăm triệu đồng có nguy cơ bị thay thế ngay trước ngày tốt nghiệp.',
      stakeholders: [
        { group: 'Sinh viên năm cuối & Tân cử nhân', interest: 'Tìm kiếm việc làm chuyên môn đúng ngành, trang trải cuộc sống và khẳng định năng lực', powerLevel: 'Thấp', concern: 'Không tích lũy được năm kinh nghiệm đầu tiên để cạnh tranh, bằng cấp mất giá' },
        { group: 'Doanh nghiệp Công nghệ', interest: 'Cắt giảm chi phí nhân sự, tăng năng suất bằng các giải pháp AI tự động hóa', powerLevel: 'Cao', concern: 'Thiếu hụt nguồn nhân sự kế cận trong 5-10 năm tới do không đào tạo lớp trẻ hôm nay' },
        { group: 'Trường Đại học & Viện Đào tạo', interest: 'Duy trì tỷ lệ sinh viên có việc làm sau tốt nghiệp, thu hút người học mới', powerLevel: 'Trung bình', concern: 'Giáo trình đào tạo 4 năm quá chậm so với tốc độ cập nhật từng quý của AI' },
        { group: 'Bộ Lao động & Các Hiệp hội Nghề nghiệp', interest: 'Duy trì ổn định xã hội, ngăn chặn tỷ lệ thất nghiệp thanh niên tăng vọt', powerLevel: 'Cao', concern: 'Khoảng trống kỹ năng (Skill Gap) lớn giữa kỳ vọng doanh nghiệp và năng lực sinh viên' }
      ],
      ethicalDilemma: 'Doanh nghiệp có trách nhiệm đạo đức trong việc đào tạo thế hệ lao động trẻ hay hoàn toàn có quyền tối ưu hóa lợi nhuận thuần túy bằng AI?',
      guidingQuestions: [
        '1. Trường đại học nên cải tổ mô hình đào tạo như thế nào để sinh viên không cạnh tranh với AI về kỹ năng cứng mà vượt trội về tư duy phản biện?',
        '2. Liệu việc đánh thuế tự động hóa (Robot Tax) để hỗ trợ đào tạo lại cho thanh niên có khả thi và công bằng?',
        '3. Sinh viên Gen Z cần xây dựng "bộ giáp miễn nhiễm trước AI" bằng những năng lực độc bản nào?'
      ],
      suggestedBiases: ['Thiên kiến bi quan thái quá (Pessimism Bias)', 'Ngụy biện Khái quát hóa vội vã (Hasty Generalization)', 'Hiệu ứng Đà điểu vùi đầu trong cát (Ostrich Effect)']
    }
  },
  {
    id: 'case-carbon-tax-campus',
    title: 'Cam Kết Net-Zero Đại Học & Phí Phát Thải Xanh: Trách Nhiệm Môi Trường Hay Gánh Nặng Học Phí?',
    category: 'current_affairs',
    categoryLabel: 'Thời Sự & Môi Trường',
    industry: 'Phát Triển Bền Vững & Kinh Tế Môi Trường',
    brief: 'Nhà trường áp dụng sáng kiến cấm xe máy xăng trong khuôn viên và thu phụ phí "Chuyển Đổi Xanh 500k/học kỳ" để tài trợ xe buýt điện.',
    defaultCase: {
      id: 'case-carbon-tax-campus',
      title: 'Cam Kết Net-Zero Đại Học & Phí Phát Thải Xanh: Trách Nhiệm Môi Trường Hay Gánh Nặng Học Phí?',
      industry: 'Chính Sách Công & Quản Trị Đại Học Xanh',
      context: 'Hưởng ứng cam kết quốc gia về phát thải ròng bằng 0 (Net-Zero 2050), một trường đại học tiên phong ban hành chính sách: Từ học kỳ mới, toàn bộ sinh viên và giảng viên đi xe máy xăng phải gửi xe ở bãi ngoại vi cách trường 2km hoặc chuyển sang xe máy điện/xe buýt trường. Đồng thời, trường đưa khoản "Phí Chuyển Đổi Xanh & Năng Lượng Mặt Trời" trị giá 500.000 VNĐ vào hóa đơn học phí bắt buộc. Quyết định gây tranh cãi nảy lửa: phe ủng hộ khen ngợi hành động dũng cảm vì hành tinh, phe phản đối cho rằng trường đang dùng khẩu hiệu môi trường để tăng học phí trá hình và gây khó khăn cho sinh viên nghèo.',
      stakeholders: [
        { group: 'Sinh viên có hoàn cảnh khó khăn', interest: 'Tiết kiệm chi phí đi lại và học phí, bảo đảm phương tiện mưu sinh làm thêm', powerLevel: 'Thấp', concern: 'Không có tiền đổi sang xe điện, tốn thêm 1-2 tiếng mỗi ngày để đi bộ và trung chuyển' },
        { group: 'Ban Lãnh đạo Trường & Ban Dự án Xanh', interest: 'Đạt xếp hạng đại học xanh THE Impact Rankings, thu hút tài trợ quốc tế', powerLevel: 'Cao', concern: 'Gặp phản ứng dữ dội từ dư luận và sinh viên làm sụt giảm uy tín tuyển sinh' },
        { group: 'Nhóm Sinh viên Hoạt động Môi trường (Green Club)', interest: 'Thúc đẩy lối sống bền vững thực chất, giảm khói bụi và tiếng ồn học đường', powerLevel: 'Trung bình', concern: 'Ý tưởng cao đẹp bị biến tướng thành vấn đề tài chính gây chia rẽ cộng đồng sinh viên' },
        { group: 'Doanh nghiệp Vận hành Xe buýt & Hạ tầng sạc điện', interest: 'Ký hợp đồng độc quyền cung cấp dịch vụ vận tải và trạm sạc trong trường', powerLevel: 'Cao', concern: 'Bị nghi ngờ lợi ích nhóm và thiếu minh bạch trong đấu thầu' }
      ],
      ethicalDilemma: 'Mục tiêu bảo vệ môi trường tương lai có quyền áp đặt gánh nặng kinh tế trước mắt lên các nhóm người học dễ bị tổn thương nhất?',
      guidingQuestions: [
        '1. Làm thế nào để phân bổ chi phí chuyển đổi xanh công bằng thay vì cào bằng qua học phí bắt buộc?',
        '2. Đâu là ranh giới giữa việc khuyến khích hành vi văn minh và việc tước đoạt quyền tự do lựa chọn phương tiện?',
        '3. Cơ chế giám sát tài chính nào giúp công khai minh bạch 100% việc sử dụng các quỹ bảo vệ môi trường trường học?'
      ],
      suggestedBiases: ['Thiên kiến Đạo đức giả lập (Moral Licensing)', 'Hiệu ứng Mỏ neo chi phí (Anchoring Bias)', 'Ngụy biện Đen-Trắng (False Dilemma)']
    }
  },
  {
    id: 'case-dorm-rent-crisis',
    title: 'Khủng Hoảng Giá Thuê Trọ Đô Thị Sau Thiên Tai & Áp Lực Sinh Kế Sinh Viên',
    category: 'student_life',
    categoryLabel: 'Đời Sống Sinh Viên',
    industry: 'Bất Động Sản Xã Hội & Đời Sống Giảng Đường',
    brief: 'Chủ nhà trọ đồng loạt tăng giá phòng 35% với lý do chi phí vật giá leo thang sau bão lũ, đẩy hàng ngàn sinh viên vào thế bế tắc.',
    defaultCase: {
      id: 'case-dorm-rent-crisis',
      title: 'Khủng Hoảng Giá Thuê Trọ Đô Thị Sau Thiên Tai & Áp Lực Sinh Kế Sinh Viên',
      industry: 'An Sinh Xã Hội & Quản Lý Đô Thị',
      context: 'Đầu năm học mới, khu vực xung quanh các cụm trường đại học lớn xảy ra tình trạng "sốt giá phòng trọ". Ký túc xá trường chỉ đáp ứng được 20% nhu cầu chỗ ở cho tân sinh viên diện chính sách. Nhân cơ hội này, các chủ nhà trọ tư nhân đồng loạt tăng giá phòng từ 2,5 triệu lên 3,8 triệu đồng/tháng, đồng thời áp đặt giá điện 4.500đ/kWh và nước 35.000đ/m3. Nhiều sinh viên nghèo từ các tỉnh vùng xa phải ghép 6-8 người trong một phòng ẩm thấp 15m2 hoặc đối mặt với nguy cơ phải bỏ học vì không đủ chi phí sinh hoạt đô thị.',
      stakeholders: [
        { group: 'Sinh viên thuê trọ', interest: 'Có chỗ ở an toàn, giá cả hợp lý, điện nước tính đúng giá nhà nước để an tâm học tập', powerLevel: 'Thấp', concern: 'Bị đuổi khỏi phòng trọ giữa học kỳ, nguy cơ tai nạn hỏa hoạn và cạn kiệt tài chính' },
        { group: 'Chủ nhà trọ & Giới đầu cơ phòng trọ', interest: 'Tối đa hóa lợi nhuận đầu tư, bù đắp chi phí cải tạo sau mùa mưa bão', powerLevel: 'Cao', concern: 'Bị chính quyền xử phạt vi phạm giá điện nước hoặc sinh viên bùng tiền phòng trốn đi' },
        { group: 'Phòng Công tác Sinh viên Đại học', interest: 'Hỗ trợ sinh viên ổn định nơi cư trú, duy trì sĩ số học tập chuyên cần', powerLevel: 'Trung bình', concern: 'Quỹ đất xây ký túc xá cạn kiệt, không có thẩm quyền chế tài các chủ trọ bên ngoài khuôn viên' },
        { group: 'Ủy ban Nhân dân Phường & Công an Khu vực', interest: 'Bảo đảm an ninh trật tự, phòng cháy chữa cháy (PCCC) và bình ổn giá trên địa bàn', powerLevel: 'Cao', concern: 'Khó kiểm soát hàng ngàn phòng trọ tự phát không đủ tiêu chuẩn PCCC nhưng nếu cấm thì sinh viên không có chỗ ở' }
      ],
      ethicalDilemma: 'Nhà ở cho sinh viên nên được xem là hàng hóa thị trường tự do thuận mua vừa bán hay là một dịch vụ an sinh xã hội cơ bản cần được kiểm soát giá trần?',
      guidingQuestions: [
        '1. Trường đại học có trách nhiệm liên đới đến đâu đối với điều kiện ăn ở và an toàn ngoài trường của sinh viên?',
        '2. Mô hình "Ký túc xá hợp tác công tư (PPP)" nào có thể giải quyết bài toán thiếu hụt chỗ ở dài hạn?',
        '3. Làm thế nào để bảo vệ quyền lợi hợp đồng thuê trọ của sinh viên trước các điều khoản chèn ép của chủ nhà?'
      ],
      suggestedBiases: ['Thiên kiến Vị kỷ (Self-serving Bias)', 'Ngụy biện Khái quát hóa vội vã', 'Hiệu ứng Nhìn thấy là tin']
    }
  },
  {
    id: 'case-gig-economy-burnout',
    title: 'Sinh Viên Chạy Xe Công Nghệ Đêm Để Tự Lập Học Phí: Nghị Lực Hay Cái Bẫy Mất Tương Lai?',
    category: 'student_life',
    categoryLabel: 'Đời Sống Sinh Viên',
    industry: 'Kinh Tế Nền Tảng (Gig Economy) & Sức Khỏe Học Đường',
    brief: 'Sinh viên chạy xe ôm công nghệ 8 tiếng mỗi đêm để kiếm tiền nộp học phí, dẫn đến ngủ gục trên lớp, nợ 15 tín chỉ và đứng trước nguy cơ bị đuổi học.',
    defaultCase: {
      id: 'case-gig-economy-burnout',
      title: 'Sinh Viên Chạy Xe Công Nghệ Đêm Để Tự Lập Học Phí: Nghị Lực Hay Cái Bẫy Mất Tương Lai?',
      industry: 'Xã Hội Học & Sức Khỏe Tinh Thần Sinh Viên',
      context: 'Nam, sinh viên năm 3 ngành Kỹ thuật Điện tử, quyết định không xin tiền bố mẹ mà tự chạy xe ôm công nghệ (Grab/Be/ShopeeFood) từ 18h tối đến 2h sáng mỗi ngày để kiếm 8 triệu đồng/tháng trang trải học phí và tiền trọ. Sau 6 tháng, do kiệt sức và thiếu ngủ mạn tính, Nam liên tục ngủ gục trong giờ thực hành máy móc nguy hiểm, điểm GPA tụt xuống 1.2 và bị cảnh báo học vụ mức 2 (nguy cơ buộc thôi học). Khi cố vấn học tập khuyên Nam giảm giờ làm để cứu vớt việc học, Nam chia sẻ: "Nếu em không chạy xe, ngày mai em sẽ bị đuổi khỏi phòng trọ và không có tiền đóng học phí để được thi".',
      stakeholders: [
        { group: 'Sinh viên làm thêm tự lập', interest: 'Tự chủ tài chính, không tạo gánh nặng cho gia đình nghèo ở quê', powerLevel: 'Thấp', concern: 'Kiệt quệ thể xác, hỏng tương lai nghề nghiệp và nguy cơ tai nạn giao thông rình rập hàng đêm' },
        { group: 'Gia đình & Bố mẹ', interest: 'Con cái có bằng cử nhân để đổi đời, tự hào về tính tự lập của con', powerLevel: 'Thấp', concern: 'Không biết tình cảnh thực tế của con cho đến khi nhận giấy báo thôi học' },
        { group: 'Giảng viên & Nhà trường', interest: 'Đảm bảo chuẩn đầu ra đào tạo, an toàn lao động trong xưởng thực hành', powerLevel: 'Cao', concern: 'Nếu hạ thấp tiêu chuẩn để châm chước thì vi phạm quy chế đào tạo tín chỉ' },
        { group: 'Các Nền tảng Công nghệ Tuyển dụng', interest: 'Lực lượng tài xế trẻ đông đảo, sẵn sàng nhận cuốc đêm với giá rẻ và không cần phúc lợi bảo hiểm', powerLevel: 'Cao', concern: 'Bị xã hội chỉ trích là khai thác sức lao động sinh viên mà không có lưới an sinh' }
      ],
      ethicalDilemma: 'Quy chế đào tạo đại học nên kiên quyết giữ vững chuẩn mực cứng nhắc hay cần có cơ chế linh hoạt cứu xét đối với sinh viên có hoàn cảnh mưu sinh ngặt nghèo?',
      guidingQuestions: [
        '1. Công việc bán thời gian kinh tế tự do (Gig work) đang tạo cơ hội tự lập hay đang tước đoạt cơ hội tích lũy tri thức chuyên sâu của thanh niên?',
        '2. Trường đại học có thể xây dựng "Hệ thống Quỹ Cho vay Học tập Không Lãi suất" như thế nào để sinh viên không phải bán mạng mưu sinh?',
        '3. Kỹ năng quản trị thời gian và giới hạn chịu đựng bản thân cần được giáo dục ra sao trong những năm đầu đại học?'
      ],
      suggestedBiases: ['Thiên kiến Chi phí chìm (Sunk Cost Fallacy)', 'Hiệu ứng Hiện tại hóa lợi ích ngắn hạn (Present Bias)', 'Thiên kiến Sống sót']
    }
  },
  {
    id: 'case-exam-surveillance',
    title: 'Phần Mềm Giám Sát Thi Cử AI (Proctored Exam): Phòng Gian Lận Hay Vi Phạm Nhân Phẩm?',
    category: 'academic',
    categoryLabel: 'Học Tập & Học Thuật',
    industry: 'Khảo Thí Giáo Dục & Quyền Riêng Tư Số',
    brief: 'Hệ thống thi online tự động chấm rớt 40 sinh viên vì thuật toán AI phát hiện "ánh mắt liếc khỏi màn hình quá 3 giây" và "âm thanh tiếng chó sủa trong phòng thi".',
    defaultCase: {
      id: 'case-exam-surveillance',
      title: 'Phần Mềm Giám Sát Thi Cử AI (Proctored Exam): Phòng Gian Lận Hay Vi Phạm Nhân Phẩm?',
      industry: 'Công Nghệ Giáo Dục (EdTech) & Triết Học Đạo Đức',
      context: 'Trong kỳ thi cuối kỳ môn Triết học Mác - Lênin trực tuyến, trường sử dụng phần mềm giám sát thi ứng dụng AI (Proctored AI) yêu cầu sinh viên bật camera 360 độ quay toàn bộ phòng ngủ, quét võng mạc và ghi âm toàn bộ micro. Khi kết thúc giờ thi, hệ thống gắn cờ đỏ (Red Flag) và tự động cho điểm 0 đối với 40 sinh viên với lý do: "Mắt đảo khỏi màn hình quá 3 lần", "Khuôn mặt nghiêng góc 45 độ" hoặc "Phát hiện tiếng nói lạ". Trên thực tế, nhiều bạn bị gắn cờ chỉ vì nhà trọ chật hẹp, mẹ bước vào mang nước hoặc bị tật giật cơ mắt bẩm sinh.',
      stakeholders: [
        { group: 'Sinh viên bị chấm gian lận oan', interest: 'Được minh oan, thi lại công bằng và được bảo vệ phẩm giá cá nhân', powerLevel: 'Thấp', concern: 'Bị lưu vết gian lận vào hồ sơ học bạ điện tử suốt đời, mất học bổng' },
        { group: 'Ban Khảo thí & Đảm bảo Chất lượng', interest: 'Ngăn chặn triệt để gian lận thi cử từ xa, bảo vệ độ tin cậy của bảng điểm', powerLevel: 'Cao', concern: 'Thiếu nhân lực chấm phúc khảo thủ công cho hàng ngàn bản ghi âm/video camera' },
        { group: 'Công ty Cung cấp Phần mềm Giám sát AI', interest: 'Chứng minh độ chính xác 99.8% của thuật toán để ký hợp đồng mở rộng toàn trường', powerLevel: 'Cao', concern: 'Bị khởi kiện vì thiên kiến thuật toán (Algorithmic Bias) đối với người khuyết tật' },
        { group: 'Giảng viên Chấm thi', interest: 'Có công cụ khách quan để đánh giá hàng trăm bài thi nhanh chóng', powerLevel: 'Trung bình', concern: 'Mất đi sự thấu cảm sư phạm và biến quan hệ thầy trò thành mối quan hệ nghi kỵ' }
      ],
      ethicalDilemma: 'Có nên giao phó quyền phán quyết liêm chính và danh dự của một con người cho một thuật toán AI không có khả năng thấu hiểu ngữ cảnh sống?',
      guidingQuestions: [
        '1. Đâu là ranh giới giữa giám sát bảo đảm công bằng và xâm phạm không gian riêng tư thiêng liêng của nơi ở?',
        '2. Cơ chế khiếu nại và quyền được con người phúc khảo (Human-in-the-loop) cần được thiết kế ra sao để tránh phán quyết oan sai của máy móc?',
        '3. Liệu hình thức thi trắc nghiệm học vẹt có phải là nguyên nhân gốc rễ thúc đẩy gian lận thay vì thi vấn đáp phản biện trực tiếp?'
      ],
      suggestedBiases: ['Thiên kiến Tự động hóa (Automation Bias)', 'Ngụy biện Khái quát hóa vội vã', 'Hiệu ứng Nhị nguyên giả']
    }
  },
  {
    id: 'case-english-exit-benchmark',
    title: 'Chuẩn Đầu Ra Ngoại Ngữ Quốc Tế Đắt Đỏ (IELTS/TOEIC): Hội Nhập Toàn Cầu Hay Bất Bình Đẳng Giai Cấp?',
    category: 'academic',
    categoryLabel: 'Học Tập & Học Thuật',
    industry: 'Chính Sách Giáo Dục & Xã Hội Học',
    brief: 'Quy định bắt buộc chứng chỉ IELTS 6.5 mới được nhận bằng tốt nghiệp khiến 35% sinh viên có hoàn cảnh khó khăn bị giam bằng suốt 2 năm.',
    defaultCase: {
      id: 'case-english-exit-benchmark',
      title: 'Chuẩn Đầu Ra Ngoại Ngữ Quốc Tế Đắt Đỏ (IELTS/TOEIC): Hội Nhập Toàn Cầu Hay Bất Bình Đẳng Giai Cấp?',
      industry: 'Chính Sách Giáo Dục & Công Bằng Xã Hội',
      context: 'Để nâng cao uy tín kiểm định quốc tế, trường đại học áp dụng quy định chuẩn đầu ra: Tất cả sinh viên tốt nghiệp phải nộp chứng chỉ IELTS tối thiểu 6.5 hoặc TOEFL iBT tương đương, không chấp nhận chứng chỉ nội bộ VSTEP. Lệ phí thi một lần gần 5 triệu đồng và chi phí luyện thi tại trung tâm lên tới 20-30 triệu đồng trở thành rào cản tài chính quá lớn đối với các sinh viên nông thôn và gia đình khó khăn. Nhiều sinh viên đã hoàn thành 100% tín chỉ chuyên ngành xuất sắc nhưng bị "giam bằng" suốt 2 năm không thể xin việc làm chính thức, trong khi các bạn gia đình khá giả đã có chứng chỉ từ thời cấp 3 dễ dàng ra trường đúng hạn.',
      stakeholders: [
        { group: 'Sinh viên hoàn cảnh khó khăn', interest: 'Được xét tốt nghiệp theo năng lực chuyên môn và chứng chỉ hợp lý, có bằng đi làm nuôi sống bản thân', powerLevel: 'Thấp', concern: 'Tốn kém tiền bạc thi đi thi lại nhiều lần nhưng không qua nổi các bẫy đề thi học thuật' },
        { group: 'Ban Giám hiệu Nhà trường', interest: 'Tăng chỉ số quốc tế hóa, nâng thứ hạng đại học trong bảng QS Asia và thu hút nhà tuyển dụng FDI', powerLevel: 'Cao', concern: 'Hạ chuẩn đầu ra sẽ bị đánh giá là tụt hậu chất lượng so với các trường đối thủ' },
        { group: 'Các Tổ chức Khảo thí Quốc tế & Trung tâm Luyện thi', interest: 'Duy trì thị trường độc quyền khảo thí với nguồn doanh thu hàng trăm tỷ đồng mỗi năm', powerLevel: 'Cao', concern: 'Các trường chuyển sang công nhận khung năng lực ngoại ngữ quốc gia 6 bậc (VSTEP)' },
        { group: 'Doanh nghiệp Tuyển dụng', interest: 'Ứng viên có khả năng giao tiếp thực tế và làm việc nhóm trong môi trường đa văn hóa', powerLevel: 'Trung bình', concern: 'Nhiều ứng viên đạt IELTS 7.0 nhưng giao tiếp thực tế lúng túng và thiếu kỹ năng chuyên môn' }
      ],
      ethicalDilemma: 'Chuẩn đầu ra đại học nên là thước đo năng lực phục vụ xã hội hay vô tình trở thành bộ lọc phân hóa giàu nghèo biến cơ hội học tập thành đặc quyền?',
      guidingQuestions: [
        '1. Nhà trường có trách nhiệm bao cấp hoặc tổ chức đào tạo miễn phí để sinh viên đạt chuẩn hay chỉ đưa ra yêu cầu rồi phó mặc?',
        '2. Khung năng lực ngoại ngữ quốc gia VSTEP có thực sự đủ độ tin cậy để thay thế các chứng chỉ quốc tế đắt đỏ?',
        '3. Làm thế nào để đánh giá năng lực ngoại ngữ thực chiến của sinh viên theo đúng đặc thù từng chuyên ngành nghề nghiệp?'
      ],
      suggestedBiases: ['Hiệu ứng Mỏ neo danh tiếng (Anchoring Effect)', 'Thiên kiến Kẻ sống sót (Survivorship Bias)', 'Thiên kiến Vị thành kiến giai cấp']
    }
  }
];

/**
 * Generate a complete Harvard-grade Case Study using Gemini 3.8 Flash
 * with graceful fallback to dynamic synthesizer if offline or API key unavailable.
 */
export async function generateCaseStudyWithAI(
  userPrompt: string,
  categoryTheme: string,
  isOffline: boolean = false
): Promise<CaseStudy> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);

  const cleanPrompt = userPrompt.trim();

  // If online and API key exists, call Gemini
  if (!isOffline && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptInstruction = `Bạn là Chuyên gia Biên soạn Tình huống Học thuật Đại học chuẩn Harvard Case Method (Harvard Business Publishing).
Hãy tạo ra MỘT tình huống thực tế (Case Study) mang tính tranh biện và tư duy phản biện sâu sắc, hướng tới đối tượng sinh viên đại học.

Chủ đề yêu cầu: "${cleanPrompt || categoryTheme}"
Thể loại: ${categoryTheme}
Yêu cầu:
1. Tình huống phải gắn liền với thực tiễn đời sống sinh viên, học thuật đại học hoặc các vấn đề thời sự nóng hổi hiện nay (AI, liêm chính học thuật, đạo đức kinh doanh, chuyển đổi xanh, an ninh mạng, tài chính sinh viên...).
2. Bối cảnh (context) phải chi tiết, kịch tính, chứa đựng mâu thuẫn lợi ích gay gắt giữa 4 nhóm đối tượng liên quan (Stakeholder Matrix).
3. Đưa ra mâu thuẫn đạo đức cốt lõi (ethical dilemma), 3 câu hỏi định hướng sâu sắc và 3 thiên kiến nhận thức (cognitive biases) dễ mắc phải.

Hãy trả về DUY NHẤT một chuỗi JSON chuẩn (không dùng markdown backticks, không kèm lời bình luận) đúng theo cấu trúc sau:
{
  "id": "case-${Date.now()}",
  "title": "Tiêu đề tình huống ngắn gọn, hấp dẫn, có tính xung đột",
  "industry": "Lĩnh vực / Ngành đào tạo liên quan",
  "context": "Mô tả bối cảnh thực tiễn từ 180 - 280 từ chi tiết, cụ thể số liệu và tình tiết đẩy xung đột lên đỉnh điểm",
  "stakeholders": [
    {
      "group": "Tên nhóm đối tượng 1",
      "interest": "Lợi ích mong muốn",
      "powerLevel": "Cao" | "Trung bình" | "Thấp",
      "concern": "Mối quan ngại lớn nhất"
    },
    {
      "group": "Tên nhóm đối tượng 2",
      "interest": "Lợi ích mong muốn",
      "powerLevel": "Cao" | "Trung bình" | "Thấp",
      "concern": "Mối quan ngại lớn nhất"
    },
    {
      "group": "Tên nhóm đối tượng 3",
      "interest": "Lợi ích mong muốn",
      "powerLevel": "Cao" | "Trung bình" | "Thấp",
      "concern": "Mối quan ngại lớn nhất"
    },
    {
      "group": "Tên nhóm đối tượng 4",
      "interest": "Lợi ích mong muốn",
      "powerLevel": "Cao" | "Trung bình" | "Thấp",
      "concern": "Mối quan ngại lớn nhất"
    }
  ],
  "ethicalDilemma": "Câu hỏi mâu thuẫn đạo đức cốt lõi phản ánh thế tiến thoái lưỡng nan",
  "guidingQuestions": [
    "1. Câu hỏi định hướng phân tích góc nhìn...",
    "2. Câu hỏi định hướng giải pháp...",
    "3. Câu hỏi đánh giá hệ quả lâu dài..."
  ],
  "suggestedBiases": [
    "Thiên kiến 1",
    "Thiên kiến 2",
    "Thiên kiến 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptInstruction
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.title && parsed.context && parsed.stakeholders) {
        return {
          id: `case-ai-${Date.now()}`,
          title: parsed.title,
          industry: parsed.industry || 'Kinh Tế & Xã Hội',
          context: parsed.context,
          stakeholders: parsed.stakeholders,
          ethicalDilemma: parsed.ethicalDilemma || 'Mâu thuẫn lợi ích giữa các bên liên quan',
          guidingQuestions: parsed.guidingQuestions || ['1. Đâu là cốt lõi của vấn đề?', '2. Giải pháp nào dung hòa tốt nhất?'],
          suggestedBiases: parsed.suggestedBiases || ['Thiên kiến xác nhận', 'Ngụy biện Dốc trượt']
        };
      }
    } catch (err) {
      console.warn('Gemini API call fell back to local dynamic generator:', err);
    }
  }

  // Fallback / Offline Dynamic Synthesizer
  return synthesizeCaseStudy(cleanPrompt, categoryTheme);
}

/**
 * Intelligent Dynamic Synthesizer for offline or rapid generation
 */
function synthesizeCaseStudy(topic: string, category: string): CaseStudy {
  const timestamp = Date.now();
  const title = topic
    ? `Tình Huống Thực Tiễn: ${topic}`
    : 'Khủng Hoảng Quyền Sở Hữu Đồ Án Nghiên Cứu Giữa Sinh Viên & Giảng Viên';

  const industry = topic.toLowerCase().includes('y') || topic.toLowerCase().includes('dược')
    ? 'Y Dược & Đạo Đức Y Sinh'
    : topic.toLowerCase().includes('tiền') || topic.toLowerCase().includes('tài chính') || topic.toLowerCase().includes('kinh tế')
    ? 'Tài Chính & Quản Trị Kinh Doanh'
    : topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('công nghệ') || topic.toLowerCase().includes('phần mềm')
    ? 'Công Nghệ Thông Tin & Trí Tuệ Nhân Tạo'
    : 'Giáo Dục Đại Học & Phát Triển Bền Vững';

  return {
    id: `case-gen-${timestamp}`,
    title,
    industry,
    context: `Trong bối cảnh trường đại học đang đẩy mạnh đổi mới sáng tạo và hội nhập quốc tế, vấn đề "${topic || 'phân chia quyền lợi nghiên cứu'}" nảy sinh xung đột gay gắt giữa các bên liên quan. Một nhóm sinh viên ưu tú đã dành 8 tháng phát triển sản phẩm thực nghiệm đạt giải thưởng nghiên cứu khoa học cấp bộ. Tuy nhiên, khi dự án được một quỹ đầu tư thiên thần đề nghị rót vốn 500 triệu đồng để thương mại hóa, giảng viên hướng dẫn và nhà trường yêu cầu nắm giữ 70% cổ phần bản quyền với lý do "sử dụng phòng thí nghiệm và cơ sở dữ liệu của trường". Sinh viên cho rằng đây là công sức sáng tạo nguyên bản của mình và đe dọa mang đề án ra khỏi trường để tự khởi nghiệp.`,
    stakeholders: [
      { group: 'Nhóm Sinh viên Sáng lập', interest: 'Bảo vệ quyền tác giả, tự do thương mại hóa và giữ quyền quyết định số phận sản phẩm', powerLevel: 'Trung bình', concern: 'Bị tước đoạt thành quả lao động và khó tốt nghiệp nếu quan hệ với trường đổ vỡ' },
      { group: 'Giảng viên Hướng dẫn & Lab Trưởng', interest: 'Được ghi nhận vai trò bảo trợ học thuật, bổ sung vào lý lịch khoa học (CV khoa học)', powerLevel: 'Cao', concern: 'Bị coi là cướp công của học trò, ảnh hưởng thanh danh sư phạm' },
      { group: 'Phòng Quản lý Khoa học & Trường ĐH', interest: 'Bảo vệ tài sản trí tuệ và thương hiệu nhà trường, tạo nguồn thu tái đầu tư lab', powerLevel: 'Cao', concern: 'Tạo tiền lệ xấu khiến nhà trường bị đánh giá là kìm hãm tinh thần khởi nghiệp trẻ' },
      { group: 'Quỹ Đầu tư Thiên thần', interest: 'Giải ngân nhanh, sản phẩm sớm ra thị trường để thu lợi nhuận và chiếm lĩnh thị phần', powerLevel: 'Trung bình', concern: 'Tranh chấp pháp lý sở hữu trí tuệ kéo dài làm chết sản phẩm khi thị trường đổi chiều' }
    ],
    ethicalDilemma: 'Ai là chủ sở hữu thực sự của phát minh học đường khi trí tuệ của sinh viên được ươm mầm nhờ hạ tầng và nguồn tài nguyên chung của nhà trường?',
    guidingQuestions: [
      '1. Làm thế nào để định giá công bằng giữa công sức trí tuệ của người học và chi phí cơ sở vật chất của trường?',
      '2. Mô hình phân chia cổ phần (Equity Split) nào giúp khuyến khích sinh viên sáng tạo mà vẫn đóng góp ngược lại cho trường?',
      '3. Cần những điều khoản hợp đồng rõ ràng nào ngay từ ngày đầu bước vào phòng thí nghiệm?'
    ],
    suggestedBiases: [
      'Thiên kiến sở hữu (Endowment Effect)',
      'Ngụy biện chi phí chìm (Sunk Cost Fallacy)',
      'Thiên kiến tự đề cao đóng góp (Egocentric Bias)'
    ]
  };
}
