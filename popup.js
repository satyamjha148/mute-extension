document.getElementById('muteButton').addEventListener('click', () => {
    const tag = document.getElementById('muteTag').value.trim();
    console.log("Tag entered:", tag); // Check if the tag is being captured
    if (tag) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log("Executing script on tab:", tabs[0].id); // Check if the script is running on the active tab
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: muteVideosByTag,
                args: [tag]
            });
        });
    }
});

function muteVideosByTag(tag) {
    console.log("Muting videos with tag:", tag); // Logs to check if the function executes
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Check for YouTube video metadata (could be title, description, or the page's title)
        const title = document.title || ''; // YouTube video page title
        const description = document.querySelector('meta[name="description"]')?.content || ''; // Page meta description
        const altText = video.getAttribute('alt') || ''; // Might not be directly useful, but can be checked

        console.log("Checking video title:", title, "description:", description, "alt:", altText); // Logs to see the metadata

        // Check for tag match in video title or description (case-insensitive)
        if (
            title.toLowerCase().includes(tag.toLowerCase()) ||
            description.toLowerCase().includes(tag.toLowerCase()) ||
            altText.toLowerCase().includes(tag.toLowerCase())
        ) {
            video.muted = true;
            console.log("Muted a YouTube video with matching tag:", tag); // Confirm if any videos are muted
        }
    });
}
