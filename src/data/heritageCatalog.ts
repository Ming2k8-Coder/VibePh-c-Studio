/**
 * VibePhục Studio — Knowledge Base & Cultural Guardrail Engine
 * Peer-reviewed catalog of authentic Vietnamese heritage garments & guardrails
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
  FengshuiHarmony
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
  cyberJade: { name: 'Cyber Jade Ngọc Bích', hex: '#00F5D4', element: 'THUY' as FiveElement, symbolicMeaning: 'Hơi thở công nghệ số hòa quyện ngọc cổ xưa' }
};

// ============================================================================
// 2. GARMENT CATALOG (CORE, BASE, OUTER, BOTTOM)
// ============================================================================
export const GARMENT_CATALOG: GarmentItem[] = [
  // ---------------- CORE GARMENTS ----------------
  {
    id: 'core-ao-dai-ngu-than',
    name: 'Áo Dài Ngũ Thân Lập Lĩnh',
    category: 'AO_DAI_NGU_THAN',
    era: 'Triều Nguyễn (TK 18 - 19)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.chamThuy,
    allowableColors: [HERITAGE_COLORS.chamThuy, HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.hoangTho, HERITAGE_COLORS.denHuyen],
    harmonyElement: 'THUY',
    historicalNote: '5 thân vải tượng trưng Tứ Thân Phụ Mẫu bao bọc lấy bản thân. Cổ đứng lập lĩnh cao 2-3cm ôm khít cổ, cài khuy bên phải theo đúng quy tắc Hữu Nhậm.',
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'LE_HOI_TRUONG', 'DAM_CUOI_WEDDING'],
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
    historicalNote: 'Họa sĩ Cát Tường cách tân từ ngũ thân với cổ bẻ lá sen, vai bồng duyên dáng, viền ren kiểu Tây phương, tà áo thướt tha chạm đất mở ra kỷ nguyên thời trang hiện đại.',
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
    historicalNote: 'Bước đột phá kỹ thuật ráp tay Raglan nối xéo từ cổ xuống nách giúp triệt tiêu hoàn toàn nếp nhăn vùng nách, cài nút bấm một bên sườn, tôn vinh đường cong học đường.',
    recommendedOccasions: ['KY_YEU_GRADUATION', 'LE_HOI_TRUONG', 'TET_SPRING'],
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
    historicalNote: 'Thiết kế phom suông nhẹ hoặc ôm vừa phải, may bằng chất liệu linen tơ tằm thoáng mát, phù hợp sinh viên học sinh mặc cả ngày trong các sự kiện kỷ yếu và lễ hội.',
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
    era: 'Triều Nguyễn (Năm 1836 Minh Mạng định chế)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.chamThuy, HERITAGE_COLORS.hoangTho],
    harmonyElement: 'THUY',
    historicalNote: 'Ống tay thu nhỏ ôm sát từ khuỷu tay đến cổ tay, tiện dụng trong sinh hoạt thường nhật nhưng vẫn giữ vẹn nguyên phong độ lễ giáo và tính đoan chính của cổ phục.',
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'LE_HOI_TRUONG', 'STREETWEAR_CASUAL'],
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
    historicalNote: 'Lễ phục trang trọng của quan viên và dân chúng khi tế lễ, hôn lễ, yến tiệc. Ống tay rộng 35-50cm thụng vuông góc khi chắp tay chào lễ, tà áo dài quá gối uy nghi.',
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
    era: 'Triều Nguyễn (Lễ phục Hậu phi & Công chúa)',
    region: 'TRUNG_BO',
    slot: 'core',
    defaultColor: HERITAGE_COLORS.sonChuSa,
    allowableColors: [HERITAGE_COLORS.sonChuSa, HERITAGE_COLORS.timHue, HERITAGE_COLORS.hoangTho],
    harmonyElement: 'HOA',
    historicalNote: 'Lễ phục cao quý với cổ áo hình chữ nhật to bản trước ngực, viền dải Ngũ Sắc tượng trưng cho Ngũ Hành ở cửa tay áo. Thắt đai ngọc hoặc dải thao buông rủ kiêu sa.',
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
    allowableColors: [HERITAGE_COLORS.lucTruc, HERITAGE_COLORS.denHuyen, HERITAGE_COLORS.hoangTho],
    harmonyElement: 'MOC',
    historicalNote: 'Bốn vạt vải mộc mạc buông lơi hoặc thắt vạt lươn trước bụng, bên trong phối yếm đào và thắt lưng lụa đào rực rỡ; hồn cốt gắn liền với câu hát Quan họ và hội Lim.',
    recommendedOccasions: ['LE_HOI_TRUONG', 'TET_SPRING', 'KY_YEU_GRADUATION'],
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
    historicalNote: 'Cổ áo vạt bắt chéo nhau hình chữ Y (vạt trái đè lên vạt phải Hữu Nhậm), phom áo thụng rộng trang trọng cổ xưa, tiền thân khai sinh ra hệ thống ngũ thân lập lĩnh.',
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
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'DAM_CUOI_WEDDING'],
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
    recommendedOccasions: ['LE_HOI_TRUONG', 'KY_YEU_GRADUATION', 'TET_SPRING'],
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
    historicalNote: 'Áo khoác bomber xuyên thấu chất liệu vải tơ sa/organza tái chế, cho phép nhìn thấu hàng cúc đồng và sống lưng áo ngũ thân bên trong mà không che mất di sản.',
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
    recommendedOccasions: ['PROM_NIGHT', 'DAM_CUOI_WEDDING'],
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
    historicalNote: 'Quần lụa ống suông rộng chạm mu bàn chân. Theo điển lệ cổ phục Việt Nam, mặc áo dài bắt buộc phải kèm quần dài, tuyệt đối không mặc váy cộc hoặc để lộ đùi.',
    recommendedOccasions: ['KY_YEU_GRADUATION', 'TET_SPRING', 'DAM_CUOI_WEDDING', 'LE_HOI_TRUONG'],
    suitableWeather: ['NANG_AM', 'SE_LANH', 'MUA_RAO'],
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM'
  },
  {
    id: 'bottom-quan-lua-den',
    name: 'Quần Lụa Đen Mỹ Đức',
    category: 'BA_BA',
    era: 'Truyền thống Nam Bộ / Bắc Bộ',
    region: 'NAM_BO',
    slot: 'bottom',
    defaultColor: HERITAGE_COLORS.denHuyen,
    allowableColors: [HERITAGE_COLORS.denHuyen],
    harmonyElement: 'THUY',
    historicalNote: 'Quần lụa đen bóng nhuộm củ nâu hoặc sơn mài, tạo vẻ đằm thắm kín đáo, thường đi liền với áo ngũ thân hoặc áo bà ba Nam Bộ.',
    recommendedOccasions: ['KY_YEU_GRADUATION', 'STREETWEAR_CASUAL', 'TET_SPRING'],
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
    historicalNote: 'Phối phá cách giữa áo ngũ thân tay chẽn hoặc áo bà ba với quần túi hộp ống rộng, mang lại nét khỏe khoắn, năng động cho các bạn trẻ khi đi dạo phố.',
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
    historicalNote: 'Váy đụp lụa đen dài đến bắp chân hoặc gót chân, phối cùng yếm đào và áo tứ thân thắt vạt lươn truyền thống.',
    recommendedOccasions: ['LE_HOI_TRUONG', 'TET_SPRING'],
    suitableWeather: ['NANG_AM'],
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM'
  }
];

// ============================================================================
// 3. ACCESSORIES CATALOG (NÓN, KHĂN, TRANG SỨC, GIÀY & ĐỒ NGOẠI LAI KIỂM DUYỆT)
// ============================================================================
export const ACCESSORY_CATALOG: AccessoryItem[] = [
  // --- CHUẨN MỰC DI SẢN ---
  {
    id: 'acc-non-quai-thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    type: 'HEADWEAR',
    region: 'BAC_BO',
    era: 'Cổ truyền Kinh Bắc',
    culturalNote: 'Nón tròn dẹt như vầng trăng rằm, quai nón làm bằng thao tơ tằm đính tua chỉ màu, tôn vinh nét e ấp duyên dáng của phụ nữ Bắc Bộ.',
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
    element: 'MOC',
    colorHex: '#FDE68A',
    recommendedGarments: ['AO_DAI_NGU_THAN', 'AO_DAI_RAGLAN', 'AO_DAI_HIEN_DAI', 'AO_TAC']
  },
  {
    id: 'acc-khan-ran',
    name: 'Khăn Rằn Nam Bộ Sọc Caro',
    type: 'SCARF',
    region: 'NAM_BO',
    era: 'Văn hóa Nam Bộ',
    culturalNote: 'Sọc caro đen trắng hoặc tím trắng biểu tượng của sự cần cù, hào sảng và mộc mạc của người dân đất phương Nam.',
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
    name: 'Guốc Mộc Quai Nhung Thêu Hoa',
    type: 'FOOTWEAR',
    region: 'BAC_BO',
    era: 'Cổ truyền',
    culturalNote: 'Gỗ mít đẽo thanh thoát, quai nhung đỏ son giữ đôi bàn chân thon thả, tiếng gõ guốc lốc cốc đặc trưng phố cổ.',
    element: 'MOC',
    colorHex: '#78350F',
    recommendedGarments: ['AO_DAI_NGU_THAN', 'AO_DAI_LEMUR', 'TU_THAN', 'AO_TAC']
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
  KY_YEU_GRADUATION: {
    title: 'Kỷ Yếu Tốt Nghiệp & Thanh Xuân Học Đường',
    idealGarments: ['AO_DAI_RAGLAN', 'AO_DAI_HIEN_DAI', 'AO_NGU_THAN_TAY_CHEN'],
    vibeDescription: 'Thanh lịch, trong trẻo, lưu giữ ký ức thanh xuân với tà áo trắng hoặc ngũ thân tay chẽn tối giản dễ vận động.',
    weatherTips: 'Nên chọn lụa tơ tằm hoặc linen thoáng mát cho ngày nắng chụp kỷ yếu ngoài trời.'
  },
  TET_SPRING: {
    title: 'Tết Nguyên Đán & Du Xuân Đầu Năm',
    idealGarments: ['AO_DAI_NGU_THAN', 'AO_TAC', 'TU_THAN'],
    vibeDescription: 'Sắc thái rực rỡ (đỏ son, hoàng thổ), tôn nghiêm cung chúc tân xuân, đón lộc may mắn.',
    weatherTips: 'Tiết trời se lạnh đầu xuân rất hợp để khoác áo Tấc hoặc lót trung đơn dày dặn.'
  },
  LE_HOI_TRUONG: {
    title: 'Lễ Hội Truyền Thống Trường Học & Ngày Di Sản',
    idealGarments: ['TU_THAN', 'GIAO_LINH', 'BA_BA', 'AO_DAI_NGU_THAN'],
    vibeDescription: 'Bùng nổ sắc màu bản địa, mang nón quai thao, khăn rằn giao lưu văn hóa đa vùng miền.',
    weatherTips: 'Nên mang thêm giày sneaker để thuận tiện biểu diễn văn nghệ và di chuyển.'
  },
  STREETWEAR_CASUAL: {
    title: 'Dạo Phố Cuối Tuần & Phong Cách Gen Z Streetwear',
    idealGarments: ['AO_NGU_THAN_TAY_CHEN', 'BA_BA', 'AO_DAI_HIEN_DAI'],
    vibeDescription: 'Phối ngẫu táo bạo cùng áo khoác Cyber Organza, quần parachute cargo và chunky boots.',
    weatherTips: 'Chất liệu chống nhăn, chống nước nhẹ rất hợp với thời tiết thất thường của thành phố.'
  },
  PROM_NIGHT: {
    title: 'Dạ Hội Trưởng Thành & Prom Night Tỏa Sáng',
    idealGarments: ['NHAT_BINH', 'AO_TAC', 'AO_DAI_LEMUR'],
    vibeDescription: 'Quyền quý, lộng lẫy, kiêu sa như hậu phi công chúa bước vào vũ hội hiện đại.',
    weatherTips: 'Kết hợp trang sức kiềng bạc hoặc trâm cài tóc thủ công mỹ nghệ.'
  },
  DAM_CUOI_WEDDING: {
    title: 'Lễ Đính Hôn & Đám Cưới Cổ Truyền',
    idealGarments: ['AO_TAC', 'NHAT_BINH', 'AO_DAI_NGU_THAN'],
    vibeDescription: 'Đại lễ long trọng, bảo chứng sự kết giao hai họ theo đúng lễ nghi Hữu Nhậm ngũ luân.',
    weatherTips: 'Chất liệu gấm tơ lụa thêu chỉ vàng chỉ bạc cao cấp.'
  }
};

// ============================================================================
// 5. CULTURAL GUARDRAILS VALIDATION ENGINE
// ============================================================================

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

  const score = Math.max(60, Math.min(100, 85 + generatingCount * 5 - overcomingCount * 8));
  const dominantElement = outfit.coreGarment.harmonyElement;

  return {
    score,
    dominantElement,
    relationships,
    advice: overcomingCount > 1
      ? 'Có dấu hiệu tương khắc giữa các lớp áo. Nên chọn phụ kiện có sắc màu trung hòa (như Bạch Lụa hoặc Hoàng Thổ) để cân bằng ngũ hành.'
      : 'Bảng màu các lớp trang phục đạt độ tương sinh vượng khí, tôn da và hài hòa tinh thần phương Đông.'
  };
}

/**
 * Validates Heritage Integrity & Checks for Cultural Taboos
 */
export function validateOutfitHeritage(outfit: OutfitState): HeritageValidationResult {
  const violations: CulturalViolation[] = [];
  let score = 100;

  // RULE 1: TABOO 01 - TẢ NHẬM (Left Lapel Closure)
  const isTaNham = outfit.lapelMode === 'TA_NHAM';
  if (isTaNham) {
    score -= 50;
    violations.push({
      ruleId: 'RULE_TABOO_TA_NHAM',
      severity: 'CRITICAL_BLOCKER',
      title: 'Đại Kỵ Văn Hóa: Vi Phạm Quy Thức Tả Nhậm (左衽)',
      message: 'Áo đang được cài từ Phải sang Trái (Tả Nhậm). Đây là điều tuyệt đối cấm kỵ trong văn hóa may mặc Việt Nam.',
      historicalContext: 'Từ thời tiền nhân đến triều Nguyễn, người Việt luôn cài vạt từ Trái đè lên Phải (Hữu Nhậm) theo lẽ sinh tồn và dương khí của người sống. Vạt áo cài sang trái (Tả Nhậm) xưa nay duy nhất chỉ dùng để khâm liệm thi thể người mất.',
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

  const fengshui = calculateFengshuiHarmony(outfit);

  let status: HeritageValidationResult['status'] = 'PASSED';
  if (violations.some(v => v.severity === 'CRITICAL_BLOCKER')) {
    status = 'CRITICAL_BLOCKER';
  } else if (violations.length > 0) {
    status = 'WARNING';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    status,
    violations,
    fengshui,
    verifiedSeams: {
      chinhTrungBackSeam: true,
      huuNhamRightClosure: !isTaNham,
      nguLuanFiveButtons: outfit.buttonCount === 5,
      traditionalLongPants: hasValidBottom
    }
  };
}
