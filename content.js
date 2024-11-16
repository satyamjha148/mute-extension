function muteVideosByTag(tag) {
    console.log("Muting videos with tag:", tag);
  
    // Function to mute videos based on tag in title or description
    const muteMatchingVideos = () => {
        document.querySelectorAll('video').forEach(video => {
            // Find the title and description for the current video
            const titleElement = document.querySelector('.title.style-scope.ytd-video-primary-info-renderer');
            const descriptionElement = document.querySelector('#description.style-scope.ytd-video-secondary-info-renderer');

            const title = titleElement ? titleElement.innerText : '';
            const description = descriptionElement ? descriptionElement.innerText : '';
  
            console.log("Checking video title:", title, "and description:", description);

            // If tag matches either title or description, mute the video
            if (title.toLowerCase().includes(tag.toLowerCase()) ||
                description.toLowerCase().includes(tag.toLowerCase())) {
                if (!video.muted) { // Check if already muted
                    video.muted = true;
                    console.log("Muted a video with matching tag:", tag);
                }
            }
        });
    };
  
    // Run initially in case video is already loaded
    muteMatchingVideos();
  
    // Set up a MutationObserver to watch for dynamic content changes
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                muteMatchingVideos(); // Call muting function if new content is added
            }
        }
    });
  
    // Observe specific container (e.g., video list or body) to reduce overhead
    const targetNode = document.querySelector('#contents') || document.body; // Change as needed
    observer.observe(targetNode, { childList: true, subtree: true });

    console.log("MutationObserver set up to monitor dynamic changes.");
}
  
// Listener for the popup message to mute videos
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'mute') {
        console.log("Mute action received with tag:", message.tag);
        muteVideosByTag(message.tag);
    }
});
