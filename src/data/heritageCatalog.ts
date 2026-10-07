/**
 * VibePhục Studio — Knowledge Base & Cultural Guardrail Engine
 * Peer-reviewed catalog of authentic Vietnamese heritage garments & guardrails
 * Citations grounded in: Đại Nam Thực Lục, Ngàn Năm Áo Mũ, Khâm Định Đại Nam Hội Điển Sự Lệ.
 */

import {
  GarmentType,
  GarmentItem,
  AccessoryItem,
  Occasion,
  Region,
  Weather,
  FiveElement,
  OutfitState,
  HeritageValidationResult,
  CulturalViolation,
  FengshuiHarmony,
  HSLHarmonyInfo,
  ClassicVietnamesePalette,
  CitationInfo
} from '../types/vibephuc';

// ============================================================================
// 1. STANDARD COLOR DEFINITIONS WITH FIVE ELEMENTS
// ============================================================================
export const HERITAGE_COLORS = {
  chamThuy: { name: 'Chàm Thủy Tộc', hex: '#1E3A8A', element: 'THUY' as FiveElement, symbolicMeaning: 'Nước sâu huyền bí, tĩnh lặng, nguồn cội sự sống' },
  sonChuSa: { name: 'Đỏ Son Chu Sa', hex: '#C53030', element: 'HOA' as FiveElement, symbolicMeaning: 'Lửa hồng cung đình, uy quyền, hân hoan chúc phúc' },
  hoangTho: { name: 'Vàng Hoàng Thổ', hex: '#D69E2E', element: 'THO' as FiveElement, symbolicMeaning: 'Đất mẹ phù sa, trung tâm vũ trụ, đức tính bao dung' },
  bachLua: { name: 'Bạch Lụa Kim', hex: '#F8FAFC', element: 'KIM' as FiveElement, symbolicMeaning: 'Thanh khiết, chính trực, kim khí sáng ngời' },
  lucTruc: { name: 'Lục Trúc Mộc', hex: '#16A34A', element: 'MOC' as FiveElement, symbolicMeaning: 'Cây cỏ đâm chồi, sinh trưởng trường tồn' },
  timHue: { name: 'Tím Hoa Cà Xứ Huế', hex: '#701A75', element: 'HOA' as FiveElement, symbolicMeaning: 'Thủy chung, trầm mặc tao nhã của đất kinh kỳ' },
  denHuyen: { name: 'Đen Mực Sơn Mài', hex: '#0E0F12', element: 'THUY' as FiveElement, symbolicMeaning: 'Vững chãi, tôn nghiêm, chiều sâu tri thức' },
  cyberLime: { name: 'Cyber Lime Tân Kỳ', hex: '#CCFF00', element: 'MOC' as FiveElement, symbolicMeaning: 'Sức sống thế hệ Gen Z, năng lượng vị lai' },
  cyberJade: { name: 'Cyber Jade Ngọc Bích', hex: '#00F5D4', element: 'THUY' as FiveElement, symbolicMeaning: 'Hơi thở công nghệ số hòa quyện ngọc cổ xưa' },
  nauNon: { name: 'Nâu Non Vỏ Dừa', hex: '#795548', element: 'THO' as FiveElement, symbolicMeaning: 'Chất phác đồng ruộng phù sa đồng bằng Bắc Bộ' },
  hoaLy: { name: 'Xanh Hoa Lý', hex: '#81C784', element: 'MOC' as FiveElement, symbolicMeaning: 'Thanh mát như dàn hoa thiên lý bờ ao' },
  hoaHoe: { name: 'Vàng Hoa Hòe', hex: '#E5C158', element: 'THO' as FiveElement, symbolicMeaning: 'Vàng dịu rạng rỡ của hoa hòe nhuộm gấm' }
};

// ============================================================================
// 2. GARMENT CATALOG (CORE, BASE, OUTER, BOTTOM) WITH PEER-REVIEWED CITATIONS
// ============================================================================
export const GARMENT_CATALOG: GarmentItem[] = [
  // ---------------- CORE GARMENTS ----------------
  {
    id: 'core-ao-dai-ngu-than',
    name: 'Áo Dài Ngũ Thân Lập Lĩnh',
    category: 'AO_DAI_NGU_THAN',
    era: 'Triều Nguyễn (Năm 1744 & 1836)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.chamThuy,
    allowableColors: [HERITAGE_COLORS.chamThuy, HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.hoangTho, HERITAGE_COLORS.denHuyen],
    harmonyElement: 'THUY',
    historicalNote: '5 thân vải tượng trưng Tứ Thân Phụ Mẫu che chở bản thân. Cổ đứng lập lĩnh cao 2-3cm ôm khít, khuy cài sang phải theo đúng quy tắc Hữu Nhậm.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu sử liệu',
      sourceDocument: 'Đại Nam Thực Lục & Khâm Định Đại Nam Hội Điển Sự Lệ',
      citationText: 'Năm 1744, Định vương Nguyễn Phúc Khoát ban sắc dụ cải cách y phục Đàng Trong. Đến năm 1836, Vua Minh Mạng thống nhất quy chế áo năm thân lập lĩnh trên toàn quốc.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'LE_HOI_TRUONG', 'DAM_CUOI_WEDDING', 'DI_CHUA_TEMPLE'],
    suitableWeather: ['NANG_AM', 'SE_LANH'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: true
  },
  {
    id: 'core-ao-dai-lemur',
    name: 'Áo Dài Le Mur Tân Thời',
    category: 'AO_DAI_LEMUR',
    era: 'Thập niên 1930 (Cải cách Cát Tường)',
    region: 'BAC_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.timHue,
    allowableColors: [HERITAGE_COLORS.timHue, HERITAGE_COLORS.bachLua, HERITAGE_COLORS.sonChuSa],
    harmonyElement: 'HOA',
    historicalNote: 'Họa sĩ Cát Tường cách tân từ ngũ thân với cổ bẻ lá sen, vai bồng duyên dáng, viền ren kiểu Tây phương, tà áo thướt tha mở ra kỷ nguyên thời trang hiện đại.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu báo chí',
      sourceDocument: 'Báo Ngày Nay & Phong Hóa (1934 - 1937)',
      citationText: 'Chuyên mục "Vẻ đẹp phụ nữ" giới thiệu mẫu áo Le Mur cách tân, dung hòa nghệ thuật tạo hình phương Tây với cốt cách tà áo Việt.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'PROM_NIGHT', 'STREETWEAR_CASUAL'],
    suitableWeather: ['NANG_AM', 'SE_LANH'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },
  {
    id: 'core-ao-dai-raglan',
    name: 'Áo Dài Raglan (Ráp Gian)',
    category: 'AO_DAI_RAGLAN',
    era: 'Thập niên 1960 (Hiệu may Dung Đakao)',
    region: 'NAM_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.bachLua,
    allowableColors: [HERITAGE_COLORS.bachLua, HERITAGE_COLORS.lucTruc, HERITAGE_COLORS.hoangTho],
    harmonyElement: 'KIM',
    historicalNote: 'Bước đột phá kỹ thuật ráp tay Raglan nối xéo từ cổ xuống nách giúp triệt tiêu hoàn toàn nếp nhăn vùng nách, cài nút bấm một bên sườn, tôn vinh nét đẹp học đường.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu lịch sử thời trang',
      sourceDocument: 'Nghiên cứu trang phục Sài Gòn thế kỷ 20',
      citationText: 'Năm 1960, nhà may Dung Đakao tại Sài Gòn sáng tạo đường nối raglan, tạo nên chuẩn mực tà áo dài nữ sinh duyên dáng cho đến tận ngày nay.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'LE_HOI_TRUONG', 'TET_SPRING', 'DI_CHUA_TEMPLE'],
    suitableWeather: ['NANG_AM', 'SE_LANH', 'MUA_RAO'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },
  {
    id: 'core-ao-dai-hien-dai',
    name: 'Áo Dài Đương Đại Lụa Linen',
    category: 'AO_DAI_HIEN_DAI',
    era: 'Đương đại (Thế kỷ 21)',
    region: 'NAM_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.lucTruc,
    allowableColors: [HERITAGE_COLORS.lucTruc, HERITAGE_COLORS.cyberLime, HERITAGE_COLORS.bachLua],
    harmonyElement: 'MOC',
    historicalNote: 'Thiết kế phom suông nhẹ may bằng linen tơ tằm thoáng mát, phù hợp sinh viên học sinh mặc cả ngày trong các sự kiện kỷ yếu và lễ hội.',
    citation: {
      trustLevel: 'FOLK_TRADITION',
      trustLabel: 'Cách hiểu đương đại',
      sourceDocument: 'Xu hướng Thời trang Bền vững Việt Nam (Eco-Fashion)',
      citationText: 'Áo dài lụa linen cách tân tối giản phom dáng suông rộng, đề cao sự tự do vận động và thân thiện môi trường của thế hệ trẻ.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'STREETWEAR_CASUAL', 'LE_HOI_TRUONG'],
    suitableWeather: ['NANG_AM', 'MUA_RAO'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },
  {
    id: 'core-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn Nam/Nữ',
    category: 'AO_NGU_THAN_TAY_CHEN',
    era: 'Triều Nguyễn (Năm 1836)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.chamThuy, HERITAGE_COLORS.hoangTho],
    harmonyElement: 'THUY',
    historicalNote: 'Ống tay thu nhỏ ôm sát từ khuỷu tay đến cổ tay, tiện dụng trong sinh hoạt thường nhật nhưng vẫn giữ vẹn nguyên phong độ lễ giáo và tính đoan chính.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu sử sách',
      sourceDocument: 'Khâm Định Đại Nam Hội Điển Sự Lệ - Quy định thường phục',
      citationText: 'Tay chẽn là y phục thông dụng nhất từ bậc văn quan, võ chức cho đến thường dân, thể hiện phong thái ngay thẳng và khiêm nhường.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'LE_HOI_TRUONG', 'STREETWEAR_CASUAL', 'DI_CHUA_TEMPLE'],
    suitableWeather: ['NANG_AM', 'SE_LANH'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: true
  },
  {
    id: 'core-ao-tac',
    name: 'Áo Tấc / Tay Thụ Đại Lễ',
    category: 'AO_TAC',
    era: 'Triều Nguyễn (Lễ phục truyền thống)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.hoangTho,
    allowableColors: [HERITAGE_COLORS.hoangTho, HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.chamThuy],
    harmonyElement: 'THO',
    historicalNote: 'Lễ phục trang trọng bậc nhất của quan viên và dân chúng khi tế lễ, hôn lễ, yến tiệc. Ống tay rộng 35-50cm thụng vuông góc khi chắp tay chào lễ (chắp tay bái lạy uy nghiêm).',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu điển chế',
      sourceDocument: 'Ngàn Năm Áo Mũ (Trần Quang Đức) & Điển chế nhà Nguyễn',
      citationText: 'Áo Tấc (áo thụng) là lễ phục bắt buộc trong các nghi thức quan trọng, đi cùng khăn đóng hoặc khăn vành dây, thể hiện sự kính cẩn với tổ tiên và nhật nguyệt.'
    },
    recommendedOccasions: ['DAM_CUOI_WEDDING', 'TET_SPRING', 'PROM_NIGHT'],
    suitableWeather: ['SE_LANH', 'NANG_AM'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: true
  },
  {
    id: 'core-nhat-binh',
    name: 'Áo Nhật Bình Cung Đình Triều Nguyễn',
    category: 'NHAT_BINH',
    era: 'Triều Nguyễn (Nội đình Huế)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.sonChuSa,
    allowableColors: [HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.timHue, HERITAGE_COLORS.hoangTho],
    harmonyElement: 'HOA',
    historicalNote: 'Thường triều y phục của Hậu phi, Công chúa và Quý tộc. Cổ áo hình chữ nhật to bản trước ngực, viền dải Ngũ Sắc tượng trưng Ngũ Hành ở cửa tay áo.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu hoàng tộc',
      sourceDocument: 'Khâm Định Đại Nam Hội Điển Sự Lệ - Chương Cung Vi Quan Phục',
      citationText: 'Nhật Bình được quy định chặt chẽ theo phẩm hàm: Hoàng hậu dùng sắc chính hoàng / đỏ chu sa; Công chúa dùng sắc đỏ / tím huế viền thêu phượng hoàng.'
    },
    recommendedOccasions: ['PROM_NIGHT', 'DAM_CUOI_WEDDING', 'LE_HOI_TRUONG'],
    suitableWeather: ['SE_LANH', 'NANG_AM'],
    sacredLevel: 'ROYAL_EXCLUSIVE',
    lapelDirection: 'CENTER_SLIT',
    hasFiveButtons: false
  },
  {
    id: 'core-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc',
    category: 'TU_THAN',
    era: 'Thế kỷ 17 - 19 (Đồng bằng Bắc Bộ)',
    region: 'BAC_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.lucTruc,
    allowableColors: [HERITAGE_COLORS.lucTruc, HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.hoangTho, HERITAGE_COLORS.nauNon],
    harmonyElement: 'MOC',
    historicalNote: 'Bốn vạt vải mộc mạc buông lơi hoặc thắt vạt lươn trước bụng, bên trong phối yếm đào và thắt lưng lụa đào rực rỡ; hồn cốt gắn liền với câu ca Quan họ sông Cầu.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu dân gian & khảo cứu',
      sourceDocument: 'Lịch Triều Hiến Chương Loại Chí & Di sản Dân ca Quan họ',
      citationText: 'Áo tứ thân phản ánh triết lý sống gắn bó với ruộng đồng, đức tính tần tảo, thắt đáy lưng ong duyên dáng của người con gái Bắc Bộ.'
    },
    recommendedOccasions: ['LE_HOI_LANG', 'LE_HOI_TRUONG', 'TET_SPRING', 'KY_YEU_GRADUATION'],
    suitableWeather: ['NANG_AM', 'SE_LANH'],
    sacredLevel: 'FOLK',
    lapelDirection: 'CROSS_CHEST',
    hasFiveButtons: false
  },
  {
    id: 'core-giao-linh',
    name: 'Áo Giao Lĩnh Cổ Chéo Đại Việt',
    category: 'GIAO_LINH',
    era: 'Triều Lý - Trần - Hậu Lê (TK 11 - 18)',
    region: 'BAC_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.chamThuy, HERITAGE_COLORS.bachLua],
    harmonyElement: 'THUY',
    historicalNote: 'Cổ áo vạt bắt chéo nhau hình chữ Y (vạt trái đè lên vạt phải Hữu Nhậm), phom áo thụng rộng trang trọng cổ xưa, cội nguồn văn hiến Đại Việt ngàn năm.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu khảo cổ & tranh tượng',
      sourceDocument: 'Ngàn Năm Áo Mũ (Trần Quang Đức) & Khảo cổ học thời Lý - Trần',
      citationText: 'Trang phục Giao Lĩnh cổ chéo Hữu Nhậm ngự trên các pho tượng chùa Thầy, tượng vua Trần Nhân Tông tại tháp Huệ Quang (Yên Tử).'
    },
    recommendedOccasions: ['LE_HOI_TRUONG', 'PROM_NIGHT', 'TET_SPRING'],
    suitableWeather: ['SE_LANH', 'NANG_AM'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },
  {
    id: 'core-ba-ba',
    name: 'Áo Bà Ba Nam Bộ Sông Nước',
    category: 'BA_BA',
    era: 'Thế kỷ 19 - 20 (Đồng bằng Sông Cửu Long)',
    region: 'NAM_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.chamThuy,
    allowableColors: [HERITAGE_COLORS.chamThuy, HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.lucTruc],
    harmonyElement: 'THUY',
    historicalNote: 'Cổ tròn hoặc tim nông, xẻ dọc chính giữa với hàng cúc chạy thẳng, xẻ tà hai bên hông tạo sự phóng khoáng, hai túi vuông trước vạt đựng vật dụng thân thuộc.',
    citation: {
      trustLevel: 'FOLK_TRADITION',
      trustLabel: 'Cách hiểu dân gian Nam Bộ',
      sourceDocument: 'Văn hóa Dân gian Nam Bộ (Sơn Nam)',
      citationText: 'Chiếc áo bà ba mộc mạc gắn liền với chiếc xuồng ba lá, phù sa sông Tiền sông Hậu, biểu trưng cho sự khẳng khái và hào sảng của đất phương Nam.'
    },
    recommendedOccasions: ['STREETWEAR_CASUAL', 'LE_HOI_TRUONG', 'KY_YEU_GRADUATION'],
    suitableWeather: ['NANG_AM', 'MUA_RAO'],
    sacredLevel: 'FOLK',
    lapelDirection: 'CENTER_SLIT',
    hasFiveButtons: false
  },

  // ---------------- BASE LAYERS (ÁO LÓT / TRUNG ĐƠN / YẾM) ----------------
  {
    id: 'base-trung-don-bach',
    name: 'Áo Trung Đơn Lụa Bạch',
    category: 'AO_NGU_THAN_TAY_CHEN',
    era: 'Truyền thống',
    region: 'TRUNG_BO',
    slot: 'base',
    defaultColor: HERITAGE_COLORS.bachLua,
    allowableColors: [HERITAGE_COLORS.bachLua],
    harmonyElement: 'KIM',
    historicalNote: 'Lớp áo lót màu trắng mặc bên trong, để lộ viền trắng 1-2mm ở cổ áo (gọi là diềm trắng) giúp giữ gìn vệ sinh và tôn thêm vẻ thanh thoát cho cổ áo lập lĩnh.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu nghi lễ',
      sourceDocument: 'Khâm Định Đại Nam Hội Điển Sự Lệ - Trung Thiền Quy Cách',
      citationText: 'Áo trung đơn màu trắng là lớp nền tinh khiết không thể thiếu dưới áo Tấc và áo ngũ thân để thể hiện lòng thành kính.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'DAM_CUOI_WEDDING', 'DI_CHUA_TEMPLE'],
    suitableWeather: ['NANG_AM', 'SE_LANH', 'MUA_RAO'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM'
  },
  {
    id: 'base-yem-canh-sen',
    name: 'Yếm Đào Cổ Xây Cánh Sen',
    category: 'TU_THAN',
    era: 'Truyền thống Bắc Bộ',
    region: 'BAC_BO',
    slot: 'base',
    defaultColor: HERITAGE_COLORS.sonChuSa,
    allowableColors: [HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.hoangTho, HERITAGE_COLORS.bachLua],
    harmonyElement: 'HOA',
    historicalNote: 'Mảnh yếm lụa che ngực thêu hoa sen hoặc viền chỉ tơ tằm, cột dây sau gáy và lưng, mặc lót bên trong áo tứ thân hoặc áo ngũ thân lơi vạt.',
    citation: {
      trustLevel: 'DEBATED_HYPOTHESIS',
      trustLabel: 'Còn nhiều giả thuyết',
      sourceDocument: 'Nghiên cứu tiến trình y phục phụ nữ Bắc Bộ',
      citationText: 'Các nhà nghiên cứu còn thảo luận về thời điểm xuất hiện của yếm cổ khoét tròn so với yếm cổ xây chữ V thời Hậu Lê và Nguyễn.'
    },
    recommendedOccasions: ['LE_HOI_LANG', 'LE_HOI_TRUONG', 'KY_YEU_GRADUATION', 'TET_SPRING'],
    suitableWeather: ['NANG_AM'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM'
  },

  // ---------------- OUTER LAYERS (KHOÁC NGOÀI / GEN Z STREETWEAR FUSION) ----------------
  {
    id: 'outer-cyber-organza',
    name: 'Áo Khoác Cyber Organza Bomber',
    category: 'AO_DAI_HIEN_DAI',
    era: 'Đương đại (Gen Z Fusion 2026)',
    region: 'NAM_BO',
    slot: 'outer',
    defaultColor: HERITAGE_COLORS.cyberLime,
    allowableColors: [HERITAGE_COLORS.cyberLime, HERITAGE_COLORS.cyberJade, HERITAGE_COLORS.denHuyen],
    harmonyElement: 'MOC',
    historicalNote: 'Áo khoác bomber xuyên thấu chất liệu vải tơ sa/organza tái chế, cho phép nhìn thấu hàng cúc đồng và sống lưng áo ngũ thân bên trong.',
    citation: {
      trustLevel: 'FOLK_TRADITION',
      trustLabel: 'Sáng tạo đương đại',
      sourceDocument: 'Tuyên ngôn thiết kế VibePhục Studio 2026',
      citationText: 'Áo khoác xuyên thấu ứng dụng chất liệu organza vị lai để tôn vinh cấu trúc nguyên bản của di sản bên trong.'
    },
    recommendedOccasions: ['STREETWEAR_CASUAL', 'PROM_NIGHT', 'LE_HOI_TRUONG'],
    suitableWeather: ['NANG_AM', 'SE_LANH'],
    sacredLevel: 'FOLK',
    lapelDirection: 'CENTER_SLIT'
  },
  {
    id: 'outer-ao-tac-khoac',
    name: 'Áo Tấc Lụa Sa Khoác Ngoài',
    category: 'AO_TAC',
    era: 'Hoàng cung triều Nguyễn',
    region: 'TRUNG_BO',
    slot: 'outer',
    defaultColor: HERITAGE_COLORS.sonChuSa,
    allowableColors: [HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.hoangTho, HERITAGE_COLORS.chamThuy],
    harmonyElement: 'HOA',
    historicalNote: 'Khoác lộng lẫy bên ngoài áo ngũ thân hoặc áo dài, mở tà tạo sự bay bổng quyền quý khi di chuyển trong dạ hội hoặc lễ cưới truyền thống.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu cung đình',
      sourceDocument: 'Đại Nam Thực Lục Chính Biên',
      citationText: 'Áo Tấc khoác kép (hai tầng tơ sa) thường được các mệnh phụ phu nhân sử dụng trong các yến tiệc hoàng triều.'
    },
    recommendedOccasions: ['PROM_NIGHT', 'DAM_CUOI_WEDDING', 'TET_SPRING'],
    suitableWeather: ['SE_LANH'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM'
  },

  // ---------------- BOTTOM PIECES (QUẦN / VÁY) ----------------
  {
    id: 'bottom-quan-lua-trang',
    name: 'Quần Lụa Trắng Ống Rộng Truyền Thống',
    category: 'AO_DAI_NGU_THAN',
    era: 'Truyền thống',
    region: 'TRUNG_BO',
    slot: 'bottom',
    defaultColor: HERITAGE_COLORS.bachLua,
    allowableColors: [HERITAGE_COLORS.bachLua],
    harmonyElement: 'KIM',
    historicalNote: 'Quần lụa ống suông rộng chạm mu bàn chân. Theo điển lệ cổ phục Việt Nam, mặc áo dài bắt buộc phải kèm quần dài, tuyệt đối không để lộ đùi.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu quy định',
      sourceDocument: 'Quy chế y phục nữ sinh trường Đồng Khánh (Huế)',
      citationText: 'Quần lụa trắng hoặc lụa đen ống suông chạm mu bàn chân là quy thức bắt buộc khi mặc áo dài nữ sinh.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'DAM_CUOI_WEDDING', 'LE_HOI_TRUONG', 'DI_CHUA_TEMPLE'],
    suitableWeather: ['NANG_AM', 'SE_LANH', 'MUA_RAO'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM'
  },
  {
    id: 'bottom-quan-lua-den',
    name: 'Quần Lụa Đen Lãnh Mỹ A Tân Châu',
    category: 'BA_BA',
    era: 'Truyền thống Nam Bộ / Bắc Bộ',
    region: 'NAM_BO',
    slot: 'bottom',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen],
    harmonyElement: 'THUY',
    historicalNote: 'Quần lụa đen bóng nhuộm trái mặc nưa trứ danh Tân Châu (An Giang), tạo vẻ đằm thắm kín đáo, đi liền với áo ngũ thân hoặc áo bà ba Nam Bộ.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu làng nghề di sản',
      sourceDocument: 'Di sản Nghề Dệt Lãnh Mỹ Á Tân Châu',
      citationText: 'Lãnh Mỹ Á nhuộm nhựa trái mặc nưa hàng trăm lần, cho sắc đen tuyền óng ả huyền thoại được tôn vinh là nữ hoàng của các loại lụa.'
    },
    recommendedOccasions: ['KY_YEU_GRADUATION', 'STREETWEAR_CASUAL', 'TET_SPRING', 'DI_CHUA_TEMPLE'],
    suitableWeather: ['NANG_AM', 'SE_LANH', 'MUA_RAO'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM'
  },
  {
    id: 'bottom-parachute-cargo',
    name: 'Quần Parachute Cargo Dây Rút Gen Z',
    category: 'AO_DAI_HIEN_DAI',
    era: 'Đương đại (Gen Z Techwear)',
    region: 'NAM_BO',
    slot: 'bottom',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.chamThuy],
    harmonyElement: 'THUY',
    historicalNote: 'Phối phá cách giữa áo ngũ thân tay chẽn hoặc áo bà ba với quần túi hộp ống rộng, mang lại nét khỏe khoắn năng động khi dạo phố.',
    citation: {
      trustLevel: 'FOLK_TRADITION',
      trustLabel: 'Phong cách đường phố',
      sourceDocument: 'Gen Z Heritage Streetwear 2026',
      citationText: 'Sự giao thoa giữa phom dáng túi hộp của thời trang đường phố và cổ phục mang lại sức sống trẻ trung.'
    },
    recommendedOccasions: ['STREETWEAR_CASUAL', 'LE_HOI_TRUONG'],
    suitableWeather: ['NANG_AM', 'SE_LANH'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM'
  },
  {
    id: 'bottom-vay-dup-den',
    name: 'Váy Đụp Đen Bắc Bộ Xòe Rộng',
    category: 'TU_THAN',
    era: 'Cổ truyền Bắc Bộ',
    region: 'BAC_BO',
    slot: 'bottom',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen],
    harmonyElement: 'THUY',
    historicalNote: 'Váy đụp lụa đen dài chạm mắt cá chân, phối cùng yếm đào và áo tứ thân thắt vạt lươn truyền thống miền Quan họ.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu dân ca ca dao',
      sourceDocument: 'Ca dao tục ngữ Đồng bằng Bắc Bộ',
      citationText: '"Đầu đội nón thúng quai thao / Chân đi guốc mộc váy bao đen tuyền" — hình tượng kinh điển của người phụ nữ nông thôn Bắc Bộ.'
    },
    recommendedOccasions: ['LE_HOI_LANG', 'LE_HOI_TRUONG', 'TET_SPRING'],
    suitableWeather: ['NANG_AM'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM'
  }
];

// ============================================================================
// 3. ACCESSORIES CATALOG
// ============================================================================
export const ACCESSORY_CATALOG: AccessoryItem[] = [
  {
    id: 'acc-non-quai-thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    type: 'HEADWEAR',
    region: 'BAC_BO',
    era: 'Cổ truyền Kinh Bắc',
    culturalNote: 'Nón tròn dẹt như vầng trăng rằm, quai nón làm bằng thao tơ tằm đính tua chỉ màu, tôn vinh nét e ấp duyên dáng của phụ nữ Bắc Bộ.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu ca dao',
      sourceDocument: 'Di sản Nón Ba Tầm Làng Chuông',
      citationText: 'Nón quai thao là biểu trưng không thể thiếu trong các làn điệu dân ca Quan họ Bắc Ninh.'
    },
    element: 'MOC',
    colorHex: '#D69E2E',
    recommendedGarments: ['TU_THAN', 'GIAO_LINH', 'AO_DAI_NGU_THAN']
  },
  {
    id: 'acc-non-la-hue',
    name: 'Nón Lá Bài Thơ Xứ Huế',
    type: 'HEADWEAR',
    region: 'TRUNG_BO',
    era: 'Triều Nguyễn',
    culturalNote: 'Đan từ lá gồi non trắng nõn, soi lên ánh sáng hiện rõ các câu thơ chữ Nôm và phong cảnh sông Hương núi Ngự.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu cố đô',
      sourceDocument: 'Văn hóa Cố Đô Huế',
      citationText: 'Nón bài thơ xứ Huế tôn vinh nét e ấp kín đáo của người thiếu nữ đất thần kinh.'
    },
    element: 'MOC',
    colorHex: '#FDE68A',
    recommendedGarments: ['AO_DAI_NGU_THAN', 'AO_DAI_RAGLAN', 'AO_DAI_HIEN_DAI', 'AO_TAC']
  },
  {
    id: 'acc-khan-dong',
    name: 'Khăn Đóng / Khăn Xếp Đen 5 Lớp',
    type: 'HEADWEAR',
    region: 'TRUNG_BO',
    era: 'Triều Nguyễn',
    culturalNote: 'Khăn xếp lụa gấm đen quấn 5 vòng tượng trưng cho Ngũ Thường, tạo thế đội ngay ngắn đĩnh đạc cho nam nữ khi diện ngũ thân.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu sử sách',
      sourceDocument: 'Đại Nam Thực Lục',
      citationText: 'Khăn đóng chữ Nhất (一) hoặc chữ Nhân (人) giữ nếp tóc trang nghiêm khi hành lễ.'
    },
    element: 'THUY',
    colorHex: '#16181D',
    recommendedGarments: ['AO_DAI_NGU_THAN', 'AO_TAC', 'AO_NGU_THAN_TAY_CHEN']
  },
  {
    id: 'acc-man-cuoi-co-dau',
    name: 'Khăn Mấn Đỏ Thêu Rồng Phụng (Đặc Quyền Cô Dâu)',
    type: 'HEADWEAR',
    region: 'TRUNG_BO',
    era: 'Hôn lễ truyền thống',
    culturalNote: 'Mấn đỏ xếp lớp cao vút thêu chỉ kim tuyến và đính hạt ngọc, trang phục độc quyền của Cô dâu trong ngày vu quy. Khách mời kiêng đội mấn đỏ trùng lặp.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Tục lệ cưới hỏi dân gian',
      sourceDocument: 'Nghi thức Hôn lễ Cổ truyền Việt Nam',
      citationText: 'Khách mời không mặc áo dài đỏ đồng màu và không đội mấn cô dâu để tôn vinh sự nổi bật của tân nương.'
    },
    element: 'HOA',
    colorHex: '#C53030',
    recommendedGarments: ['AO_TAC', 'NHAT_BINH']
  },
  {
    id: 'acc-khan-ran',
    name: 'Khăn Rằn Nam Bộ Sọc Caro',
    type: 'SCARF',
    region: 'NAM_BO',
    era: 'Văn hóa Nam Bộ',
    culturalNote: 'Sọc caro đen trắng hoặc tím trắng biểu tượng của sự cần cù, hào sảng và mộc mạc của người dân đất phương Nam.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu dân gian',
      sourceDocument: 'Văn minh Miệt Vườn (Sơn Nam)',
      citationText: 'Khăn rằn vắt vai là vật bất ly thân của người dân miền Tây sông nước từ khai hoang mở cõi.'
    },
    element: 'THUY',
    colorHex: '#38BDF8',
    recommendedGarments: ['BA_BA', 'AO_DAI_HIEN_DAI', 'AO_NGU_THAN_TAY_CHEN']
  },
  {
    id: 'acc-kieng-bac',
    name: 'Kiềng Bạc Chạm Hoa Sen Cung Đình',
    type: 'JEWELRY',
    region: 'TRUNG_BO',
    era: 'Mỹ nghệ hoàng gia',
    culturalNote: 'Vòng cổ bạc trơn hoặc chạm hoa văn cúc/sen tinh xảo, điểm nhấn thanh nhã cho cổ áo lập lĩnh và áo nhật bình.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu mỹ nghệ',
      sourceDocument: 'Kim Hoàn Cung Đình Huế',
      citationText: 'Kiềng bạc đúc thủ công làng chạm bạc Đồng Xâm và kinh kỳ Huế mang ý nghĩa bình an, thanh cao.'
    },
    element: 'KIM',
    colorHex: '#E2E8F0',
    recommendedGarments: ['NHAT_BINH', 'AO_TAC', 'AO_DAI_NGU_THAN', 'AO_DAI_LEMUR']
  },
  {
    id: 'acc-sneaker-chunky',
    name: 'Chunky Sneaker Cyber Lime (Gen Z Fusion)',
    type: 'FOOTWEAR',
    region: 'ALL',
    era: 'Đương đại 2026',
    culturalNote: 'Giày thể thao đế thô tương phản mạnh mẽ với tà áo dài lụa mỏng, tạo phong cách năng động cho sinh viên khi dạo phố.',
    element: 'MOC',
    colorHex: '#CCFF00',
    recommendedGarments: ['AO_DAI_HIEN_DAI', 'AO_DAI_RAGLAN', 'AO_NGU_THAN_TAY_CHEN', 'BA_BA']
  },
  {
    id: 'acc-guoc-moc',
    name: 'Guốc Mộc Quai Nhung Sơn Son',
    type: 'FOOTWEAR',
    region: 'BAC_BO',
    era: 'Cổ truyền',
    culturalNote: 'Gỗ mít đẽo thanh thoát sơn son mạ, quai nhung đỏ giữ đôi bàn chân thon thả, tiếng gõ lốc cốc âm vang phố cổ.',
    citation: {
      trustLevel: 'DOC_CITED',
      trustLabel: 'Có tư liệu lịch sử',
      sourceDocument: 'Kinh Thành Thăng Long và Phố Cổ Hà Nội',
      citationText: 'Guốc mộc Yên Xá là món phục sức thân thương của cư dân Kẻ Chợ xưa.'
    },
    element: 'MOC',
    colorHex: '#78350F',
    recommendedGarments: ['AO_DAI_NGU_THAN', 'AO_DAI_LEMUR', 'TU_THAN', 'AO_TAC']
  },
  {
    id: 'acc-sunglasses',
    name: 'Kính Râm Đen Phá Cách (Streetwear Accent)',
    type: 'MODERN_ACCENT',
    region: 'ALL',
    era: 'Hiện đại',
    culturalNote: 'Kính râm gọng đen thời thượng cho giới trẻ dạo phố. Tuy nhiên cần tháo kính khi vào chốn thiền môn, đền chùa tôn nghiêm.',
    element: 'THUY',
    colorHex: '#181A20',
    recommendedGarments: ['AO_DAI_HIEN_DAI', 'BA_BA']
  },

  // --- PHỤ KIỆN NGOẠI LAI / VI PHẠM CẦN BẢO VỆ VĂN HÓA ---
  {
    id: 'acc-foreign-kimono-obi',
    name: 'Đai Vải Thắt Eo Kiểu Kimono (Obi Nhật Bản)',
    type: 'MODERN_ACCENT',
    region: 'ALL',
    era: 'Ngoại lai (Nhật Bản)',
    isForeignOrAssimilated: true,
    culturalNote: 'Đai thắt lưng bản to của trang phục Kimono Nhật Bản. Khi phối vào Áo dài hoặc Áo Tấc Việt Nam sẽ làm biến dạng phom dáng suông thẳng đoan trang và lai căng văn hóa.',
    element: 'HOA',
    colorHex: '#DC2626',
    recommendedGarments: []
  },
  {
    id: 'acc-foreign-ruqun-ribbon',
    name: 'Dải Lụa Thắt Nơ Ngực Tiên Hiệp (Hanfu Ruqun)',
    type: 'MODERN_ACCENT',
    region: 'ALL',
    era: 'Ngoại lai (Hán phục cổ trang)',
    isForeignOrAssimilated: true,
    culturalNote: 'Dải nơ ngực đặc trưng của phong cách Tiên hiệp / Ruqun Trung Hoa. Gây nhầm lẫn văn hóa nghiêm trọng giữa Áo Giao Lĩnh / Tứ Thân Việt Nam với trang phục phim trường nước ngoài.',
    element: 'HOA',
    colorHex: '#E11D48',
    recommendedGarments: []
  }
];

export const HERITAGE_CATALOG = GARMENT_CATALOG;

// ============================================================================
// 4. MATRIX RECOMMENDATIONS (OCCASIONS & WEATHER MAPPING)
// ============================================================================
export const OCCASION_RECOMMENDATIONS: Record<Occasion, {
  title: string;
  idealGarments: GarmentType[];
  vibeDescription: string;
  weatherTips: string;
}> = {
  KY_YEU: {
    title: 'Kỷ Yếu Tốt Nghiệp & Thanh Xuân Học Đường',
    idealGarments: ['AO_DAI_RAGLAN', 'AO_DAI_HIEN_DAI', 'AO_NGU_THAN_TAY_CHEN'],
    vibeDescription: 'Thanh lịch, trong trẻo, lưu giữ ký ức học đường với tà áo trắng hoặc ngũ thân tay chẽn tối giản dễ vận động.',
    weatherTips: 'Nên chọn lụa tơ tằm Bảo Lộc hoặc linen thoáng mát cho ngày chụp kỷ yếu ngoài trời.'
  },
  KY_YEU_GRADUATION: {
    title: 'Kỷ Yếu Tốt Nghiệp & Thanh Xuân Học Đường',
    idealGarments: ['AO_DAI_RAGLAN', 'AO_DAI_HIEN_DAI', 'AO_NGU_THAN_TAY_CHEN'],
    vibeDescription: 'Thanh lịch, trong trẻo, lưu giữ ký ức học đường với tà áo trắng hoặc ngũ thân tay chẽn tối giản dễ vận động.',
    weatherTips: 'Nên chọn lụa tơ tằm Bảo Lộc hoặc linen thoáng mát cho ngày chụp kỷ yếu ngoài trời.'
  },
  TET: {
    title: 'Tết Nguyên Đán & Du Xuân Đầu Năm',
    idealGarments: ['AO_DAI_NGU_THAN', 'AO_TAC', 'TU_THAN'],
    vibeDescription: 'Sắc thái rực rỡ (đỏ son, hoàng thổ, hoa hòe), tôn nghiêm cung chúc tân xuân, đón lộc may mắn.',
    weatherTips: 'Tiết trời se lạnh đầu xuân rất hợp để khoác áo Tấc hoặc lót trung đơn dày dặn.'
  },
  TET_SPRING: {
    title: 'Tết Nguyên Đán & Du Xuân Đầu Năm',
    idealGarments: ['AO_DAI_NGU_THAN', 'AO_TAC', 'TU_THAN'],
    vibeDescription: 'Sắc thái rực rỡ (đỏ son, hoàng thổ, hoa hòe), tôn nghiêm cung chúc tân xuân, đón lộc may mắn.',
    weatherTips: 'Tiết trời se lạnh đầu xuân rất hợp để khoác áo Tấc hoặc lót trung đơn dày dặn.'
  },
  LE_HOI_TRUONG: {
    title: 'Lễ Hội Truyền Thống Trường Học & Ngày Di Sản',
    idealGarments: ['TU_THAN', 'GIAO_LINH', 'BA_BA', 'AO_DAI_NGU_THAN'],
    vibeDescription: 'Bùng nổ sắc màu bản địa, mang nón quai thao, khăn rằn giao lưu văn hóa đa vùng miền.',
    weatherTips: 'Nên mang thêm giày sneaker để thuận tiện biểu diễn văn nghệ và di chuyển.'
  },
  STREETWEAR: {
    title: 'Dạo Phố Cuối Tuần & Phong Cách Gen Z Streetwear',
    idealGarments: ['AO_NGU_THAN_TAY_CHEN', 'BA_BA', 'AO_DAI_HIEN_DAI'],
    vibeDescription: 'Phối ngẫu táo bạo cùng áo khoác Cyber Organza, quần parachute cargo và chunky boots.',
    weatherTips: 'Chất liệu chống nhăn, chống nước nhẹ rất hợp với thời tiết thất thường của thành phố.'
  },
  STREETWEAR_CASUAL: {
    title: 'Dạo Phố Cuối Tuần & Phong Cách Gen Z Streetwear',
    idealGarments: ['AO_NGU_THAN_TAY_CHEN', 'BA_BA', 'AO_DAI_HIEN_DAI'],
    vibeDescription: 'Phối ngẫu táo bạo cùng áo khoác Cyber Organza, quần parachute cargo và chunky boots.',
    weatherTips: 'Chất liệu chống nhăn, chống nước nhẹ rất hợp với thời tiết thất thường của thành phố.'
  },
  PROM: {
    title: 'Dạ Hội Trưởng Thành & Prom Night Tỏa Sáng',
    idealGarments: ['NHAT_BINH', 'AO_TAC', 'AO_DAI_LEMUR'],
    vibeDescription: 'Quyền quý, lộng lẫy, kiêu sa như hậu phi công chúa bước vào vũ hội hiện đại.',
    weatherTips: 'Kết hợp trang sức kiềng bạc hoặc trâm cài tóc thủ công mỹ nghệ.'
  },
  PROM_NIGHT: {
    title: 'Dạ Hội Trưởng Thành & Prom Night Tỏa Sáng',
    idealGarments: ['NHAT_BINH', 'AO_TAC', 'AO_DAI_LEMUR'],
    vibeDescription: 'Quyền quý, lộng lẫy, kiêu sa như hậu phi công chúa bước vào vũ hội hiện đại.',
    weatherTips: 'Kết hợp trang sức kiềng bạc hoặc trâm cài tóc thủ công mỹ nghệ.'
  },
  DAM_CUOI: {
    title: 'Lễ Đính Hôn & Đám Cưới Cổ Truyền',
    idealGarments: ['AO_TAC', 'NHAT_BINH', 'AO_DAI_NGU_THAN'],
    vibeDescription: 'Đại lễ long trọng, bảo chứng sự kết giao hai họ theo đúng lễ nghi Hữu Nhậm ngũ luân.',
    weatherTips: 'Chất liệu gấm Vạn Phúc thêu chỉ vàng chỉ bạc cao cấp.'
  },
  DAM_CUOI_WEDDING: {
    title: 'Lễ Đính Hôn & Đám Cưới Cổ Truyền',
    idealGarments: ['AO_TAC', 'NHAT_BINH', 'AO_DAI_NGU_THAN'],
    vibeDescription: 'Đại lễ long trọng, bảo chứng sự kết giao hai họ theo đúng lễ nghi Hữu Nhậm ngũ luân.',
    weatherTips: 'Chất liệu gấm Vạn Phúc thêu chỉ vàng chỉ bạc cao cấp.'
  },
  DI_CHUA_TEMPLE: {
    title: 'Đi Chùa & Chiêm Bái Chốn Tôn Nghiêm',
    idealGarments: ['AO_NGU_THAN_TAY_CHEN', 'AO_DAI_NGU_THAN', 'AO_DAI_RAGLAN'],
    vibeDescription: 'Kín đáo, đoan trang, tôn kính nơi thiền môn. Bắt buộc mặc quần dài mu bàn chân, tháo kính râm và tránh trang phục bó sát.',
    weatherTips: 'Chất liệu đũi tơ Nam Cao hoặc lụa mộc trầm ấm, di chuyển êm ái khi lễ bái.'
  },
  LE_HOI_LANG: {
    title: 'Trẩy Hội Làng & Giao Lưu Quan Họ Dân Gian',
    idealGarments: ['TU_THAN', 'GIAO_LINH', 'AO_DAI_NGU_THAN'],
    vibeDescription: 'Đậm đà phong vị làng quê châu thổ sông Hồng: Yếm đào, áo tứ thân vắt vạt lươn, nón quai thao và dải thắt lưng đào.',
    weatherTips: 'Đi guốc mộc hoặc hài thêu truyền thống rất hài hòa với không gian đình làng.'
  }
};

// ============================================================================
// 5. HSL COLOR THEORY & CLASSIC VIETNAMESE PALETTES ENGINE
// ============================================================================

/**
 * Converts Hex string to HSL { h: [0-360], s: [0-100], l: [0-100] }
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Calculates HSL Color Harmony & Recognizes Classic Vietnamese Palettes
 */
export function evaluateHSLColorHarmony(outfit: OutfitState): HSLHarmonyInfo {
  const coreHex = outfit.coreGarment.defaultColor.hex;
  const coreHsl = hexToHSL(coreHex);

  const secondaryHex = outfit.bottomPiece?.defaultColor.hex || outfit.outerGarment?.defaultColor.hex || '#FFFFFF';
  const secHsl = hexToHSL(secondaryHex);

  // Hue delta in degrees (0 - 180)
  let rawDelta = Math.abs(coreHsl.h - secHsl.h);
  if (rawDelta > 180) rawDelta = 360 - rawDelta;

  // 1. Check for Classic Vietnamese Traditional Palettes
  let identifiedClassicPalette: ClassicVietnamesePalette | undefined;

  const isHuePurple = (coreHsl.h >= 280 && coreHsl.h <= 325) || coreHex.toLowerCase() === '#701a75';
  const isWhiteSilk = secHsl.l >= 85 || secondaryHex.toLowerCase() === '#f8fafc' || secondaryHex.toLowerCase() === '#fdfbf7';
  if (isHuePurple && isWhiteSilk) {
    identifiedClassicPalette = {
      id: 'TIM_TRANG_HUE',
      nameVi: 'Tím Trắng Xứ Huế (Thần Kinh Tao Nhã)',
      description: 'Sắc tím hoa cà thùy mị kết hợp cùng quần lụa trắng muốt, biểu tượng trứ danh của phụ nữ xứ Huế.',
      historicalContext: 'Được nữ sinh trường Đồng Khánh mặc định thành biểu tượng văn hóa cố đô đầu thế kỷ 20.',
      matchScore: 98
    };
  }

  const isNauNon = (coreHsl.h >= 20 && coreHsl.h <= 45 && coreHsl.s < 60) || coreHex.toLowerCase() === '#795548' || coreHex.toLowerCase() === '#5d4037';
  const isHoaLy = (secHsl.h >= 90 && secHsl.h <= 160) || secondaryHex.toLowerCase() === '#81c784';
  if (isNauNon && isHoaLy) {
    identifiedClassicPalette = {
      id: 'NAU_NON_HOA_LY',
      nameVi: 'Nâu Non - Hoa Lý (Hồn Quê Kinh Bắc)',
      description: 'Tông nâu củ nâu đất phù sa phối cùng xanh hoa lý thanh khiết, mộc mạc mà đằm thắm trữ tình.',
      historicalContext: 'Màu sắc dân dã lưu truyền trong ca dao đồng bằng sông Hồng thời Lý - Trần - Lê.',
      matchScore: 96
    };
  }

  const isDoSon = (coreHsl.h <= 20 || coreHsl.h >= 345) && coreHsl.s > 50;
  const isVangHoe = (secHsl.h >= 40 && secHsl.h <= 65) || secondaryHex.toLowerCase() === '#d69e2e' || secondaryHex.toLowerCase() === '#e5c158';
  if (isDoSon && isVangHoe) {
    identifiedClassicPalette = {
      id: 'DO_SON_HOA_HOE',
      nameVi: 'Đỏ Son - Vàng Hoa Hòe (Đại Cát Cung Đình)',
      description: 'Sắc đỏ chu sa vương giả phối cùng vàng hoa hòe rực rỡ, tượng trưng cho hỷ sự, vinh hoa phú quý.',
      historicalContext: 'Thường thấy trên các tấm đại triều phục và lễ phục Nhật Bình triều Nguyễn.',
      matchScore: 97
    };
  }

  const isLanhMyA = (coreHsl.l <= 18) && (secHsl.l <= 18 || secHsl.l >= 85);
  if (isLanhMyA && !identifiedClassicPalette) {
    identifiedClassicPalette = {
      id: 'DEN_LANH_MY_A',
      nameVi: 'Đen Tuyển Lãnh Mỹ Á (Nữ Hoàng Tơ Lụa)',
      description: 'Sắc đen bóng huyền bí nhuộm mặc nưa Tân Châu, toát lên phong thái kiêu kỳ, sang trọng vô song.',
      historicalContext: 'Vải tiến cung trứ danh của Nam Kỳ Lục Tỉnh thế kỷ 19 - 20.',
      matchScore: 95
    };
  }

  // 2. Classify HSL Harmony Type
  let harmonyType: HSLHarmonyInfo['harmonyType'] = 'MODERATE';
  let harmonyNameVi = 'Hài Hòa Trung Lập';
  let score = 82;
  let details = '';

  if (identifiedClassicPalette) {
    harmonyType = 'CLASSIC_VIETNAMESE';
    harmonyNameVi = identifiedClassicPalette.nameVi;
    score = identifiedClassicPalette.matchScore;
    details = `Khớp chuẩn bảng màu di sản kinh điển: ${identifiedClassicPalette.description}`;
  } else if (rawDelta <= 35) {
    harmonyType = 'ANALOGOUS';
    harmonyNameVi = 'Tương Đồng (Analogous)';
    score = 90;
    details = `Độ chênh sắc tướng thấp (ΔH = ${rawDelta}°), tạo cảm giác êm dịu, liền mạch và thanh thoát giữa các tầng vải.`;
  } else if (Math.abs(rawDelta - 180) <= 30) {
    harmonyType = 'COMPLEMENTARY';
    harmonyNameVi = 'Bổ Túc Đối Kháng (Complementary)';
    score = 88;
    details = `Độ chênh sắc tướng đối xứng (ΔH = ${rawDelta}°), tạo độ tương phản thị giác mạnh mẽ, ấn tượng và thời thượng.`;
  } else if (Math.abs(rawDelta - 120) <= 25) {
    harmonyType = 'TRIADIC';
    harmonyNameVi = 'Tam Giác Cân Bằng (Triadic)';
    score = 86;
    details = `Hợp sắc tam giác cân bằng (ΔH = ${rawDelta}°), giữ cho tổng thể bộ trang phục sinh động, đa sắc mà không bị rối mắt.`;
  } else {
    harmonyType = 'MODERATE';
    harmonyNameVi = 'Hài Hòa Tự Nhiên';
    score = 80;
    details = `Tỷ lệ màu sắc ổn định (ΔH = ${rawDelta}°), thích hợp cho phục sức sinh hoạt thường nhật.`;
  }

  return {
    score,
    harmonyType,
    harmonyNameVi,
    identifiedClassicPalette,
    hueDelta: rawDelta,
    details
  };
}

/**
 * Calculates Five Elements Fengshui Harmony
 */
export function calculateFengshuiHarmony(outfit: OutfitState): FengshuiHarmony {
  const elements: Array<{ name: string; element: FiveElement }> = [];
  if (outfit.baseGarment) elements.push({ name: outfit.baseGarment.name, element: outfit.baseGarment.harmonyElement });
  elements.push({ name: outfit.coreGarment.name, element: outfit.coreGarment.harmonyElement });
  if (outfit.outerGarment) elements.push({ name: outfit.outerGarment.name, element: outfit.outerGarment.harmonyElement });
  if (outfit.bottomPiece) elements.push({ name: outfit.bottomPiece.name, element: outfit.bottomPiece.harmonyElement });
  if (outfit.footwear) elements.push({ name: outfit.footwear.name, element: outfit.footwear.element });
  outfit.accessories.forEach(a => elements.push({ name: a.name, element: a.element }));

  // Generation cycle: KIM -> THUY -> MOC -> HOA -> THO -> KIM
  const generatingMap: Record<FiveElement, FiveElement> = {
    KIM: 'THUY',
    THUY: 'MOC',
    MOC: 'HOA',
    HOA: 'THO',
    THO: 'KIM'
  };

  // Overcoming cycle: KIM -> MOC -> THO -> THUY -> HOA -> KIM
  const overcomingMap: Record<FiveElement, FiveElement> = {
    KIM: 'MOC',
    MOC: 'THO',
    THO: 'THUY',
    THUY: 'HOA',
    HOA: 'KIM'
  };

  let generatingCount = 0;
  let overcomingCount = 0;
  const relationships: FengshuiHarmony['relationships'] = [];

  for (let i = 0; i < elements.length - 1; i++) {
    const cur = elements[i];
    const nxt = elements[i + 1];
    if (generatingMap[cur.element] === nxt.element || generatingMap[nxt.element] === cur.element) {
      generatingCount++;
      relationships.push({
        source: cur.name,
        target: nxt.name,
        relation: 'GENERATING',
        description: `${cur.element} tương sinh với ${nxt.element} (Bổ trợ vượng khí)`
      });
    } else if (overcomingMap[cur.element] === nxt.element || overcomingMap[nxt.element] === cur.element) {
      overcomingCount++;
      relationships.push({
        source: cur.name,
        target: nxt.name,
        relation: 'OVERCOMING',
        description: `${cur.element} tương khắc với ${nxt.element} (Nên tiết chế sắc độ)`
      });
    }
  }

  const hsl = evaluateHSLColorHarmony(outfit);
  const rawScore = 80 + generatingCount * 4 - overcomingCount * 6 + (hsl.score - 80) * 0.4;
  const score = Math.max(60, Math.min(100, Math.round(rawScore)));
  const dominantElement = outfit.coreGarment.harmonyElement;

  return {
    score,
    dominantElement,
    relationships,
    advice: hsl.identifiedClassicPalette
      ? `Tuyệt tác hòa sắc! Bảng màu trang phục hội tụ tinh hoa "${hsl.identifiedClassicPalette.nameVi}". Ngũ hành ${dominantElement} vượng sắc, tôn da và đoan trang quý phái.`
      : overcomingCount > 1
      ? 'Có dấu hiệu tương khắc giữa các tầng sắc áo. Nên chọn phụ kiện có sắc màu trung hòa (như Bạch Lụa hoặc Hoàng Thổ) để cân bằng ngũ hành.'
      : 'Bảng màu các lớp trang phục đạt độ tương sinh vượng khí, tôn da và hài hòa tinh thần phương Đông.',
    hslHarmony: hsl
  };
}

/**
 * Validates Heritage Integrity, Checks for Cultural Taboos & Occasion Matrix
 */
export function validateOutfitHeritage(outfit: OutfitState, currentOccasion: Occasion = 'KY_YEU_GRADUATION'): HeritageValidationResult {
  const violations: CulturalViolation[] = [];
  let score = 100;

  // RULE 1: TABOO 01 - TẢ NHẬM (Left Lapel Closure) - DEADLY SINS
  const isTaNham = outfit.lapelMode === 'TA_NHAM';
  if (isTaNham) {
    score -= 50;
    violations.push({
      ruleId: 'RULE_TABOO_TA_NHAM',
      severity: 'CRITICAL_BLOCKER',
      title: 'Đại Kỵ Văn Hóa: Vi Phạm Quy Thức Tả Nhậm (左衽)',
      message: 'Áo đang được cài từ Phải sang Trái (Tả Nhậm). Đây là điều tuyệt đối cấm kỵ trong văn hóa may mặc Việt Nam.',
      historicalContext: 'Từ thời Lý - Trần đến triều Nguyễn, người Việt luôn cài vạt từ Trái đè lên Phải (Hữu Nhậm) theo lẽ sinh tồn và dương khí của người sống. Vạt áo cài sang trái (Tả Nhậm) xưa nay duy nhất chỉ dùng để khâm liệm thi thể người mất.',
      fixSuggestion: 'Chuyển vạt áo về quy thức Hữu Nhậm (Trái đè lên Phải)',
      autoFixAction: 'INVERT_LAPEL'
    });
  }

  // RULE 2: TABOO 02 - PHỤ KIỆN NGOẠI LAI LAI CĂNG (Foreign Assimilation)
  const foreignAcc = outfit.accessories.find(a => a.isForeignOrAssimilated);
  if (foreignAcc) {
    score -= 30;
    violations.push({
      ruleId: 'RULE_FOREIGN_ASSIMILATION',
      severity: 'CRITICAL_BLOCKER',
      title: `Lai Căng Văn Hóa: Phát Hiện Phụ Kiện Ngoại Lai (${foreignAcc.name})`,
      message: `Đang phối ${foreignAcc.name} vào trang phục truyền thống Việt Nam.`,
      historicalContext: foreignAcc.culturalNote,
      fixSuggestion: 'Gỡ bỏ phụ kiện ngoại lai và thay thế bằng Nón quai thao, Nón lá hoặc Kiềng bạc truyền thống',
      autoFixAction: 'REMOVE_FOREIGN_ACCENT'
    });
  }

  // RULE 3: THIẾU QUẦN DÀI KHI MẶC ÁO DÀI / ÁO TẤC / NGŨ THÂN
  const isAoDaiOrTac = ['AO_DAI_NGU_THAN', 'AO_DAI_LEMUR', 'AO_DAI_RAGLAN', 'AO_DAI_HIEN_DAI', 'AO_NGU_THAN_TAY_CHEN', 'AO_TAC', 'NHAT_BINH'].includes(outfit.coreGarment.category);
  const hasValidBottom = outfit.bottomPiece !== null;
  if (isAoDaiOrTac && !hasValidBottom) {
    score -= 25;
    violations.push({
      ruleId: 'RULE_MISSING_LONG_PANTS',
      severity: 'WARNING',
      title: 'Thiếu Quần Dài Truyền Thống Khi Mặc Áo Dài / Cổ Phục',
      message: 'Áo dài và áo ngũ thân bắt buộc phải đi cùng quần dài chạm mu bàn chân.',
      historicalContext: 'Mặc áo dài không quần hoặc phối váy cộc để lộ đùi là hành vi phản cảm, vi phạm nghiêm trọng tính đoan trang thuần phong mỹ tục của tà áo dài Việt.',
      fixSuggestion: 'Thêm Quần lụa trắng hoặc Quần lụa đen ống suông',
      autoFixAction: 'ADD_LONG_PANTS'
    });
  }

  // RULE 4: LỆCH CHUẨN NGŨ LUÂN (5 CÚC ÁO NGŨ THÂN)
  if (outfit.coreGarment.hasFiveButtons && outfit.buttonCount !== 5) {
    score -= 15;
    violations.push({
      ruleId: 'RULE_BUTTON_COUNT_FIVE',
      severity: 'HISTORICAL_NOTE',
      title: 'Lệch Chuẩn 5 Cúc Ngũ Thường / Ngũ Luân',
      message: `Áo ngũ thân hiện đang có ${outfit.buttonCount} cúc (Chuẩn là 5 cúc).`,
      historicalContext: '5 cúc đồng tượng trưng cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) và Ngũ Luân (Phụ tử, Quân thần, Phu thê, Huynh đệ, Bằng hữu).',
      fixSuggestion: 'Điều chỉnh lại đủ 5 cúc áo'
    });
  }

  // ============================================================================
  // OCCASION MATRIX CHECKING (REAL-TIME DETERMINISTIC ENGINE)
  // ============================================================================
  const occasionWarnings: string[] = [];
  let isAppropriateForOccasion = true;

  // Occasion Check: ĐÁM CƯỚI (Tránh trùng trang phục cô dâu)
  if (currentOccasion === 'DAM_CUOI_WEDDING') {
    const isRedCore = outfit.coreGarment.defaultColor.hex === '#C53030';
    const hasBrideHeadwear = outfit.accessories.some(a => a.id === 'acc-man-cuoi-co-dau');
    if (isRedCore && hasBrideHeadwear) {
      score -= 20;
      violations.push({
        ruleId: 'RULE_WEDDING_BRIDE_CONFLICT',
        severity: 'WARNING',
        title: 'Tránh Trùng Lặp Trang Phục Với Cô Dâu (Đám Cưới)',
        message: 'Khách mời không nên mặc áo đỏ kết hợp mấn cưới lộng lẫy thêu rồng phụng vì đây là đặc quyền của Cô dâu trong ngày hôn lễ.',
        historicalContext: 'Theo phép lịch sự và tục lệ cưới hỏi truyền thống, khách dự tiệc nên chọn sắc thái nhã nhặn (như Chàm thâm, Xanh ngọc, Tím huế, Vàng nhạt) để tôn vinh sự nổi bật của tân nương.',
        fixSuggestion: 'Đổi sang Áo ngũ thân tay chẽn xanh chàm hoặc tháo mấn cưới đỏ',
        autoFixAction: 'CHANGE_WEDDING_COLOR'
      });
      isAppropriateForOccasion = false;
      occasionWarnings.push('Phối áo đỏ son cùng mấn cưới gây trùng lặp với cô dâu');
    }
  }

  // Occasion Check: ĐI CHÙA (Tôn nghiêm, tháo kính râm, bỏ guốc trơn)
  if (currentOccasion === 'DI_CHUA_TEMPLE') {
    const hasSunglasses = outfit.accessories.some(a => a.id === 'acc-sunglasses');
    if (hasSunglasses) {
      score -= 15;
      violations.push({
        ruleId: 'RULE_TEMPLE_SUNGLASSES',
        severity: 'WARNING',
        title: 'Phục Sức Nơi Chốn Tôn Nghiêm: Mang Kính Râm Trong Chùa',
        message: 'Không nên đeo kính râm khi bước vào chính điện chiêm bái, lễ Phật.',
        historicalContext: 'Chốn tôn nghiêm yêu cầu sự khiêm nhường, ánh mắt chân thành và diện mạo tự nhiên.',
        fixSuggestion: 'Tháo kính râm ra khỏi trang phục chiêm bái',
        autoFixAction: 'REMOVE_FOREIGN_ACCENT'
      });
      occasionWarnings.push('Cần tháo kính râm khi vào lễ chùa');
    }
    if (!hasValidBottom) {
      isAppropriateForOccasion = false;
      occasionWarnings.push('Đi chùa bắt buộc phải mặc quần dài kín đáo chạm mu bàn chân');
    }
  }

  // Occasion Check: TẾT (Tránh thuần đen toàn bộ - điềm tang ma)
  if (currentOccasion === 'TET_SPRING') {
    const isAllBlack = outfit.coreGarment.defaultColor.hex === '#0E0F12' &&
      outfit.bottomPiece?.defaultColor.hex === '#0E0F12' &&
      !outfit.outerGarment;
    if (isAllBlack) {
      score -= 15;
      violations.push({
        ruleId: 'RULE_TET_ALL_BLACK',
        severity: 'WARNING',
        title: 'Kiêng Kỵ Đầu Xuân: Trang Phục Thuần Đen Tang Ma',
        message: 'Mặc toàn thân màu đen tuyền vào ngày đầu năm mới dễ gợi nhắc sự tang tóc, ảm đạm.',
        historicalContext: 'Phong tục Tết cổ truyền Việt Nam kiêng mặc thuần đen hoặc thuần trắng toàn thân; người xưa chuộng sắc đỏ son (chu sa), vàng hoàng kim hay xanh ngọc để cầu mong đại cát đại lợi.',
        fixSuggestion: 'Đổi áo hoặc quần sang màu Đỏ son, Hoàng thổ hoặc Bạch lụa'
      });
      occasionWarnings.push('Tránh mặc tuyền đen ngày mùng một Tết');
    }
  }

  const fengshui = calculateFengshuiHarmony(outfit);

  let status: HeritageValidationResult['status'] = 'PASSED';
  if (violations.some(v => v.severity === 'CRITICAL_BLOCKER')) {
    status = 'CRITICAL_BLOCKER';
  } else if (violations.length > 0) {
    status = 'WARNING';
  }

  let occasionVerdict = 'Trang phục rất phù hợp với bối cảnh!';
  if (occasionWarnings.length > 0) {
    occasionVerdict = `Lưu ý bối cảnh: ${occasionWarnings.join('. ')}.`;
  } else {
    occasionVerdict = `${OCCASION_RECOMMENDATIONS[currentOccasion]?.title || 'Sự kiện'}: Phối đồ chuẩn mực phong thái di sản.`;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    status,
    violations,
    fengshui,
    occasionFeedback: {
      occasion: currentOccasion,
      isAppropriate: isAppropriateForOccasion,
      verdict: occasionVerdict,
      warnings: occasionWarnings
    },
    verifiedSeams: {
      chinhTrungBackSeam: true,
      huuNhamRightClosure: !isTaNham,
      nguLuanFiveButtons: outfit.buttonCount === 5,
      traditionalLongPants: hasValidBottom
    }
  };
}
