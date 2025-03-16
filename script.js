// Scene 1 Audio
document.addEventListener("DOMContentLoaded", function () {
  let paragraphs = document.querySelectorAll(".play-audio");
  let currentIndex = 0;
  let isMuted = false; // حالة كتم الصوت
  let currentAudio = null; // الصوت الحالي

  // تشغيل الصوت مع تمييز الفقرة
  function playNextAudio() {
    if (currentIndex < paragraphs.length) {
      let paragraph = paragraphs[currentIndex];
      let audioSrc = paragraph.dataset.audio;

      if (!audioSrc) return;

      currentAudio = new Audio(audioSrc);
      currentAudio.muted = isMuted; // ضبط حالة الصوت عند التشغيل

      paragraph.classList.add("highlight");

      currentAudio.addEventListener("canplaythrough", function () {
        currentAudio.play();
      });

      currentAudio.onended = function () {
        paragraph.classList.remove("highlight");
        currentIndex++;
        playNextAudio();
      };
    }
  }

  // دالة كتم الصوت
  function toggleMute() {
    let volumeBtn = document.getElementById("volume-btn");
    let volumeIcon = volumeBtn.querySelector("i");

    isMuted = !isMuted;

    // تغيير الأيقونة
    if (isMuted) {
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    } else {
      volumeIcon.classList.remove("fa-volume-mute");
      volumeIcon.classList.add("fa-volume-up");
    }

    // كتم أو إلغاء كتم الصوت الحالي
    if (currentAudio) {
      currentAudio.muted = isMuted;
    }
  }

  // تشغيل الصوت الأول بعد 1 ثانية من تحميل الصفحة
  setTimeout(playNextAudio, 1000);

  // ربط زر كتم الصوت بالدالة
  document.getElementById("volume-btn").addEventListener("click", toggleMute);
});
