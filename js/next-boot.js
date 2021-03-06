/* global NexT, CONFIG, Velocity */

NexT.boot = {};

NexT.boot.registerEvents = function() {

  NexT.utils.registerScrollPercent();
  NexT.utils.registerCanIUseTag();

  // Mobile top menu bar.
  document.querySelector('.site-nav-toggle .toggle').addEventListener('click', () => {
    event.currentTarget.classList.toggle('toggle-close');
    var siteNav = document.querySelector('.site-nav');
    var animateAction = siteNav.classList.contains('site-nav-on') ? 'slideUp' : 'slideDown';

    if (typeof Velocity === 'function') {
      Velocity(siteNav, animateAction, {
        duration: 200,
        complete: function() {
          siteNav.classList.toggle('site-nav-on');
        }
      });
    } else {
      siteNav.classList.toggle('site-nav-on');
    }
  });

  var TAB_ANIMATE_DURATION = 200;
  document.querySelectorAll('.sidebar-nav li').forEach((element, index) => {
    element.addEventListener('click', event => {
      var item = event.currentTarget;
      var activeTabClassName = 'sidebar-nav-active';
      var activePanelClassName = 'sidebar-panel-active';
      if (item.classList.contains(activeTabClassName)) return;

      var targets = document.querySelectorAll('.sidebar-panel');
      var target = targets[index];
      var currentTarget = targets[1 - index];
      // if(currentTarget.className.includes("site-overview-wrap"))  {
        window.anime({
          targets : currentTarget,
          duration: TAB_ANIMATE_DURATION,
          easing  : 'linear',
          opacity : 0,
          complete: () => {
            // Prevent adding TOC to Overview if Overview was selected when close & open sidebar.
            currentTarget.classList.remove(activePanelClassName);
            target.style.opacity = 0;
            target.classList.add(activePanelClassName);
            window.anime({
              targets : target,
              duration: TAB_ANIMATE_DURATION,
              easing  : 'linear',
              opacity : 1
            });
          }
        });
      // }

      [...item.parentNode.children].forEach(element => {
        element.classList.remove(activeTabClassName);
      });
      item.classList.add(activeTabClassName);
    });
  });

  window.addEventListener('resize', NexT.utils.initSidebarDimension);

  window.addEventListener('hashchange', () => {
    var tHash = location.hash;
    if (tHash !== '' && !tHash.match(/%\S{2}/)) {
      var target = document.querySelector(`.tabs ul.nav-tabs li a[href="${tHash}"]`);
      target && target.click();
    }
  });

  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

  // MARK: icon-wall, when hover on icon
  const iconWallIcons = document.querySelectorAll('.icon-wall-icon');
  const avatarImgSrc = getLocation(document.querySelector(".site-author-image").src).pathname;
  const authorName = document.querySelector(".site-author-name").innerHTML;
  const selfIntro = document.querySelector(".site-description").innerHTML;
  for (const iconWallIcon of iconWallIcons) {
    iconWallIcon.addEventListener('mouseover', function(event) {
      document.querySelector(".site-author-image").src = getLocation(iconWallIcon.src).pathname;
      document.querySelector(".site-author-name").innerHTML = iconWallIcon.getAttribute('name') ? iconWallIcon.getAttribute('name') : '';
      document.querySelector(".site-description").innerHTML = iconWallIcon.getAttribute('desc') ? iconWallIcon.getAttribute('desc') : '';
    });
  }
  document.querySelector(".icon-wall").addEventListener('mouseout', function(e) {
    var e = event.toElement || event.relatedTarget;
    if (e.parentNode != this && e != this) {
      document.querySelector(".site-author-image").src = avatarImgSrc;
      document.querySelector(".site-author-name").innerHTML = authorName;
      document.querySelector(".site-description").innerHTML = selfIntro;
    }
  });
  // END

  // MARK: 在首页只展示每个post的思维导图（如果存在），作为excerpt
  if(document.querySelector(".c_index_page")) {
    const articles = document.querySelectorAll('.post-block');
    for(const article of articles)  {
      const bd = article.querySelector(".post-body");
      if(bd.children && bd.children.length > 0 && bd.children[0].tagName.toLowerCase() == 'blockquote') {
        var toDelIdx = 1;
        while(toDelIdx < bd.children.length)  {
          if(bd.children[toDelIdx].tagName.toLowerCase() == 'script' || bd.children[toDelIdx].tagName.toLowerCase() == 'link')  {
            toDelIdx += 1;
          } else{
            bd.removeChild(bd.children[toDelIdx]);
          }
        }
      }
      console.log(bd);
    }
  }
  // END
};

NexT.boot.refresh = function() {

  /**
   * Register JS handlers by condition option.
   * Need to add config option in Front-End at 'layout/_partials/head.swig' file.
   */
  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  CONFIG.mediumzoom && window.mediumZoom('.post-body :not(a) > img, .post-body > img');
  CONFIG.lazyload && window.lozad('.post-body img').observe();
  CONFIG.pangu && window.pangu.spacingPage();

  CONFIG.exturl && NexT.utils.registerExtURL();
  CONFIG.copycode.enable && NexT.utils.registerCopyCode();
  NexT.utils.registerTabsTag();
  NexT.utils.registerActiveMenuItem();
  NexT.utils.registerSidebarTOC();
  NexT.utils.wrapTableWithBox();
  NexT.utils.registerVideoIframe();
};

NexT.boot.motion = function() {
  // Define Motion Sequence & Bootstrap Motion.
  if (CONFIG.motion.enable) {
    NexT.motion.integrator
      .add(NexT.motion.middleWares.logo)
      .add(NexT.motion.middleWares.menu)
      .add(NexT.motion.middleWares.postList)
      .add(NexT.motion.middleWares.sidebar)
      .bootstrap();
  }
  NexT.utils.updateSidebarPosition();
};

window.addEventListener('DOMContentLoaded', () => {
  NexT.boot.registerEvents();
  NexT.boot.refresh();
  NexT.boot.motion();
});
