document.addEventListener('DOMContentLoaded', function() {
    // Carrossel Básico
    const basicSwiper = new Swiper('.basic-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
    });

    // Carrossel com Navegação e Paginação
    const navigationSwiper = new Swiper('.navigation-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.navigation-swiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.navigation-swiper .swiper-button-next',
            prevEl: '.navigation-swiper .swiper-button-prev',
        },
    });

    // Carrossel com Cards
    const cardSwiper = new Swiper('.card-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        pagination: {
            el: '.card-swiper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            // quando a largura da tela for >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            // quando a largura da tela for >= 480px
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // quando a largura da tela for >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });

    // Carrossel com Efeito Coverflow
    const coverflowSwiper = new Swiper('.coverflow-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.coverflow-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // Carrossel Vertical
    const verticalSwiper = new Swiper('.vertical-swiper', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        mousewheel: true,
        pagination: {
            el: '.vertical-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // Carrossel com Efeito Cubo
    const cubeSwiper = new Swiper('.cube-swiper', {
        effect: 'cube',
        grabCursor: true,
        cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
        },
        pagination: {
            el: '.cube-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // Carrossel com Autoplay
    const autoplaySwiper = new Swiper('.autoplay-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.autoplay-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // Galeria com Miniaturas
    const thumbsGallery = new Swiper('.thumbs-gallery', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });
    
    const mainGallery = new Swiper('.main-gallery', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: thumbsGallery,
        },
    });
});
