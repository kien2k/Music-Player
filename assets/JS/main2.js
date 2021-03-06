/**
 * 1.Render songs
 * 2.Scroll top
 * 3.Play / pause / seek
 * 4.CD rotate
 * 5.Next / prev
 * 6.Random
 * 7.Next / Repeat when ended
 * 8.Active song
 * 9.Scroll active song into view
 * 10.Play song when click
 * 11. save volume in storage
 * 12. save song now in storage
 * 13..... add future of option, love song, skip back - foward in ...minutes....
 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE = 'my_player'
const playing = $('.player')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

const progress = $('.progress')
const current = $('.current')
const volumeSlider = $('.volume-slider')
const volumeBtn = $('.volume i')
const duration = $('.duration')
const audio = $('#audio')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return ` 
            <div  class="song ${index == this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>`
        } )
        playlist.innerHTML = htmls.join('')
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
            name: '???????????????????????????',
            singer: '?????? & ?????????',
            path: './assets/music/MuonCaTheGioiBietAnhYeuEm-LucTrietLiuZheHaKinhHien-4857969.mp3',
            image: './assets/img/anh yeu em.jpg',   
        },
        {
            name: 'Nothing Stopping Me',
            singer: 'Vicetone, Kat Nestel',
            path: './assets/music/Nightcore ??? Nothing Stopping Me.mp3',
            image: './assets/img/nothing stopping me.jpg',   
        },
        {
            name: 'Se??orita',
            singer: 'Shawn Mendes, Camila Cabello',
            path: './assets/music/Shawn Mendes, Camila Cabello ??? Se??orita.mp3',
            image: './assets/img/Se??orita.png',   
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
            path: './assets/music/Shayne Ward ??? Until You.mp3',
            image: './assets/img/Until you.jpg',   
        },
        {
            name: '?????????????????????',
            singer: '?????????',
            path: './assets/music/?????????????????????.mp3',
            image: './assets/img/y??u giang s??n.jpg',   
        },
        {
            name: 'Ng??i Sao S??ng Nh???t B???u Tr???i ????m',
            singer: 'Escape Plan',
            path: './assets/music/Escape Plan.mp3',
            image: './assets/img/ng??i sao s??ng nh???t tr???i ????m.jpg',   
        },
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong' , {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    }, 
    loadCurrentSong: function() {   
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        //x??? l?? cu???n to nh??? CD
        document.onscroll = function() {
            const scrollWidth = window.scrollY || document.documentElement.scrollTop
            const newcdWidth =  cdWidth - scrollWidth

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdWidth
        }
        // x??? l?? khi play song
        playBtn.onclick = function() {
            if(app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }

        //x??? l?? khi audio play
        audio.onplay = function() {
            app.isPlaying = true
            cdAnimation.play()
            playing.classList.add('playing')
        }

        // x??? l?? khi audio pause
        audio.onpause = function() {
            app.isPlaying = false
            cdAnimation.pause()
            playing.classList.remove('playing')
        }
        //x??? l?? khi b??i h??t thay ?????i
        audio.ontimeupdate = function(e) {
            // setting progress run with playing
            const progressTime = this.currentTime / this.duration * 100
            progress.value = progressTime
           //setting time 
            audio.onloadeddata = function() {
                const currentDurationPlaying = this.duration
                
                const totalMin = Math.floor(currentDurationPlaying / 60)
                const totalSec = Math.floor(currentDurationPlaying % 60)
                // if (totalSec < 10) {
                //     totalSec = `0${totalSec}`
                // } kh??ng hi???u v?? sao l???i l???i lu??n - v?? l??
                duration.innerText = `${totalMin}:${totalSec < 10 ? `0${totalSec}` : `${totalSec}`}`
            }
            //update playing song current time
            const currentTimePlaying = this.currentTime
            const currentMin = Math.floor(currentTimePlaying / 60)
            const currentSec = Math.floor(currentTimePlaying % 60)
            // if (currentSec < 10) {
            //     currentSec = `0${currentSec}`
            // } kh??ng hi???u v?? sao l???i l???i lu??n - v?? l??
            current.innerText = `${currentMin}:${currentSec < 10 ? `0${currentSec}` : `${currentSec}` }`
        }
        
        //x??? l?? tua range
        progress.oninput = function() {
            const progressChange = this.value * audio.duration / 100
            audio.currentTime = progressChange
        }

        //t??ng gi???m  volume
        volumeBtn.onclick = function() {
            volumeSlider.classList.toggle('active')
        }
        volumeSlider.oninput = function() {
            audio.volume = this.value;
        }

        // x??? l?? cd quay/ d???ng
        const cdAnimation = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        },  
        )
        cdAnimation.pause()

        //x??? l?? click next b??i h??t
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.loadRandomActive()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.activeScrollIntoView()
        }
        
        //x??? l?? click prev b??i h??t
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.loadRandomActive()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.activeScrollIntoView()
        }
        // x??? l?? click v??o random
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            this.classList.toggle('active', app.isRandom)
            app.setConfig('isRandom', app.isRandom)
        }

        //x??? l?? khi click v??o repeat
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            this.classList.toggle('active', app.isRepeat)
            app.setConfig('isRepeat', app.isRepeat)
        }
        // x??? l?? repeat when ended
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //x??? l?? khi click v??o song 
        playlist.onclick = function(e) {
            const nodeSong = e.target.closest('.song:not(.active)')
            if(nodeSong  || e.target.closest('.option')) {
                if(nodeSong) {
                    app.currentIndex = Number(nodeSong.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
                if(e.target.closest('.option')) {
                    console.log(123)
                }
            }

        }
        
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }  
        this.loadCurrentSong()   
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }  
        this.loadCurrentSong()  

    },
    loadRandomActive: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()      
    },
    activeScrollIntoView: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: "auto",
                block: "end"
            })
        }, 200)
       
    },
    loadConfig: function() {    
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }, 


     
    start: function() {
        this.loadConfig()

        this.defineProperties()

        this.render()

        this.handleEvents()

        this.loadCurrentSong()

        this.loadRandomActive()
    },
   
}
app.start()




