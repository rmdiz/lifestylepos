
document.addEventListener('DOMContentLoaded', () => {
	// SIDE MENU/NAVIGATION
	const menuToggle = document.querySelector('.menu-toggle');
        menuToggle.addEventListener('click', () => {
        if(menuToggle.textContent == 'menu'){
            document.querySelector('main').classList.remove('cover');
            document.querySelector('.logo img').setAttribute('src', './images/logo.png');
            document.querySelector('.logo img').classList.remove('box');
            document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => navTitle.style.marginLeft = "8%");
            document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "0");
            document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '22px')
            menuToggle.textContent = 'close';
            document.querySelector('.search-field').classList.add('hide');
        }else{
            document.querySelector('main').classList.add('cover');
            document.querySelector('.logo img').setAttribute('src', './images/box-logo.png');
            document.querySelector('.logo img').classList.add('box');
            document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => {navTitle.style.marginLeft = "1%"});
            document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "12%");
            document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '25px')
            menuToggle.textContent = 'menu';
            document.querySelector('.search-field').classList.add('hide');
        }
    });
    const closeSideMenu = document.getElementById('close-side-bar');
    closeSideMenu.addEventListener('click', () => {
        document.querySelector('main').classList.add('cover');
        document.querySelector('.logo img').setAttribute('src', './images/box-logo.png');
        document.querySelector('.logo img').classList.add('box');
        document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => {navTitle.style.marginLeft = "1%"});
        document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "12%");
        document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '25px')
        menuToggle.textContent = 'menu';
        document.querySelector('.search-field').classList.add('hide');
    });

    const sideNavLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    sideNavLinks.forEach(navLink => {
    	navLink.addEventListener('click', (e) =>  {
    		e.preventDefault();

    		sideNavLinks.forEach(navLink => navLink.classList.remove('active'));
    		navLink.classList.add('active');

    		let nxtPage = document.getElementById(navLink.dataset.page);
    		// let prvPage = document.querySelector('.page .active');
    		pages.forEach(page => page.classList.remove('active'));

    		// prvPage.classList.remove('active');
    		nxtPage.classList.add('active');
    		if(Number(document.querySelector('aside').clientWidth) > 300){

	    		document.querySelector('main').classList.add('cover');
		        document.querySelector('.logo img').setAttribute('src', './images/box-logo.png');
		        document.querySelector('.logo img').classList.add('box');
		        document.querySelectorAll('aside .side-menu label.sidebar-title').forEach(navTitle => {navTitle.style.marginLeft = "1%"});
		        document.querySelectorAll('aside .side-menu a h3').forEach(linkTitle => linkTitle.style.marginLeft = "12%");
		        document.querySelectorAll('aside .side-menu a span').forEach(linkIcon => linkIcon.style.fontSize = '25px')
		        menuToggle.textContent = 'menu';
		        document.querySelector('.search-field').classList.add('hide');
    		}
    	})
    })
    // TOP NAVIGATION SEARCH
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        document.querySelector('.search-field').classList.toggle('hide');
    });
    // TOP NAVIGATION THEME
    const themeBtn = document.querySelector('.top-nav label.theme');
    const themeMenu = document.querySelector('.theme-menu');
    const themeClosetn = document.querySelector('.theme-menu__close');
    themeBtn.addEventListener('click', () => {
        themeMenu.classList.toggle('active');
    });
    themeClosetn.addEventListener('click', () => {
        themeMenu.classList.toggle('active');
    });

    const themeCs = document.querySelectorAll('.mode-list__color');
    themeCs.forEach(themeC => {
        themeC.addEventListener('click', () => {
            themeCs.forEach(themeCl => themeCl.childNodes[1].classList.remove('active'));
            themeC.childNodes[1].classList.add('active');
        })
    });


    // FILTRATION
    const filtrationBox = document.querySelectorAll('.title-modifications');
    const filtrationBtn = document.querySelectorAll('.section-title span.table-filter');
    filtrationBtn.forEach(btn => btn.addEventListener('click', () => {
    	filtrationBox.forEach(ftBx => ftBx.classList.toggle('hide'));
    	console.log(filtrationBox, filtrationBtn)
    }))
});