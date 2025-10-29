/**
 * 게시글 로더 모듈
 * 마크다운 로딩 및 파싱, Giscus 통합
 */

// 게시글 로더 클래스
class PostLoader {
  constructor() {
    this.postTitle = document.getElementById("post-title");
    this.postDate = document.getElementById("post-date");
    this.postTags = document.getElementById("post-tags");
    this.postContent = document.getElementById("post-content");
    this.init();
  }

  // 초기화
  init() {
    console.log("📄 PostLoader 초기화 시작");

    // URL 파라미터에서 파일명 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get("file");

    if (fileName) {
      this.loadPost(fileName);
    } else {
      this.showError("게시글 파일이 지정되지 않았습니다.");
    }

    console.log("📄 PostLoader 초기화 완료");
  }

  // 게시글 로드
  async loadPost(fileName) {
    try {
      console.log(`📄 게시글 로드 시작: ${fileName}`);

      // 마크다운 파일 로드
      const response = await fetch(`pages/${fileName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const markdown = await response.text();
      console.log(`📄 마크다운 파일 로드됨 (${markdown.length}자)`);

      // Front Matter 파싱
      const { metadata, content } = this.parseFrontMatter(markdown);

      // 메타데이터 표시
      this.displayMetadata(metadata, fileName);

      // 마크다운을 HTML로 변환
      const htmlContent = this.renderMarkdown(content);
      this.postContent.innerHTML = htmlContent;

      // 코드 하이라이팅 적용
      this.applyCodeHighlighting();

      // Giscus 로드
      this.loadGiscus(metadata, fileName);

      console.log("📄 게시글 로드 및 렌더링 완료");
    } catch (error) {
      console.error("📄 게시글 로드 실패:", error);
      this.showError("게시글을 불러오는데 실패했습니다.");
    }
  }

  // Front Matter 파싱
  parseFrontMatter(markdown) {
    const frontMatterMatch = markdown.match(
      /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    );

    if (!frontMatterMatch) {
      return { metadata: {}, content: markdown };
    }

    const frontMatter = frontMatterMatch[1];
    const content = frontMatterMatch[2];

    // Front Matter 라인 파싱
    const metadata = {};
    const lines = frontMatter.split("\n");

    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value
              .slice(1, -1)
              .split(",")
              .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ""));
          }
        }

        metadata[key] = value;
      }
    });

    console.log("📄 Front Matter 파싱 완료:", metadata);
    return { metadata, content };
  }

  // 메타데이터 표시
  displayMetadata(metadata, fileName) {
    // 제목
    if (this.postTitle) {
      this.postTitle.textContent =
        metadata.title || fileName.replace(".md", "");
    }

    // 날짜
    if (this.postDate && metadata.date) {
      this.postDate.textContent = this.formatDate(metadata.date);
    }

    // 태그
    if (this.postTags && metadata.tags) {
      const tagsHTML = Array.isArray(metadata.tags)
        ? metadata.tags
            .map((tag) => `<span class="post-tag">${tag}</span>`)
            .join("")
        : "";
      this.postTags.innerHTML = tagsHTML;
    }
  }

  // 마크다운 렌더링
  renderMarkdown(markdown) {
    // Marked.js 설정
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
    });

    // HTML 변환
    const html = marked.parse(markdown);

    console.log("📄 마크다운 렌더링 완료");
    return html;
  }

  // 코드 하이라이팅 적용
  applyCodeHighlighting() {
    // Prism.js가 로드되었는지 확인
    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
      console.log("📄 코드 하이라이팅 적용됨");
    } else {
      console.warn(
        "📄 Prism.js가 로드되지 않아 코드 하이라이팅을 적용할 수 없습니다."
      );
    }
  }

  // Giscus 로드
  loadGiscus(metadata, fileName) {
    const giscusContainer = document.getElementById("giscus-container");

    if (!giscusContainer) {
      console.log("📄 Giscus 컨테이너를 찾을 수 없습니다.");
      return;
    }

    // Giscus 스크립트 생성
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Giscus 설정
    script.setAttribute(
      "data-repo",
      "your-github-username/your-github-username.github.io"
    ); // TODO: 실제 저장소로 변경
    script.setAttribute("data-repo-id", "YOUR_REPO_ID"); // TODO: 실제 값으로 변경
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID"); // TODO: 실제 값으로 변경
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");

    // 스크립트 로드 완료 이벤트
    script.onload = () => {
      console.log("📄 Giscus 스크립트 로드 완료");
    };

    script.onerror = () => {
      console.error("📄 Giscus 스크립트 로드 실패");
      giscusContainer.innerHTML =
        "<p>댓글 시스템을 불러오는데 실패했습니다.</p>";
    };

    // 스크립트 추가
    giscusContainer.appendChild(script);
    console.log("📄 Giscus 로드 시작");
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
    if (this.postTitle) {
      this.postTitle.textContent = "오류";
    }
    if (this.postContent) {
      this.postContent.innerHTML = `<div class="error">${message}</div>`;
    }
    console.error("📄 에러:", message);
  }
}

// 게시글 페이지에서만 PostLoader 초기화
if (document.getElementById("post-content")) {
  const postLoader = new PostLoader();
}

console.log("✅ post-loader.js 로드 완료");
