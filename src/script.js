document.addEventListener("DOMContentLoaded", () => {
  let currentSceneIndex = -1;
  let currentAudio = null;
  let isMuted = false;
  const scenes = document.querySelectorAll(".scene");
  const nextButton = document.getElementById("next-btn");
  const prevButton = document.getElementById("prev-btn");
  const startButton = document.getElementById("start-btn");
  const muteButton = document.getElementById("mute-btn");
  const startScreen = document.getElementById("start-screen");
  const storyContainer = document.getElementById("story-container");
  const pauseResumeButton = document.getElementById("pause-resume-btn");
  let isPaused = false; // حالة الإيقاف المؤقت

  // تشغيل الصوت الخاص بالمشهد الحالي فقط مع تمييز الفقرة
  const playAudio = async (scene) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // إعادة ضبط الصوت السابق
    }

    const audioElements = scene.querySelectorAll(".play-audio");
    for (const element of audioElements) {
      // إزالة التمييز من جميع الفقرات
      audioElements.forEach((el) => el.classList.remove("highlight"));

      const audioSrc = element.getAttribute("data-audio");
      if (audioSrc) {
        currentAudio = new Audio(audioSrc);
        currentAudio.muted = isMuted; // تطبيق حالة الكتم
        element.classList.add("highlight"); // تمييز الفقرة الحالية

        await new Promise((resolve) => {
          currentAudio.onended = () => {
            element.classList.remove("highlight"); // إزالة التمييز عند انتهاء الصوت
            resolve();
          };
          currentAudio.play();
        });
      }
    }
    goToNextScene(); // الانتقال التلقائي بعد انتهاء آخر صوت
  };

  // الانتقال إلى المشهد التالي
  const goToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      scenes[currentSceneIndex].classList.remove("active");
      currentSceneIndex++;
      scenes[currentSceneIndex].classList.add("active");
      playAudio(scenes[currentSceneIndex]);
      updateButtons();
    }
  };

  // الرجوع إلى المشهد السابق
  const goToPreviousScene = () => {
    if (currentSceneIndex > 0) {
      scenes[currentSceneIndex].classList.remove("active");
      currentSceneIndex--;
      scenes[currentSceneIndex].classList.add("active");
      playAudio(scenes[currentSceneIndex]); // تشغيل الصوت عند العودة
      updateButtons();
    }
  };

  // تحديث حالة الأزرار
  const updateButtons = () => {
    prevButton.style.display =
      currentSceneIndex === 0 ? "none" : "inline-block";
    nextButton.style.display =
      currentSceneIndex === scenes.length - 1 ? "none" : "inline-block";
  };

  pauseResumeButton.addEventListener("click", () => {
    if (currentAudio) {
      if (!isPaused) {
        currentAudio.pause(); // إيقاف الصوت مؤقتًا
        pauseResumeButton.innerHTML = '<i class="fas fa-play"></i>'; // تغيير الأيقونة إلى تشغيل
      } else {
        currentAudio.play(); // استئناف التشغيل
        pauseResumeButton.innerHTML = '<i class="fas fa-pause"></i>'; // تغيير الأيقونة إلى إيقاف مؤقت
      }
      isPaused = !isPaused;
    }
  });

  // تشغيل القصة من البداية
  startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    storyContainer.style.display = "block";
    currentSceneIndex = 0;
    scenes[currentSceneIndex].classList.add("active");
    playAudio(scenes[currentSceneIndex]);
    updateButtons();
  });

  nextButton.addEventListener("click", goToNextScene);
  prevButton.addEventListener("click", goToPreviousScene);

  // زر كتم وتشغيل الصوت
  muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    if (currentAudio) {
      currentAudio.muted = isMuted;
    }
    muteButton.innerHTML = isMuted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
  });
});
