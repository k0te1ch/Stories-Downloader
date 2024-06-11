function waitForElm(selector) {
	return new Promise(resolve => {
		const checkExist = () => {
			const elm = document.querySelector(selector)
			if (elm) {
				resolve(elm)
				return true
			}
			return false
		}
		if (checkExist()) return

		const observer = new MutationObserver(() => {
			if (checkExist()) observer.disconnect()
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		})
	})
}

function observeUrlChange() {
	let oldHref = document.location.href
	const body = document.querySelector('body')
	const observer = new MutationObserver(() => {
		if (oldHref !== document.location.href) {
			oldHref = document.location.href
			if (window.location.href.includes('story')) {
				addDownloadButtons()
			}
		}
	})
	observer.observe(body, { childList: true, subtree: true })
}

window.addEventListener('load', () => {
	observeUrlChange()
	if (window.location.href.includes('story')) {
		addDownloadButtons()
	}
})

function addDownloadButtons() {
	waitForElm('div.StoryBottom__panels').then(elm => {
		if (elm.querySelector('.StoryButtonDownload')) return

		const styleSheet = document.createElement('style')
		styleSheet.innerText = `
            .StoryBottom__floor--3 {
                bottom: calc(var(--sent-reactions-margin-bottom) * 2.3);
                right: 0;
                padding: 0 calc(var(--story-viewer-button-round-size) / 2 + var(--padding-left-right) - var(--story-viewer-button-round-size-big) / 2);
            }`
		document.head.appendChild(styleSheet)

		const buttonContainer = document.createElement('div')
		buttonContainer.setAttribute(
			'class',
			'StoryBottom__floor StoryBottom__floor--3'
		)
		buttonContainer.innerHTML = `
            <div class="StoryButtonDownload StoryViewerButton StoryViewerButton--dark StoryViewerButton--round StoryViewerBottomControl StoryViewerButton--big" data-testid="story_download_button">
                <svg aria-hidden="true" display="block" class="vkuiIcon vkuiIcon--28 vkuiIcon--w-28 vkuiIcon--h-28 vkuiIcon--download_outline_28 StoryButtonDownload__icon" viewBox="0 0 512 512" width="28" height="28" style="width: 28px; height: 28px; fill: currentcolor">
                    <path d="m492 512h-472c-11.046875 0-20-8.953125-20-20s8.953125-20 20-20h472c11.046875 0 20 8.953125 20 20s-8.953125 20-20 20zm-194.335938-107.5625 105.464844-105.285156c7.816406-7.800782 7.828125-20.464844.023438-28.28125-7.800782-7.816406-20.464844-7.828125-28.28125-.023438l-105.480469 105.292969c-3.777344 3.777344-8.796875 5.859375-14.140625 5.859375s-10.363281-2.082031-14.121094-5.835938l-103.964844-104.285156c-7.800781-7.824218-20.464843-7.84375-28.285156-.042968-7.820312 7.796874-7.839844 20.460937-.042968 28.285156l103.988281 104.304687c11.332031 11.332031 26.398437 17.574219 42.425781 17.574219s31.09375-6.242188 42.414062-17.5625zm-22.664062-102.4375v-282c0-11.046875-8.953125-20-20-20s-20 8.953125-20 20v282c0 11.046875 8.953125 20 20 20s20-8.953125 20-20zm0 0"/>
                </svg>
            </div>`
		const firstPanelChild = elm.children[0]
		elm.insertBefore(buttonContainer, firstPanelChild)
	})
}

function downloadBackgroundImage(element) {
	const backgroundImage = element.style.backgroundImage
    const imageURL = backgroundImage.slice(4, -1).replace(/"/g, '')

	download(imageURL, 'image')
}


function download(url, filename) {
	const anchor = document.createElement('a')
	anchor.href = url
	anchor.download = filename
	document.body.appendChild(anchor)
	anchor.click()
	document.body.removeChild(anchor)
}

document.addEventListener('click', e => {
	const target = e.target.closest('.StoryButtonDownload')
	if (target) {
		const video = document.querySelector('video.stories_video')
		const photo = document.querySelector('div.stories_photo')
		if (video) download(video.getAttribute('src'), '')
		else if (photo) downloadBackgroundImage(photo)
	}
})
