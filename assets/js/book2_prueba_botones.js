
var global_currentSlide = 1; //cuenta en que slide esta
var global_minSlide = 1; // el numero minimo de slide para controlar que no salga de parametros (deberia ser siempre 1)
// var global_maxSlide = 1; // la maxima cantidad de slides para controlar que no salga de parametro
var global_lang = 'spanish'; // determina el lenguaje a utilizar puede ser spanish o guarani
var global_simple = false; // determina si esta en modo texto simple
var global_audio = false; // determina si se esta reproduciendo audio
var global_senhas = false; // determina si se muestra el vide de lenguaje de senias
var global_scrolling = false; // esta scrolleando (?)
var animation_speed = 400;
var is_play = false; // determina si esta reproduciendo el audio (ver diferencia entre global_audio)
var stop_recursion = false; // no se usa


var global_currentAudio = 1; // indica que numero de audio reproducir en el slide actual (?)
var audio_element = false;  // puntero al audio que se tiene que reproducir o pausar, si es false es que no hay ningun audio indicado para reproducir
var global_minAudio = 1; // no se usa
var global_maxAudio = 0; // indica cuantos elementos en el slide tienen audio pero no se usa aparte de eso (?)

var audio_queue = [];

var contentOffset = 0; // offset para hacer scroll al siguiente slide (?) constante 96

var memoria = false; // tiene que ver con ejercicios de memoria
var audio_assets_dir = 'assets/audio/';
var video_assets_dir = 'assets/video/';
var audio_extension = '.mp3';
var video_extension = '.mp4';

var text_slides = [4, 10];




function activateModal(id_modal, word_modal, image_modal, audio, description_modal) {
    if (id_modal == 1) {
        title_modal = "Descripción de la imagen"
    } else {
        title_modal = "Glosario"
    }


    if (image_modal && image_modal != '') {
        var image = document.getElementById("div_image");
        image.setAttribute("class", "d-block");
        image.setAttribute("data-audio-file", audio);
        image.setAttribute("src", image_modal);
    } else {
        var image = document.getElementById("div_image");
        image.setAttribute("class", "d-none");
    }


    if (word_modal && word_modal != '') {
        var word = document.getElementById("word");
        word.setAttribute("style", "display: block");
        word.textContent = word_modal;
    } else {
        var word = document.getElementById("word");
        word.setAttribute("style", "display: none");
    }



    var description = document.getElementById("div_description");
    description.textContent = description_modal;

    var main_title = document.getElementById("title");
    main_title.textContent = title_modal;

    $('#myModal').modal('toggle');
    $('#myModal').modal('show');
    $('#myModal').modal('hide');

}

function goToSlide(slideNo) {

    let slide_to_go = slides_dictionary[slideNo];
    // console.log("slideNo", slideNo);
    // console.log("slide_to_go", slide_to_go);
    if (slideNo >= global_minSlide && slideNo <= global_maxSlide) {
        // if ((slideNo == 2 && global_currentSlide == 3) || slideNo == 3 || slideNo == 4 || (slideNo == 5 && global_currentSlide == 4) ||
        //     (slideNo == 6 && global_currentSlide == 7) || slideNo == 7 || slideNo == 8 || (slideNo == 9 && global_currentSlide == 8) ||
        //     (slideNo == 10 && global_currentSlide == 11) || slideNo == 11 || slideNo == 12 || (slideNo == 13 && global_currentSlide == 12)
        // ) {
        //     animation_speed = 1
        // } else {
        //     animation_speed = 400
        // }
        if(slideNo > global_currentSlide){
            if (slide_to_go.forward_animation){
                animation_speed = 400;
            }else{
                animation_speed = 1;
            }
        } else{
            if (slide_to_go.back_animation){
                animation_speed = 400;
            }else{
                animation_speed = 1;
            }
        }

        // console.log("slide_to_go.slide_name", slide_to_go.slide_name);
        $('html, body').stop().animate({ scrollTop: $("#" + slide_to_go.slide_name).offset().top - contentOffset }, animation_speed, 'swing', function () {
            global_currentSlide = slideNo;
            global_scrolling = false;
            $('#var-slide_number').html(global_currentSlide);
            global_maxAudio = $("#" + slide_to_go.slide_name).find('.js-read-auto').length;
            audio_queue = [];
            $("#" + slide_to_go.slide_name).find('.js-read-auto').filter(':visible').each(function () {
                audio_queue.push($(this));
            });
            audio_queue.push('end');
            global_currentAudio = 1;
            $('.read-selected').removeClass('read-selected');
            if (audio_element) {
                audio_element.pause();
                audio_element = false;
                var video = document.getElementById("video-ls");
                video.pause();
                video.currentTime = 0;
                if (is_play) {
                    playNextAudio();
                }
            } else {
                if (is_play) {
                    playNextAudio();
                }
            }
        });
    } else {
        setTimeout(function () {
            global_scrolling = false;
        }, 500);
    }
}

function getLangFilesPrefix() {
    var audioPrefix = '';
    switch (global_lang) {
        case 'guarani':
            audioPrefix = 'gua-';
            break;
        case 'spanish':
            audioPrefix = '';
            break;
    }
    return audioPrefix;
}

function isRight(element) {
    var data = element.data('is-right');
    return data === true;
}

function isExclusive(element) {
    var data = element.data('is-exclusive');
    return data === true;
}

function startUp() {
    //  var counter = 0;
    //  $('.slide').each(function(){
    //      $(this).attr("id", 'slide-'+ ++counter);
    //  });
    //  global_maxSlide = counter;

    

    contentOffset = 5;


    setSimple(global_simple);
    // setAudio(global_audio);
    setSenhas(global_senhas);
    // setLang(global_lang);
    setNarration(global_audio, global_lang);


    $('#var-last_slide_number').html(global_maxSlide);
    goToSlide(global_currentSlide);
}
function setSimple(setVal) {
    if (setVal) {
        $(".select-simple").fadeTo("fast", 1);
        global_simple = true;
        $(".simple-lang-on").each(function () {
            $(this).show();
        });
        $(".simple-lang-off").each(function () {
            $(this).hide();
        });
        // $('.simple-lang-on').fadeIn();
        // $('.simple-lang-off').fadeOut();
    } else {
        $(".select-simple").fadeTo("fast", 0.3);
        global_simple = false;
        $(".simple-lang-on").each(function () {
            $(this).hide();
        });
        $(".simple-lang-off").each(function () {
            $(this).show();
        });
        // $('.simple-lang-on').fadeOut();
        // $('.simple-lang-off').fadeIn();
    }
    goToSlide(global_currentSlide);
}
function setAudio(setVal) {
    if (setVal) {
        if (!is_play) {
            $('#play-pause').click();
        }
        $(".select-audio").fadeTo("fast", 1);
        global_audio = true;
    } else {
        $(".select-audio").fadeTo("fast", 0.3);
        global_audio = false;
    }
    goToSlide(global_currentSlide);
}

function setNarration(setVal, narrationLanguage) {
    console.log("setNarration", setVal);
    setLang(narrationLanguage);

    if (setVal) {
        if (!is_play) {
            $('#play-pause').click();
        }
        if(narrationLanguage == 'spanish'){
            $(".select-audio-spanish").fadeTo("fast", 1);
            $(".select-audio-guarani").fadeTo("fast", 0.3);
        }else{
            $(".select-audio-spanish").fadeTo("fast", 0.3);
            $(".select-audio-guarani").fadeTo("fast", 1);
        }
        global_audio = true;
    } else {
        $(".select-audio-spanish").fadeTo("fast", 0.3);
        $(".select-audio-guarani").fadeTo("fast", 0.3);
        global_audio = false;
    }
    goToSlide(global_currentSlide);
}
function setSenhas(setVal) {
    if (global_lang != 'guarani') {
        if (setVal) {
            if (!is_play) {
                $('#play-pause').click();
            }

            $(".select-senhas").fadeTo("fast", 1);
            global_senhas = true;
            $("#video-column").fadeIn();

            setAudio(false); // se desactiva el audio si se activa el lenguaje de senias
        } else {
            $(".select-senhas").fadeTo("fast", 0.3);
            global_senhas = false;
            $("#video-column").fadeOut();
        }
    }
    goToSlide(global_currentSlide);
}
function setLang(lang) {
    switch (lang) {
        case 'guarani':
            global_lang = 'guarani';
            break;
        case 'spanish':
            global_lang = 'spanish';
            break;
    }
    //alert('lang set = ' + global_lang);
}

function getCurrentSlide() {
    let slide_to_go = slides_dictionary[global_currentSlide];
    return $("#" + slide_to_go.slide_name);
}

function UrlExistsAudio(url) {
    audio = new Audio(url);
}

function UrlExistsVideo(url) {
    audio = new Video(url);
}

function UrlExists(asd) {
    return true;
}

// Auto read
function playNextAudio() {
    console.log("playNextAudio");
    var video = document.getElementById("video-ls");
    console.log("variable video", video);
    if (audio_queue[0] === 'end') {
        console.log("if(audio_queue[0] === 'end'");
        if (audio_element) {
            console.log("audio_element", audio_element);
            audio_element.play();
            video.play();
        }
        return;
    } //end condition

    if (audio_element) {
        console.log("audio_element", audio_element);
        audio_element.play();
        video.play();
    } else {
        console.log("------> nuevo audio");
        if (audio_queue.length == 0) return;

        var audioUrl;
        // genera el audioUrl en base a los parametros y los contadores de slide y de global_currenAudio
        // if (text_slides.includes(global_currentSlide) && global_simple) {
        //     console.log("if(text_slides.includes(global_currentSlide) && global_simple)");
        //     audioUrl = '' + audio_assets_dir + getLangFilesPrefix() + 'slide-' + global_currentSlide + '/' + 'audio-' + global_currentAudio + '-ts' + audio_extension;
        // } else {
        //     audioUrl = '' + audio_assets_dir + getLangFilesPrefix() + 'slide-' + global_currentSlide + '/' + 'audio-' + global_currentAudio + audio_extension;
        // }

        var audio;
        let item = audio_queue.shift();
        // console.log("audioUrl1:" + audioUrl);
        audioUrl = item.data('audio-file');
        console.log("audioUrl2:" + audioUrl);

        // var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-' + global_currentAudio + video_extension;
        var videoUrl = item.data('video-file');

        console.log("video", video);
        if (videoUrl && UrlExists(videoUrl)) {
            if ((text_slides.includes(global_currentSlide)) && global_currentAudio > 1) {
                console.log("if((text_slides.includes(global_currentSlide) ) && global_currentAudio > 1  )");
            } else {
                console.log("else ------->if((text_slides.includes(global_currentSlide) ) && global_currentAudio > 1  )");
                $(video).find('source').attr('src', videoUrl);
                video.load();
                video.play();
            }
        }

        // audio
        // var audioUrl;
        // genera el audioUrl en base a los parametros y los contadores de slide y de global_currenAudio
        // if (text_slides.includes(global_currentSlide) && global_simple) {
        //     console.log("if(text_slides.includes(global_currentSlide) && global_simple)");
        //     audioUrl = '' + audio_assets_dir + getLangFilesPrefix() + 'slide-' + global_currentSlide + '/' + 'audio-' + global_currentAudio + '-ts' + audio_extension;
        // } else {
        //     audioUrl = '' + audio_assets_dir + getLangFilesPrefix() + 'slide-' + global_currentSlide + '/' + 'audio-' + global_currentAudio + audio_extension;
        // }

        // var audio;
        // let item = audio_queue.shift();
        // console.log("audioUrl1:" + audioUrl);
        // audioUrl = item.data('audio-file');
        // console.log("audioUrl2:" + audioUrl);

        audio = new Audio(audioUrl);
        var localcurrentaudio = global_currentAudio;
        console.log("new audio", audio);
        audio.onerror = function () {
            console.log("audio on error");
            audio_element.pause();
            var audio = new Audio(audio_assets_dir + slides_dictionary[global_currentSlide] + '/' + 'audio-' + localcurrentaudio + audio_extension);
            audio.play();
            audio_element = audio;
        };
        audio.play();
        audio_element = audio;
        console.log(audio_queue);


        var currentSlide = getCurrentSlide();
        // si tiene un texto con scroll, hace algun tipo de scroll (esto ya no vamos a usar por que no usamos scroll)
        //  var scrollableItem = currentSlide.find('.scrollable');
        //  if(scrollableItem.length > 0 && item.parents('.scrollable').length > 0){
        //  //if( - scrollableItem[0].scrollTop + item.position().top > 250)
        //      scrollableItem[0].scrollTop = item.position().top - scrollableItem.height()/2;
        //  }

        item.addClass('read-selected');

        console.log("-------->item data-audio-file:", item.data('audio-file'));

        audio_queue.push(item);
        global_currentAudio++;
        video.onended = function () {
            if (audio_element.paused) {
                item.removeClass('read-selected');
                audio_element = false;
                playNextAudio();
            }
        };
        audio_element.onended = function () {
            var video = document.getElementById("video-ls");
            if (video.currentTime == 0 || video.paused || !global_senhas || text_slides.includes(global_currentSlide)) {
                item.removeClass('read-selected');
                audio_element = false;
                playNextAudio();
            }
        };
    }
}

function playPreviousAudio() {
    var video = document.getElementById("video-ls");
    if (audio_element) {
        audio_element.pause();
        audio_element = false;
        video.pause();
    }
    var itemAux = '';
    var last_element = audio_queue.pop();
    audio_queue.push(last_element);
    if (last_element === "end") {
        global_currentAudio = 1;
    } else {
        itemAux = audio_queue.pop();
        if (itemAux != 'end') {
            audio_queue.unshift(itemAux);
            global_currentAudio--;
            itemAux.removeClass('read-selected');
            itemAux = audio_queue.pop();
            if (itemAux != 'end') {
                audio_queue.unshift(itemAux);
                itemAux.removeClass('read-selected');
                global_currentAudio--;
            } else {
                audio_queue.push(itemAux);
                global_currentAudio = 1;
            }
        } else {
            audio_queue.push(itemAux);
        }
    }
    if (is_play)
        playNextAudio();
}

function skipAudio() {
    if (audio_element) {
        audio_element.pause();
        audio_element = false;
        var itemAux = audio_queue[audio_queue.length - 1];
        if (itemAux != 'end') {
            itemAux.removeClass('read-selected');
        }
    }
    if (is_play)
        playNextAudio();
}

function stopAudio() {
    // audio
    if (audio_element) {
        audio_element.pause();
    }

    // video
    video = document.getElementById("video-ls");
    video.pause();
}

function toogleSimple() {
    setSimple(!global_simple);
}
function toogleAudio() {
    setAudio(!global_audio);
}
function toogleSenhas() {
    setSenhas(!global_senhas);
}
function toogleNarration(narrationLanguage) {
    setNarration(!global_audio, narrationLanguage);
}

$(function () {

    //CONTROLS
    $(document).on("click", "#next-slide", function () {
        goToSlide(global_currentSlide + 1);
    });
    $(document).on("click", "#prev-slide", function () {
        goToSlide(global_currentSlide - 1);
    });


    $(window).bind('mousewheel DOMMouseScroll', function (event) {
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            // scroll up
            if (global_scrolling == false) {
                global_scrolling = true;
                goToSlide(global_currentSlide - 1);
            }
        }
        else {
            // scroll down
            if (!global_scrolling) {
                global_scrolling = true;
                goToSlide(global_currentSlide + 1);
            }
        }
    });


    $(".scroll-up").click(function (e) {
        $(this).siblings('.scrollable').animate({
            scrollTop: '-=200px'
        });
    });

    $(".scroll-down").click(function (e) {
        $(this).siblings('.scrollable').animate({
            scrollTop: '+=200px'
        });
    });

    $('map').imageMapResize();

    // Listener botones seleccion multiple
    $(document).on("click", ".js-ejercicio", function () {
        if (isExclusive($(this))) {
            $(this).closest('.js-ejercicio-parent').find('.js-ejercicio').removeClass('ejercicio-correct').removeClass('ejercicio-incorrect');
        }
        if (isRight($(this))) {
            $(this).addClass('ejercicio-correct');
            var audio = new Audio(audio_assets_dir + 'correcto2.mp3');
            audio.play();
        } else {
            $(this).addClass('ejercicio-incorrect');
            var audio = new Audio(audio_assets_dir + 'incorrecto.mp3');
            audio.play();
        }
    });

    // START UP
    startUp();

    function removeIncorrectClasses(element1, element2) {
        element1.removeClass('ejercicio-incorrect');
        element2.removeClass('ejercicio-incorrect');

    }

    $(document).on("click", "#play-pause", function () {
        if (is_play) {
            $(this).find('.js-play').show();
            $(this).find('.js-pause').hide();
            stopAudio();
        } else {
            $(this).find('.js-play').hide();
            $(this).find('.js-pause').show();
            playNextAudio();
        }
        is_play = !is_play;
    });


    //botones control
    $(document).keydown(function (e) {
        switch (e.which) {
            case 32: // left
                $('#play-pause').click();
                break;

            case 37: // left
                $('#prev-slide').click();
                break;

            case 38: // up
                $('#prev-action').click();
                break;

            case 39: // right
                $('#next-slide').click();
                break;

            case 40: // down
                $('#next-action').click();
                break;

            case 74: // J
            case 106: // j
                $('.read-selected').click();
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


    playNextAudio();
});