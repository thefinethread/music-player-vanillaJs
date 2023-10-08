const playPauseBtn = document.querySelector('.play-pause');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const volumeBtn = document.querySelector('.volume-btn');
const volumeSlider = document.querySelector('#volume');
const shuffleBtn = document.querySelector('.shuffle');
const musicContainer = document.querySelector('.music-container');
const titleEl = document.querySelector('.title');
const artistEl = document.querySelector('.artist');
const audio = document.querySelector('audio');
const songDurationEl = document.querySelector('.song-duration');
const currentSongDurationEl = document.querySelector('.current-time');
const audioTime = document.querySelector('#audio-time');
const coverPicEl = document.querySelector('.cover-pic');
const bgOverlay = document.querySelector('.bg-overlay');

let songsDataArr = [];
let currSongIndex = 0;
let isShuffle = false;

const getSongsData = async () => {
    const res = await fetch('./song-metadata.json');
    songsDataArr = await res.json();
};

const playPauseMedia = () => {
    // audio.paused returns true if audio is paused
    if (audio.paused) {
        audio.play();
        playPauseBtn.firstElementChild.className = 'ri-pause-circle-fill';
    } else {
        audio.pause();
        playPauseBtn.firstElementChild.className = 'ri-play-circle-fill';
    }
};

const changeSong = (direction) => {
    if (direction === 'next') {
        currSongIndex++;
        currSongIndex === songsDataArr.length && (currSongIndex = 0);
    } else {
        currSongIndex--;
        currSongIndex === -1 && (currSongIndex = songsDataArr.length - 1);
    }

    // if shuffle is ON then make currSongIndex random from 0 to length of songsArray
    if (isShuffle) {
        const rndNum = Math.floor(Math.random() * songsDataArr.length);
        currSongIndex = rndNum;
    }
    setSongInfo();
    playPauseMedia();
    audio.onloadedmetadata = showSongDuration;
};

const setSongInfo = () => {
    const { title, artist, songFile, coverPic, bg } =
        songsDataArr[currSongIndex];

    audio.src = songFile;
    coverPicEl.style.backgroundImage = `url(${coverPic})`;
    bgOverlay.style.background = ` linear-gradient(to bottom, ${bg}, rgb(0, 0, 0))`;
    titleEl.innerText = title;
    artistEl.innerText = artist;
    currentSongDurationEl.innerText = '0:00';
};

const showTimeUpdateInRangeInput = () => {
    const progress = (100 / audio.duration) * audio.currentTime;

    if (isNaN(progress)) return;

    audioTime.value = Math.floor(progress);

    audioTime.style.background = `linear-gradient(to right, #1db954 ${Math.floor(
        progress
    )}%, rgba(255, 255, 255, 0.3) ${progress}%)`;
};

const onMediaProgress = () => {
    currentSongDurationEl.innerText = timeToMmSs(audio.currentTime);
    showTimeUpdateInRangeInput();
};

const onSongEnd = () => {
    playPauseBtn.firstElementChild.className = 'ri-play-circle-fill';
    audioTime.style.background = `rgba(255, 255, 255, 0.3) `;
    changeSong('next');
};

const timeToMmSs = (time) => {
    const timeInMmSs = new Date(Math.floor(time) * 1000)
        .toISOString()
        .substring(15, 19);

    return timeInMmSs;
};

const setSongProgress = () => {
    audio.currentTime = (audio.duration / 100) * audioTime.value;
};

const showSongDuration = () => {
    songDurationEl.innerText = timeToMmSs(audio.duration);
};

const changeVolume = () => {
    audio.volume = (1 / 10) * volumeSlider.value;
    volumeSlider.style.background = `linear-gradient(to right, #1db954 ${
        volumeSlider.value * 10
    }%, rgba(255, 255, 255, 0.3) ${volumeSlider.value * 10}%)`;
};

const showVolumeSlider = () => {
    volumeSlider.classList.toggle('active');
};

const onShuffle = () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
};

playPauseBtn.addEventListener('click', playPauseMedia);
nextBtn.addEventListener('click', () => changeSong('next'));
prevBtn.addEventListener('click', () => changeSong('prev'));
volumeBtn.addEventListener('click', showVolumeSlider);
volumeSlider.addEventListener('input', changeVolume);
shuffleBtn.addEventListener('click', onShuffle);

audio.addEventListener('timeupdate', onMediaProgress);

audio.addEventListener('ended', onSongEnd);

window.addEventListener('DOMContentLoaded', () => {
    getSongsData();
    changeVolume();
});

audioTime.addEventListener('input', setSongProgress);
