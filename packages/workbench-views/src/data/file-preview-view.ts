import { ViewModel } from "../core/view-model.js";

/**
 * View model for an inline image preview.
 * The renderer should display the image using the provided data URL or object URL.
 */
export class ImagePreviewView extends ViewModel {
  #src = "";
  #alt = "";

  get src(): string {
    return this.#src;
  }

  get alt(): string {
    return this.#alt;
  }

  setSrc(src: string, alt?: string): void {
    this.#src = src;
    this.#alt = alt ?? "";
    this.notify();
  }
}

/**
 * View model for a text/code preview with optional syntax highlighting.
 * The renderer displays the content in a `<pre>` block.
 */
export class TextPreviewView extends ViewModel {
  #content = "";
  #language = "";
  #filename = "";

  get content(): string {
    return this.#content;
  }

  get language(): string {
    return this.#language;
  }

  get filename(): string {
    return this.#filename;
  }

  setContent(content: string, language?: string, filename?: string): void {
    this.#content = content;
    this.#language = language ?? "";
    this.#filename = filename ?? "";
    this.notify();
  }
}

/**
 * View model for rendered markdown preview.
 */
export class MarkdownPreviewView extends ViewModel {
  #markdown = "";
  #filename = "";

  get markdown(): string {
    return this.#markdown;
  }

  get filename(): string {
    return this.#filename;
  }

  setMarkdown(markdown: string, filename?: string): void {
    this.#markdown = markdown;
    this.#filename = filename ?? "";
    this.notify();
  }
}
