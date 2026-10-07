'use client';

import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Clock,
  BookOpen,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Crown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Share2,
  FileText
} from 'lucide-react';

interface WikiHeritagePageProps {
  onNavigate: (route: 'atelier' | 'ai-studio' | 'rules' | 'lookbooks' | 'onboarding') => void;
}

interface TimelineItem {
  id: string;
  era: string;
  period: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  imageUrl: string;
  imageCaption: string;
  description: string;
  garments: string[];
  historicalNotes: string;
  quote?: string;
  quoteAuthor?: string;
}

// Authentic Wikimedia Commons Historical Imagery
const HISTORICAL_TIMELINE: TimelineItem[] = [
  {
    id: 'ly-tran-le',
    era: 'THỜI KỲ ĐẠI VIỆT TỰ CHỦ',
    period: 'Thế kỷ 11 – 15 (Thời Lý, Trần, Hồ, Lê Sơ)',
    title: 'Khởi Thủy Áo Giao Lĩnh & Tứ Thân',
    subtitle: 'Nền tảng trang phục tự chủ của văn minh sông Hồng',
    tag: 'Đại Việt Khởi Nguyên',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/PQ_2022%2C_Th%C4%83ng_Long_c%E1%BB%95_tr%E1%BA%A5n_%28c%E1%BB%95_ph%E1%BB%A5c_Vi%E1%BB%87t%29_%281%29.jpg',
    imageCaption: 'Phục dựng y phục cổ thời Lý - Trần tại Thăng Long',
    description:
      'Trang phục thời Lý - Trần - Lê mang đặc trưng cổ chéo (Giao Lĩnh) vạt thụng rộng, tay áo buông dài trang nghiêm. Trong đời sống dân gian, phụ nữ chuộng Áo Tứ Thân mộc mạc bốn thân vải buông lơi hoặc buộc thắt vạt lươn trước bụng, kết hợp áo yếm lụa đào và nón quai thao ba tầm che nắng mưa.',
    garments: ['Áo Giao Lĩnh (Cổ chéo)', 'Áo Tứ Thân', 'Áo Yếm Cánh Sen', 'Nón Quai Thao'],
    historicalNotes:
      'Các sắc dụ đầu tiên thời Lý - Trần bắt đầu quy định rõ ràng y phục triều nghi của quan lại và dân chúng nhằm phân biệt với phong tục lân bang, giữ gìn phong hóa phương Nam.',
    quote: 'Núi sông bờ cõi đã chia, phong tục Bắc Nam cũng khác.',
    quoteAuthor: 'Bình Ngô Đại Cáo — Nguyễn Trãi (1428)'
  },
  {
    id: 'chua-nguyen',
    era: 'BƯỚC NGOẶT ĐÀNG TRONG',
    period: 'Năm 1744 (Chúa Võ Vương Nguyễn Phúc Khoát)',
    title: 'Định Chế Áo 5 Thân Xứ Thuận Hóa',
    subtitle: 'Nguồn gốc trực tiếp sinh thành ra Áo Dài truyền thống',
    tag: 'Cội Nguồn 5 Thân',
    tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Costumes_Annamites_Cambodgiens_et_Siamois_%28Vietnamese_Cambodian_Thai%29_c1870.jpg',
    imageCaption: 'Ký họa trang phục người Việt thế kỷ 19 (Costumes Annamites)',
    description:
      'Năm 1744, khi xưng vương tại Đàng Trong, Chúa Nguyễn Phúc Khoát ban hành sắc lệnh cải cách toàn diện y phục để xác lập bản sắc riêng: Toàn dân mặc áo cài cúc bên nách phải, cổ đứng ôm tròn (Lập Lĩnh), may ghép bằng 5 thân vải và mặc quần dài hai ống thay cho váy đụp.',
    garments: ['Áo Tiền thân Ngũ Thân Lập Lĩnh', 'Quần Lụa Dài Đáy', 'Khăn Đóng Vấn'],
    historicalNotes:
      'Đây là cột mốc lịch sử mang tính khai sinh của tiền thân chiếc Áo Dài Việt Nam. Sách Đại Nam Thực Lục ghi rõ: "Thường phục thì đàn ông đàn bà dùng áo cổ đứng, vạt chéo bên hữu, nẹp có 5 cúc, mặc quần không đáy."',
    quote: 'Đàn ông đàn bà đều dùng áo cổ đứng, nẹp 5 cúc bên hữu, quần dài che gót.',
    quoteAuthor: 'Đại Nam Thực Lục Tiền Biên'
  },
  {
    id: 'trieu-nguyen',
    era: 'HOÀNG KIM TRIỀU NGUYỄN',
    period: '1802 – 1945 (Thời Gia Long, Minh Mạng đến Bảo Đại)',
    title: 'Thống Nhất Toàn Quốc: Áo Tấc & Áo Nhật Bình',
    subtitle: 'Đỉnh cao của điển chế mỹ thuật cung đình và thường phục',
    tag: 'Đỉnh Cao Điển Chế',
    tagColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Empress_Nam_Phuong.jpg',
    imageCaption: 'Hoàng hậu Nam Phương trong triều phục Áo Nhật Bình và khăn vành dây',
    description:
      'Dưới triều vua Minh Mạng (1820 – 1841), quy chế y phục được áp dụng đồng bộ khắp Bắc - Trung - Nam. Xã hội định hình rõ ràng: Áo Tấc (tay thụng vuông 30-50cm) làm đại lễ phục; Áo Ngũ Thân tay chẽn làm thường phục gọn gàng; và Áo Nhật Bình (cổ vuông chữ nhật viền ngũ sắc) là đặc quyền cao quý của bậc Hoàng thái hậu, Hoàng hậu và Công chúa.',
    garments: ['Áo Tấc (Tay Thụ)', 'Áo Ngũ Thân Tay Chẽn', 'Áo Nhật Bình', 'Khăn Vành Dây'],
    historicalNotes:
      'Trục sống lưng "Chính Trung" được may ngay ngắn ở lưng áo nhắc nhở tâm hồn người mặc luôn ngay thẳng, quang minh chính đại. Hàng 5 cúc đại diện cho đạo lý Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
    quote: 'Nước có quy tắc, áo có điển chế; giữ lấy lễ tiết thuần phong của tiên đế.',
    quoteAuthor: 'Khâm Định Đại Nam Hội Điển Sự Lệ — Vua Minh Mạng (1827)'
  },
  {
    id: 'lemur-1930',
    era: 'PHONG TRÀO TÂN THỜI',
    period: 'Thập niên 1930 (Nhóm Tự Lực Văn Đoàn)',
    title: 'Cuộc Cải Cách Âu Hóa Của Họa Sĩ Cát Tường',
    subtitle: 'Áo Dài Le Mur thổi làn gió tân kỳ vào thời trang Hà Nội',
    tag: 'Canh Tân Le Mur',
    tagColor: 'bg-purple-100 text-purple-900 border-purple-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Ao_dai.jpg',
    imageCaption: 'Tà áo dài duyên dáng Việt Nam thời kỳ canh tân mỹ thuật',
    description:
      'Họa sĩ Cát Tường (bút danh Le Mur) thuộc tuần báo Phong Hóa khởi xướng cuộc cách mạng áo dài: Rút gọn thân áo ôm sát đường cong ngực và eo, đưa vào các chi tiết Tây phương như vai bồng, cổ sen bẻ, viền ren đăng ten và vạt quét đất. Đây là bước ngoặt giải phóng thân thể phụ nữ thoát ly tính chất suông rộng phong kiến.',
    garments: ['Áo Dài Le Mur Cổ Sen', 'Áo Dài Vai Bồng', 'Quần Lụa Trắng Ống Rộng'],
    historicalNotes:
      'Áo Dài Le Mur đã mở ra tư duy thiết kế thời trang hiện đại đầu tiên tại Việt Nam, tôn vinh vẻ đẹp hình thể và nét thanh lịch của phụ nữ.',
    quote: 'Chiếc áo dài của chị em không phải là một thứ để che giấu, mà là để tôn vinh sự mỹ lệ đoan trang.',
    quoteAuthor: 'Họa sĩ Cát Tường (Báo Phong Hóa, 1934)'
  },
  {
    id: 'raglan-1960',
    era: 'ĐỘT PHÁ KỸ THUẬT RÁP TAY',
    period: 'Thập niên 1960 (Hiệu may Dung Đakao Sài Gòn)',
    title: 'Áo Dài Raglan Nữ Sinh: Đỉnh Cao Kỹ Thuật May',
    subtitle: 'Phát minh triệt tiêu nếp gấp nhăn nách kinh điển',
    tag: 'Đột Phá Kỹ Thuật',
    tagColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/2_girls_in_aodai_and_a_tree.jpg',
    imageCaption: 'Nữ sinh trong tà áo dài trắng thướt tha thanh xuân',
    description:
      'Hiệu may Dung tại Đakao (Sài Gòn) sáng chế phương pháp nối tay Raglan xéo nách: Ống tay được ráp chéo từ chân cổ áo xuống nách. Sáng chế này xóa bỏ hoàn toàn các nếp gấp nhăn nhúm dưới nách của kiểu may cũ, giúp ngực áo phẳng phiu ôm sát cơ thể, cài bằng hàng nút bấm một bên sườn phải.',
    garments: ['Áo Dài Raglan Trắng Nữ Sinh', 'Nón Lá Chóp Xứ Huế', 'Guốc Mộc Gót Son'],
    historicalNotes:
      'Kỹ thuật Raglan trở thành phương pháp may chuẩn mực của Áo Dài Việt Nam cho đến tận hôm nay, đồng thời gắn liền với hình tượng tà áo dài trắng tinh khôi của nữ sinh Việt Nam.',
    quote: 'Tà áo nữ sinh tung bay trên đường phố như cánh bướm trắng chở mùa xuân.',
    quoteAuthor: 'Ký ức văn hóa áo dài thế kỷ 20'
  },
  {
    id: 'gen-z-neo-heritage',
    era: 'THẾ KỶ 21 & KỶ NGUYÊN SỐ',
    period: '2020s & Tương lai (VibePhục Studio)',
    title: 'Neo-Heritage: Di Sản Thở Cùng Nhịp Đập Gen Z',
    subtitle: 'Sự hòa quyện giữa tơ lụa nghìn năm và thời trang đương đại',
    tag: 'Tái Sinh Kỷ Nguyên Số',
    tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Ao_Dai_%28modern%29.jpg',
    imageCaption: 'Áo dài đương đại trong đời sống lễ hội và kỷ yếu thanh xuân',
    description:
      'Thế hệ trẻ Việt Nam phối ngẫu cổ phục với thời trang đường phố: Áo Tấc, Ngũ Thân được phối sáng tạo cùng Cyber Organza, quần Cargo parachute, chunky sneaker và túi tote chàm. Dù cách tân phá cách, phom dáng thanh nhã và nề nếp đoan trang vẫn được người mặc trân trọng gìn giữ.',
    garments: ['Áo Tấc Streetwear', 'Cyber Trench Coat', 'Cargo Indigo Denim', 'Chunky Sneaker'],
    historicalNotes:
      'VibePhục Studio ra đời như cầu nối số hóa đưa cổ phục vào không gian tương tác trực quan 2D để người trẻ dễ dàng tiếp cận và ứng dụng.',
    quote: 'Di sản không phải là giữ gìn đống tro tàn, mà là tiếp tục thắp sáng ngọn lửa.',
    quoteAuthor: 'Tuyên ngôn VibePhục Studio'
  }
];

interface GarmentArticle {
  id: string;
  name: string;
  category: string;
  era: string;
  region: string;
  imageUrl: string;
  imageAlt: string;
  collarSpec: string;
  lapelSpec: string;
  buttonSpec: string;
  fabricSpec: string;
  socialRole: string;
  overview: string;
  anatomyList: string[];
}

const GARMENT_ENCYCLOPEDIA_ARTICLES: GarmentArticle[] = [
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    category: 'Hoàng Cung Mệnh Phụ',
    era: 'Triều Nguyễn (1802 – 1945)',
    region: 'Kinh đô Huế',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Empress_Nam_Phuong.jpg',
    imageAlt: 'Hoàng hậu Nam Phương mặc áo Nhật Bình triều Nguyễn',
    collarSpec: 'Cổ Chữ Nhật viền bản lớn buông thẳng trước ngực',
    lapelSpec: 'Xẻ dọc chính giữa, cài cúc ngọc hoặc thắt dải ngọc thao',
    buttonSpec: 'Hàng cúc vàng hoặc dây thao thắt ngọc bội chính giữa ngực',
    fabricSpec: 'Sa, đoan, đoạn thêu chỉ kim tuyến hình phượng vũ, hoa mẫu đơn',
    socialRole: 'Lễ phục bậc cao của Hoàng thái hậu, Hoàng hậu, Công chúa và Mệnh phụ triều đình',
    overview:
      'Áo Nhật Bình là kiệt tác trang phục cung đình triều Nguyễn. Tên gọi bắt nguồn từ phần viền cổ áo hình chữ nhật bản lớn buông thẳng từ cổ xuống ngực. Trên vạt áo và tay áo được trang trí dải ngũ sắc tượng trưng cho Ngũ Hành, đi cùng xiêm bát quy lộng lẫy và khăn vành dây quấn 45-50 vòng quanh đầu.',
    anatomyList: [
      'Khung viền chữ nhật: Thêu hoa văn rồng phượng, bát bảo lộng lẫy bằng chỉ vàng bạc.',
      'Dải ngũ sắc tay áo: 5 màu đỏ, vàng, xanh, trắng, đen tượng trưng cho trời đất ngũ hành tương sinh.',
      'Phân cấp màu sắc nghiêm ngặt: Hoàng hậu mặc màu vàng chính hoàng, Công chúa mặc đỏ xích đào, Mệnh phụ mặc màu tím hoặc lam.',
      'Khăn vành dây: Dải lụa dài quấn tròn đều quanh đầu tạo thế vương miện uy nghi cao quý.'
    ]
  },
  {
    id: 'ao-tac-tay-thu',
    name: 'Áo Tấc (Áo Tay Thụ)',
    category: 'Đại Lễ Phục Triều Nguyễn',
    era: 'Triều Nguyễn (1802 – 1945)',
    region: 'Cung đình & Toàn quốc',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Geedzi%C4%9Da_festo_en_vila%C4%9Do_apud_Hue_71.jpg',
    imageAlt: 'Lễ phục Áo Tấc trong nghi lễ truyền thống xứ Huế',
    collarSpec: 'Cổ Lập Lĩnh cao đứng, dựng thẳng nghiêm cẩn',
    lapelSpec: 'Vạt trái đè vạt phải, khép sang nách phải',
    buttonSpec: '5 hạt cúc ngọc hoặc kim hoàn biểu thị Ngũ Thường',
    fabricSpec: 'Gấm cung đình, lụa vân dệt hoa văn chữ Thọ, Bát Bửu',
    socialRole: 'Đại lễ phục của quan viên, sĩ tử, tôn thất và nhân dân trong nghi lễ',
    overview:
      'Áo Tấc (hay còn gọi là Áo Tay Thụ) là phẩm phục tôn nghiêm bậc nhất trong hệ thống Ngũ Thân triều Nguyễn. Đặc trưng nổi bật nhất là hai ống tay áo thụng vuông vức bản rộng từ 30cm đến 50cm, chiều dài tay buông ngang bằng vạt áo. Khi chắp tay hành lễ, hai ống tay giao nhau tạo nên phong thái khiêm nhường, kính cẩn.',
    anatomyList: [
      'Tay thụng vuông vức: Biểu tượng cho sự bao dung, quy củ và phẩm hạnh của người quân tử.',
      'Phối phụ kiện chuẩn: Nam giới đội khăn đóng đen, nữ giới vấn khăn vành dây hoặc đeo kiềng bạc.',
      'Dịp nghi lễ: Dùng trong lễ tế tổ tiên, đăng khoa, lễ cưới cổ truyền, nghênh xuân khánh tiết.',
      'Vạt áo dài qua gối: Buông rủ trang nghiêm, thể hiện phong thái đĩnh đạc của bậc trí giả.'
    ]
  },
  {
    id: 'ao-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    category: 'Ngũ Thân Lập Lĩnh',
    era: 'Triều Nguyễn (1802 – 1945)',
    region: 'Toàn quốc (Bắc - Trung - Nam)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Costumes_Annamites_Cambodgiens_et_Siamois_%28Vietnamese_Cambodian_Thai%29_c1870.jpg',
    imageAlt: 'Áo Ngũ Thân Lập Lĩnh nẹp 5 cúc truyền thống triều Nguyễn',
    collarSpec: 'Cổ Lập Lĩnh (cổ đứng tròn ôm khít cổ 2 – 3cm)',
    lapelSpec: 'Khép vạt sang nách phải',
    buttonSpec: '5 hạt cúc đại diện Ngũ Luân (Quân thần, Phụ tử, Phu thê, Huynh đệ, Bằng hữu)',
    fabricSpec: 'Lụa tơ tằm, sa, đũi Nam Cao, lụa Lãnh Mỹ Á Tân Châu',
    socialRole: 'Thường phục trang trọng của cả nam lẫn nữ trong mọi tầng lớp',
    overview:
      'Áo ngũ thân tay chẽn là y phục chuẩn mực nhất của người Việt dưới triều Nguyễn. Tên gọi ngũ thân xuất phát từ kết cấu 5 thân vải: 2 thân trước, 2 thân sau và 1 thân con che chở bên trong. Áo có phom suông rộng vừa phải, ống tay ôm gọn từ khuỷu tay xuống cổ tay giúp cử động linh hoạt.',
    anatomyList: [
      'Sống lưng Chính Trung: Đường may nối giữa 2 thân sau chạy dọc cột sống, tượng trưng cho đạo làm người ngay thẳng chính trực.',
      'Thân con (Thân thứ 5): May lót kín đáo bên trong vạt trước, che chắn bảo vệ nội y và giữ trọn sự kín đáo tế nhị.',
      'Áo trung đơn trắng: Người mặc luôn mặc áo lót trắng bên trong, để lộ viền cổ sạch sẽ 1-2mm thanh lịch.',
      'Quần thụng lụa: Bắt buộc đi cùng quần lụa trắng hoặc đen chạm mu bàn chân; giữ trọn nếp đoan nghiêm.'
    ]
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc',
    category: 'Dân Gian Cổ Truyền',
    era: 'Thời Lý - Trần - Lê',
    region: 'Đồng bằng Bắc Bộ',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Li%E1%BB%81n_ch%E1%BB%8B_quan_h%E1%BB%8D_-_H%E1%BB%99i_Lim%2C_B%E1%BA%AFc_Ninh.JPG',
    imageAlt: 'Liền chị Quan họ Hội Lim trong trang phục Áo Tứ Thân nón quai thao',
    collarSpec: 'Cổ buông lơi hoặc cổ tròn khoe áo yếm đào',
    lapelSpec: 'Buộc chéo vạt lươn trước bụng hoặc thả buông tự nhiên',
    buttonSpec: 'Không dùng cúc kim loại; thắt bằng dải thắt lưng lụa đào',
    fabricSpec: 'Đũi tơ tằm, vải sồi, the nhuộm củ nâu, chàm',
    socialRole: 'Y phục phụ nữ bình dân, liền chị Quan họ và trẩy hội làng mùa xuân',
    overview:
      'Áo Tứ Thân là biểu tượng mộc mạc mà duyên dáng của người phụ nữ nông nghiệp Bắc Bộ. Áo gồm 4 thân vải: hai thân sau may nối sống lưng, hai thân trước thả dài có thể buông lơi hoặc buộc thắt vạt lươn trước bụng, bên trong để lộ chiếc áo yếm lụa đào khéo léo khoe chiếc cổ kiêu ba ngấn.',
    anatomyList: [
      'Áo Yếm lót trong: Yếm cổ xây hoặc yếm cánh sen đào duyên dáng.',
      'Nón Quai Thao: Nón ba tầm bản rộng che nắng mưa, có quai thao buông dài chấm ngực.',
      'Thắt lưng lụa đào: Dải lụa màu hồng đào hoặc xanh biếc thắt ngang eo tôn đường cong mềm mại.',
      'Váy đụp đen: Váy xòe dài chấm gót tiện lợi khi lội ruộng và lao động đồng áng.'
    ]
  },
  {
    id: 'ao-dai-raglan',
    name: 'Áo Dài Raglan Nữ Sinh',
    category: 'Tân Thời Cách Tân',
    era: 'Thập niên 1960 – Nay',
    region: 'Toàn quốc',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Ao_dai.jpg',
    imageAlt: 'Áo Dài truyền thống thướt tha thanh xuân',
    collarSpec: 'Cổ Lập Lĩnh cao 3-5cm hoặc cổ thuyền hiện đại',
    lapelSpec: 'Nút bấm cài một bên sườn phải theo đường ráp tay raglan',
    buttonSpec: 'Nút bấm kim loại ẩn bên trong mép áo',
    fabricSpec: 'Lụa tơ tằm Bảo Lộc, voan, gấm hoa chìm',
    socialRole: 'Quốc phục phụ nữ Việt Nam, đồng phục nữ sinh học đường và dạ tiệc',
    overview:
      'Được phát minh bởi nhà may Dung Đakao vào những năm 1960, Áo Dài Raglan là thành tựu cách tân vượt bậc: Ống tay được may ráp xéo từ cổ áo xuống nách, giúp thân áo ôm sát ngực và eo mà không hề để lại bất kỳ nếp nhăn nách nào, tạo nên nét bay bổng thanh thoát cho người phụ nữ Việt.',
    anatomyList: [
      'Đường ráp raglan: Nối xéo từ cổ xuống nách triệt tiêu nếp gấp nách nhăn nhúm.',
      'Eo chiết cong: Ôm sát đường cong cơ thể, xẻ tà cao vừa chạm cạp quần dài.',
      'Quần lụa trắng/đen ống rộng: Bay bổng theo nhịp bước chân, giữ gìn vẻ đoan trang.',
      'Nón lá bài thơ: Phụ kiện truyền thống đi cùng che nắng che mưa dịu dàng.'
    ]
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    category: 'Dân Gian Phương Nam',
    era: 'Thế kỷ 19 – Nay',
    region: 'Nam Bộ (Đồng bằng sông Cửu Long)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Women_Rowing_-_My_Tho_-_Vietnam.JPG',
    imageAlt: 'Áo Bà Ba chèo xuồng trên sông nước Nam Bộ',
    collarSpec: 'Cổ tròn hoặc cổ tim xẻ nông',
    lapelSpec: 'Xẻ dọc chính diện, cài hàng nút giữa ngực (không khép chéo)',
    buttonSpec: 'Hàng cúc nhựa hoặc cúc bọc vải chạy dọc chính trung',
    fabricSpec: 'Vải ú, vải lụa đen Lãnh Mỹ Á nhuộm quả mặc nưa',
    socialRole: 'Y phục sinh hoạt thường nhật của người dân sông nước miền Tây',
    overview:
      'Áo Bà Ba là y phục gắn liền với tâm hồn phóng khoáng, hào sảng và chân chất của con người Nam Bộ. Áo may xẻ tà hai bên hông tạo sự thoải mái khi chèo thuyền, lao động, có hai túi vuông tiện lợi ở hai vạt trước, thường đi cùng chiếc khăn rằn caro quàng cổ che nắng.',
    anatomyList: [
      'Xẻ tà hai bên hông: Giúp vạt áo mở rộng khi ngồi xuồng và cử động lao động.',
      'Hai túi vạt trước: Tiện lợi đựng các vật dụng cá nhân nhỏ gọn.',
      'Quần Lãnh Mỹ Á đen: Nhuộm quả mặc nưa Tân Châu đen bóng, mềm mịn không dính bùn.',
      'Khăn rằn caro Nam Bộ: Vừa là phụ kiện vừa là vật dụng che nắng thấm mồ hôi.'
    ]
  }
];

export const WikiHeritagePage: React.FC<WikiHeritagePageProps> = ({ onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [activeSection, setActiveSection] = useState<'timelines' | 'garments' | 'rules' | 'archives'>('timelines');
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('ao-nhat-binh');

  const currentGarment =
    GARMENT_ENCYCLOPEDIA_ARTICLES.find(g => g.id === selectedGarmentId) ||
    GARMENT_ENCYCLOPEDIA_ARTICLES[0];

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] text-[#1E2024] pb-24 font-sans selection:bg-[#B45309]/20 selection:text-[#92400E]">
      {/* Top Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-emerald-600 z-50 origin-left shadow-sm"
      />

      {/* ==================================================================== */}
      {/* 1. HERO HEADER: VĂN THƯ BÁCH KHOA CỔ PHỤC (THEME TRẮNG SANG TRỌNG)   */}
      {/* ==================================================================== */}
      <section className="relative z-10 pt-10 pb-12 px-4 max-w-7xl mx-auto text-center border-b border-neutral-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Văn Thư Điển Chế & Bách Khoa Toàn Thư Cổ Phục</span>
          </div>

          <h1 className="font-imperial text-3xl sm:text-5xl md:text-6xl font-black text-neutral-900 tracking-tight leading-tight">
            Wiki Cổ Phục & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600">
              Tiến Trình Di Sản Việt Nam
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Hệ thống tra cứu chuyên khảo về phục sức truyền thống Việt Nam: từ cội nguồn thời Lý - Trần, đỉnh cao triều Nguyễn đến nét thanh xuân áo dài tân thời.
          </p>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-2xl mx-auto text-xs font-mono">
            <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
              <span className="text-amber-700 font-bold text-base block">7 Thời Kỳ</span>
              <span className="text-neutral-500 text-[11px]">Tiến trình lịch sử</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
              <span className="text-emerald-700 font-bold text-base block">6 Hệ Trang Phục</span>
              <span className="text-neutral-500 text-[11px]">Cốt cách phục sức</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
              <span className="text-indigo-700 font-bold text-base block">Ảnh Wikimedia</span>
              <span className="text-neutral-500 text-[11px]">Tư liệu bảo tàng thực</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
              <span className="text-rose-700 font-bold text-base block">Chính Sử Thư Tịch</span>
              <span className="text-neutral-500 text-[11px]">Nội các triều Nguyễn</span>
            </div>
          </div>

          {/* Quick Jump Anchor Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'timelines', label: '1. Niên Biểu Lịch Sử (Timelines)', icon: Clock },
              { id: 'garments', label: '2. Bách Khoa Cổ Phục (Codex)', icon: Layers },
              { id: 'rules', label: '3. Quy Thức & Cốt Cách Cổ Phục', icon: ShieldCheck },
              { id: 'archives', label: '4. Thư Tịch Chính Sử', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id as any);
                  const el = document.getElementById(`section-${tab.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSection === tab.id
                    ? 'bg-amber-600 text-white shadow-md scale-105'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-sm'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 2. SECTION: TIẾN TRÌNH LỊCH SỬ (TIMELINES VỚI ẢNH WIKIMEDIA CHUẨN)   */}
      {/* ==================================================================== */}
      <section id="section-timelines" className="relative z-10 py-16 px-4 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-amber-800 font-bold">
            <Clock className="w-4 h-4" />
            <span>Dòng Chảy Lịch Sử Y Phục</span>
          </div>
          <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-neutral-900">
            Tiến Trình Phát Triển Y Phục Việt Nam
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
            Khảo cứu từng bước chuyển mình từ phom dáng thụng thời Lý - Trần đến quy chuẩn triều Nguyễn và phong trào tân thời thế kỷ 20.
          </p>
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative border-l-2 border-amber-300 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-14">
          {HISTORICAL_TIMELINE.map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-2 w-6 h-6 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
              </div>

              {/* Milestone Card (Theme Sáng Tinh Tế) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/80 shadow-sm hover:shadow-md transition-all space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold block">
                      {milestone.era}
                    </span>
                    <h3 className="font-imperial font-bold text-xl sm:text-2xl text-neutral-900 mt-1">
                      {milestone.title}
                    </h3>
                    <p className="text-xs font-mono text-amber-800 mt-0.5">{milestone.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border ${milestone.tagColor}`}>
                      {milestone.tag}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      {milestone.period}
                    </span>
                  </div>
                </div>

                {/* Real Photographic Showcase (Ảnh Wikimedia Commons Chuẩn Xác) */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 group/img">
                  <img
                    src={milestone.imageUrl}
                    alt={milestone.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/img:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[11px] font-mono text-white bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                    📷 {milestone.imageCaption}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                  {milestone.description}
                </p>

                {/* Garments tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-mono text-neutral-500 mr-2">Y phục tiêu biểu:</span>
                  {milestone.garments.map((g, gIdx) => (
                    <span
                      key={gIdx}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 font-medium"
                    >
                      ✓ {g}
                    </span>
                  ))}
                </div>

                {/* Historical Quote Box */}
                {milestone.quote && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border-l-4 border-amber-600 text-xs text-neutral-800 italic space-y-1">
                    <p className="font-imperial text-amber-950 font-semibold">"{milestone.quote}"</p>
                    <span className="not-italic text-[10px] font-mono text-neutral-600 block">
                      — {milestone.quoteAuthor}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. SECTION: BÁCH KHOA CỔ PHỤC (ẢNH THỰC TẾ & GIẢI PHẪU Y PHỤC)        */}
      {/* ==================================================================== */}
      <section id="section-garments" className="relative z-10 py-16 px-4 max-w-7xl mx-auto space-y-10 border-t border-neutral-200">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-800 font-bold">
            <Layers className="w-4 h-4" />
            <span>Bách Khoa Cổ Phục Toàn Thư</span>
          </div>
          <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-neutral-900">
            6 Hệ Thống Y Phục Cốt Lõi Của Người Việt
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Khảo cứu ảnh tư liệu thực tế, hình thể cổ áo, nẹp vạt và chất liệu tơ lụa chuẩn mực.
          </p>
        </div>

        {/* Garment Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GARMENT_ENCYCLOPEDIA_ARTICLES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGarmentId(g.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGarmentId === g.id
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-sm'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Selected Garment Spotlight Feature Card */}
        <motion.div
          key={currentGarment.id}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 sm:p-10 rounded-2xl bg-white border border-neutral-200 shadow-sm"
        >
          {/* Left Column (5 cols): Authentic Image & Identification */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
              <img
                src={currentGarment.imageUrl}
                alt={currentGarment.imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm border border-white/30 font-bold uppercase">
                  {currentGarment.category}
                </span>
                <h4 className="font-imperial font-bold text-xl text-white">
                  {currentGarment.name}
                </h4>
                <p className="text-[11px] font-mono text-neutral-200">
                  {currentGarment.region} · {currentGarment.era}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('atelier')}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-imperial font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Thử Mẫu Này Tại Xưởng Atelier 2D</span>
            </button>
          </div>

          {/* Right Column (7 cols): Anatomical Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase text-amber-800 font-bold block">
                {currentGarment.socialRole}
              </span>
              <h3 className="font-imperial font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
                {currentGarment.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2">
                {currentGarment.overview}
              </p>
            </div>

            {/* 4 Technical Parameter Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase">Cổ Áo & Bản Nẹp</span>
                <p className="font-bold text-neutral-900 text-xs">{currentGarment.collarSpec}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase">Quy Cách Khép Vạt</span>
                <p className="font-bold text-emerald-800 text-xs">{currentGarment.lapelSpec}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase">Khuy Cúc & Phụ Kiện</span>
                <p className="font-bold text-indigo-800 text-xs">{currentGarment.buttonSpec}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase">Chất Liệu Truyền Thống</span>
                <p className="font-bold text-amber-900 text-xs">{currentGarment.fabricSpec}</p>
              </div>
            </div>

            {/* Anatomy Points */}
            <div className="space-y-2.5">
              <h5 className="font-imperial font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Đặc Điểm Kết Cấu & Kỹ Thuật May:
              </h5>
              <ul className="space-y-2 text-xs text-neutral-700">
                {currentGarment.anatomyList.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 4. SECTION: QUY THỨC CỐT CÁCH & ĐẶC TRƯNG TỪNG DÒNG ÁO               */}
      {/* ==================================================================== */}
      <section id="section-rules" className="relative z-10 py-16 px-4 max-w-5xl mx-auto space-y-10 border-t border-neutral-200">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-amber-800 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Cốt Cách & Phong Thái Y Phục</span>
          </div>
          <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-neutral-900">
            Quy Cách Cài Vạt & Nét Đẹp Đoan Trang
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Mỗi loại trang phục truyền thống Việt Nam đều có cách khép vạt và cài khuy mang triết lý nhân sinh riêng biệt.
          </p>
        </div>

        {/* Balanced Comparison Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-6">
          <h3 className="font-imperial font-bold text-xl sm:text-2xl text-neutral-900">
            Tìm Hiểu Về Các Kiểu Vạt Áo Truyền Thống
          </h3>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            Trong phục sức Việt Nam, không phải chiếc áo nào cũng giống nhau: <strong>Áo Ngũ Thân</strong> và <strong>Áo Tấc</strong> khép vạt sang phải; <strong>Áo Nhật Bình</strong> xẻ dọc và đính cúc giữa ngực; <strong>Áo Bà Ba</strong> xẻ giữa cài nút chính trung; còn <strong>Áo Tứ Thân</strong> thì buộc vạt lươn duyên dáng.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <span className="text-xs font-bold font-mono uppercase text-amber-900">
                ÁO CÀI VẠT BÊN PHẢI (ÁO NGŨ THÂN & ÁO TẤC)
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Vạt trái đè lên vạt phải và cài nút sang nách phải (Hữu Nhậm). Đây là quy thức trang phục của người sống trong nghi lễ và đời thường, mang ý nghĩa dương khí, sự sinh sôi và phép tắc nho nhã. Hàng 5 cúc đại diện cho đức tính Nhân, Lễ, Nghĩa, Trí, Tín.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-100 border border-neutral-200 space-y-2">
              <span className="text-xs font-bold font-mono uppercase text-neutral-800">
                ÁO XẺ GIỮA & BUỘC VẠT (BÀ BA, NHẬT BÌNH, TỨ THÂN)
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Áo Nhật Bình có vạt xẻ giữa cài cúc ngọc trước ngực; Áo Bà Ba có hàng cúc chính diện xẻ tà hai bên; Áo Tứ Thân buộc vạt trước bụng. Các kiểu dáng này thể hiện tính đa dạng phong phú của y phục Việt qua từng vùng miền.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. SECTION: THƯ TỊCH CHÍNH SỬ                                        */}
      {/* ==================================================================== */}
      <section id="section-archives" className="relative z-10 py-16 px-4 max-w-5xl mx-auto space-y-8 border-t border-neutral-200">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-amber-800 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Tư Liệu Sử Liệu Đã Thẩm Định</span>
          </div>
          <h2 className="font-imperial text-2xl sm:text-4xl font-bold text-neutral-900">
            Thư Tịch Cổ & Nguồn Dẫn Chứng Bảo Tàng
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
            Mọi thông tin trong Wiki đều dựa trên các công trình chính sử của Quốc Sử Quán và nghiên cứu trang phục thực chứng.
          </p>
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
              author: 'Nhà nghiên cứu Trần Quang Đức (Nhã Nam, 2013)',
              quote:
                'Khảo cứu phục dựng toàn diện hệ thống trang phục Việt Nam từ thời Lý, Trần, Lê đến Nguyễn dựa trên văn bia, tượng chùa và tranh chân dung cổ.',
              link: 'https://vi.wikipedia.org/wiki/Ng%C3%A0n_n%C4%83m_%C3%A1o_m%C5%A9'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-imperial font-bold text-base text-neutral-900">
                  {item.book}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-amber-700 hover:underline flex items-center gap-1"
                >
                  <span>Xem Nguồn Bảo Tàng</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <span className="text-xs font-mono text-neutral-500 block">{item.author}</span>
              <p className="text-xs sm:text-sm text-neutral-700 italic bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 leading-relaxed">
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Call To Action Box */}
        <div className="p-8 sm:p-10 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-4">
          <h3 className="font-imperial font-bold text-2xl text-neutral-900">
            Sẵn Sàng Trải Nghiệm Cổ Phục Trong Không Gian 2D?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-xl mx-auto">
            Ghé thăm Xưởng Phối Đồ AI Atelier 2D để trực tiếp ướm thử từng tà áo Ngũ Thân, Áo Tấc, Nhật Bình và lưu lại những bản phối cá nhân hóa.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('atelier')}
              className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-imperial font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Vào Xưởng Atelier 2D Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('atelier')}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 font-mono font-bold text-xs flex items-center gap-2 transition-all border border-neutral-300 cursor-pointer"
            >
              <span>Thử Trợ Lý AI Phối Đồ</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WikiHeritagePage;
