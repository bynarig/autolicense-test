import { useEffect } from "react";
import ClipboardJS from "clipboard";
import { toast } from "sonner";

/**
 * A custom hook that initializes clipboard functionality for elements with the specified selector.
 * @param selector - CSS selector for elements that should have clipboard functionality
 * @returns void
 */
export function useCopyToClipboard(selector: string = ".copy-btn") {
	useEffect(() => {
		const clipboard = new ClipboardJS(selector, {
			text: function (trigger) {
				return trigger.getAttribute("data-clipboard-text") || "";
			},
		});

		clipboard.on("success", function (e) {
			toast.success(`Copied: ${e.text}`);
			e.clearSelection();
		});

		clipboard.on("error", function (e) {
			toast.error("Failed to copy text");
		});

		return () => {
			clipboard.destroy();
		};
	}, [selector]);
}
