/**
 * VibePhục Studio — AI Heritage Stylist ("Cố vấn Di sản") Engine
 * Generates creative lookbook titles, witty Gen Z captions, fabric recommendations,
 * and context-aware styling advice with deterministic fallback resilience.
 */

import { OutfitState, HeritageValidationResult, AIStylistCritique, FabricRecommendation, Occasion, Region, Weather } from '../types/vibephuc';

// Curated Vietnamese Artisanal Fabric Corpus
export const HERITAGE_FABRICS: Record<string, FabricRecommendation> = {
  LUA_BAO_LOC: {
    name: 'Lụa Tơ Tằm Bảo Lộc',
    origin: 'Bảo Lộc, Lâm Đồng (Thủ phủ tơ tằm Việt)',
    suitability: 'Hoàn hảo cho thời tiết nắng ấm, tà rủ mềm mại, thoáng mát và tôn dáng thướt tha.',
    feel: 'Mịn màng, mướt lạnh khi chạm vào da, độ óng ả tự nhiên'
  },
  GAM_VAN_PHUC: {
    name: 'Gấm Lụa Vạn Phúc (Hà Đông)',
    origin: 'Làng dệt Vạn Phúc hơn 1.000 năm tuổi',
    suitability: 'Lý tưởng cho tiết trời se lạnh thu đông, đại lễ, cưới hỏi. Giúp cổ lập lĩnh đứng phom vững chãi.',
    feel: 'Dày dặn, hoa văn chìm nổi tinh xảo, bắt sáng sang trọng'
  },
  DUI_NAM_CAO: {
    name: 'Đũi Tơ Tằm Nam Cao',
    origin: 'Làng nghề đũi Nam Cao, Thái Bình',
    suitability: 'Tuyệt vời cho phong cách dạo phố du xuân, phong thái mộc mạc, thấm hút mồ hôi tối ưu.',
    feel: 'Mặt vải gân tự nhiên, thô ráp thanh tao, càng giặt càng mềm'
  },
  SA_TO_TAM: {
    name: 'Sa Tơ Tằm Cung Đình',
    origin: 'Kinh đô Huế & Thăng Long cổ truyền',
    suitability: 'Áo khoác ngoài xuyên thấu (Áo Tấc sa, Cyber Trench), tạo lớp layer huyền ảo nhẹ tựa sương khói.',
    feel: 'Cực mỏng, trong suốt, thoáng khí như làn gió thoảng'
  },
  NHUNG_HAI_DUONG: {
    name: 'Nhung Tuyết Cổ Truyền',
    origin: 'Nghề dệt nhung Hải Dương / Hà Nội',
    suitability: 'Dành riêng cho dạ tiệc Prom, sự kiện mùa đông. Quyền quý, trầm mặc và giữ ấm tuyệt đối.',
    feel: 'Mềm mượt như nhung tuyết, chiều sâu màu sắc thẳm sâu'
  },
  LANH_MY_A: {
    name: 'Lãnh Mỹ Á Nhuộm Mặc Nưa',
    origin: 'Tân Châu, An Giang (Nữ hoàng của các loại lụa)',
    suitability: 'Áo Bà Ba Nam Bộ, quần lụa đen huyền thoại, phối cùng áo dài cổ phục.',
    feel: 'Đen nhánh bóng loáng như da, không phai màu, chống thấm nhẹ'
  }
};

interface StylistInput {
  outfit: OutfitState;
  validation: HeritageValidationResult;
  occasion: Occasion;
  region: Region | 'ALL';
  weather: Weather;
}

/**
 * Generates an elevated AI Heritage Stylist response with zero cringe, authentic Vietnamese cultural wit.
 */
export function generateAIStylistAdvice(input: StylistInput): AIStylistCritique {
  const { outfit, validation, occasion, region, weather } = input;
  const core = outfit.coreGarment;
  const isTaNham = outfit.lapelMode === 'TA_NHAM';

  // 1. Creative Lookbook Titles
  let lookbookTitle = '';
  if (isTaNham) {
    lookbookTitle = '⚠️ CẢNH BÁO DI SẢN: Vạt Áo Nghịch Chiều Cần Chấn Chỉnh';
  } else if (core.category === 'TU_THAN' || core.category === 'GIAO_LINH') {
    lookbookTitle = region === 'BAC_BO'
      ? 'Kinh Bắc Sông Cầu: Tứ Thân Lụa Thắm Vắt Ngang Thời Đại'
      : 'Thăng Long Huyền Tưởng: Giao Lĩnh Ngũ Sắc Gặp Gỡ Tương Lai';
  } else if (core.category === 'NHAT_BINH' || core.category === 'AO_TAC') {
    lookbookTitle = occasion === 'DAM_CUOI_WEDDING'
      ? 'Hỷ Khí Hoàng Đình: Nhật Bình Sắc Son Trăm Năm Hòa Hợp'
      : 'Cố Đô Vị Lai: Áo Tấc Uy Nghiễm Phủ Bóng Cyberpunk';
  } else if (core.category === 'BA_BA') {
    lookbookTitle = 'Phù Sa Dạ Khúc: Áo Bà Ba Tơ Tằm Lướt Dưới Đèn Neon';
  } else if (core.category === 'AO_DAI_LEMUR') {
    lookbookTitle = 'Hương Sắc 1930: Le Mur Lãng Mạn Tái Sinh Trong Phom Dáng Trẻ';
  } else if (core.category === 'AO_DAI_RAGLAN') {
    lookbookTitle = 'Sài Gòn Thập Niên 60: Raglan Duyên Dáng Giữa Giảng Đường Kỷ Yếu';
  } else {
    lookbookTitle = 'Ngũ Thân Lập Lĩnh: Cốt Cách Quân Tử Hòa Nhịp High-Street';
  }

  // 2. Gen Z Captions (witty, respectful, zero AI cliche emoji spam)
  let genZCaption = '';
  if (isTaNham) {
    genZCaption = 'Ủa khoan dừng khoảng chừng là 2 giây! Vạt áo đang cài sang trái (Tả Nhậm) kìa bạn ơi. Xưa nay người sống luôn cài Hữu Nhậm từ trái qua phải, sửa lại ngay kẻo các cụ chấm điểm HIS trừ thẳng tay nha.';
  } else {
    switch (occasion) {
      case 'KY_YEU_GRADUATION':
        genZCaption = `Học 12 năm đèn sách, ngày ra trường diện ${core.name} Hữu Nhậm chuẩn chỉnh thì ảnh kỷ yếu cứ gọi là sáng nhất khóa. Vừa tôn nét học đường lại bảo chứng lòng tự tôn di sản.`;
        break;
      case 'TET_SPRING':
        genZCaption = `Tết này dạo phố du xuân khỏi lo đụng hàng. Sự kết hợp giữa ${core.name} cùng sắc màu ngũ hành không chỉ rước tài lộc mà còn tạo phong thái sang xịn mịn không tì vết.`;
        break;
      case 'DAM_CUOI_WEDDING':
        genZCaption = `Đi ăn cưới lịch thiệp mà vẫn tinh tế: Diện cổ phục vừa đủ trang trọng chúc phúc lứa đôi, giữ đúng quy thức chừng mực không lấn át nhân vật chính của ngày vui.`;
        break;
      case 'DI_CHUA_TEMPLE':
        genZCaption = `Về chốn thiền môn thanh tịnh, chiếc cổ lập lĩnh ôm khít cùng vạt dài phủ gối là chuẩn mực đoan trang nhất. Thong dong từng bước chân, tâm an tịnh giữa khói hương trầm mặc.`;
        break;
      case 'LE_HOI_LANG':
        genZCaption = `Về trẩy hội làng, tiếng trống hội giòn giã quyện cùng tà ${core.name}. Nét đẹp cha ông trao truyền qua từng đường kim sống lưng Chính Trung nay lại bừng sáng giữa thế hệ mới.`;
        break;
      case 'STREETWEAR_CASUAL':
      default:
        genZCaption = `Mang cổ phục xuống phố: Không phải cosplay, đây là thời trang mang theo bản sắc cội nguồn. ${outfit.outerGarment ? `Lớp khoác ${outfit.outerGarment.name} đè nhẹ` : 'Phom dáng suông'} vừa phóng khoáng lại cực kỳ ra chất Gen Z hiện đại.`;
        break;
    }
  }

  // 3. Contextual Styling Advice
  let stylingAdvice = '';
  if (isTaNham) {
    stylingAdvice = 'Bấm nút "Tự Động Sửa Chuẩn Mực (Auto-Fix)" để đảo vạt áo sang Hữu Nhậm ngay lập tức. Đây là ranh giới bất khả xâm phạm giữa lễ tang và phục sức sinh hoạt thường nhật.';
  } else {
    const bottomName = outfit.bottomPiece?.name || 'Quần lụa ống suông';
    const accNames = outfit.accessories.map(a => a.name).join(', ') || 'phụ kiện tối giản';
    stylingAdvice = `Tổng thể trang phục đạt độ cân bằng xuất sắc (${validation.score}/100 HIS). Khi phối cùng ${bottomName} và ${accNames}, bạn nên giữ lưng thẳng để tà áo thả rủ tự nhiên, làm nổi bật đường sống lưng Chính Trung thanh khiết.`;
  }

  // 4. Fabric Recommendations based on Weather & Garment
  const fabricTips: FabricRecommendation[] = [];
  if (weather === 'SE_LANH') {
    fabricTips.push(HERITAGE_FABRICS.GAM_VAN_PHUC);
    fabricTips.push(HERITAGE_FABRICS.NHUNG_HAI_DUONG);
  } else if (weather === 'NANG_AM') {
    fabricTips.push(HERITAGE_FABRICS.LUA_BAO_LOC);
    fabricTips.push(HERITAGE_FABRICS.DUI_NAM_CAO);
  } else {
    // Mưa rào / thời tiết chuyển mùa
    fabricTips.push(HERITAGE_FABRICS.LANH_MY_A);
    fabricTips.push(HERITAGE_FABRICS.SA_TO_TAM);
  }

  // 5. Weather advice
  let weatherAdvice = '';
  if (weather === 'SE_LANH') {
    weatherAdvice = 'Thời tiết se lạnh: Ưu tiên lớp trong là tơ tằm dệt dày hoặc khoác thêm áo Tấc / Cyber Trench bên ngoài để cản gió và giữ phom cổ đứng ấm áp.';
  } else if (weather === 'NANG_AM') {
    weatherAdvice = 'Thời tiết nắng ấm: Khuyên dùng chất liệu Lụa Bảo Lộc hoặc Đũi tơ Nam Cao, thoáng khí, thấm hút mồ hôi và cho độ bay tà cực kỳ ăn ảnh khi di chuyển ngoài trời.';
  } else {
    weatherAdvice = 'Thời tiết ẩm ướt / mưa rào: Khuyên chọn Lãnh Mỹ Á hoặc lụa đen chống bám bẩn nhẹ, kết hợp guốc mộc đế cao hoặc boots da quân đội để tránh vấy bẩn tà áo.';
  }

  // 6. Occasion critique
  const occasionCritique = validation.occasionFeedback.verdict;

  return {
    lookbookTitle,
    genZCaption,
    stylingAdvice,
    fabricTips,
    weatherAdvice,
    occasionCritique,
  };
}
