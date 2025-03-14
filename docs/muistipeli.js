// 1️⃣ Luodaan lista hedelmistä (8 erilaista, kahdesti)
let korttiSisallot = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥭", "🍍",
    "🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥭", "🍍"];

// 2️⃣ Fisher-Yates-algoritmi korttien sekoittamiseen
function sekoitaKortit() {
    for (let i = korttiSisallot.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [korttiSisallot[i], korttiSisallot[j]] = [korttiSisallot[j], korttiSisallot[i]];
    }
}

// 3️⃣ Alustetaan peli
const kortit = document.querySelectorAll(".kortti");
const virhevalot = document.querySelectorAll(".virhevalo");

// 🎵 Äänitiedostot
const oikeinAudio = document.getElementById("oikeinAudio");
const vaarinAudio = document.getElementById("vaarinAudio");

let valitutKortit = []; // Lista käännetyille korteille
let yritykset = 0;
let virheet = 0;

// ✅ Aseta sekoitetut hedelmät kortteihin
function asetaKortit() {
    sekoitaKortit();
    kortit.forEach((kortti, index) => {
        kortti.querySelector(".etu").textContent = korttiSisallot[index];
        kortti.classList.remove("kaannetty"); // Käännetään kaikki kortit takaisin
        kortti.style.backgroundColor = ""; // Nollataan vihreät parikortit
    });

    valitutKortit = [];
    yritykset = 0;
    virheet = 0;
    document.getElementById("laskuri").textContent = yritykset;
    virhevalot.forEach(valo => valo.classList.remove("virhe"));
}

// ✅ Alustetaan peli
asetaKortit();

// 🔄 Korttien klikkaaminen
kortit.forEach(kortti => {
    kortti.addEventListener("click", () => {
        if (valitutKortit.length < 2 && !valitutKortit.includes(kortti)) {
            valitutKortit.push(kortti);
            kortti.classList.add("kaannetty");
        }
        
        // 🔢 Kasvatetaan yritysten määrää vain, kun kaksi korttia on käännetty
        if (valitutKortit.length === 2) {
            let ekaKortti = valitutKortit[0].querySelector(".etu").textContent;
            let tokaKortti = valitutKortit[1].querySelector(".etu").textContent;
        
            yritykset++;
            document.getElementById("laskuri").textContent = yritykset;
        
            if (ekaKortti === tokaKortti) {
                console.log("Kortit ovat pari! 🎉");

                valitutKortit[0].style.backgroundColor = "green";
                valitutKortit[1].style.backgroundColor = "green";

                // 🎵 Soita "oikein" ääni
                oikeinAudio.play();

                
                // ✅ Poistetaan 1 virhevalo, mutta ei alle nollan
if (virheet > 0) {
    virheet--;

    // 🔴 Sammutetaan viimeisin virhevalo
    let viimeinenValo = [...virhevalot].reverse().find(valo => valo.classList.contains("virhe"));
    if (viimeinenValo) {
        viimeinenValo.classList.remove("virhe");
    }
}


                setTimeout(() => {
                    let kaikkiLoydetyt = document.querySelectorAll(".kortti[style*='green']").length;
                    if (kaikkiLoydetyt === kortit.length) {
                        alert(`Voitit pelin! Yrityksiä: ${yritykset}`);
                    }
                }, 500);  
                
                setTimeout(() => {
                    valitutKortit = [];
                }, 500);
            } else {
                // ❌ Kortit eivät olleet pari – käännetään takaisin ja lisätään virhe
                virheet++;

                // 🎵 Soita "väärin" ääni
                vaarinAudio.play();

                // 🔴 Sytytetään virhevalo
                if (virheet <= 8) {
                    virhevalot[virheet - 1].classList.add("virhe");
                }

                // 🔴 Jos virheitä on 8, peli päättyy
                if (virheet === 8) {
                    setTimeout(() => {
                        alert("Peli päättyi! Teit liian monta virhettä.");
                        asetaKortit(); // Kutsutaan pelin resetointia
                    }, 500);
                }

                setTimeout(() => { 
                    valitutKortit[0].classList.remove("kaannetty");
                    valitutKortit[1].classList.remove("kaannetty");

                    console.log("Ei ollut pari, käännetään takaisin ❌");

                    valitutKortit = [];
                }, 1000);
            }
        }
    });
});

// 🔄 Resetointi-painike
document.getElementById("resetoiPeli").addEventListener("click", asetaKortit);
