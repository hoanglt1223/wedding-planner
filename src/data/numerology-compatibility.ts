// Thần Số Học — Compatibility harmony data between number pairs

export interface NumberPairHarmony {
  number1: number;
  number2: number;
  harmony: number; // 0-100
  label: string;
  description: string;
}

// Key pairs with specific harmony levels and descriptions
const PAIR_DATA: [number, number, number, string, string][] = [
  [1, 1, 85, "Rất tương hợp", "Hai người lãnh đạo mạnh mẽ, cần học cách nhường nhịn nhau."],
  [1, 2, 90, "Rất tương hợp", "Số 1 dẫn dắt, số 2 hỗ trợ — sự kết hợp hoàn hảo."],
  [1, 3, 75, "Tương hợp", "Năng lượng sáng tạo và lãnh đạo bổ trợ lẫn nhau."],
  [1, 4, 55, "Trung bình", "Xung đột giữa tự do và kỷ luật, cần thỏa hiệp."],
  [1, 5, 85, "Rất tương hợp", "Cả hai đều yêu tự do và phiêu lưu."],
  [1, 6, 70, "Tương hợp", "Số 6 chăm sóc tạo mái ấm cho số 1 phát triển."],
  [1, 7, 65, "Tương hợp", "Tôn trọng không gian riêng của nhau là chìa khóa."],
  [1, 8, 60, "Trung bình", "Hai quyền lực mạnh, cần phân chia vai trò rõ ràng."],
  [1, 9, 80, "Rất tương hợp", "Tầm nhìn rộng lớn và lý tưởng chung kết nối hai người."],
  [2, 2, 85, "Rất tương hợp", "Hài hòa và nhạy cảm, nhưng cần người quyết đoán."],
  [2, 3, 75, "Tương hợp", "Số 3 mang niềm vui, số 2 mang sự ổn định."],
  [2, 4, 70, "Tương hợp", "Nền tảng vững chắc với sự kiên nhẫn và ổn định."],
  [2, 5, 50, "Thách thức", "Số 5 quá tự do cho số 2 nhạy cảm."],
  [2, 6, 90, "Rất tương hợp", "Cả hai đều hướng về gia đình và tình yêu."],
  [2, 7, 70, "Tương hợp", "Kết nối tâm linh và trực giác sâu sắc."],
  [2, 8, 80, "Rất tương hợp", "Số 8 bảo vệ, số 2 nuôi dưỡng — cặp đôi mạnh."],
  [2, 9, 70, "Tương hợp", "Tình yêu lãng mạn và nhân ái."],
  [3, 3, 80, "Rất tương hợp", "Sáng tạo bùng nổ nhưng cần ai đó thực tế."],
  [3, 4, 50, "Thách thức", "Sáng tạo vs kỷ luật — khác biệt lớn về lối sống."],
  [3, 5, 85, "Rất tương hợp", "Năng lượng phiêu lưu và sáng tạo tuyệt vời."],
  [3, 6, 90, "Rất tương hợp", "Số 6 tạo mái ấm cho số 3 tỏa sáng."],
  [3, 7, 60, "Trung bình", "Sáng tạo bề ngoài vs chiều sâu nội tâm."],
  [3, 8, 55, "Trung bình", "Nghệ thuật vs kinh doanh — cần tìm điểm chung."],
  [3, 9, 90, "Rất tương hợp", "Sáng tạo và nhân ái — cặp đôi truyền cảm hứng."],
  [4, 4, 80, "Rất tương hợp", "Ổn định và đáng tin cậy, nền tảng vững chắc."],
  [4, 5, 40, "Thách thức", "Ổn định vs thay đổi — xung đột lối sống lớn."],
  [4, 6, 85, "Rất tương hợp", "Xây dựng gia đình vững chắc và ấm áp."],
  [4, 7, 65, "Tương hợp", "Cả hai đều cần không gian và sự yên tĩnh."],
  [4, 8, 90, "Rất tương hợp", "Thành công vật chất và ổn định dài lâu."],
  [4, 9, 55, "Trung bình", "Thực tế vs lý tưởng — cần cân bằng."],
  [5, 5, 75, "Tương hợp", "Tự do tuyệt đối nhưng thiếu ổn định."],
  [5, 6, 55, "Trung bình", "Tự do vs trách nhiệm gia đình — cần thỏa hiệp."],
  [5, 7, 80, "Rất tương hợp", "Khám phá thế giới bên ngoài và bên trong."],
  [5, 8, 60, "Trung bình", "Năng lượng mạnh nhưng khác hướng."],
  [5, 9, 70, "Tương hợp", "Tự do và nhân ái — phiêu lưu có ý nghĩa."],
  [6, 6, 90, "Rất tương hợp", "Gia đình hạnh phúc, tình yêu tràn đầy."],
  [6, 7, 55, "Trung bình", "Gia đình vs cô đơn — cần thấu hiểu."],
  [6, 8, 75, "Tương hợp", "Tình yêu và vật chất — gia đình thịnh vượng."],
  [6, 9, 90, "Rất tương hợp", "Tình yêu vô điều kiện và sự chăm sóc."],
  [7, 7, 80, "Rất tương hợp", "Chiều sâu tâm linh nhưng cần kết nối xã hội."],
  [7, 8, 55, "Trung bình", "Tâm linh vs vật chất — hai thế giới khác."],
  [7, 9, 80, "Rất tương hợp", "Trí tuệ và tâm linh — kết nối sâu sắc."],
  [8, 8, 75, "Tương hợp", "Quyền lực nhân đôi, cần tránh tranh giành."],
  [8, 9, 60, "Trung bình", "Vật chất vs tinh thần — cần cân bằng."],
  [9, 9, 85, "Rất tương hợp", "Lý tưởng và nhân ái — cặp đôi vĩ đại."],
];

const HARMONY_MAP = new Map<string, NumberPairHarmony>();
for (const [n1, n2, harmony, label, description] of PAIR_DATA) {
  const key = `${Math.min(n1, n2)}-${Math.max(n1, n2)}`;
  HARMONY_MAP.set(key, { number1: n1, number2: n2, harmony, label, description });
}

const DEFAULT_HARMONY: NumberPairHarmony = {
  number1: 0, number2: 0, harmony: 60, label: "Trung bình", description: "Mối quan hệ cần nỗ lực từ cả hai phía.",
};

/** Lookup harmony between two numbers. Order-independent. */
export function getNumberHarmony(n1: number, n2: number): NumberPairHarmony {
  // Reduce master numbers for lookup
  const r1 = n1 > 9 ? (n1 === 11 ? 2 : n1 === 22 ? 4 : n1 === 33 ? 6 : n1 % 9 || 9) : n1;
  const r2 = n2 > 9 ? (n2 === 11 ? 2 : n2 === 22 ? 4 : n2 === 33 ? 6 : n2 % 9 || 9) : n2;
  const key = `${Math.min(r1, r2)}-${Math.max(r1, r2)}`;
  return HARMONY_MAP.get(key) ?? { ...DEFAULT_HARMONY, number1: n1, number2: n2 };
}
