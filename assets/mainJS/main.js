const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'My_Player'
const play = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const current = $('.current')
const volumeSlider = $('.volume-slider')
const volumeBtn = $('.volume i')
const duration = $('.duration')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    conFig: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.conFig[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.conFig))
    },
    songs: [
        {
            name: 'Tabun',
            singer: 'Yoasobi',
            path: './assets/music/Tabun.mp3',
            image: './assets/img/tabun1.jpg',
        },
        {
            name: 'At My Worst',
            singer: 'Pink Sweat$',
            path: './assets/music/At My Worst.mp3',
            image: './assets/img/at-my-worst.jpeg',   
        },
        {
            name: '让全世界知道我爱你',
            singer: '六哲 & 贺敬轩',
            path: './assets/music/MuonCaTheGioiBietAnhYeuEm-LucTrietLiuZheHaKinhHien-4857969.mp3',
            image: './assets/img/everybody knows i love you.jpg',   
        },
        {
            name: 'Nothing Stopping Me',
            singer: 'Vicetone, Kat Nestel',
            path: './assets/music/Nightcore – Nothing Stopping Me.mp3',
            image: './assets/img/nothing stopping me.jpg',   
        },
        {
            name: 'Señorita',
            singer: 'Shawn Mendes, Camila Cabello',
            path: './assets/music/Shawn Mendes, Camila Cabello – Señorita.mp3',
            image: './assets/img/Señorita.png',   
        },
        {
            name: 'Symphony Heartbeat',
            singer: 'Tape Machines feat. NeiNei',
            path: './assets/music/Symphony Heartbeat.mp3',
            image: './assets/img/symphony heartbeat.jpg',   
        },
        {
            name: 'Until You',
            singer: 'Shayne Ward',
            path: './assets/music/Shayne Ward – Until You.mp3',
            image: './assets/img/Until you.jpg',   
        },
        {
            name: '爱江山更爱美人',
            singer: '安逸尘',
            path: './assets/music/爱江山更爱美人.mp3',
            image: './assets/img/yêu giang sơn.jpg',   
        },
        {
            name: 'Ngôi Sao Sáng Nhất Bầu Trời Đêm',
            singer: 'Escape Plan',
            path: './assets/music/Escape Plan.mp3',
            image: './assets/img/ngôi sao sáng nhất trời đêm.jpg',   
        },
    ],
    render: function() {
        const htmls = this.songs.map( (song, index) => {// nhớ làm lại bằng function thường
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
            ` 
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
             get() {
                return this.songs[this.currentIndex]
             }
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth 

        //xử lí cd quay khi play và dừng lại khi pause
        const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,// 10 sencond
            iterations: Infinity
        })
        cdThumbAnimation.pause()
        
        // xử lí phóng to/ thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth >= 0 ? newCdWidth+'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lí khi click play
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        //khi song play
        audio.onplay = function() {
            app.isPlaying = true
            play.classList.add('playing')
            cdThumbAnimation.play()
        }
        
        //khi song bị pause
        audio.onpause = function() {
            app.isPlaying = false
            play.classList.remove('playing')
            cdThumbAnimation.pause()
        }

        //Khi tiến độ bài hát thay đổi - range sẽ thay đổi theo 
        audio.ontimeupdate = function() {
            const progressPecent = Math.floor(this.currentTime * 100 / this.duration )
            progress.value = progressPecent

        
           //setting time 
            audio.onloadeddata = function() {
                const currentDurationPlaying = this.duration
                
                const totalMin = Math.floor(currentDurationPlaying / 60)
                const totalSec = Math.floor(currentDurationPlaying % 60)
                // if (totalSec < 10) {
                //     totalSec = `0${totalSec}`
                // } không hiểu vì sao lại lỗi luôn - vô lý
                duration.innerText = `${totalMin}:${totalSec < 10 ? `0${totalSec}` : `${totalSec}`}`
            }
            //update playing song current time
            const currentTimePlaying = this.currentTime
            const currentMin = Math.floor(currentTimePlaying / 60)
            const currentSec = Math.floor(currentTimePlaying % 60)
            // if (currentSec < 10) {
            //     currentSec = `0${currentSec}`
            // } không hiểu vì sao lại lỗi luôn - vô lý
            current.innerText = `${currentMin}:${currentSec < 10 ? `0${currentSec}` : `${currentSec}` }`
        }

        //Xử lí khi tua song - dùng oninput sẽ ko bị giật
        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        //tăng giảm  volume
        volumeBtn.onclick = function() {
            volumeSlider.classList.toggle('active')
        }
        volumeSlider.oninput = function() {
            audio.volume = this.value;
        }

        // khi next song
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()    
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        //khi prev song
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.prevSong()    
            }
            audio.play()
            app.render()// nhớ làm cách khác: xóa active trước đó và thêm mới active
            app.scrollToActiveSong()

        }

        //xử lí khi random song
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            this.classList.toggle('active', app.isRandom)
        }

        // xử lí khi repeat song
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat )
            this.classList.toggle('active', app.isRepeat)
        }

        // xử lí khi play ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            }else {
                nextBtn.click()
            }
        }

        // xử lí khi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //xử lí khi click vào song not active
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    app.scrollToActiveSong()
                    audio.play()

                }
                //xử lí khi click vào option
                if (e.target.closest('.option')){
                    console.log(123)
                }
            }
        }

    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 400)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.conFig.isRandom
        this.isRepeat = this.conFig.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newRandomIndex
        do {
            newRandomIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.currentIndex === newRandomIndex)

        this.currentIndex = newRandomIndex
        this.loadCurrentSong()
    },
    start: function() {
        //gán cấu hình tử config vào ứng dụng 
        this.loadConfig()

        //định nghĩa các thuộc tính
        this.defineProperties()

        //Lắng nghe/xử lí các sự kiên(dom events)
        this.handleEvents()

        //Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //render list bài hát 
        this.render()

        //hiển thị trạng thái ban đầu của button repeat, random 
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }

}

app.start()
//note
/**
 * sửa background các btn
 * sửa range khi di vào
 * khi click vào bài  gần cuối màn hình, list nhảy tua lên màn hình
 */