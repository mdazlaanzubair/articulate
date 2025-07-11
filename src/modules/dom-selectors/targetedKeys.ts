// list of target of DOM elements
/**
 * Set a value in Chrome local storage.
 * @key feeds - Contains the selector for main feeds container and used to observe mutations.
 * @key feed_item - Contains the selector for linkedin post that contains "Post Content" & "Comment Box".
 * @key post - Contains the selector for linkedin post content container.
 * @key author - Contains the selector for linkedin post author info container.
 * @key comment_form - Contains the selector for linkedin comment-box associated with the post.
 * @key comment_editor - Contains the selector for linkedin comment-box's editor/text-box.
 * @key comment_editor_blank - Contains the selector for linkedin comment-box that tells the box has no text/comment.
 * @key inject - Contains the selector for linkedin comment-box where `Articulate` button will be injected.
 */
export const SELECT_TARGET = {
  main: "main",
  feeds:
    'div.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]',
  feed_item:
    'div.feed-shared-update-v2[role="article"][data-urn^="urn:li:activity:"]',
  post: "div.update-components-text.update-components-update-v2__commentary[dir]",
  author: "div.update-components-actor__container span[dir]",
  comment_form: "form.comments-comment-box__form",
  comment_editor: ".ql-editor",
  comment_editor_blank: ".ql-blank",
  inject: ".comments-comment-box__detour-container",
};
