function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern clipboard API (works on HTTPS & supported browsers)
        navigator.clipboard.writeText(text)
            .then(() => console.log("Copied to clipboard!"))
            .catch(err => console.error("Failed to copy: ", err));
    } else {
        // Fallback for older browsers & mobile
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  // Avoids scrolling to the element
        textArea.style.opacity = "0";       // Hide element
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile compatibility
        try {
            document.execCommand("copy");
            console.log("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
        document.body.removeChild(textArea);
    }
}

export {copyToClipboard};