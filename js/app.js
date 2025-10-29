/**
 * 메인 애플리케이션 모듈
 * 앱 초기화 및 공통 기능
 */

// 앱 클래스
class BlogApp {
  constructor() {
    this.init();
  }

  // 초기화
  init() {
    console.log("🚀 BlogApp 초기화 시작");

    // 공통 기능 초기화
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.logAppInfo();

    console.log("🚀 BlogApp 초기화 완료");
  }

  // 전역 에러 핸들링
  setupErrorHandling() {
    window.addEventListener("error", (event) => {
      console.error("🚨 JavaScript 에러:", event.error);
      // 사용자에게 친화적인 에러 메시지 표시
      this.showUserFriendlyError(
        "예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요."
      );
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("🚨 처리되지 않은 Promise 거부:", event.reason);
      this.showUserFriendlyError(
        "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      );
    });

    console.log("🚀 에러 핸들링 설정 완료");
  }

  // 성능 모니터링
  setupPerformanceMonitoring() {
    // 페이지 로드 시간 측정
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      console.log(`🚀 페이지 로드 시간: ${loadTime.toFixed(2)}ms`);

      // Core Web Vitals 측정 (간단 버전)
      if ("web-vitals" in window) {
        // 실제 프로덕션에서는 web-vitals 라이브러리 사용 권장
        console.log("🚀 Core Web Vitals 측정 가능");
      }
    });

    console.log("🚀 성능 모니터링 설정 완료");
  }

  // 앱 정보 로깅
  logAppInfo() {
    const info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      currentURL: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    };

    console.log("🚀 앱 정보:", info);
  }

  // 사용자 친화적 에러 메시지 표시
  showUserFriendlyError(message) {
    // 간단한 토스트 메시지 표시 (스타일은 CSS에서 처리)
    const toast = document.createElement("div");
    toast.className = "error-toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b6b;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
      font-size: 0.9rem;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    // 5초 후 자동 제거
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => toast.remove(), 300);
    }, 5000);

    console.log("🚀 사용자 에러 메시지 표시됨");
  }

  // 유틸리티 메서드들
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // 현재 페이지 타입 확인
  static getPageType() {
    const path = window.location.pathname;
    if (path.includes("post.html")) {
      return "post";
    } else if (
      path.includes("index.html") ||
      path === "/" ||
      path.endsWith("/")
    ) {
      return "home";
    }
    return "unknown";
  }
}

// 앱 인스턴스 생성
const blogApp = new BlogApp();

// 전역 헬퍼 함수들
window.BlogApp = BlogApp;

// DOM 준비 확인
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOMContentLoaded 이벤트 발생");

  // 추가 초기화 로직이 필요한 경우 여기에 추가
  const pageType = BlogApp.getPageType();
  console.log(`🚀 페이지 타입: ${pageType}`);
});

// 페이지 언로드 시 정리
window.addEventListener("beforeunload", () => {
  console.log("🚀 페이지 언로드");
});

// 서비스 워커 등록 (PWA 지원을 위한 준비)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // 향후 PWA 기능을 위해 준비
    console.log("🚀 서비스 워커 지원 확인됨");
  });
}

// CSS 애니메이션 키프레임 (JavaScript에서 동적 추가)
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  .error-toast {
    font-family: inherit;
  }

  .error {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #fcc;
    margin: 1rem 0;
  }
`;
document.head.appendChild(style);

console.log("✅ app.js 로드 완료");
