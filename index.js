class FactHistory {
  constructor () {
    let h = JSON.parse(localStorage.getItem("history"));
    if (!h) {
      this.h = [];
      localStorage.setItem("history", JSON.stringify(this.h));
      h = JSON.parse(localStorage.getItem("history"))
    }
    this.h = h;

    this.render();
  }
  h = [];
  add (e) {
    this.h.splice(0, 0, e);
    localStorage.setItem("history", JSON.stringify(this.h));

    this.render();
  }
  remove (i) {
    this.h.splice(i, 1);
    localStorage.setItem("history", JSON.stringify(this.h));
    
    if (0 < i && i < this.h.length) {
      currentfactbtn.dataset.i -= 1;
      fact.innerHTML = this.h[currentfactbtn.dataset.i].fact;
    }

    if (this.h.length == 0) {
      contentbar.classList.add("hidden");
      noitem.classList.remove("hidden");
    }

    this.render();
  }
  rstar (i) {
    this.h[i].starred = !this.h[i].starred;
    localStorage.setItem("history", JSON.stringify(this.h));

    this.render();
  }
  render () {
    historylist.innerHTML = "";
    
    // if (this.h[currentfactbtn.dataset.i]?.fact != fact.innerText && fact.innerText != "") {
    //   // fact deleted, or added
    //   currentfactbtn.dataset.i -= 1;
    //   fact.innerHTML = this.h[currentfactbtn.dataset.i].fact;
    // }
    
    if (0 <= currentfactbtn.dataset.i && currentfactbtn.dataset.i < this.h.length) {
      currentfactbtn.classList.remove("hidden");
      starcurrentfactspan.classList = `material-symbols-rounded ${this.h[currentfactbtn.dataset.i].starred && "icon-fill"}`;
    }
    else if (currentfactbtn.dataset.i != 0 && this.h.length != 0) {
      currentfactbtn.classList.add("hidden");
      currentfactbtn.dataset.i -= 1;
      fact.innerHTML = this.h[currentfactbtn.dataset.i].fact;
    } else if (currentfactbtn.dataset.i == 0 && this.h.length != 0) {
      currentfactbtn.classList.add("hidden");
      fact.innerHTML = this.h[currentfactbtn.dataset.i].fact;
    }

    this.h.map((v, i) => {
      let html = `
        <li data-i=${i} onclick="wayback(${i})" class="${currentfactbtn.dataset.i == i && "chosen-fact"}">
        <span>${v.fact}</span>
        <button><span class="material-symbols-rounded ${v.starred && "icon-fill"}" onclick="fh.rstar(${i}); event.stopPropagation();">star</span></button>
          <button><span class="material-symbols-rounded" onclick="fh.remove(${i}); event.stopPropagation();">delete</span></button>
          </li>
      `;
      
      historylist.innerHTML += html;
    });
    
  }
  has (v) {
    const a = this.h.filter((_v, i) => _v.fact == v);
    return a.length != 0;
  }
}

const changetab = (to) => {
  const tabarray = ["#about", "main", ".historytab"];
  tabarray.map((e) => {
    if (e != to) {
      document.querySelector(e).classList.add("hidden");
    } 
    else {
      document.querySelector(e).classList.remove("hidden");
    }
  });
  
  document.querySelectorAll(".mobile-nav-btn").forEach((e, i) => {
    if (e.dataset.for == to) {
      e.classList.add("mobile-nav-btn-active");
    } else {
      e.classList.remove("mobile-nav-btn-active");
    }
  });
}

// const res = await ().json();
let fh = new FactHistory();
changetab("main");

window.onload = async () => {
  if (fh.h.length == 0) {
    getnewbtn.classList.add("hidden");
    const res = await (await fetch("https://catfact.ninja/fact")).json();
    fact.innerText = res.fact;
    if (!fh.has(res.fact)) {
      fh.add({ fact: res.fact, starred: false });
    }
    getnewbtn.classList.remove("hidden");
  } else {
    fact.innerText = fh.h[0].fact;
  }
}

const getnew = async () => {
  const res = await (await fetch("https://catfact.ninja/fact")).json();
  fact.innerText = res.fact;
  if (!fh.has(res.fact)) {
    currentfactbtn.dataset.i = 0;

    if (fh.h.length == 0) {
      contentbar.classList.remove("hidden");
      noitem.classList.add("hidden");
    }

    fh.add({ fact: res.fact, starred: false });
  }
}

const wayback = (i) => {
  fact.innerText = fh.h[i].fact;
  currentfactbtn.dataset.i = i;
  fh.render();
}
