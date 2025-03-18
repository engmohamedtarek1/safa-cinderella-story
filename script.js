document.addEventListener("DOMContentLoaded", function () {
  let paragraphs = document.querySelectorAll(".play-audio");
  let currentIndex = 0;
  let isMuted = true;
  let currentAudio = null;

  function playNextAudio() {
    if (currentIndex < paragraphs.length) {
      let paragraph = paragraphs[currentIndex];
      let audioSrc = paragraph.dataset.audio;

      if (!audioSrc) return;

      currentAudio = new Audio(audioSrc);
      currentAudio.muted = isMuted;
      paragraph.classList.add("highlight");

      currentAudio
        .play()
        .then(() => {
          console.log("Audio started playing.");
        })
        .catch((error) => {
          console.warn("Autoplay failed. Waiting for user interaction...");
          document.addEventListener("click", retryAudioPlayback, {
            once: true,
          });
        });

      currentAudio.onended = function () {
        paragraph.classList.remove("highlight");
        currentIndex++;
        playNextAudio();
      };
    }
  }

  function retryAudioPlayback() {
    if (currentAudio) {
      currentAudio
        .play()
        .catch((error) => console.error("Playback still blocked:", error));
    } else {
      playNextAudio();
    }
  }

  function toggleMute() {
    let volumeBtn = document.getElementById("volume-btn");
    let volumeIcon = volumeBtn.querySelector("i");

    isMuted = !isMuted;

    if (isMuted) {
      volumeIcon.classList.replace("fa-volume-up", "fa-volume-mute");
    } else {
      volumeIcon.classList.replace("fa-volume-mute", "fa-volume-up");
    }

    if (currentAudio) {
      currentAudio.muted = isMuted;
    }
  }

  document.getElementById("volume-btn").addEventListener("click", toggleMute);

  // Try playing on DOMContentLoaded
  playNextAudio();
});
