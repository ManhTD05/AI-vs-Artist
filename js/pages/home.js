(() => {
  // Page 01 — Tổng quan / media viewer.
  // The src attributes in index.html are the source of truth.

  const resourceOpeners = [...document.querySelectorAll('[data-open-resource]')];

  const setResourceAvailable = (type, available) => {
    resourceOpeners
      .filter(button => button.dataset.openResource === type)
      .forEach(button => {
        button.disabled = !available;
        button.hidden = !available;
        button.setAttribute('aria-disabled', String(!available));
      });
  };

  for (const slot of document.querySelectorAll('[data-resource-slot]')) {
    const placeholder = slot.querySelector('[data-resource-placeholder]');
    const image = slot.querySelector('[data-resource-image]');
    const video = slot.querySelector('[data-resource-video]');

    if (image) {
      const showImage = () => {
        image.hidden = false;
        if (placeholder) placeholder.hidden = true;
        slot.classList.add('has-media');
        setResourceAvailable('image', true);
      };
      const showPlaceholder = () => {
        image.hidden = true;
        if (placeholder) placeholder.hidden = false;
        slot.classList.remove('has-media');
        setResourceAvailable('image', false);
      };
      image.addEventListener('load', showImage);
      image.addEventListener('error', showPlaceholder);
      if (image.complete) image.naturalWidth > 0 ? showImage() : showPlaceholder();
    }

    if (video) {
      const showVideo = () => {
        video.hidden = false;
        if (placeholder) placeholder.hidden = true;
        slot.classList.add('has-media');
        setResourceAvailable('video', true);
      };
      const showPlaceholder = () => {
        video.hidden = true;
        if (placeholder) placeholder.hidden = false;
        slot.classList.remove('has-media');
        setResourceAvailable('video', false);
      };
      video.addEventListener('loadedmetadata', showVideo);
      video.addEventListener('error', showPlaceholder);
      if (video.readyState >= 1) showVideo();
      else video.load();
    }
  }

  const viewer = document.querySelector('[data-resource-lightbox]');
  if (!viewer) return;

  const stage = viewer.querySelector('.resource-lightbox-stage');
  const lightboxImage = viewer.querySelector('[data-resource-lightbox-image]');
  const lightboxVideo = viewer.querySelector('[data-resource-lightbox-video]');
  const lightboxEmpty = viewer.querySelector('[data-resource-lightbox-empty]');
  const lightboxTitle = viewer.querySelector('[data-resource-lightbox-title]');
  const zoomControls = viewer.querySelector('[data-resource-zoom-controls]');
  const zoomOut = viewer.querySelector('[data-resource-zoom-out]');
  const zoomIn = viewer.querySelector('[data-resource-zoom-in]');
  const zoomLabel = viewer.querySelector('[data-resource-zoom-label]');

  const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3];
  let zoomIndex = 0;
  let fitWidth = 0;
  let returnFocus = null;
  let inlineVideo = null;
  let inlineVideoTime = 0;
  let wasInlineVideoPlaying = false;

  const updateZoom = (nextIndex, preserveCenter = true) => {
    if (!lightboxImage || lightboxImage.hidden || !stage) return;

    const oldWidth = lightboxImage.getBoundingClientRect().width || fitWidth || 1;
    const oldCenterX = stage.scrollLeft + stage.clientWidth / 2;
    const oldCenterY = stage.scrollTop + stage.clientHeight / 2;
    const ratioX = oldCenterX / oldWidth;
    const oldHeight = lightboxImage.getBoundingClientRect().height || 1;
    const ratioY = oldCenterY / oldHeight;

    zoomIndex = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, nextIndex));
    const zoom = ZOOM_LEVELS[zoomIndex];
    const targetWidth = Math.max(1, fitWidth * zoom);

    lightboxImage.style.width = `${targetWidth}px`;
    lightboxImage.style.height = 'auto';
    lightboxImage.classList.toggle('is-zoomed', zoomIndex > 0);
    stage.classList.toggle('is-image-zoomed', zoomIndex > 0);
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    if (zoomOut) zoomOut.disabled = zoomIndex === 0;
    if (zoomIn) zoomIn.disabled = zoomIndex === ZOOM_LEVELS.length - 1;

    if (preserveCenter) {
      requestAnimationFrame(() => {
        const newRect = lightboxImage.getBoundingClientRect();
        stage.scrollLeft = Math.max(0, ratioX * newRect.width - stage.clientWidth / 2);
        stage.scrollTop = Math.max(0, ratioY * newRect.height - stage.clientHeight / 2);
      });
    } else {
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
    }
  };

  const calculateFitWidth = () => {
    if (!lightboxImage || !stage || !lightboxImage.naturalWidth || !lightboxImage.naturalHeight) return;
    const horizontalPadding = 32;
    const verticalPadding = 32;
    const availableWidth = Math.max(1, stage.clientWidth - horizontalPadding);
    const availableHeight = Math.max(1, stage.clientHeight - verticalPadding);
    const ratio = Math.min(
      availableWidth / lightboxImage.naturalWidth,
      availableHeight / lightboxImage.naturalHeight,
      1
    );
    fitWidth = Math.max(1, lightboxImage.naturalWidth * ratio);
    updateZoom(0, false);
  };

  const requestViewerFullscreen = async () => {
    if (!viewer.requestFullscreen || document.fullscreenElement) return;
    try { await viewer.requestFullscreen(); } catch (_) { /* overlay remains fullscreen in-page */ }
  };

  const exitViewerFullscreen = async () => {
    if (document.fullscreenElement === viewer && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
  };

  const closeViewer = async () => {
    if (!viewer.classList.contains('is-open')) return;

    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.hidden = true;
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
    }

    if (inlineVideo) {
      // Keep preview paused after closing. Restore position only, never autoplay unexpectedly.
      inlineVideo.currentTime = Math.min(inlineVideoTime, inlineVideo.duration || inlineVideoTime);
    }

    if (lightboxImage) {
      lightboxImage.hidden = true;
      lightboxImage.removeAttribute('src');
      lightboxImage.removeAttribute('style');
      lightboxImage.classList.remove('is-zoomed');
    }

    if (lightboxEmpty) lightboxEmpty.hidden = true;
    if (zoomControls) zoomControls.hidden = true;
    stage?.classList.remove('is-image-zoomed');
    stage?.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('resource-lightbox-open');
    await exitViewerFullscreen();
    returnFocus?.focus?.();
  };

  const openViewer = async (type, trigger) => {
    if (trigger?.disabled) return;
    returnFocus = trigger || document.activeElement;

    if (lightboxImage) lightboxImage.hidden = true;
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.hidden = true;
    }
    if (lightboxEmpty) lightboxEmpty.hidden = true;
    if (zoomControls) zoomControls.hidden = true;
    stage?.classList.remove('is-image-zoomed');
    stage?.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (type === 'image') {
      const source = document.querySelector('[data-resource-image]');
      if (source && !source.hidden && lightboxImage) {
        if (lightboxTitle) lightboxTitle.textContent = 'Infographic tĩnh';
        if (zoomControls) zoomControls.hidden = false;
        zoomIndex = 0;
        lightboxImage.onload = calculateFitWidth;
        lightboxImage.src = source.currentSrc || source.src;
        lightboxImage.hidden = false;
        if (lightboxImage.complete && lightboxImage.naturalWidth) calculateFitWidth();
      } else if (lightboxEmpty) {
        lightboxEmpty.hidden = false;
      }
    } else {
      const source = document.querySelector('[data-resource-video]');
      if (source && !source.hidden && lightboxVideo) {
        inlineVideo = source;
        inlineVideoTime = source.currentTime || 0;
        wasInlineVideoPlaying = !source.paused;
        source.pause();

        if (lightboxTitle) lightboxTitle.textContent = 'Motion infographic / video';
        lightboxVideo.src = source.currentSrc || source.src;
        lightboxVideo.hidden = false;
        lightboxVideo.load();
        lightboxVideo.addEventListener('loadedmetadata', () => {
          if (Number.isFinite(inlineVideoTime)) lightboxVideo.currentTime = inlineVideoTime;
          lightboxVideo.play().catch(() => {});
        }, { once: true });
      } else if (lightboxEmpty) {
        lightboxEmpty.hidden = false;
      }
    }

    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('resource-lightbox-open');
    viewer.querySelector('.resource-lightbox-close')?.focus?.();
    await requestViewerFullscreen();
  };

  resourceOpeners.forEach(button => {
    button.addEventListener('click', () => openViewer(button.dataset.openResource, button));
  });

  const inlineImage = document.querySelector('[data-resource-image]');
  inlineImage?.addEventListener('click', () => {
    const opener = resourceOpeners.find(button => button.dataset.openResource === 'image');
    if (opener && !opener.disabled) openViewer('image', opener);
  });

  zoomOut?.addEventListener('click', () => updateZoom(zoomIndex - 1));
  zoomIn?.addEventListener('click', () => updateZoom(zoomIndex + 1));

  lightboxImage?.addEventListener('click', event => {
    event.stopPropagation();
    updateZoom(zoomIndex === ZOOM_LEVELS.length - 1 ? 0 : zoomIndex + 1);
  });

  viewer.querySelectorAll('[data-close-resource]').forEach(element => {
    element.addEventListener('click', closeViewer);
  });

  document.addEventListener('keydown', event => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeViewer();
    if (!lightboxImage?.hidden && (event.key === '+' || event.key === '=')) {
      event.preventDefault();
      updateZoom(zoomIndex + 1);
    }
    if (!lightboxImage?.hidden && event.key === '-') {
      event.preventDefault();
      updateZoom(zoomIndex - 1);
    }
  });

  // Re-fit when viewport/fullscreen size changes, but only at 100%.
  const refit = () => {
    if (viewer.classList.contains('is-open') && lightboxImage && !lightboxImage.hidden && zoomIndex === 0) {
      calculateFitWidth();
    }
  };
  window.addEventListener('resize', refit, { passive: true });
  document.addEventListener('fullscreenchange', refit);
})();
