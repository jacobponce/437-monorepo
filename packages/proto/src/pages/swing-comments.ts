import { define, Auth } from "@calpoly/mustang";
import "../components";

define({
  "mu-auth": Auth.Provider
});

interface Comment {
  _id?: string;
  author: string;
  content: string;
  posted: string;
  topic?: string;
}

async function loadComments() {
  try {
    const response = await fetch("/api/comments");
    if (!response.ok) {
      throw new Error("Failed to load comments");
    }
    const comments: Comment[] = await response.json();
    displayComments(comments);
  } catch (error) {
    console.error("Error loading comments:", error);
    const container = document.getElementById("comments-container");
    if (container) {
      container.innerHTML = "<p>Failed to load comments. Please try again later.</p>";
    }
  }
}

function displayComments(comments: Comment[]) {
  const container = document.getElementById("comments-container");
  if (!container) return;

  if (comments.length === 0) {
    container.innerHTML = "<p>No comments yet. Be the first to share your advice!</p>";
    return;
  }

  container.innerHTML = comments
    .map(
      (comment) => `
    <article>
      <h3>${escapeHtml(comment.author)}</h3>
      ${comment.topic ? `<p><strong>Topic:</strong> ${escapeHtml(comment.topic)}</p>` : ""}
      <p>Posted: ${escapeHtml(comment.posted)}</p>
      <p>${escapeHtml(comment.content)}</p>
    </article>
  `
    )
    .join("");
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  loadComments();

  const addCommentBtn = document.getElementById("add-comment-btn");
  const formSection = document.getElementById("comment-form-section");

  if (addCommentBtn && formSection) {
    addCommentBtn.addEventListener("click", () => {
      formSection.classList.toggle("show");
      if (formSection.classList.contains("show")) {
        addCommentBtn.textContent = "- Hide Form";
        formSection.scrollIntoView({ behavior: "smooth" });
      } else {
        addCommentBtn.textContent = "+ Add Comment";
      }
    });
  }
});
