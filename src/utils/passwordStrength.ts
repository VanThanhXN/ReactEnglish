/**
 * Utility để kiểm tra độ mạnh mật khẩu
 */

export type PasswordStrength = "none" | "weak" | "medium" | "strong" | "very-strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  color: string;
  text: string;
}

/**
 * Kiểm tra độ mạnh mật khẩu
 */
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return {
      strength: "none",
      score: 0,
      color: "#e74c3c",
      text: "Chưa có",
    };
  }

  let score = 0;

  // Độ dài tối thiểu 8 ký tự
  if (password.length >= 8) score += 25;
  // Có chữ thường
  if (/[a-z]/.test(password)) score += 25;
  // Có chữ hoa
  if (/[A-Z]/.test(password)) score += 25;
  // Có số
  if (/[0-9]/.test(password)) score += 25;

  let strength: PasswordStrength = "none";
  let color = "#e74c3c";
  let text = "Chưa có";

  if (score === 0) {
    strength = "none";
    color = "#e74c3c";
    text = "Chưa có";
  } else if (score <= 25) {
    strength = "weak";
    color = "#e74c3c";
    text = "Yếu";
  } else if (score <= 50) {
    strength = "medium";
    color = "#f39c12";
    text = "Trung bình";
  } else if (score <= 75) {
    strength = "strong";
    color = "#3498db";
    text = "Mạnh";
  } else {
    strength = "very-strong";
    color = "#2ecc71";
    text = "Rất mạnh";
  }

  return { strength, score, color, text };
};





