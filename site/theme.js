(() => {
  const read = () => { try { return localStorage.getItem('goose-theme'); } catch { return null; } };
  const media = matchMedia('(prefers-color-scheme: dark)');
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      button.title = button.getAttribute('aria-label');
    });
  }
  const preferred = read();
  apply(['light','dark'].includes(preferred) ? preferred : media.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(theme); try { localStorage.setItem('goose-theme', theme); } catch {}
    }));
    const contents = document.querySelector('[data-guide-contents]');
    if (contents) {
      const viewport=matchMedia('(max-width: 760px)');
      const choices={};
      const mode=()=>viewport.matches?'mobile':'desktop';
      const applyContents=()=>{contents.open=choices[mode()] ?? !viewport.matches;};
      contents.querySelector('summary').addEventListener('click',()=>{choices[mode()]=!contents.open;});
      viewport.addEventListener('change',applyContents);
      document.querySelectorAll('[data-contents-open]').forEach(control=>control.addEventListener('click',()=>{
        choices[mode()]=true; contents.open=true;
        requestAnimationFrame(()=>contents.querySelector('summary').focus());
      }));
      applyContents();
    }
    const outline=[...document.querySelectorAll('.guide-toc details a[href^="#"]')].map(link=>({link,heading:document.getElementById(decodeURIComponent(link.hash.slice(1)))})).filter(item=>item.heading);
    if(outline.length) {
      let scheduled=false;
      const updateLocation=()=>{
        scheduled=false;
        const offset=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||64;
        let current=null;
        for(const item of outline) { if(item.heading.getBoundingClientRect().top<=offset+16) current=item; else break; }
        if(scrollY+innerHeight>=document.documentElement.scrollHeight-4) current=outline.at(-1);
        for(const item of outline) { if(item===current) item.link.setAttribute('aria-current','location'); else item.link.removeAttribute('aria-current'); }
      };
      const schedule=()=>{if(document.hidden) updateLocation(); else if(!scheduled) {scheduled=true;requestAnimationFrame(updateLocation);}};
      addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule); addEventListener('hashchange',updateLocation); addEventListener('load',updateLocation);
      updateLocation();
    }
    try { const query=sessionStorage.getItem('goose-directory-query'); if(query) document.querySelectorAll('[data-directory-return]').forEach(back=>{back.href='./'+query;}); } catch {}
  });
  media.addEventListener('change', () => { if (!read()) apply(media.matches ? 'dark' : 'light'); });
  window.addEventListener('storage', event => { if (event.key === 'goose-theme') apply(['light','dark'].includes(event.newValue) ? event.newValue : media.matches ? 'dark' : 'light'); });
})();
