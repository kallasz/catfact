// const res = await ().json();

// window.onload = async () => {
//   const res = await (await fetch("https://catfact.ninja/fact")).json();
//   fact.innerText = res.fact;
// }


function addToHistory() {
  
}

class History {
  constructor () {
    let h = localStorage.getItem("history");
    if (!h) {
      localStorage.setItem("history", []);
    }
    h = [];
    this.h = h;
  }
  h = [];
  add (e) {
    this.h.splice(0, 0, e);
    localStorage.setItem("history", h);

    this.render();
  }
  remove (i) {
    this.h.splice(i, 1);
    localStorage.setItem("history", h);

    this.render();
  }
  rstar (i) {
    this.h[i].starred = !this.h[i].starred;

    this.render();
  }
  render () {
    historylist.innerHTML = "";
    this.h.map((v, i) => {
      let e = document.createElement("li");
      e.innerText = v.value;

      let s = document.createElement("button");
      s.innerHTML = "S";
      if (v.starred) {
        s.classList.add("starred");
      }

      let x = document.createElement("button");
      x.innerHTML = "X";


      e.appendChild(s);
      e.appendChild(x);
    });
  }
  has (v) {
    const a = this.h.filter((_v, i) => _v == v);
    return a.length != 0;
  }
}