/**
 * VibePhục Studio — Digital Heritage Knowledge Base
 * Catalog of peer-reviewed Vietnamese traditional garments & accessories.
 * Grounded in: Đại Nam Thực Lục, Khâm Định Đại Nam Hội Điển Sự Lệ, Ngàn Năm Áo Mũ (Trần Quang Đức).
 */

import { GarmentItem, AccessoryItem } from '../types/vibephuc';

// ============================================================================
// 1. GARMENT CATALOG (TỦ ĐỒ DI SẢN CHUẨN XÁC LỊCH SỬ)
// ============================================================================

export const GARMENT_CATALOG: GarmentItem[] = [
  // 1. Áo Ngũ Thân Tay Chẽn (Triều Nguyễn)
  {
    id: 'ao-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    category: 'NGU_THAN',
    era: 'TRIEU_NGUYEN',
    region: 'TRUNG_BO',
    defaultColor: '#1E3A8A', // Chàm Thủy Tộc
    allowableColors: ['#1E3A8A', '#0E0F12', '#D69E2E', '#F8FAFC', '#795548'],
    harmonyElement: 'THUY',
    historicalBrief:
      'Định chế tối thượng năm 1836 bởi Hoàng đế Minh Mạng thống nhất y phục toàn quốc. Cấu tạo 5 thân tượng trưng cho "Tứ thân phụ mẫu" che chở lấy thân mình. Cổ đứng Lập Lĩnh cao 2-3cm ôm khít, khuy cài bên phải (Hữu Nhậm), ống tay thu nhỏ ôm gọn cổ tay, sống lưng Chính Trung thanh chính ngay thẳng.',
    visualLayerUrl: '/assets/garments/ao-ngu-than-tay-chen.svg',
    closureDirection: 'RIGHT',
    collarType: 'LAP_LINH',
    buttonCount: 5,
    hasChinhTrungSeam: true,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: true
  },

  // 2. Áo Tấc / Tay Thụ (Triều Nguyễn - Lễ Phục)
  {
    id: 'ao-tac-tay-thu',
    name: 'Áo Tấc (Tay Thụ Đại Lễ)',
    category: 'NGU_THAN',
    era: 'TRIEU_NGUYEN',
    region: 'TRUNG_BO',
    defaultColor: '#D69E2E', // Vàng Hoàng Thổ
    allowableColors: ['#D69E2E', '#C53030', '#1E3A8A', '#701A75'],
    harmonyElement: 'THO',
    historicalBrief:
      'Lễ phục trang trọng bậc nhất của quan viên và bách tính triều Nguyễn trong các dịp tế tự, điển lễ, hôn sự. Thiết kế cổ lập lĩnh 5 cúc, hai ống tay thụng vuông vức rộng 40-50cm (khi chắp tay bái lễ hai tay thụng xuống tạo thành hình chữ nhật tôn nghiêm), tà áo dài phủ gối uy nghi.',
    visualLayerUrl: '/assets/garments/ao-tac-tay-thu.svg',
    closureDirection: 'RIGHT',
    collarType: 'LAP_LINH',
    buttonCount: 5,
    hasChinhTrungSeam: true,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: true
  },

  // 3. Áo Nhật Bình (Triều Nguyễn - Hoàng Cung)
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình Hoàng Cung',
    category: 'NHAT_BINH',
    era: 'TRIEU_NGUYEN',
    region: 'TRUNG_BO',
    defaultColor: '#C53030', // Đỏ Son Chu Sa
    allowableColors: ['#C53030', '#701A75', '#D69E2E', '#16A34A'],
    harmonyElement: 'HOA',
    historicalBrief:
      'Thường triều y phục tối cao của Hậu phi, Công chúa và Quý tộc nội đình triều Nguyễn. Đặc trưng bởi bản cổ áo to hình chữ nhật buông thẳng trước ngực, viền dải Ngũ Sắc ngũ hành ở cửa tay áo tượng trưng cho càn khôn vũ trụ, thắt đai ngọc hoặc dải thao buông rủ kiêu sa.',
    visualLayerUrl: '/assets/garments/ao-nhat-binh.svg',
    closureDirection: 'CENTER',
    collarType: 'CHU_NHAT',
    buttonCount: 1,
    hasChinhTrungSeam: true,
    isRoyalExclusive: true,
    slot: 'core',
    sacredLevel: 'ROYAL_EXCLUSIVE',
    lapelDirection: 'CENTER_SLIT',
    hasFiveButtons: false
  },

  // 4. Áo Dài Le Mur (Thập niên 1930 - Cải cách Cát Tường)
  {
    id: 'ao-dai-lemur',
    name: 'Áo Dài Le Mur Tân Thời',
    category: 'AO_DAI',
    era: 'LEMUR_1930',
    region: 'BAC_BO',
    defaultColor: '#701A75', // Tím Xứ Huế / Hoa Cà
    allowableColors: ['#701A75', '#F8FAFC', '#C53030', '#D69E2E'],
    harmonyElement: 'HOA',
    historicalBrief:
      'Đột phá cách tân của họa sĩ Nguyễn Cát Tường (Le Mur) khởi xướng trên tuần báo Phong Hóa năm 1934. Chiếc áo dung hòa tinh thần Á Đông với đường nét lãng mạn phương Tây: cổ bẻ lá sen hoặc viền ren tinh tế, vai bồng duyên dáng, eo ôm gọn gàng và tà áo dài thướt tha quét đất.',
    visualLayerUrl: '/assets/garments/ao-dai-lemur.svg',
    closureDirection: 'RIGHT',
    collarType: 'CO_BE',
    buttonCount: 0,
    hasChinhTrungSeam: false,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },

  // 5. Áo Dài Raglan (Thập niên 1960 - Hiệu may Dung Đakao)
  {
    id: 'ao-dai-raglan',
    name: 'Áo Dài Raglan Đakao',
    category: 'AO_DAI',
    era: 'RAGLAN_1960',
    region: 'NAM_BO',
    defaultColor: '#F8FAFC', // Bạch Lụa Nữ Sinh
    allowableColors: ['#F8FAFC', '#16A34A', '#00F5D4', '#CCFF00', '#1E3A8A'],
    harmonyElement: 'KIM',
    historicalBrief:
      'Kiệt tác kỹ thuật cắt may năm 1960 của nhà may Dung Đakao tại Sài Gòn. Phương pháp ráp tay raglan nối xéo từ cổ áo xuống nách triệt tiêu hoàn toàn nếp nhăn nhúm vùng nách, cài hàng nút bấm dọc bên sườn, định hình phom áo dài nữ sinh duyên dáng thanh xuân cho đến ngày nay.',
    visualLayerUrl: '/assets/garments/ao-dai-raglan.svg',
    closureDirection: 'RIGHT',
    collarType: 'LAP_LINH',
    buttonCount: 6,
    hasChinhTrungSeam: false,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FOLK',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },

  // 6. Áo Tứ Thân (Đồng bằng Bắc Bộ & Quan họ)
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc',
    category: 'TU_THAN',
    era: 'TIEN_NGUYEN',
    region: 'BAC_BO',
    defaultColor: '#795548', // Nâu Non Vỏ Dừa
    allowableColors: ['#795548', '#16A34A', '#D69E2E', '#0E0F12', '#C53030'],
    harmonyElement: 'MOC',
    historicalBrief:
      'Hồn cốt di sản nghìn năm châu thổ sông Hồng và các làn điệu Quan họ Kinh Bắc. Bốn thân vải mộc mạc buông lơi tự nhiên hoặc thắt vạt lươn trước bụng, bên trong phối yếm đào cổ xây, thắt lưng bao lụa đào và váy đụp đen xòe rộng, thể hiện nét đẹp cần cù đoan thục.',
    visualLayerUrl: '/assets/garments/ao-tu-than.svg',
    closureDirection: 'CENTER',
    collarType: 'TRON',
    buttonCount: 0,
    hasChinhTrungSeam: true,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FOLK',
    lapelDirection: 'CROSS_CHEST',
    hasFiveButtons: false
  },

  // 7. Áo Giao Lĩnh (Đại Việt thời Lý - Trần - Lê)
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh Cổ Chéo Đại Việt',
    category: 'GIAO_LINH',
    era: 'TIEN_NGUYEN',
    region: 'BAC_BO',
    defaultColor: '#0E0F12', // Đen Mực Sơn Mài
    allowableColors: ['#0E0F12', '#1E3A8A', '#F8FAFC', '#C53030', '#D69E2E'],
    harmonyElement: 'THUY',
    historicalBrief:
      'Y phục cổ xưa mang tính chính thống thời Lý - Trần - Hậu Lê. Cổ áo vạt bắt chéo nhau hình chữ Y nghiêm cẩn (vạt trái luôn đè lên vạt phải - Hữu Nhậm), phom áo thụng rộng trang trọng cổ xưa, cội nguồn văn hiến khai sinh ra toàn bộ hệ thống ngũ thân lập lĩnh sau này.',
    visualLayerUrl: '/assets/garments/ao-giao-linh.svg',
    closureDirection: 'RIGHT',
    collarType: 'GIAO_LINH',
    buttonCount: 0,
    hasChinhTrungSeam: true,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FORMAL_CEREMONIAL',
    lapelDirection: 'HUU_NHAM',
    hasFiveButtons: false
  },

  // 8. Áo Bà Ba (Nam Bộ Miền Tây Sông Nước)
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    category: 'BA_BA',
    era: 'TRIEU_NGUYEN',
    region: 'NAM_BO',
    defaultColor: '#1E3A8A', // Chàm Sông Nước
    allowableColors: ['#1E3A8A', '#0E0F12', '#16A34A', '#795548', '#F8FAFC'],
    harmonyElement: 'THUY',
    historicalBrief:
      'Trang phục biểu tượng của người dân đất phương Nam hào sảng, phóng khoáng. Cổ tròn hoặc cổ tim nông, xẻ dọc chính giữa với hàng cúc chạy thẳng, xẻ tà hai bên hông tạo sự tự do tối đa khi chèo xuồng, hai túi vuông trước vạt may liền tiện dụng.',
    visualLayerUrl: '/assets/garments/ao-ba-ba.svg',
    closureDirection: 'CENTER',
    collarType: 'TRON',
    buttonCount: 5,
    hasChinhTrungSeam: true,
    isRoyalExclusive: false,
    slot: 'core',
    sacredLevel: 'FOLK',
    lapelDirection: 'CENTER_SLIT',
    hasFiveButtons: false
  },

  // --- BASE & BOTTOM SUPPORT PIECES ---
  {
    id: 'base-trung-don',
    name: 'Áo Trung Đơn Lụa Bạch',
    category: 'NGU_THAN',
    era: 'TRIEU_NGUYEN',
    region: 'TRUNG_BO',
    defaultColor: '#F8FAFC',
    allowableColors: ['#F8FAFC'],
    harmonyElement: 'KIM',
    historicalBrief: 'Áo lót trắng mặc trong cùng, viền cổ trắng 1-2mm lộ ra giữ vệ sinh và làm sáng cổ áo lập lĩnh.',
    closureDirection: 'RIGHT',
    collarType: 'LAP_LINH',
    buttonCount: 5,
    hasChinhTrungSeam: true,
    isRoyalExclusive: false,
    slot: 'base'
  },
  {
    id: 'bottom-quan-lua-trang',
    name: 'Quần Lụa Trắng Ống Rộng',
    category: 'AO_DAI',
    era: 'TRIEU_NGUYEN',
    region: 'TRUNG_BO',
    defaultColor: '#F8FAFC',
    allowableColors: ['#F8FAFC'],
    harmonyElement: 'KIM',
    historicalBrief: 'Quần lụa ống suông rộng chạm mu bàn chân, quy thức đoan trang bất khả phân ly của tà áo dài.',
    closureDirection: 'CENTER',
    collarType: 'TRON',
    buttonCount: 0,
    hasChinhTrungSeam: false,
    isRoyalExclusive: false,
    slot: 'bottom'
  },
  {
    id: 'bottom-quan-lanh-my-a',
    name: 'Quần Lụa Đen Lãnh Mỹ Á',
    category: 'BA_BA',
    era: 'TRIEU_NGUYEN',
    region: 'NAM_BO',
    defaultColor: '#0E0F12',
    allowableColors: ['#0E0F12'],
    harmonyElement: 'THUY',
    historicalBrief: 'Quần đen tuyền nhuộm mặc nưa Tân Châu óng ả, mặc cùng áo bà ba hoặc áo dài ngũ thân.',
    closureDirection: 'CENTER',
    collarType: 'TRON',
    buttonCount: 0,
    hasChinhTrungSeam: false,
    isRoyalExclusive: false,
    slot: 'bottom'
  },
  {
    id: 'bottom-vay-dup-den',
    name: 'Váy Đụp Đen Bắc Bộ',
    category: 'TU_THAN',
    era: 'TIEN_NGUYEN',
    region: 'BAC_BO',
    defaultColor: '#0E0F12',
    allowableColors: ['#0E0F12'],
    harmonyElement: 'THUY',
    historicalBrief: 'Váy đụp lụa đen buông dài, trang phục hạ thân truyền thống của người phụ nữ châu thổ Bắc Bộ.',
    closureDirection: 'CENTER',
    collarType: 'TRON',
    buttonCount: 0,
    hasChinhTrungSeam: false,
    isRoyalExclusive: false,
    slot: 'bottom'
  }
];

// ============================================================================
// 2. ACCESSORIES CATALOG (DANH SÁCH PHỤ KIỆN TRUYỀN THỐNG & ĐƯƠNG ĐẠI)
// ============================================================================

export const ACCESSORY_CATALOG: AccessoryItem[] = [
  // 1. Nón Quai Thao (Nón Ba Tầm)
  {
    id: 'acc-non-quai-thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    type: 'HEADWEAR',
    region: 'BAC_BO',
    era: 'Cổ truyền Kinh Bắc',
    culturalNote: 'Nón tròn dẹt vành rộng tựa vầng trăng rằm, quai nón bện tơ thao óng ả đính tua chỉ ngũ sắc, tôn vinh nét e ấp duyên dáng của các liền chị Quan họ.',
    element: 'MOC',
    colorHex: '#D69E2E',
    recommendedGarments: ['TU_THAN', 'GIAO_LINH', 'AO_DAI']
  },

  // 2. Nón Lá Chóp
  {
    id: 'acc-non-la-chop',
    name: 'Nón Lá Chóp (Nón Bài Thơ Xứ Huế)',
    type: 'HEADWEAR',
    region: 'TRUNG_BO',
    era: 'Triều Nguyễn',
    culturalNote: 'Nón chóp nhọn đan từ lá gồi non trắng muốt, khi soi dưới ánh nắng hiện ra bài thơ chữ Nôm và phong cảnh sông Hương núi Ngự.',
    element: 'MOC',
    colorHex: '#FDE68A',
    recommendedGarments: ['AO_DAI', 'NGU_THAN', 'BA_BA']
  },

  // 3. Khăn Rằn Caro
  {
    id: 'acc-khan-ran',
    name: 'Khăn Rằn Caro Nam Bộ',
    type: 'SCARF',
    region: 'NAM_BO',
    era: 'Văn hóa Nam Bộ',
    culturalNote: 'Sọc caro đen trắng hoặc tím trắng biểu tượng của sự cần cù, hào sảng và mộc mạc của cư dân miền Tây sông nước Cửu Long.',
    element: 'THUY',
    colorHex: '#38BDF8',
    recommendedGarments: ['BA_BA', 'AO_DAI']
  },

  // 4. Khăn Vành Dây
  {
    id: 'acc-khan-vanh-day',
    name: 'Khăn Vành Dây Hoàng Cung',
    type: 'HEADWEAR',
    region: 'TRUNG_BO',
    era: 'Triều Nguyễn',
    culturalNote: 'Khăn lụa gấm màu xanh hoặc vàng quấn nhiều vòng đều tăm tắp quanh đầu, kết hợp hoàn hảo cùng lễ phục Áo Nhật Bình và Áo Tấc.',
    element: 'THO',
    colorHex: '#D69E2E',
    recommendedGarments: ['NHAT_BINH', 'NGU_THAN']
  },

  // 5. Khăn Đóng (Khăn Xếp)
  {
    id: 'acc-khan-dong',
    name: 'Khăn Đóng / Khăn Xếp Đen 5 Lớp',
    type: 'HEADWEAR',
    region: 'TRUNG_BO',
    era: 'Triều Nguyễn',
    culturalNote: 'Khăn gấm đen xếp nếp hình chữ Nhất (一) hoặc chữ Nhân (人) tượng trưng cho đạo làm người ngay thẳng, đi cùng Áo Ngũ Thân.',
    element: 'THUY',
    colorHex: '#0E0F12',
    recommendedGarments: ['NGU_THAN', 'AO_DAI']
  },

  // 6. Kiềng Bạc
  {
    id: 'acc-kieng-bac',
    name: 'Kiềng Bạc Chạm Sen Cung Đình',
    type: 'JEWELRY',
    region: 'TRUNG_BO',
    era: 'Mỹ nghệ hoàng gia',
    culturalNote: 'Vòng cổ bạc đúc thủ công làng Đồng Xâm hoặc kinh đô Huế, chạm trổ hoa sen uốn lượn tôn vinh cổ áo lập lĩnh và yếm đào.',
    element: 'KIM',
    colorHex: '#E2E8F0',
    recommendedGarments: ['NHAT_BINH', 'NGU_THAN', 'AO_DAI', 'TU_THAN']
  },

  // 7. Guốc Mộc
  {
    id: 'acc-guoc-moc',
    name: 'Guốc Mộc Quai Nhung Sơn Son',
    type: 'FOOTWEAR',
    region: 'BAC_BO',
    era: 'Cổ truyền',
    culturalNote: 'Gỗ mít đẽo thanh thoát sơn son mạ, quai nhung đỏ chu sa ôm khít bàn chân, tiếng gõ lốc cốc âm vang ký ức phố cổ Kẻ Chợ.',
    element: 'MOC',
    colorHex: '#78350F',
    recommendedGarments: ['TU_THAN', 'NGU_THAN', 'AO_DAI']
  },

  // 8. Sneaker Chunky
  {
    id: 'acc-sneaker-chunky',
    name: 'Chunky Sneaker Cyber Lime (Gen Z Fusion)',
    type: 'FOOTWEAR',
    region: 'ALL',
    era: 'DUONG_DAI',
    culturalNote: 'Giày thể thao đế thô năng động tương phản táo bạo với tà áo dài lụa mỏng, tạo phong cách Streetwear High-Street phá cách cho giới trẻ.',
    element: 'MOC',
    colorHex: '#CCFF00',
    recommendedGarments: ['AO_DAI', 'BA_BA', 'NGU_THAN']
  },

  // 9. Túi Tote Chàm
  {
    id: 'acc-tui-tote-cham',
    name: 'Túi Tote Nhuộm Chàm Thổ Cẩm',
    type: 'BAG',
    region: 'NAM_BO',
    era: 'DUONG_DAI',
    culturalNote: 'Vải đũi thô dệt selvedge nhuộm lá chàm tự nhiên kết hợp nẹp hoa văn hình học, phụ kiện tiện dụng khi mang cổ phục xuống phố.',
    element: 'THUY',
    colorHex: '#1E3A8A',
    recommendedGarments: ['AO_DAI', 'BA_BA', 'NGU_THAN']
  },

  // --- FOREIGN TEST ACCENTS (PHỤ KIỆN LAI TẠP KIỂM DUYỆT) ---
  {
    id: 'acc-foreign-obi',
    name: 'Đai Vải Thắt Lưng Kimono (Obi Nhật Bản)',
    type: 'MODERN_ACCENT',
    region: 'ALL',
    era: 'Ngoại lai (Nhật Bản)',
    isForeignOrAssimilated: true,
    culturalNote: 'Đai thắt lưng bản to của Kimono Nhật Bản. Khi phối vào Áo Tấc hay Nhật Bình Việt Nam sẽ bóp nghẹt phom suông và lai căng văn hóa.',
    element: 'HOA',
    colorHex: '#DC2626',
    recommendedGarments: []
  },
  {
    id: 'acc-foreign-hanfu-ribbon',
    name: 'Dải Lụa Thắt Nơ Ngực Tiên Hiệp (Hanfu Ruqun)',
    type: 'MODERN_ACCENT',
    region: 'ALL',
    era: 'Ngoại lai (Hán phục cổ trang)',
    isForeignOrAssimilated: true,
    culturalNote: 'Dải nơ ngực thắt chéo của phong cách Tiên hiệp / Ruqun Trung Hoa, gây nhầm lẫn bản sắc với Áo Giao Lĩnh và Tứ Thân Việt Nam.',
    element: 'HOA',
    colorHex: '#E11D48',
    recommendedGarments: []
  }
];
