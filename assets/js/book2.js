
var global_currentSlide = 1; //cuenta en que slide esta
var global_minSlide = 1; // el numero minimo de slide para controlar que no salga de parametros (deberia ser siempre 1)
// var global_maxSlide = 1; // la maxima cantidad de slides para controlar que no salga de parametro
var global_lang = 'spanish'; // determina el lenguaje a utilizar puede ser spanish o guarani
var global_simple = false; // determina si esta en modo texto simple
var global_audio = false; // determina si se esta reproduciendo audio
var global_senhas = true; // determina si se muestra el vide de lenguaje de senias
var global_scrolling = false; // esta scrolleando (?)
var animation_speed = 400;
var global_audio_started = false;
var is_play = false; // determina si esta reproduciendo el audio (ver diferencia entre global_audio)
var stop_recursion = false; // no se usa
var global_audio_guarani = false;


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

var video = undefined;

var text_slides = [4, 10];

var first_iteration = true;
var animation_ongoing = false;

var last_viewed_slide = 9;
var testAudioGuarani = undefined;
var audioAnswer = undefined;

var option_interactions = false;

var interval_function = undefined;
var is_enter = false;

var last_id_mouseOver = undefined;

var activate_autoclick = true;

var global_audo_muted = false;

function playPause(){
    option_interactions = false;
    global_audio_started = true;
    console.log("playPause");
    if (is_play) {
        global_audio = false;
        $("#play-pause").find('.js-play').show();
        $("#play-pause").find('.js-pause').hide();
        $(".select-audio").fadeTo("fast", 0.3);
        $(".repeat-button").fadeTo("fast", 0.3);
        stopAudio();
    } else {
        global_audio = true;
        $("#play-pause").find('.js-play').hide();
        $("#play-pause").find('.js-pause').show();
        $(".select-audio").fadeTo("fast", 1);
        $(".repeat-button").fadeTo("fast", 1);
        playNextAudio();
    }
    is_play = !is_play;
}

function activateModal(id_modal, word_modal, image_modal, description_modal) {
    if (id_modal == 1) {
        title_modal = "DESCRIPCIÓN DE LA IMAGEN"
    } else {
        title_modal = "GLOSARIO"
    }


    if (image_modal && image_modal != '') {
        var image = document.getElementById("div_image");
        image.setAttribute("class", "d-block");
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

function repeatCurrentSlide(){
    if(global_audio || slides_dictionary[global_currentSlide].is_multiple_select){
        goToSlide(global_currentSlide);
    }
}

function goToSlide(slideNo) {
    console.log("------->gotoslide", slideNo);
    if(animation_ongoing) return;
    let slide_to_go = slides_dictionary[slideNo];
    if (slideNo >= global_minSlide && slideNo <= (slides_dictionary.length - 1)) {
        if(slide_to_go.slide_title){
            $("#slide-title").text(slide_to_go.slide_title);
        }else{
            $("#slide-title").text("");
        }
        if(slide_to_go.guarani_btn){
            $("#btn_guarani").show();
        }else{
            $("#btn_guarani").hide();
        }
        if(slide_to_go.simple_btn){
            $("#btn_simple").show();
        }else{
            $("#btn_simple").hide();
        }
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
        if(last_viewed_slide<slideNo) last_viewed_slide=slideNo;

        if(slide_to_go.is_multiple_select){
            $("#" + slide_to_go.slide_name).find('.multiple_answer').each(function () {
                    $(this).hide();
            })
             $("#" + slide_to_go.slide_name).find('.hiden-option').each(function () {
                    $(this).hide();
            })
            $("#" + slide_to_go.slide_name).find('.shown-option').each(function () {
                $(this).show();
        })
        }

        animation_ongoing = true;
        // console.log("----->scroll animation 1", window.innerHeight);
        $('html, body').stop().animate({ scrollTop: $("#" + slide_to_go.slide_name).offset().top - contentOffset }, animation_speed, 'swing', function () {

        // $('html, body').stop().animate({ scrollTop: (window.innerHeight * (slideNo-1)) - contentOffset }, animation_speed, 'swing', function () { 
            console.log("----->scroll animation 2");
            animation_ongoing = false;
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
    
    $(".multiple_answer").each(function () {
        console.log("hide answers");
        $(this).hide();
    });

    console.log("startup");
    contentOffset = 5;

    setAutoclick(true);
    setSimple(global_simple);
    setAudio(global_audio);
    setSenhas(global_senhas);
    setLang(global_lang);
    // $('#var-last_slide_number').html(global_maxSlide);
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
    console.log("adio val", setVal);
    if (setVal) {
        if (!is_play) {
            $('#play-pause').click();
        }
        // $(".select-audio").fadeTo("fast", 1);
        // global_audio = true;
    } else {
        // $(".select-audio").fadeTo("fast", 0.3);
        // global_audio = false;
        if(!first_iteration){
            $('#play-pause').click();
        }else{
            first_iteration = false;
            $(".select-audio").fadeTo("fast", 0.3);
            $(".repeat-button").fadeTo("fast", 0.3);
        }
        
    }
    // goToSlide(global_currentSlide);
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

            // setAudio(false); // se desactiva el audio si se activa el lenguaje de senias
        } else {
            $(".select-senhas").fadeTo("fast", 0.3);
            global_senhas = false;
            $("#video-column").fadeOut();
        }
    }
    // goToSlide(global_currentSlide);
}
function setLang(lang) {
    switch (lang) {
        case 'guarani':
            setSenhas(false);
            global_lang = 'guarani';
            $("#select-guarani").fadeTo("fast", 1);
            $("#select-spanish").fadeTo("fast", 0.3);
            $(".js-lang-controlled").each(function () {
                if ($(this).hasClass('lang-spanish')) {
                    $(this).hide();
                } else if ($(this).hasClass('lang-guarani')) {
                    $(this).show();
                } else {
                    $(this).text($(this).data('lang-guarani'));
                }
            });
            break;
        case 'spanish':
            global_lang = 'spanish';
            $("#select-guarani").fadeTo("fast", 0.3);
            $("#select-spanish").fadeTo("fast", 1);
            $(".js-lang-controlled").each(function () {
                if ($(this).hasClass('lang-spanish')) {
                    $(this).show();
                } else if ($(this).hasClass('lang-guarani')) {
                    $(this).hide();
                } else {
                    $(this).text($(this).data('lang-spanish'));
                }
            });
            break;
    }
    //alert('lang set = ' + global_lang);
}

function toggleGuaraniAudio(){
    global_audio_guarani = !global_audio_guarani;
    if(global_audio_guarani){
        $(".guarani-audio").fadeTo("fast", 1);
    }else{
        $(".guarani-audio").fadeTo("fast", 0.3);
    }
}

function toggleGuaraniAudioTest(){
    if (audio_element) {
        audio_element.pause();
        audio_element = false;
        if(video) video.pause();
    }
    toggleGuaraniAudio();
    if(global_audio_guarani){
        if(testAudioGuarani) testAudioGuarani.pause();
        testAudioGuarani = new Audio("assets/audio/config/boton_Nee_narracion.m4a");
        testAudioGuarani.play();
    }else{
        if(testAudioGuarani) testAudioGuarani.pause();
        testAudioGuarani = new Audio("assets/audio/config/boton_Nee_narracion_es.m4a.m4a");
        testAudioGuarani.play();
    }
        
}

//interaciones de botones de ejercicios
function optionPress(value, indicator_id){
    clearTimeout(interval_function);
    is_enter = false;
    if (audio_element && !audio_element.paused) {
        $('#play-pause').click();
    }
    $("#" + indicator_id).addClass("btn_selected");
    setTimeout(() => {
        $("#" + indicator_id).removeClass("btn_selected");
    }, 3000); 
    option_interactions = true;
    switch (value) {
        case 1: // correct
            $(".repeat-button").fadeTo("fast", 1);
            $("#" + indicator_id).find('.multiple_answer').show();
            
            if(audioAnswer) audioAnswer.pause();
            audioAnswer = new Audio("assets/audio/audioprueba/r_correcta.m4a");
            
            if(!global_audo_muted) audioAnswer.play();
            if(global_senhas){
                console.log("entro a mostrar video de respuesta");
                video = document.getElementById("video-ls");

                let videoUrl = $("#" + indicator_id).data('video-file');

                if (videoUrl && UrlExists(videoUrl)) {
                    $(video).find('source').attr('src', videoUrl);
                    video.load();
                    video.play();
                }
            }
            
            break;
        default:
            if(audioAnswer) audioAnswer.pause();
            audioAnswer = new Audio("assets/audio/audioprueba/r_incorrecta.m4a");
            if(!global_audo_muted) audioAnswer.play();

            if(global_senhas){
                console.log("entro a mostrar video de respuesta");
                video.pause();
                video = document.getElementById("video-ls");

                let videoUrl = $("#" + indicator_id).data('video-file');

                if (videoUrl && UrlExists(videoUrl)) {
                    $(video).find('source').attr('src', videoUrl);
                    video.load();
                    video.play();
                }
            }

            break;
    }
}

//interaciones de botones de ejercicios mostrar y esconder texto
function optionPressShow(value, indicator_id, show_option_by_id){
    clearTimeout(interval_function);
    is_enter = false;
    if (audio_element && !audio_element.paused) {
        $('#play-pause').click();
    }
    $("#" + indicator_id).addClass("btn_selected");
    setTimeout(() => {
        $("#" + indicator_id).removeClass("btn_selected");
    }, 3000); 
    option_interactions = true;
    switch (value) {
        case 1: // correct
            $(".repeat-button").fadeTo("fast", 1);
            $("#" + indicator_id).find('.multiple_answer').show();
            
            if(show_option_by_id){
                $("#" + show_option_by_id).find('.hiden-option').show();
                $("#" + show_option_by_id).find('.shown-option').hide();
            }else{
                $("#" + indicator_id).find('.hiden-option').show();
                $("#" + indicator_id).find('.shown-option').hide();
            }
            
            
            if(audioAnswer) audioAnswer.pause();
            audioAnswer = new Audio("assets/audio/audioprueba/r_correcta.m4a");
            
            if(!global_audo_muted) audioAnswer.play();
            if(global_senhas){
                console.log("entro a mostrar video de respuesta");
                video = document.getElementById("video-ls");

                let videoUrl = $("#" + indicator_id).data('video-file');

                if (videoUrl && UrlExists(videoUrl)) {
                    $(video).find('source').attr('src', videoUrl);
                    video.load();
                    video.play();
                }
            }
            
            break;
        default:
            if(audioAnswer) audioAnswer.pause();
            audioAnswer = new Audio("assets/audio/audioprueba/r_incorrecta.m4a");
            if(!global_audo_muted) audioAnswer.play();

            if(global_senhas){
                console.log("entro a mostrar video de respuesta");
                video.pause();
                video = document.getElementById("video-ls");

                let videoUrl = $("#" + indicator_id).data('video-file');

                if (videoUrl && UrlExists(videoUrl)) {
                    $(video).find('source').attr('src', videoUrl);
                    video.load();
                    video.play();
                }
            }

            break;
    }
}

function onEnterAnswer(value, indicator_id){
    return;
    is_enter = true;
    interval_function = setTimeout(() => {
        if(is_enter){
            is_enter = false;
            optionPress(value, indicator_id);
        }
    }, 2000); 
}

function onMouseLeave(){
    return;
    clearTimeout(interval_function);
    is_enter = false;
}


//interacciones de botones emociones
function onclickButtonAudio(indicator_id){
    clearTimeout(interval_function);
    is_enter = false;
    if (audio_element && !audio_element.paused) {
        $('#play-pause').click();
    }
    $("#" + indicator_id).addClass("btn_selected");
    setTimeout(() => {
        $("#" + indicator_id).removeClass("btn_selected");
    }, 3000); 
    option_interactions = true;

    $(".repeat-button").fadeTo("fast", 1);
    $("#" + indicator_id).find('.multiple_answer').show();
    
    if(audioAnswer) audioAnswer.pause();
    let audioUrl = $("#" + indicator_id).data('audio-file');
    audioAnswer = new Audio(audioUrl);
    
    if(!global_audo_muted) audioAnswer.play();
    if(global_senhas){
        console.log("entro a mostrar video de respuesta");
        video = document.getElementById("video-ls");

        let videoUrl = $("#" + indicator_id).data('video-file');

        if (videoUrl && UrlExists(videoUrl)) {
            $(video).find('source').attr('src', videoUrl);
            video.load();
            video.play();
        }
    }
}

function onEnterButtonAudio(indicator_id){
    return;
    is_enter = true;
    interval_function = setTimeout(() => {
        if(is_enter){
            is_enter = false;
            onclickButtonAudio(indicator_id);
        }
    }, 2000); 
}

function onMouseLeaveButtonAudio(){
    return;
    clearTimeout(interval_function);
    is_enter = false;
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
    if(testAudioGuarani) testAudioGuarani.pause();
    console.log("playNextAudio");
    video = document.getElementById("video-ls");
    if (audio_queue[0] === 'end') {
        if (audio_element) {
            console.log("play1");
;            console.log("audio_element", audio_element);
            if(!global_audo_muted) audio_element.play();
            video.play();
        }
        // console.log('------>audio ended');
        return;
    } //end condition

    if (audio_element) {
        console.log("play2");
        console.log("audio_element", audio_element);
        if(!global_audo_muted) audio_element.play();
        video.play();
    } else {
        // console.log("------> nuevo audio");
        if (audio_queue.length == 0) return;

        var audioUrl;

        var audio;
        let item = audio_queue.shift();
        console.log("item.data(audio-file-guarani)", item.data('audio-file-guarani'));
        if(global_audio_guarani && item.data('audio-file-guarani')){
            audioUrl = item.data('audio-file-guarani');
        }else{
            audioUrl = item.data('audio-file');
        }
        

        // var videoUrl = video_assets_dir + 'slide-' + global_currentSlide + '/' + 'video-' + global_currentAudio + video_extension;
        var videoUrl = item.data('video-file');

        if (videoUrl && UrlExists(videoUrl)) {
            if ((text_slides.includes(global_currentSlide)) && global_currentAudio > 1) {
                // console.log("if((text_slides.includes(global_currentSlide) ) && global_currentAudio > 1  )");
            } else {
                console.log("play3");
                // console.log("else ------->if((text_slides.includes(global_currentSlide) ) && global_currentAudio > 1  )");
                $(video).find('source').attr('src', videoUrl);
                video.load();
                video.play();
            }
        }

        audio = new Audio(audioUrl);
        var localcurrentaudio = global_currentAudio;
        audio.onerror = function () {
            console.log("audio on error");
            audio_element.pause();
            var audio = new Audio(audio_assets_dir + slides_dictionary[global_currentSlide] + '/' + 'audio-' + localcurrentaudio + audio_extension);
            console.log("play4");
            if(!global_audo_muted) audio.play();
            audio_element = audio;
        };
        console.log("play5");
        if(!global_audo_muted) audio.play();
        audio_element = audio;

        // var currentSlide = getCurrentSlide();

        item.addClass('read-selected');

        audio_queue.push(item);
        global_currentAudio++;
        video.onended = function () {
            if (audio_element.paused) {
                item.removeClass('read-selected');
                audio_element = false;
                console.log("playNextAudio video ended");
                if(!option_interactions) playNextAudio();
            }
        };
        audio_element.onended = function () {
            var video = document.getElementById("video-ls");
            if (video.currentTime == 0 || video.paused || !global_senhas || text_slides.includes(global_currentSlide)) {
                item.removeClass('read-selected');
                audio_element = false;
                console.log("playNextAudio audio ended");
                if(!option_interactions) playNextAudio();
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
        console.log("playNextAudio play prev audio");
        playNextAudio();
}

function skipAudio() {
    if (audio_element) {
        audio_element.pause();
        audio_element = false;
        var itemAux = audio_queue[audio_queue.length - 1];
        if (itemAux != 'end') {
            itemAux.removeClass('read-selected');
        }else{
            // console.log("------->skip to end");
        }
    }
    if (is_play)
    console.log("------------------->playNextAudio skip audio");
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

function muteAudio(){
    global_audo_muted = true;
    if (audio_element) {
        audio_element.pause();
    }
}

function unMuteAudio(){
    global_audo_muted = false;
}

function toggleMute(){
    if(global_audo_muted){
        unMuteAudio();
        $("#btn_audio").fadeTo("fast", 1);
    }else{
        muteAudio();
        $("#btn_audio").fadeTo("fast", 0.3);
    }
}

function toggleSimple() {
    setSimple(!global_simple);
}
function toggleAudio() {
    setAudio(!global_audio);
}
function toggleSenhas() {
    // console.log("---------------> togglesenias");
    setSenhas(!global_senhas);
}

function toggleAutoclick() {
    setAutoclick(!activate_autoclick);
}

function setAutoclick(setVal) {
    activate_autoclick = setVal
    if (setVal) {
        $(".select-autoclick").fadeTo("fast", 1);

    } else {
        $(".select-autoclick").fadeTo("fast", 0.3);
    }
}

function goNext(){
    console.log("gonext")
    // console.log("global_audio_started", global_audio_started)
    // console.log("audio_element", audio_element)
    // console.log("--------> gonext video.paused", video.paused);
    if(!global_audio_started || (audio_element.paused && video.paused) || audio_element.paused == undefined){
        // console.log("gonext1");
        goToSlide(global_currentSlide + 1);
    }else{
        // console.log("gonext2");
        skipAudio();
    }
}

function goBack(){
    // if(audio_queue[audio_queue.length-2]=="end"){
    //     console.log("--------->is first element");
    // }else{
    //     console.log("--------->", audio_queue)
    // }
    if(!global_audio_started || (audio_element.paused && video.paused) || audio_element.paused == undefined || audio_queue[audio_queue.length-2]=="end"){
        goToSlide(global_currentSlide - 1);
    }else{
        playPreviousAudio();
    }
}

function startTutorial(){
    // console.log("--------------------> start tutorial");
    
    goToSlide(2);
    $('#toggleSenhas').click();
}

function movementButton(){
    if(global_currentSlide<9){
        goToSlide(last_viewed_slide);
    }else{
        goToSlide(2);
    }
    
}

// function scrollToCustom(targetID, offset, callback) {

//     var element = document.getElementById(targetID);
//     var headerOffset = offset;
//     var elementPosition = element.getBoundingClientRect().top;
//     var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
//     window.scrollTo({
//          top: offsetPosition,
//          behavior: "smooth"
//     });

//     const fixedOffset = offset.toFixed();
//     const onScroll = function () {
//             if (window.pageYOffset.toFixed() === fixedOffset) {
//                 window.removeEventListener('scroll', onScroll)
//                 callback()
//             }
//         }

//     window.addEventListener('scroll', onScroll)
//     onScroll()
//     window.scrollTo({
//         top: offset,
//         behavior: 'smooth'
//     })
// }

$(function () {


    //CONTROLS
    // $(document).on("click", "#next-slide", function () {
    //     goNext();  
    // });
    // $(document).on("click", "#prev-slide", function () {
    //     goBack();
    // });

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

    // START UP
    startUp();


    


    //botones control
    $(document).keydown(function (e) {
        console.log("keydown", e.which);
        switch (e.which) {
            case 32: // left
                playPause();
                break;
            case 37: // left
                goBack();
                break;
            case 39: // right
                goNext();
                break;
            case 65: // a
                toggleAudio();
                break;
            // case 71: // g
            // console.log("global_currentSlide", global_currentSlide)
            //     if(global_currentSlide == 3){
            //         toggleGuaraniAudioTest();
            //     }else{
            //         toggleGuaraniAudio();
            //     }
            //     break;
            case 68: // d
                toggleSenhas();
                break;
            case 70: // f
                toggleSimple();
                break;
            case 82: // r
                repeatCurrentSlide();
                break;
            case 49: // 1       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[0]).click();
                }
                break;
            case 50: // 2       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[1]).click();
                }
                break;
            case 51: // 3       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[2]).click();
                }
                break;
            case 52: // 4       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[3]).click();
                }
                break;
            case 53: // 5       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[4]).click();
                }
                break;
            case 54: // 6       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[5]).click();
                }
                break;
            case 55: // 7       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[6]).click();
                }
                break;
            case 56: // 8       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[7]).click();
                }
                break;
            case 57: // 9       
                if (slides_dictionary[global_currentSlide].is_multiple_select){
                    $('#'+slides_dictionary[global_currentSlide].options[8]).click();
                }
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


    $(":button").each(function () {
        $(this).mouseover(() => {
            if(!activate_autoclick) return;
            if(last_id_mouseOver == $(this).attr('id')) return;
            last_id_mouseOver = $(this).attr('id');
            console.log("onenter");
            if(!is_enter){
                is_enter = true;
                interval_function = setTimeout(() => {
                    if(is_enter){
                        is_enter = false;
                        $(this).click();
                    }
                }, 2500);
            }
        })
        
        $(this).mouseleave(function(){
            last_id_mouseOver = "";
            console.log("onexit");
            is_enter = false;
            clearTimeout(interval_function);
        })
    })

    console.log("playNextAudio final function");
    playNextAudio();
});