'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Crown,
  Wand2,
  FileCheck2,
  CheckCircle2,
  Compass,
  Palette,
  HeartHandshake
} from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (route: 'atelier' | 'ai-studio' | 'rules' | 'lookbooks' | 'wiki') => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#FAF9F5] text-[#1E2024] pb-24 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* ==================================================================== */}
      {/* 1. HERO SECTION: GIỚI THIỆU TỔNG QUAN VIBEPHỤC STUDIO (LIGHT THEME)  */}
      {/* ==================================================================== */}
      <section className="relative z-10 pt-10 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-700" />
            <span>Nền Tảng Thời Trang Di Sản Việt Nam · Kỷ Nguyên Số</span>
          </div>

          {/* Main Title */}
          <h1 className="font-imperial text-4xl sm:text-6xl md:text-7xl font-black text-neutral-900 tracking-tight leading-tight">
            Tôn Vinh Cổ Phục Việt <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600">
              Trong Nhịp Sống Đương Đại
            </span>
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-sm sm:text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            <strong>VibePhục Studio</strong> là không gian số hóa và giám tuyển phục sức truyền thống Việt Nam: Kết nối tơ lụa trăm năm với thời trang đương đại thông qua Xưởng phối đồ 2D tương tác, Văn thư Wiki bách khoa chuẩn sử liệu, và Trí tuệ nhân tạo cố vấn phong cách.
          </p>

          {/* CTA Buttons Group */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => onNavigate('atelier')}
              className="px-8 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-imperial font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Bắt Đầu Phối Đồ Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('wiki')}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-amber-50/60 text-stone-800 font-mono font-bold text-xs flex items-center gap-2 transition-all border border-stone-300 hover:border-amber-400 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Tra Cứu Wiki Cổ Phục</span>
            </button>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm text-center">
              <span className="text-amber-700 font-bold text-lg block">7 Thời Kỳ</span>
              <span className="text-stone-500 text-[11px]">Tiến trình y phục lịch sử</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm text-center">
              <span className="text-emerald-700 font-bold text-lg block">Chuẩn Điển Chế</span>
              <span className="text-stone-500 text-[11px]">Sử sách triều Nguyễn & Lý Trần</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm text-center">
              <span className="text-blue-700 font-bold text-lg block">6 Lớp Phối Đồ</span>
              <span className="text-stone-500 text-[11px]">Bóc tách trang phục trực quan</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm text-center">
              <span className="text-purple-700 font-bold text-lg block">Chuẩn 9:16</span>
              <span className="text-stone-500 text-[11px]">Thẻ Heritage Passport Story</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 2. MẪU CỔ PHỤC TIÊU BIỂU VỚI ẢNH CHUẨN XÁC WIKIMEDIA COMMONS         */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto border-t border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-amber-700 font-bold tracking-widest block">
                Kho Tàng Di Sản Phục Sức
              </span>
              <h2 className="font-imperial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Các Mẫu Cổ Phục Chuẩn Mực Điển Chế
              </h2>
            </div>
            <button
              onClick={() => onNavigate('wiki')}
              className="text-xs font-mono text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Xem Dòng Thời Gian & Điển Chế Chi Tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Áo Nhật Bình',
                era: 'Hoàng Cung Triều Nguyễn',
                role: 'Lễ phục bậc cao Hậu phi & Công chúa',
                imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Empress%20Nam%20Phuong.jpg',
                caption: 'Hoàng hậu Nam Phương mặc áo Nhật Bình và quấn khăn vành dây',
                note: 'Cổ hình chữ nhật viền thêu bản lớn, dải ngũ sắc ngũ hành ở cửa tay áo và dây ngọc thao thắt ngực.'
              },
              {
                name: 'Áo Tấc (Áo Tay Thụ)',
                era: 'Triều Nguyễn (1802 – 1945)',
                role: 'Đại lễ phục trang trọng của cả nam lẫn nữ',
                imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Geedzi%C4%9Da%20festo%20en%20vila%C4%9Do%20apud%20Hue%2071.jpg',
                caption: 'Áo Tấc trong nghi lễ truyền thống xứ Huế',
                note: 'Hai ống tay thụng vuông vức bản rộng 30-50cm buông ngang vạt áo, khi chắp tay hành lễ tạo phong thái đoan trang.'
              },
              {
                name: 'Áo Ngũ Thân Tay Chẽn',
                era: 'Định chế Chúa Nguyễn & Vua Minh Mạng',
                role: 'Thường phục chuẩn mực toàn dân',
                imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Costumes%20Annamites%20Cambodgiens%20et%20Siamois%20(Vietnamese%20Cambodian%20Thai)%20c1870.jpg',
                caption: 'Ký họa trang phục Áo Ngũ Thân Lập Lĩnh thế kỷ 19',
                note: '5 thân vải ghép lại mang ý nghĩa ngũ thường, cổ đứng lập lĩnh 2-3cm, tay ôm gọn gàng thuận tiện làm việc.'
              },
              {
                name: 'Áo Tứ Thân Kinh Bắc',
                era: 'Đồng Bằng Bắc Bộ (Lý - Trần - Lê)',
                role: 'Y phục dân gian & Liền chị quan họ',
                imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Li%E1%BB%81n%20ch%E1%BB%8B%20quan%20h%E1%BB%8D%20-%20H%E1%BB%99i%20Lim%2C%20B%E1%BA%AFc%20Ninh.JPG',
                caption: 'Liền chị quan họ Hội Lim trong áo Tứ Thân nón quai thao',
                note: '4 thân vải mộc mạc thắt vạt lươn trước bụng, khéo léo để lộ áo yếm lụa đào và nón ba tầm quai thao che nắng.'
              },
              {
                name: 'Áo Bà Ba Nam Bộ',
                era: 'Vùng Sông Nước Nam Bộ (TK 19 – Nay)',
                role: 'Y phục hào sảng, phóng khoáng phương Nam',
                imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Peasant%20in%20%C3%A1o%20b%C3%A0%20ba.jpg',
                caption: 'Phụ nữ Nam Bộ mộc mạc trong tà Áo Bà Ba',
                note: 'Xẻ dọc giữa cúc áo, xẻ tà ngang hông, hai túi vuông vạt trước tiện lợi, kết hợp quần lụa đen và khăn rằn caro.'
              },
              {
                name: 'Áo Dài Raglan Nữ Sinh',
                era: 'Thập niên 1960 – Nay',
                role: 'Quốc phục thanh xuân & học đường',
                imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2%20girls%20in%20aodai%20and%20a_tree.jpg',
                caption: 'Nữ sinh trong tà áo dài trắng thướt tha ráp tay Raglan',
                note: 'Bước đột phá ráp tay raglan chéo từ cổ áo xuống nách triệt tiêu nếp nhăn, ôm khít đường cong duyên dáng.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-amber-200 border border-white/20">
                      {item.role}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.era}
                      </span>
                    </div>
                    <h4 className="font-imperial font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1 border-t border-stone-100 text-[11px] text-stone-500 italic">
                  * {item.caption}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 3. 3 TRỤ CỘT CỦA NỀN TẢNG (THE 3 CORE PILLARS)                         */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto border-t border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase text-amber-700 font-bold tracking-widest">
              Sứ Mệnh & Giá Trị
            </span>
            <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-stone-900">
              Đưa Cổ Phục Bước Ra Khỏi Bảo Tàng
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Chúng tôi tin rằng di sản sống mãnh liệt nhất là khi được người trẻ tự hào mặc trong lễ kỷ yếu, ngày tết sum vầy, đám cưới truyền thống và những sự kiện thanh xuân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-imperial font-bold text-lg text-stone-900">
                1. Chuẩn Xác Sử Liệu & Điển Chế
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mọi kết cấu từ sống lưng Chính Trung (đạo ngay thẳng), 5 cúc Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) đến tà áo Áo Tấc, Nhật Bình đều được căn cứ theo chính sử <em>Khâm Định Đại Nam Hội Điển Sự Lệ</em> và <em>Đại Nam Thực Lục</em>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-300 flex items-center justify-center text-blue-700">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-imperial font-bold text-lg text-stone-900">
                2. Xưởng Thử Đồ Bóc Tách Đa Tầng Lớp
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cơ chế phối đồ 6 tầng lớp thời gian thực: Quần lụa hạ y, Áo trung đơn lót trong, Áo chính, Áo khoác tân kỳ và Phụ kiện kiềng bạc, nón quai thao với chế độ quét X-Ray và thử gương mặt qua Camera.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-imperial font-bold text-lg text-stone-900">
                3. Tôn Trọng Văn Hóa & Phù Hợp Bối Cảnh
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hướng dẫn văn hóa chu đáo: phân biệt quy thức khép vạt người sống với nghi thức tống táng, giữ gìn nét riêng tránh nhầm lẫn với y phục lân bang, và tư vấn trang phục hài hòa theo dịp sự kiện.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 4. HỆ THỐNG CÔNG CỤ TẠI VIBEPHỤC (4 CORE WORKFLOWS)                  */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-12 px-4 max-w-6xl mx-auto border-t border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase text-amber-700 font-bold tracking-widest">
              Bộ Công Cụ Sáng Tạo
            </span>
            <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-stone-900">
              Trải Nghiệm Toàn Diện Tại VibePhục
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Khám phá quy trình từ nghiên cứu văn sử, thử đồ trên ma-nơ-canh đến xuất thẻ chia sẻ mạng xã hội.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Module 1: Xưởng Phối Đồ 2D */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 transition-all space-y-4 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                    Trải Nghiệm Cốt Lõi
                  </span>
                </div>
                <h3 className="font-imperial font-bold text-xl text-stone-900">
                  Xưởng Phối Đồ Atelier & Mannequin Stage
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Trực tiếp ướm thử trang phục trên ma-nơ-canh vector với khả năng tùy biến màu sắc tơ lụa theo ngũ hành, phối đồ theo bối cảnh ba miền Bắc - Trung - Nam, và hỗ trợ tải ảnh khuôn mặt cá nhân hoặc chụp webcam.
                </p>
              </div>
              <button
                onClick={() => onNavigate('atelier')}
                className="text-xs font-mono text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1.5 transition-colors pt-2 cursor-pointer"
              >
                <span>Mở Xưởng Phối Đồ Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 2: Wiki Cổ Phục */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 transition-all space-y-4 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-bold">
                    Bách Khoa Sử Liệu
                  </span>
                </div>
                <h3 className="font-imperial font-bold text-xl text-stone-900">
                  Wiki Cổ Phục & Tiến Trình Timelines
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Trang chuyên khảo toàn diện với dòng thời gian lịch sử, bách khoa giải phẫu 6 hệ trang phục kinh điển kèm hình ảnh tư liệu chuẩn xác từ Bảo tàng Dân tộc học và văn thư chính sử.
                </p>
              </div>
              <button
                onClick={() => onNavigate('wiki')}
                className="text-xs font-mono text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1.5 transition-colors pt-2 cursor-pointer"
              >
                <span>Mở Văn Thư Bách Khoa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 3: Gemini AI Remix Studio */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 transition-all space-y-4 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                    AI Giám Tuyển
                  </span>
                </div>
                <h3 className="font-imperial font-bold text-xl text-stone-900">
                  Gemini AI Heritage Remix Studio
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Cố vấn phong cách AI thông minh gợi ý bản phối trang phục di sản theo dịp cụ thể (Kỷ yếu học đường, Tết du xuân, Lễ cưới cổ truyền, Dạ hội Prom) kèm phân tích màu sắc và thơ xướng họa.
                </p>
              </div>
              <button
                onClick={() => onNavigate('ai-studio')}
                className="text-xs font-mono text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1.5 transition-colors pt-2 cursor-pointer"
              >
                <span>Khám Phá Cùng Gemini AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Module 4: Digital Heritage Passport */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-blue-400 transition-all space-y-4 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-300 flex items-center justify-center text-blue-700">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold">
                    Xuất Ảnh HD
                  </span>
                </div>
                <h3 className="font-imperial font-bold text-xl text-stone-900">
                  Bộ Xuất Thẻ Di Sản Số (Passport 9:16)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Kết xuất thẻ Digital Heritage Passport chuẩn tỉ lệ dọc 9:16 cho Instagram Story và TikTok, đính kèm con dấu di sản, phân tích bảng màu Ngũ Hành và mã QR tra cứu lịch sử nhanh.
                </p>
              </div>
              <button
                onClick={() => onNavigate('atelier')}
                className="text-xs font-mono text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 transition-colors pt-2 cursor-pointer"
              >
                <span>Tạo Thẻ Passport Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 5. CALL TO ACTION CUỐI TRANG                                         */}
      {/* ==================================================================== */}
      <section className="relative z-10 pt-10 pb-16 px-4 max-w-4xl mx-auto text-center border-t border-stone-200">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-amber-300/80 space-y-6 shadow-md">
          <Crown className="w-8 h-8 text-amber-600 mx-auto" />
          <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-stone-900">
            Khám Phá & Sáng Tạo Phong Cách Cổ Phục Của Bạn
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Chọn tà áo truyền thống yêu thích, tra cứu nguồn gốc lịch sử hoặc sáng tạo bản phối đương đại cùng VibePhục Studio ngay bây giờ.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('atelier')}
              className="px-8 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-imperial font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Vào Xưởng Phối Đồ Ngay</span>
            </button>
            <button
              onClick={() => onNavigate('wiki')}
              className="px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono font-bold text-xs flex items-center gap-2 transition-all border border-stone-300 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Mở Wiki Cổ Phục Toàn Thư</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OnboardingPage;
