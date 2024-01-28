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
    
    // if (0 < i && i < this.h.length) {
    //   actionbar.dataset.i -= 1;
    //   fact.innerHTML = this.h[actionbar.dataset.i].fact;
    // }

    // if (this.h.length == 0) {
    //   contentbar.classList.add("hidden");
    //   noitem.classList.remove("hidden");
    // }

    this.render();
  }
  rstar (i) {
    this.h[i].starred = !this.h[i].starred;
    localStorage.setItem("history", JSON.stringify(this.h));

    this.render();
  }
  render () {
    historylist.innerHTML = "";
   
    // if (0 <= actionbar.dataset.i && actionbar.dataset.i < this.h.length) {
    //   currentfactbtn.classList.remove("hidden");
    //   starcurrentfactspan.classList = `material-symbols-rounded ${this.h[actionbar.dataset.i].starred && "icon-fill"}`;
    // }
    // else if (actionbar.dataset.i != 0 && this.h.length != 0) {
    //   currentfactbtn.classList.add("hidden");
    //   actionbar.dataset.i -= 1;
    //   fact.innerHTML = this.h[actionbar.dataset.i].fact;
    // } else if (actionbar.dataset.i == 0 && this.h.length != 0) {
    //   currentfactbtn.classList.add("hidden");
    //   fact.innerHTML = this.h[actionbar.dataset.i].fact;
    // }

    if (this.h.length > 0) {
      noitem.classList.add("hidden");
      contentbar.classList.remove("hidden");
      currentfactbtn.classList.remove("hidden");
      removecurrentfactbtn.classList.remove("hidden");

      if (actionbar.dataset.i == this.h.length && this.h.length != 0) {
        actionbar.dataset.i -= 1;
        fact.innerText = this.h[actionbar.dataset.i].fact;
      }
      else if (this.h.length != 0) {
        fact.innerText = this.h[actionbar.dataset.i].fact;
      }
      starcurrentfactspan.classList = `material-symbols-rounded ${this.h[actionbar.dataset.i].starred && "icon-fill"}`;
    }
    else if (this.h.length == 0) {
      fact.innerText = "";
      noitem.classList.remove("hidden");
      contentbar.classList.add("hidden");
      currentfactbtn.classList.add("hidden");
      removecurrentfactbtn.classList.add("hidden");
    }


    historycount.innerText = this.h.length != 0 ? `${actionbar.dataset.i - -1}/${this.h.length}` : "";
    if (actionbar.dataset.i == 0) {
      back.disabled = true;
    }
    else {
      back.disabled = false;
    }
    if (actionbar.dataset.i - -1 == this.h.length || this.h.length == 0) {
      forward.disabled = true;
    }
    else {
      forward.disabled = false;
    }

    this.h.map((v, i) => {
      let html = `
        <li data-i=${i} onclick="wayback(${i})" class="${actionbar.dataset.i == i && "chosen-fact"}">
          <span>${v.fact}</span>
          <button onclick="fh.rstar(${i}); event.stopPropagation();"><span class="material-symbols-rounded ${v.starred && "icon-fill"}">star</span></button>
          <button onclick="fh.remove(${i}); event.stopPropagation();"><span class="material-symbols-rounded">delete</span></button>
        </li>
      `;
      
      if ((starredchip.classList.contains("active") && v.starred) || !starredchip.classList.contains("active")) {
        historylist.innerHTML += html;
      }
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
      e.querySelector("span").classList.add("icon-fill");
    } else {
      e.classList.remove("mobile-nav-btn-active");
      e.querySelector("span").classList.remove("icon-fill");
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
  getnewbtn.disabled = true;
  const res = await (await fetch("https://catfact.ninja/fact")).json();
  fact.innerText = res.fact;
  if (!fh.has(res.fact)) {
    actionbar.dataset.i = 0;

    // if (fh.h.length == 0) {
    //   contentbar.classList.remove("hidden");
    //   noitem.classList.add("hidden");
    // }

    fh.add({ fact: res.fact, starred: false });
    fh.render();
  }
  getnewbtn.disabled = false;
}

const wayback = (i) => {
  fact.innerText = fh.h[i].fact;
  actionbar.dataset.i = i;
  fh.render();
}

const filterstarred = () => {
  starredchip.classList.toggle("active");

  fh.render();
}