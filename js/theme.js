/**
 * 테마 관리 모듈
 * 다크/라이트 모드 토글 기능
 */

// 테마 설정 및 저장
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");
    this.currentTheme = this.getSavedTheme();
    this.init();
  }

  // 초기화
  init() {
    console.log("🎨 ThemeManager 초기화 시작");

    // 저장된 테마 적용
    this.applyTheme(this.currentTheme);

    // 토글 버튼 이벤트 리스너
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
      console.log("🎨 테마 토글 버튼 이벤트 리스너 추가됨");
    }

    console.log("🎨 ThemeManager 초기화 완료");
  }

  // 저장된 테마 가져오기
  getSavedTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved;
    }
    // 시스템 테마 감지
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // 테마 저장
  saveTheme(theme) {
    localStorage.setItem("theme", theme);
    console.log(`🎨 테마 저장됨: ${theme}`);
  }

  // 테마 적용
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;

    // 아이콘 업데이트
    if (this.themeIcon) {
      this.themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    console.log(`🎨 테마 적용됨: ${theme}`);
  }

  // 테마 토글
  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);

    console.log(`🎨 테마 토글됨: ${this.currentTheme} → ${newTheme}`);
  }

  // 현재 테마 반환
  getCurrentTheme() {
    return this.currentTheme;
  }
}

// 전역 테마 매니저 인스턴스 생성
const themeManager = new ThemeManager();

// 시스템 테마 변경 감지
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      themeManager.applyTheme(newTheme);
      console.log(`🎨 시스템 테마 변경 감지: ${newTheme}`);
    }
  });

console.log("✅ theme.js 로드 완료");
