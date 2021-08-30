const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let playList = $(".playlist");
let cd = $(".cd");
const cdWidth = cd.offsetWidth;
const audio = $("#audio");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const playBtn = $(".btn-toggle-play");
const iconPlay = $(".player .icon-play");
const iconPause = $(".player .icon-pause");
const player = $(".player");
const progress = $(".progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");


const app = {
  playedSong: [],
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Chênh Vênh",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Chenh Venh - Le Cat Trong Ly.m4a",
      image: "./image/le-cat-trong-ly-2.jpg",
    },
    {
      name: "Chênh Vênh - Guitar",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Chenh Venh Guitar Version_ - Le Cat Tron.m4a",
      image: "./image/86091.jpg",
    },
    {
      name: "Chuyến Xe",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Chuyen Xe - Le Cat Trong Ly.m4a",
      image: "./image/71USURbYLiL._SS500_.jpg",
    },
    {
      name: "Cơm bão nghiêng đêm",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Con Bao Nghieng Dem - Le Cat Trong Ly.m4a",
      image: "./image/57381.jpg",
    },
    {
      name: "Hương Lạc",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Huong Lac - Le Cat Trong Ly.m4a",
      image: "./image/3463.jpg",
    },
    {
      name: "Giấc mộng lớn",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Giac Mong Lon - Le Cat Trong Ly.m4a",
      image: "./image/mai-kia.jpg",
    },
    {
      name: "Không Tên",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Khong Ten - Le Cat Trong Ly.m4a",
      image: "./image/1596091500496_600.jpg",
    },
    {
      name: "Lúng Ta Lúng Túng",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Lung Ta Lung Tung - Le Cat Trong Ly.m4a",
      image: "./image/1386152595351_500.jpg",
    },
    {
      name: "Mùa Yêu",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Mua Yeu - Le Cat Trong Ly.m4a",
      image: "./image/132918.jpg",
    },
    {
      name: "Trời Ơi!",
      singer: "Lê Cát Trọng Lý",
      path: "./music/Troi Oi - Le Cat Trong Ly.m4a",
      image: "./image/12516.jpg",
    },
  ],

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  render: function () {
    var htmls = app.songs.map(function (song, index) {
      return `
        <div class="song ${index === app.currentIndex ?'active' : ''}" data-index= "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },

  handleEvents: function () {
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWitdh = cdWidth - scrollTop;
      cd.style.width = newCdWitdh > 0 ? newCdWitdh + "px" : 0;
      cd.style.opacity = newCdWitdh / cdWidth;
    };

    // Xử lý CD quay/ dừng
    let cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    playBtn.onclick = function () {
      //Xử lý khi click play
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Khi song được play
    audio.onplay = function () {
      player.classList.add("playing");
      app.isPlaying = true;
      cdThumbAnimate.play();
    };

    //Khi song được pause
    audio.onpause = function () {
      player.classList.remove("playing");
      app.isPlaying = false;
      cdThumbAnimate.pause();
    };

    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      const progressPercent = Math.floor(
        (audio.currentTime * 100) / audio.duration
      );
      if (audio.duration) {
        progress.value = progressPercent;
      }
    };

    //Xử lý khi tua bài hát
    progress.oninput = function (e) {
      console.log(e.target.value);
      audio.currentTime = (e.target.value * audio.duration) / 100;
    };

    //Xử lý next song
    btnNext.onclick = function () {
      if (btnRandom.classList.contains("active")) {
        app.playRandomSong();
      }
      app.nextSong();
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };
    //Xử lý prev song
    btnPrev.onclick = function () {
      if (btnRandom.classList.contains("active")) {
        app.playRandomSong();
      }
      app.prevsong();
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    //Xử lý random toggle
    btnRandom.onclick = function (e) {
      app.isRandom = !app.isRandom;
      btnRandom.classList.toggle("active", app.isRandom);
    };

    //Xử lý khi hết bài
    audio.onended = function () {
      if (app.isRepeat) {
        // audio.loop;
        audio.play()
      } else {
        btnNext.onclick();
      }
    };

    // Xử lý khi ấn nút repeate
    btnRepeat.onclick = function (e) {
      app.isRepeat = !app.isRepeat;
      btnRepeat.classList.toggle("active", app.isRepeat);
    };

    //Lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      //Xử lý khi click vào song
      const songElements = e.target.closest('.song:not(.active)');
      const optionElements = e.target.closest('.option');

      if ( songElements||optionElements ) {

        if (songElements) {
          const newIndex = Number(songElements.getAttribute('data-index'));
          app.currentIndex = newIndex;
          app.loadCurrentSong();
          app.render();
          audio.play();
        } 


        // Xử lý khi click vào option
        else if (optionElements) {

        }
        

      };
    }
  },

  loadCurrentSong: function () {
    audio.src = this.currentSong.path;
    heading.innerHTML = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    app.loadCurrentSong();
  },

  prevsong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    app.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;

    if (this.playedSong.length === this.songs.length) {
      this.playedSong = [];
    } else {
      newIndex = Math.floor(Math.random() * app.songs.length);

      do {
        newIndex = Math.floor(Math.random() * app.songs.length);
      } while (
        newIndex === this.currentIndex ||
        this.playedSong.includes(app.songs[newIndex]) === true
      ); //loại bỏ trùng index hiện tại
      this.currentIndex = newIndex;
      app.playedSong.push(app.songs[this.currentIndex]);
    }
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout (function () {
      if (app.currentIndex < 3) {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'center',
      })} else {
        console.log(app.currentIndex);
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })}
    }, 100)
  },

  start: function () {
    //Định nghĩa thuộc tính cho obj
    this.defineProperties();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //Render playslist
    app.render();

    //Xử lý sự kiện
    this.handleEvents();
  },
};

app.start();
