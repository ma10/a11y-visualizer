import { computeAccessibleName } from "dom-accessibility-api";
import { ElementTip } from "../../types";
import { isAriaHidden } from "../isAriaHidden";
import { isFocusable } from "../isFocusable";

export const LinkSelectors = ["a", "area", '[role="link"]'] as const;

export const isLink = (el: Element): boolean =>
  hasLinkRole(el) || hasLinkTag(el);

const hasLinkRole = (el: Element): boolean =>
  el.getAttribute("role") === "link";

const hasLinkTag = (el: Element): boolean =>
  ["a", "area"].includes(el.tagName.toLowerCase());

export const linkTips = (el: Element): ElementTip[] => {
  const result: ElementTip[] = [];
  const hidden = isAriaHidden(el);
  const hasTag = hasLinkTag(el);
  const hasRole = hasLinkRole(el);
  const href = el.getAttribute("href");

  if (hasTag || hasRole) {
    const name = computeAccessibleName(el);
    if (!name && (hasRole || href) && !hidden) {
      result.push({ type: "error", content: "messages.noName" });
    }
  }
  if (hasTag) {
    if (!el.hasAttribute("href")) {
      result.push({ type: "warning", content: "messages.noHref" });
    }
  }
  if (hasRole && !isFocusable(el)) {
    result.push({ type: "error", content: "messages.notFocusable" });
  }
  return result;
};
