/* =========================
   AUDIQUE V4
========================= */

const audio = new Audio();

let currentSong = 0;
let isPlaying = false;
let shuffleMode = false;
let repeatMode = false;

let downloadedSongs = [];

/* =========================
   DEFAULT SONGS
========================= */

const songs = [
{
title: "Midnight Drive",
artist: "Audique Studio",
src: "songs/song1.mp3",
cover: "covers/cover1.jpg"
},
{
title: "Neon Dreams",
artist: "Audique Studio",
src: "songs/song2.mp3",
cover: "covers/cover2.jpg"
},
{
title: "Future Waves",
artist: "Audique Studio",
src: "songs/song3.mp3",
cover: "covers/cover3.jpg"
},
{
title: "Cosmic Flow",
artist: "Audique Studio",
src: "songs/song4.mp3",
cover: "covers/cover4.jpg"
},
{
title: "Cyber Pulse",
artist: "Audique Studio",
src: "songs/song5.mp3",
cover: "covers/cover5.jpg"
}
];

/* =========================
   DOM ELEMENTS
========================= */

const songList = document.getElementById("songList");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const searchInput = document.getElementById("searchInput");

const favoritesBtn = document.getElementById("favoritesBtn");
const recentBtn = document.getElementById("recentBtn");
const downloadedBtn = document.getElementById("downloadedBtn");
const allSongsBtn = document.getElementById("allSongsBtn");

const sectionTitle = document.getElementById("sectionTitle");

const favoriteSongBtn = document.getElementById("favoriteSongBtn");

const addSongsBtn = document.getElementById("addSongsBtn");
const songUploader = document.getElementById("songUploader");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const createPlaylistBtn =
document.getElementById("createPlaylistBtn");

const playlistContainer =
document.getElementById("playlistContainer");

const themeBtn =
document.getElementById("themeBtn");

/* =========================
   LOCAL STORAGE
========================= */

let favorites = [];
let recentSongs = [];
let playlists = [];

try{
favorites =
JSON.parse(
localStorage.getItem("audiqueFavorites")
) || [];
}catch{
favorites = [];
}

try{
recentSongs =
JSON.parse(
localStorage.getItem("audiqueRecent")
) || [];
}catch{
recentSongs = [];
}

try{
playlists =
JSON.parse(
localStorage.getItem("audiquePlaylists")
) || [];
}catch{
playlists = [];
}

/* =========================
   LOAD SONG
========================= */

function loadSong(index){

audio.src = songs[index].src;

title.textContent =
songs[index].title;

artist.textContent =
songs[index].artist;

cover.src =
songs[index].cover;

addToRecent(
songs[index].title
);

}

/* =========================
   PLAY
========================= */

function playSong(){

audio.play();

isPlaying = true;

cover.classList.add("playing");

playBtn.innerHTML =
'<i class="fas fa-pause"></i>';

}

/* =========================
   PAUSE
========================= */

function pauseSong(){

audio.pause();

isPlaying = false;

cover.classList.remove("playing");

playBtn.innerHTML =
'<i class="fas fa-play"></i>';

}

/* =========================
   NEXT
========================= */

function nextSong(){

if(shuffleMode){

currentSong =
Math.floor(
Math.random() * songs.length
);

}else{

currentSong++;

if(currentSong >= songs.length){

currentSong = 0;

}

}

loadSong(currentSong);
playSong();

}

/* =========================
   PREVIOUS
========================= */

function prevSong(){

currentSong--;

if(currentSong < 0){

currentSong =
songs.length - 1;

}

loadSong(currentSong);
playSong();

}

/* =========================
   SONG LIST
========================= */

function renderSongs(list){

songList.innerHTML = "";

if(list.length === 0){

songList.innerHTML =
"<p>No songs found.</p>";

return;

}

list.forEach(song=>{

const card =
document.createElement("div");

card.className =
"song-card";

card.innerHTML = `
<img src="${song.cover}">
<div class="song-meta">
<h4>${song.title}</h4>
<p>${song.artist}</p>
</div>
`;

card.addEventListener("click",()=>{

currentSong =
songs.findIndex(
s=>s.title === song.title
);

loadSong(currentSong);
playSong();

});

songList.appendChild(card);

});

}

/* =========================
   RECENT
========================= */

function addToRecent(songTitle){

recentSongs =
recentSongs.filter(
s=>s!==songTitle
);

recentSongs.unshift(songTitle);

recentSongs =
recentSongs.slice(0,10);

localStorage.setItem(
"audiqueRecent",
JSON.stringify(recentSongs)
);

}

/* =========================
   FAVORITES
========================= */

favoriteSongBtn.addEventListener(
"click",
()=>{

const current =
songs[currentSong].title;

if(
!favorites.includes(current)
){

favorites.push(current);

localStorage.setItem(
"audiqueFavorites",
JSON.stringify(favorites)
);

alert(
"Added to Favorites"
);

}

}
);

/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
"keyup",
()=>{

const value =
searchInput.value
.toLowerCase();

const filtered =
songs.filter(song=>

song.title
.toLowerCase()
.includes(value)

||

song.artist
.toLowerCase()
.includes(value)

);

renderSongs(filtered);

}
);

/* =========================
   FILTERS
========================= */

allSongsBtn.onclick = ()=>{

sectionTitle.textContent =
"All Songs";

renderSongs(songs);

};

favoritesBtn.onclick = ()=>{

sectionTitle.textContent =
"Favorites";

const fav =
songs.filter(song=>

favorites.includes(
song.title
)

);

renderSongs(fav);

};

recentBtn.onclick = ()=>{

sectionTitle.textContent =
"Recently Played";

const recent =
songs.filter(song=>

recentSongs.includes(
song.title
)

);

renderSongs(recent);

};

downloadedBtn.onclick = ()=>{

sectionTitle.textContent =
"Downloaded Songs";

renderSongs(
downloadedSongs
);

};

/* =========================
   UPLOAD SONGS
========================= */

addSongsBtn.onclick = ()=>{

songUploader.click();

};

songUploader.addEventListener(
"change",
(e)=>{

const files =
Array.from(
e.target.files
);

files.forEach(file=>{

const song = {

title:
file.name.replace(
".mp3",
""
),

artist:
"Uploaded Song",

src:
URL.createObjectURL(file),

cover:
"covers/cover1.jpg"

};

songs.push(song);

downloadedSongs.push(song);

});

renderSongs(songs);

}
);

/* =========================
   PLAYLISTS
========================= */

function renderPlaylists(){

playlistContainer.innerHTML = "";

playlists.forEach(
(playlist,index)=>{

const item =
document.createElement("div");

item.className =
"playlist-item";

item.textContent =
playlist.name;

playlistContainer.appendChild(
item
);

}
);

}

createPlaylistBtn.onclick = ()=>{

const name =
prompt(
"Playlist Name"
);

if(!name) return;

playlists.push({

name:name,
songs:[]

});

localStorage.setItem(
"audiquePlaylists",
JSON.stringify(playlists)
);

renderPlaylists();

};

/* =========================
   SHUFFLE
========================= */

shuffleBtn.onclick = ()=>{

shuffleMode =
!shuffleMode;

shuffleBtn.style.background =
shuffleMode
? "#00bfff"
: "";

};

/* =========================
   REPEAT
========================= */

repeatBtn.onclick = ()=>{

repeatMode =
!repeatMode;

repeatBtn.style.background =
repeatMode
? "#00bfff"
: "";

};

/* =========================
   PLAYER EVENTS
========================= */

playBtn.onclick = ()=>{

isPlaying
? pauseSong()
: playSong();

};

nextBtn.onclick =
nextSong;

prevBtn.onclick =
prevSong;

audio.addEventListener(
"ended",
()=>{

if(repeatMode){

playSong();

}else{

nextSong();

}

}
);

/* =========================
   PROGRESS
========================= */

audio.addEventListener(
"timeupdate",
()=>{

const percent =

(audio.currentTime
/
audio.duration)
*
100;

progress.value =
percent || 0;

currentTimeEl.textContent =
formatTime(
audio.currentTime
);

durationEl.textContent =
formatTime(
audio.duration
);

}
);

progress.addEventListener(
"input",
()=>{

audio.currentTime =

(progress.value/100)
*
audio.duration;

}
);

/* =========================
   VOLUME
========================= */

volume.addEventListener(
"input",
()=>{

audio.volume =
volume.value;

}
);

/* =========================
   THEME
========================= */

const savedTheme =
localStorage.getItem(
"audiqueTheme"
);

if(savedTheme==="light"){

document.body.classList.add(
"light"
);

}

function updateThemeIcon(){

const icon =
themeBtn.querySelector("i");

if(
document.body.classList.contains("light")
){

icon.className =
"fas fa-sun";

}else{

icon.className =
"fas fa-moon";

}

}

updateThemeIcon();

themeBtn.onclick = ()=>{

document.body.classList.toggle(
"light"
);

localStorage.setItem(
"audiqueTheme",

document.body.classList.contains("light")
? "light"
: "dark"
);

updateThemeIcon();

};

/* =========================
   TIME FORMAT
========================= */

function formatTime(time){

if(isNaN(time))
return "0:00";

let mins =
Math.floor(time/60);

let secs =
Math.floor(time%60);

if(secs<10){

secs = "0"+secs;

}

return `${mins}:${secs}`;

}

/* =========================
   INIT
========================= */

loadSong(currentSong);

renderSongs(songs);

renderPlaylists();

audio.volume = 1;