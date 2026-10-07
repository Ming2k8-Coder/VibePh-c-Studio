'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Scroll,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Compass,
  Crown,
  Palette,
  Eye,
  Info
} from 'lucide-react';

interface CulturalGuardrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'timeline' | 'garments' | 'rules' | 'archives';
}

type WikiTabId = 'timeline' | 'garments' | 'rules' | 'archives';

interface TimelineMilestone {
  era: string;
  period: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  summary: string;
  keyGarments: string[];
  philosophy: string;
  reformNotes: string;
}

const HISTORICAL_TIMELINES: TimelineMilestone[] = [
  {
    era: 'LÝ - TRẦN - HỒ - LÊ SƠ',
    period: 'Thế kỷ 11 – 15',
    title: 'Khởi Thủy Giao Lĩnh & Tứ Thân',
    subtitle: 'Nền móng độc lập tự chủ của Đại Việt',
    badge: 'Đại Việt Tự Chủ',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    summary:
      'Trang phục thời Lý - Trần mang phom dáng thụng rộng, cổ áo giao chéo (Giao Lĩnh) với vạt trái đè lên vạt phải (Hữu Nhậm). Tầng lớp bình dân và phụ nữ Kinh Bắc ưa chuộng Áo Tứ Thân giản dị, tiện lao động, kết hợp áo yếm và nón quai thao.',
    keyGarments: ['Áo Giao Lĩnh', 'Áo Tứ Thân', 'Áo Yếm Cổ Xây', 'Nón Quai Thao'],
    philosophy: 'Thuận theo tự nhiên, đề cao tinh thần khoáng đạt, tự chủ của nền văn minh lúa nước.',
    reformNotes: 'Các sắc lệnh định chế trang phục bắt đầu phân định rõ ràng giữa mũ áo triều nghi và thường phục nhân dân.'
  },
  {
    era: 'HẬU LÊ & CHÚA NGUYỄN',
    period: 'Thế kỷ 16 – 18',
    title: 'Bước Ngoặt Đàng Trong: Khởi Sinh Áo 5 Thân',
    subtitle: 'Chúa Nguyễn Phúc Khoát định chế y phục xứ Nam',
    badge: 'Cội Nguồn 5 Thân',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    summary:
      'Năm 1744, Võ Vương Nguyễn Phúc Khoát ban sắc lệnh cải cách trang phục tại xứ Đàng Trong để tạo dựng bản sắc riêng biệt: Toàn dân mặc áo cài nút bên phải (Hữu Nhậm), cổ đứng ôm khít, may bằng 5 thân vải và mặc quần đáy dài thay cho váy đụp.',
    keyGarments: ['Áo Tiền thân Ngũ Thân Lập Lĩnh', 'Quần Lụa Thụt Dài', 'Khăn Đóng'],
    philosophy: 'Thiết lập trật tự lễ giáo mới, dung hòa văn hóa bản địa Nam tiến với quy thức Trung chính.',
    reformNotes: 'Là cột mốc lịch sử sinh thành ra hình thái tiền thân trực tiếp của Áo Dài truyền thống Việt Nam.'
  },
  {
    era: 'TRIỀU NGUYỄN HOÀNG KIM',
    period: '1802 – 1945',
    title: 'Quy Thước Toàn Quốc: Áo Tấc & Nhật Bình',
    subtitle: 'Vua Minh Mạng thống nhất quy chuẩn Bắc - Nam',
    badge: 'Đỉnh Cao Điển Chế',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    summary:
      'Năm 1827 - 1837, Vua Minh Mạng triệt để thống nhất y phục toàn quốc: Bắt buộc từ Bắc chí Nam đều mặc áo ngũ thân lập lĩnh và quần dài. Hình thành hệ thống phân định đẳng cấp nghiêm ngặt: Áo Tấc (lễ phục thụng vuông), Áo Ngũ Thân tay chẽn (thường phục), và Áo Nhật Bình (dành riêng cho Hậu phi, Công chúa).',
    keyGarments: ['Áo Tấc (Tay Thụ)', 'Áo Ngũ Thân Tay Chẽn', 'Áo Nhật Bình', 'Khăn Vành Dây'],
    philosophy: 'Trục thẳng "Chính Trung" (sống lưng ngay thẳng) và "Ngũ Luân / Ngũ Thường" (5 cúc ngọc đại diện Nhân, Lễ, Nghĩa, Trí, Tín).',
    reformNotes: 'Ghi chép chi tiết trong bộ chính sử "Khâm Định Đại Nam Hội Điển Sự Lệ" của Nội các triều Nguyễn.'
  },
  {
    era: 'TÂN THỜI LE MUR',
    period: 'Thập niên 1930',
    title: 'Cuộc Canh Tân Tây Hóa Của Cát Tường',
    subtitle: 'Phong trào Thơ Mới thổi làn gió Paris vào tà áo',
    badge: 'Âu Hóa Tân Kỳ',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    summary:
      'Họa sĩ Cát Tường (bút danh Le Mur) thuộc nhóm Tự Lực Văn Đoàn khởi xướng phong trào cải cách áo dài: Rút gọn thân áo ôm sát đường cong cơ thể, đưa vai bồng, cổ sen bẻ, viền đăng ten và vạt quét đất mang phong cách đầm phương Tây.',
    keyGarments: ['Áo Dài Le Mur', 'Quần Lụa Trắng Ống Rộng', 'Giày Cao Gót'],
    philosophy: 'Giải phóng thân thể người phụ nữ, tôn vinh nét đẹp tân thời thoát ly định kiến phong kiến.',
    reformNotes: 'Gặp nhiều tranh cãi dư luận thời bấy giờ vì tính chất táo bạo, nhưng mở đường cho tư duy thời trang hiện đại.'
  },
  {
    era: 'ÁO DÀI LÊ PHỔ',
    period: 'Thập niên 1950',
    title: 'Dung Hòa Cốt Cách & Nét Quyến Rũ Đoan Trang',
    subtitle: 'Chuẩn mực thiếu nữ Hà thành thanh lịch',
    badge: 'Dung Hòa Đoan Chính',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    summary:
      'Họa sĩ Lê Phổ đã tinh tế dung hòa áo Le Mur với áo ngũ thân truyền thống: Loại bỏ vai bồng và các chi tiết rườm rà Tây phương, đưa trở lại cổ lập lĩnh kín đáo nhưng ôm eo mềm mại, tà áo rủ dài thướt tha chạm gót.',
    keyGarments: ['Áo Dài Lê Phổ', 'Quần Lụa Trắng', 'Kiềng Bạc Khắc Sen'],
    philosophy: 'Vẻ đẹp e ấp, kín đáo mà gợi cảm kín kẽ của người phụ nữ Việt Nam thế kỷ 20.',
    reformNotes: 'Được công nhận là phom dáng kinh điển nhất đặt nền móng cho Áo Dài hiện đại.'
  },
  {
    era: 'ĐỘT PHÁ RAGLAN ĐAKAO',
    period: 'Thập niên 1960',
    title: 'Tuyệt Tác Tay Raglan Nữ Sinh Sài Gòn',
    subtitle: 'Giải pháp triệt tiêu nếp nhăn nách kinh điển',
    badge: 'Đỉnh Cao Kỹ Thuật',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    summary:
      'Nhà may Dung ở Đakao (Sài Gòn) sáng chế phương pháp ráp tay Raglan: Ống tay được may nối xéo từ cổ áo xuống nách. Sáng kiến này triệt tiêu hoàn toàn các nếp gấp nhăn nhúm dưới nách, giúp tà áo phẳng phiu hoàn hảo, kết hợp hàng nút bấm cài một bên sườn.',
    keyGarments: ['Áo Dài Raglan Trắng Nữ Sinh', 'Quần Lụa Đen/Trắng', 'Nón Lá'],
    philosophy: 'Tính ứng dụng công nghiệp nhẹ, tối ưu chuyển động cơ thể, biểu tượng học đường thuần khiết.',
    reformNotes: 'Trở thành chuẩn mực kỹ thuật may Áo Dài nữ được áp dụng rộng rãi cho đến tận ngày nay.'
  },
  {
    era: 'GEN Z NEO-HERITAGE',
    period: '2020s & Tương Lai',
    title: 'Hơi Thở Streetwear & Kỷ Nguyên Số VibePhục',
    subtitle: 'Sắc lụa hoàng triều chạm nhịp đập đương đại',
    badge: 'Cyber Heritage',
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    summary:
      'Thế hệ trẻ Việt Nam phối ngẫu cổ phục với thời trang đường phố: Áo Tấc khoác cùng Cyber Organza, quần Cargo parachute, Chunky Sneaker. Dù cách tân táo bạo, quy thức cốt lõi như Hữu Nhậm, sống lưng Chính Trung và nề nếp đoan trang hạ y vẫn được bảo toàn trọn vẹn.',
    keyGarments: ['Áo Tấc Streetwear', 'Cyber Trench Coat', 'Sneaker Chunky', 'Túi Tote Chàm'],
    philosophy: 'Di sản sống trong đời thường; truyền thống không phải là bảo tàng tro bụi mà là ngọn lửa tiếp nối.',
    reformNotes: 'Bảo chứng bởi hệ thống AI Cultural Guardrails ngăn chặn sai lệch quy thức.'
  }
];

interface GarmentDetail {
  id: string;
  name: string;
  era: string;
  collar: string;
  closure: string;
  buttons: string;
  material: string;
  socialStrata: string;
  anatomy: string[];
  historicalNotes: string;
}

const GARMENTS_ENCYCLOPEDIA: GarmentDetail[] = [
  {
    id: 'ao-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    era: 'Triều Nguyễn (1802 – 1945)',
    collar: 'Cổ Lập Lĩnh (đứng tròn khép kín 2 – 3cm)',
    closure: 'Hữu Nhậm (vạt trái đè lên vạt phải, cài nút bên nách phải)',
    buttons: '5 hạt cúc ngọc / đồi mồi / đồng tượng trưng cho Ngũ Thường',
    material: 'Lụa tơ tằm Bảo Lộc, gấm, sa, đũi, lãnh',
    socialStrata: 'Thường phục trang trọng của cả nam lẫn nữ trong toàn xã hội',
    anatomy: [
      '5 Thân áo: 2 thân trước, 2 thân sau ghép sống lưng Chính Trung, 1 thân con che chắn bên trong.',
      'Tay Chẽn: Ống tay áo ôm gọn từ khuỷu tay xuống cổ tay, linh hoạt khi làm việc và sinh hoạt.',
      'Sống lưng Chính Trung: Nối 2 thân sau chạy dọc cột sống, tượng trưng cho sự chính trực quang minh.'
    ],
    historicalNotes:
      'Quy chuẩn y phục toàn quốc theo sắc lệnh của Vua Minh Mạng. Người mặc luôn mặc lót áo trung đơn màu trắng bên trong và quần thụng chạm đất.'
  },
  {
    id: 'ao-tac-tay-thu',
    name: 'Áo Tấc (Áo Tay Thụ)',
    era: 'Triều Nguyễn (1802 – 1945)',
    collar: 'Cổ Lập Lĩnh cao đứng, dựng thẳng nghiêm trang',
    closure: 'Hữu Nhậm tuyệt đối, gài sang nách phải',
    buttons: '5 hạt cúc đại diện Ngũ Luân đạo lý',
    material: 'Gấm cung đình, lụa vân thượng hạng thêu chỉ kim tuyến',
    socialStrata: 'Lễ phục trang trọng của quan viên, sĩ tử, quý tộc và dân chúng trong đại lễ',
    anatomy: [
      'Tay Thụ rộng: Cửa tay thụng vuông vức bản lớn từ 30cm đến 50cm, thả buông ngang bằng vạt áo.',
      'Khi chắp tay hành lễ (vái lạy), hai ống tay áo giao nhau tạo thế nghiêm cẩn, khiêm cung.',
      'Vạt áo dài quá đầu gối, vạt con lót bên trong bảo vệ sự kín đáo tế nhị.'
    ],
    historicalNotes:
      'Chỉ mặc trong các dịp đại lễ: Tế miếu, hôn lễ, thi cử đại khoa, khánh tiết, đón Tết cổ truyền. Đi kèm khăn đóng (nam) hoặc khăn vành dây (nữ).'
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    era: 'Triều Nguyễn (1802 – 1945)',
    collar: 'Cổ Chữ Nhật viền bản lớn buông thẳng trước ngực',
    closure: 'Xẻ dọc chính giữa ngực, đính cúc vàng/ngọc hoặc thắt dải ngọc thao',
    buttons: 'Hàng cúc ngọc hoặc dây thắt thao ngọc bội',
    material: 'Sa, đoan, đoạn dệt hoa văn phượng vũ, mẫu đơn, thủy ba',
    socialStrata: 'Lễ phục bậc cao dành cho Hậu phi, Công chúa và Mệnh phụ triều đình',
    anatomy: [
      'Viền cổ ngũ sắc: Khung thêu chữ nhật viền hoa văn kim tuyến lộng lẫy trước ngực.',
      'Tay áo ngũ hành: Tay áo đính 5 dải màu ngũ hành (Đỏ, Vàng, Xanh, Trắng, Đen) tượng trưng ngũ hành vũ trụ.',
      'Đi cùng Xiêm Bát Quy, dải ruy băng thắt lưng và khăn vành dây vấn 45-50 vòng quanh đầu.'
    ],
    historicalNotes:
      'Màu sắc quy định nghiêm ngặt theo phẩm cấp: Hoàng thái hậu/Hoàng hậu dùng màu chính hoàng/hoàng yến; Công chúa dùng màu đỏ xích đào; Mệnh phụ dùng màu lam, tím quả quế.'
  },
  {
    id: 'ao-tu-than-giao-linh',
    name: 'Áo Tứ Thân & Giao Lĩnh',
    era: 'Thời Lý - Trần - Lê (Bắc Bộ)',
    collar: 'Cổ Giao Lĩnh chéo ngực hoặc cổ buông lơi',
    closure: 'Buộc vạt lươn trước bụng hoặc thả buông tự nhiên',
    material: 'Vải đũi tơ tằm, sồi, the, nhuộm củ nâu, chàm mộc mạc',
    buttons: 'Không dùng cúc kim loại; dùng dải thắt lưng lụa đào',
    socialStrata: 'Y phục phụ nữ bình dân, liền chị Quan họ Kinh Bắc và lễ hội dân gian',
    anatomy: [
      '4 Thân áo: 2 thân sau may liền ở sống lưng; 2 thân trước thả dài buộc thắt con lươn trước bụng.',
      'Áo Yếm lót trong: Yếm cổ xây hoặc yếm cánh sen khoe cổ kiêu ba ngấn duyên dáng.',
      'Nón Quai Thao (nón ba tầm) đường kính lớn, dây thao chạm ngọc buông dài.'
    ],
    historicalNotes:
      'Biểu tượng thuần hậu của văn hóa đồng bằng Bắc Bộ, gắn liền với làn điệu dân ca Quan họ và các hội làng mùa xuân.'
  },
  {
    id: 'ao-dai-raglan',
    name: 'Áo Dài Raglan',
    era: 'Thập niên 1960 – Nay',
    collar: 'Cổ Lập Lĩnh ôm nhẹ hoặc cổ thuyền thanh thoát',
    closure: 'Hàng nút bấm (hoặc dây kéo) chạy dọc đường ráp xéo nách sang sườn phải',
    buttons: 'Hàng nút bấm kim loại hoặc cúc bọc vải chìm',
    material: 'Lụa Hà Đông, voan, nhung, gấm đương đại',
    socialStrata: 'Y phục phổ biến của toàn bộ phụ nữ Việt Nam, quốc phục nữ sinh',
    anatomy: [
      'Tay Raglan: Nối xéo từ chân cổ áo xuống nách, loại bỏ hoàn toàn vết nhăn nách truyền thống.',
      'Eo chiết cong: Ôm sát lượn theo đường cong ngực và eo, xẻ tà cao chạm cạp quần.',
      'Quần lụa trắng hoặc đen ống rộng bay bổng theo từng bước đi.'
    ],
    historicalNotes:
      'Đỉnh cao cách tân áo dài thế kỷ 20 do nhà may Dung Đakao khai phá, trở thành biểu tượng nữ sinh và quốc phục Việt Nam ra trường quốc tế.'
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    era: 'Thế kỷ 19 – Nay (Phương Nam)',
    collar: 'Cổ tròn hoặc cổ tim xẻ nông thanh thoát',
    closure: 'Xẻ dọc chính diện, cài hàng nút bấm hoặc nút nhựa giữa ngực',
    buttons: 'Hàng cúc chính trung chạy thẳng',
    material: 'Vải ú, vải lụa Lãnh Mỹ Á nhuộm quả mặc nưa óng ả',
    socialStrata: 'Y phục đặc trưng của người dân sông nước Nam Bộ',
    anatomy: [
      'Xẻ tà hông: Hai bên hông xẻ tà vừa phải, thoải mái chèo xuồng và đi lại.',
      'Hai túi vạt trước: May hai túi nhỏ bản vuông ở hai vạt trước tiện dụng.',
      'Phối cùng Quần lụa đen và Khăn Rằn caro quàng cổ che nắng gió.'
    ],
    historicalNotes:
      'Biểu tượng của nét đẹp chân chất, hào sảng, cần lao của người dân đồng bằng sông Cửu Long qua các thời kỳ lịch sử.'
  }
];

export const CulturalGuardrailModal: React.FC<CulturalGuardrailModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'timeline'
}) => {
  const [activeTab, setActiveTab] = useState<WikiTabId>(initialTab);
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('ao-ngu-than-tay-chen');
  const [selectedTimelineIdx, setSelectedTimelineIdx] = useState<number>(2);

  if (!isOpen) return null;

  const currentGarment =
    GARMENTS_ENCYCLOPEDIA.find(g => g.id === selectedGarmentId) || GARMENTS_ENCYCLOPEDIA[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      {/* Outer Modal Container with Imperial Woodblock Aesthetic */}
      <div className="relative w-full max-w-5xl bg-[#111216] border-2 border-heritage-hoang/50 rounded-m3-xl shadow-[0_0_60px_rgba(214,158,46,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Decorative Lacquer Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-heritage-son via-heritage-hoang to-cyber-lime" />

        {/* ================================================================== */}
        {/* HEADER: Title & Tab Switcher Navigation                            */}
        {/* ================================================================== */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#171920] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-m3-md bg-heritage-hoang/10 border border-heritage-hoang/40 flex items-center justify-center text-heritage-hoang shadow-heritage-glow">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-imperial text-lg sm:text-xl font-bold text-white tracking-wide">
                  Wiki Cổ Phục & Điển Chế Di Sản
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-lime/10 text-cyber-lime border border-cyber-lime/30 font-bold uppercase">
                  Verified Codex
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Niên biểu lịch sử qua các triều đại · Bách khoa y phục · Bảo chứng Hữu Nhậm ngàn năm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Đóng [ESC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Tab Navigation Strip */}
        <div className="px-6 pt-2 border-b border-white/10 bg-[#13151B] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'timeline', label: '1. Niên Biểu Lịch Sử (Timelines)', icon: Clock },
            { id: 'garments', label: '2. Bách Khoa Cổ Phục (Codex)', icon: Layers },
            { id: 'rules', label: '3. Quy Thức Bất Biến & 4 Đại Kỵ', icon: ShieldAlert },
            { id: 'archives', label: '4. Thư Tịch & Trích Dẫn Sử Liệu', icon: BookOpen }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WikiTabId)}
                className={`relative px-4 py-3 rounded-t-m3-md text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-heritage-hoang' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeWikiCodexTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-heritage-hoang to-cyber-lime shadow-[0_0_8px_#D69E2E]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/* MAIN BODY: Tab Content Showcase                                    */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#E3E2E6]">
          {/* ---------------------------------------------------------------- */}
          {/* TAB 1: NIÊN BIỂU LỊCH SỬ (TIMELINES)                             */}
          {/* ---------------------------------------------------------------- */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="font-imperial font-bold text-base text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-heritage-hoang" />
                    Tiến Trình Phát Triển Y Phục Việt Nam Ngàn Năm
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Từ chiếc áo Giao Lĩnh thời Lý - Trần qua sắc lệnh cải cách thời Minh Mạng đến phong cách tân thời Raglan
                  </p>
                </div>
                <span className="text-xs font-mono text-cyber-lime bg-cyber-lime/10 px-2.5 py-1 rounded-full border border-cyber-lime/30 font-bold hidden sm:inline">
                  7 Thời Kỳ Lịch Sử
                </span>
              </div>

              {/* Horizontal / Grid Timeline Milestone Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {HISTORICAL_TIMELINES.map((item, idx) => {
                  const isSelected = selectedTimelineIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTimelineIdx(idx)}
                      className={`p-2.5 rounded-m3-md border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-heritage-hoang/15 border-heritage-hoang text-white shadow-heritage-glow scale-[1.03]'
                          : 'bg-[#181A22] border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-amber-300 font-bold block truncate">
                        {item.period}
                      </span>
                      <span className="text-xs font-imperial font-bold line-clamp-1 mt-1 text-white">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 truncate mt-1">
                        {item.era}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* In-depth Milestone Spotlight Card */}
              {(() => {
                const milestone = HISTORICAL_TIMELINES[selectedTimelineIdx];
                return (
                  <div className="p-6 rounded-m3-lg bg-[#181A22] border border-heritage-hoang/40 space-y-4 shadow-xl relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${milestone.badgeColor}`}>
                            {milestone.badge}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            Niên đại: {milestone.period}
                          </span>
                        </div>
                        <h4 className="font-imperial font-bold text-xl text-white mt-1">
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-amber-200 italic">{milestone.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {milestone.keyGarments.map((g, gIdx) => (
                          <span
                            key={gIdx}
                            className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyber-lime font-bold"
                          >
                            ✓ {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                      {milestone.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-m3-md bg-[#121319] border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-heritage-hoang font-bold flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" />
                          Triết lý thẩm mỹ & Cốt cách:
                        </span>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {milestone.philosophy}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-m3-md bg-[#121319] border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-cyber-jade font-bold flex items-center gap-1.5">
                          <Scroll className="w-3.5 h-3.5" />
                          Ghi chép thư tịch & Định chế:
                        </span>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {milestone.reformNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* TAB 2: BÁCH KHOA CỔ PHỤC (GARMENT CODEX)                          */}
          {/* ---------------------------------------------------------------- */}
          {activeTab === 'garments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="font-imperial font-bold text-base text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-heritage-hoang" />
                    Hệ Thống Phân Loại & Cấu Trúc Cổ Phục Chuẩn Mực
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Khảo cứu chi tiết giải phẫu học từng loại y phục: thân áo, nẹp vạt, khuy cúc và chất liệu chuẩn cổ
                  </p>
                </div>
              </div>

              {/* Garment Selector Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {GARMENTS_ENCYCLOPEDIA.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGarmentId(g.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                      selectedGarmentId === g.id
                        ? 'bg-heritage-hoang text-black font-bold shadow-heritage-glow scale-[1.02]'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>

              {/* Garment Detail Card */}
              <div className="p-6 rounded-m3-lg bg-[#181A22] border border-white/10 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-heritage-hoang font-bold">
                      {currentGarment.era}
                    </span>
                    <h3 className="font-imperial font-bold text-2xl text-white mt-0.5">
                      {currentGarment.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Phân cấp: <strong className="text-amber-200">{currentGarment.socialStrata}</strong>
                    </p>
                  </div>

                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
                    ✓ Hữu Nhậm Enforced
                  </span>
                </div>

                {/* 4 Anatomical Specification Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-m3-md bg-[#121319] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Kiểu Dáng Cổ Áo</span>
                    <p className="text-xs font-bold text-white">{currentGarment.collar}</p>
                  </div>
                  <div className="p-3.5 rounded-m3-md bg-[#121319] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Quy Thức Cài Vạt</span>
                    <p className="text-xs font-bold text-emerald-400">{currentGarment.closure}</p>
                  </div>
                  <div className="p-3.5 rounded-m3-md bg-[#121319] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Khuy Cúc & Triết Lý</span>
                    <p className="text-xs font-bold text-cyber-lime">{currentGarment.buttons}</p>
                  </div>
                  <div className="p-3.5 rounded-m3-md bg-[#121319] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Chất Liệu Chuẩn Cổ</span>
                    <p className="text-xs font-bold text-amber-200">{currentGarment.material}</p>
                  </div>
                </div>

                {/* Anatomy Breakdowns */}
                <div className="space-y-2">
                  <h5 className="font-imperial font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-heritage-hoang" />
                    Đặc Điểm Giải Phẫu & Kỹ Thuật May Cắt:
                  </h5>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {currentGarment.anatomy.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 bg-[#14161D] p-2.5 rounded-m3-sm border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyber-lime shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-m3-md bg-[#14161D] border border-white/5 text-xs text-neutral-300 italic">
                  <strong className="text-heritage-hoang not-italic mr-1.5">[Khảo Cứu Lịch Sử]:</strong>
                  {currentGarment.historicalNotes}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* TAB 3: QUY THỨC BẤT BIẾN & 4 ĐẠI KỴ (HỮU NHẬM VS TẢ NHẬM)       */}
          {/* ---------------------------------------------------------------- */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Highlight Comparison Banner */}
              <div className="p-6 rounded-m3-lg bg-[#24171A] border-2 border-rose-600/80 space-y-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                      ĐỊNH CHẾ TỐI THƯỢNG CỦA CỔ PHỤC VIỆT
                    </span>
                    <h4 className="font-imperial font-bold text-xl text-white mt-0.5">
                      Quy Thức Bất Biến: "Hữu Nhậm" (右衽) vs "Tả Nhậm" (左衽)
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  Trong văn hóa phục sức truyền thống của người Việt qua các triều Lý, Trần, Lê và Nguyễn, trang phục luôn tuân thủ nguyên tắc <strong>Hữu Nhậm (右衽)</strong>: Vạt áo bên trái luôn đè lên vạt áo bên phải, hàng khuy cài về phía nách phải.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-m3-md bg-emerald-950/40 border border-emerald-600/60 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>HỮU NHẬM (右衽) — QUY THỨC NGƯỜI SỐNG</span>
                    </div>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
                      <li>Khép vạt từ Trái sang Phải, hàng nút ở sườn phải.</li>
                      <li>Tượng trưng cho dương khí, sự sinh sôi nảy nở và lễ giáo quang minh.</li>
                      <li>5 Hạt nút áo ngũ thân tượng trưng cho <strong>Ngũ Luân / Ngũ Thường</strong>: <em>Nhân, Lễ, Nghĩa, Trí, Tín</em>.</li>
                      <li>Được bảo tồn bất biến trong mọi nghi thức cung đình lẫn thường nhật.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-m3-md bg-rose-950/60 border border-rose-600/60 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase font-mono">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>TẢ NHẬM (左衽) — ĐẠI KỴ TANG MA</span>
                    </div>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
                      <li>Khép vạt từ Phải sang Trái, hàng nút ở sườn trái.</li>
                      <li><strong>Chỉ dùng duy nhất trong khâm liệm người đã khuất</strong> để đưa tiễn linh hồn về cõi âm thế.</li>
                      <li>Người sống tuyệt đối không mặc Tả Nhậm; cổ thư xem đây là điều xui rủi, đại kỵ tâm linh.</li>
                      <li>Sử xưa từng gọi tộc người ngoài mặc cài vạt sang trái là dấu hiệu dị tộc xa lạ.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4 Cultural Guardrails System */}
              <div className="space-y-3">
                <h5 className="font-imperial font-bold text-base text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-heritage-hoang" />
                  4 Bộ Quy Tắc Văn Hóa Tự Động (Responsible AI Guardrails):
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-m3-md bg-[#181A22] border border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] text-rose-400 font-bold">TABOO 01</span>
                    <h6 className="font-imperial font-bold text-sm text-white">Chống Vi Phạm Tả Nhậm</h6>
                    <p className="text-neutral-300 leading-relaxed">
                      Hệ thống tự động phát hiện và khóa cơ chế lật vạt trái đè phải. Nếu người dùng cố tình kéo sang trái, từ trường "Magnetic Hữu Nhậm Snap" sẽ giật rung và snap ngược về bên phải.
                    </p>
                  </div>

                  <div className="p-4 rounded-m3-md bg-[#181A22] border border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">TABOO 02</span>
                    <h6 className="font-imperial font-bold text-sm text-white">Chống Đồng Hóa Văn Hóa</h6>
                    <p className="text-neutral-300 leading-relaxed">
                      Ngăn chặn nhầm lẫn Áo Giao Lĩnh với Hán phục Tiên hiệp (Hanfu Ruqun thắt nơ ngực), đai Obi Kimono Nhật Bản hay cổ sườn xám Mãn Thanh. Giữ gìn nguyên vẹn cốt cách Đại Việt.
                    </p>
                  </div>

                  <div className="p-4 rounded-m3-md bg-[#181A22] border border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] text-yellow-400 font-bold">TABOO 03</span>
                    <h6 className="font-imperial font-bold text-sm text-white">Quy Định Thẩm Quyền Hoàng Tộc</h6>
                    <p className="text-neutral-300 leading-relaxed">
                      Trang phục streetwear và kỷ yếu không được tự tiện dùng sắc Chính Hoàng nguyên chất (#FFD700) và họa tiết Ngũ Trảo Kim Long (rồng 5 móng) vốn là độc quyền tối thượng của Hoàng đế.
                    </p>
                  </div>

                  <div className="p-4 rounded-m3-md bg-[#181A22] border border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">TABOO 04</span>
                    <h6 className="font-imperial font-bold text-sm text-white">Đoan Trang Hạ Y Truyền Thống</h6>
                    <p className="text-neutral-300 leading-relaxed">
                      Cổ phục tà dài (Áo Dài, Ngũ Thân, Áo Tấc) bắt buộc phải đi cùng quần dài chạm mu bàn chân (quần lụa trắng hoặc đen Lãnh Mỹ Á); tuyệt đối cấm mặc áo dài không quần hoặc cắt xẻ lộ đùi phản cảm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* TAB 4: THƯ TỊCH & TRÍCH DẪN SỬ LIỆU (GROUNDED ARCHIVES)           */}
          {/* ---------------------------------------------------------------- */}
          {activeTab === 'archives' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="font-imperial font-bold text-base text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-heritage-hoang" />
                    Thư Tịch Cổ & Nguồn Sử Liệu Đã Thẩm Định
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Trích dẫn nguyên văn từ các trước tác chính sử của Quốc Sử Quán và Viện Nghiên cứu Văn hóa
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    book: 'Khâm Định Đại Nam Hội Điển Sự Lệ (欽定大南會典事例)',
                    author: 'Nội các triều Nguyễn biên soạn (1843 – 1851)',
                    quote:
                      'Năm Minh Mạng thứ 8 (1827): "Định chế thường phục của nhân dân: đàn ông, đàn bà đều mặc áo năm thân cổ đứng, tay chẽn, khuy năm hạt cài bên hữu, quần dài che gót... nhằm giữ lễ tiết thuần phong."',
                    link: 'http://baotanglichsu.vn/vi/Articles/3096/13359/kham-dinh-dai-nam-hoi-dien-su-le.html'
                  },
                  {
                    book: 'Đại Nam Thực Lục Chính Biên (大南寔錄正編)',
                    author: 'Quốc Sử Quán triều Nguyễn',
                    quote:
                      'Chúa Võ Vương Nguyễn Phúc Khoát định sắc phục năm Giáp Tý (1744): "Thường phục thì đàn ông, đàn bà dùng áo cổ đứng, vạt chéo bên hữu, nẹp có năm cúc, tay áo rộng hẹp tùy nghi, mặc quần không đáy."',
                    link: 'http://baotanglichsu.vn/vi/Articles/3096/12480/dai-nam-thuc-luc-chinh-bien.html'
                  },
                  {
                    book: 'Ngàn Năm Áo Mũ (Lịch sử trang phục Việt Nam)',
                    author: 'Nhà nghiên cứu Trần Quang Đức (2013)',
                    quote:
                      'Hệ thống khảo cứu phục dựng toàn diện văn hóa trang phục Việt Nam từ thời Lý, Trần, Lê đến Nguyễn dựa trên hiện vật điêu khắc lăng tẩm và tranh cổ.',
                    link: 'https://vi.wikipedia.org/wiki/Ng%C3%A0n_n%C4%83m_%C3%A1o_m%C5%A9'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-m3-md bg-[#181A22] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-imperial font-bold text-sm text-amber-200">
                        {item.book}
                      </span>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-cyber-lime hover:underline flex items-center gap-1"
                      >
                        <span>Xem Nguồn Lưu Trữ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 block">{item.author}</span>
                    <p className="text-xs text-neutral-300 italic bg-[#121319] p-3 rounded border border-white/5 leading-relaxed">
                      "{item.quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* FOOTER: Responsible AI Assurance & Close                           */}
        {/* ================================================================== */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#171920] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">VibePhục Heritage Verification Protocol</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-heritage-hoang hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-heritage-glow"
            >
              Đã Hiểu Điển Lệ & Quy Thức
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalGuardrailModal;
