/**
 * 검색 및 필터링 모듈
 * 게시글 검색과 태그 필터링 기능
 */

// 검색 및 필터링 클래스
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.postsContainer = document.getElementById("posts-container");
    this.noResults = document.getElementById("no-results");
    this.loading = document.getElementById("loading");
    this.tagButtons = document.querySelectorAll(".tag-btn");
    this.allPosts = [];
    this.filteredPosts = [];
    this.currentTag = "all";
    this.init();
  }

  // 초기화
  init() {
    console.log("🔍 SearchManager 초기화 시작");

    this.loadPosts();

    // 검색 입력 이벤트
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.filterPosts(e.target.value);
      });
      console.log("🔍 검색 입력 이벤트 리스너 추가됨");
    }

    // 태그 버튼 이벤트
    this.tagButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.setActiveTag(e.target);
      });
    });

    console.log("🔍 SearchManager 초기화 완료");
  }

  // posts.json 로드
  async loadPosts() {
    try {
      console.log("🔍 게시글 데이터 로드 시작");
      const response = await fetch("posts.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.allPosts = await response.json();
      this.filteredPosts = [...this.allPosts];

      console.log(`🔍 ${this.allPosts.length}개의 게시글 로드됨`);
      this.renderPosts();
      this.updateTagButtons();
    } catch (error) {
      console.error("🔍 게시글 로드 실패:", error);
      this.showError("게시글을 불러오는데 실패했습니다.");
    }
  }

  // 태그 버튼 업데이트
  updateTagButtons() {
    const tagContainer = document.querySelector(".tag-filter");
    const existingButtons = tagContainer.querySelectorAll(
      '.tag-btn:not([data-tag="all"])'
    );

    // 기존 태그 버튼 제거
    existingButtons.forEach((btn) => btn.remove());

    // 모든 태그 수집
    const allTags = new Set();
    this.allPosts.forEach((post) => {
      post.tags.forEach((tag) => allTags.add(tag));
    });

    // 태그 버튼 생성 및 추가
    Array.from(allTags)
      .sort()
      .forEach((tag) => {
        const button = document.createElement("button");
        button.className = "tag-btn";
        button.textContent = tag;
        button.setAttribute("data-tag", tag);
        button.addEventListener("click", (e) => {
          this.setActiveTag(e.target);
        });
        tagContainer.appendChild(button);
      });

    console.log(`🔍 ${allTags.size}개의 태그 버튼 생성됨`);
  }

  // 활성 태그 설정
  setActiveTag(button) {
    // 모든 버튼에서 active 클래스 제거
    this.tagButtons.forEach((btn) => btn.classList.remove("active"));

    // 클릭된 버튼에 active 클래스 추가
    button.classList.add("active");

    this.currentTag = button.getAttribute("data-tag") || "all";
    this.filterPosts(this.searchInput ? this.searchInput.value : "");

    console.log(`🔍 태그 필터 변경: ${this.currentTag}`);
  }

  // 게시글 필터링
  filterPosts(searchTerm = "") {
    const term = searchTerm.toLowerCase().trim();

    this.filteredPosts = this.allPosts.filter((post) => {
      // 태그 필터링
      const tagMatch =
        this.currentTag === "all" || post.tags.includes(this.currentTag);

      // 검색어 필터링
      const searchMatch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        post.category.toLowerCase().includes(term);

      return tagMatch && searchMatch;
    });

    console.log(`🔍 필터링 결과: ${this.filteredPosts.length}개 게시글`);
    this.renderPosts();
  }

  // 게시글 렌더링
  renderPosts() {
    if (!this.postsContainer) return;

    // 로딩 숨기기
    if (this.loading) {
      this.loading.style.display = "none";
    }

    // 결과 없음 표시 토글
    if (this.noResults) {
      this.noResults.style.display =
        this.filteredPosts.length === 0 ? "block" : "none";
    }

    // 게시글 HTML 생성
    const postsHTML = this.filteredPosts
      .map((post) => this.createPostCard(post))
      .join("");

    this.postsContainer.innerHTML = postsHTML;

    console.log("🔍 게시글 렌더링 완료");
  }

  // 게시글 카드 HTML 생성
  createPostCard(post) {
    const tagsHTML = post.tags
      .map((tag) => `<span class="post-tag">${tag}</span>`)
      .join("");

    return `
      <article class="post-card">
        <h2><a href="post.html?file=${encodeURIComponent(post.file)}">${
      post.title
    }</a></h2>
        <div class="post-meta">
          <time>${this.formatDate(post.date)}</time>
          <div class="post-tags">${tagsHTML}</div>
        </div>
        <p class="post-excerpt">${post.excerpt}</p>
        <a href="post.html?file=${encodeURIComponent(
          post.file
        )}" class="read-more">더 읽기 →</a>
      </article>
    `;
  }

  // 날짜 포맷팅
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  }

  // 에러 표시
  showError(message) {
    if (this.postsContainer) {
      this.postsContainer.innerHTML = `<div class="error">${message}</div>`;
    }
    if (this.loading) {
      this.loading.style.display = "none";
    }
    console.error("🔍 에러:", message);
  }
}

// 전역 검색 매니저 인스턴스 생성 (index.html에서만)
if (document.getElementById("posts-container")) {
  const searchManager = new SearchManager();
}

console.log("✅ search.js 로드 완료");
