let chart; // Variable globale pour le graphique
function afficherGraphiqueImc() {
    const data = JSON.parse(localStorage.getItem("historiqueImc")) || [];
    const labels = data.map(item => item.date).reverse();
    const imcValues = data.map(item => item.imc).reverse();

    const ctx = document.getElementById("graphImc").getContext("2d");

    // Détruire l’ancien graphique si présent
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "IMC",
                data: imcValues,
                borderColor: "#e91e64",
                backgroundColor: "rgba(89, 37, 54, 0.1)",
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: 10,
                    suggestedMax: 50
                }
            }
        }
    });
}
afficherGraphiqueImc();

function calculerImc() {
    let taille = parseFloat(document.querySelector("#taille").value);
    const poids = parseFloat(document.querySelector("#poids").value);
    const bar = document.querySelector("#imcBar");
    const barContainer = document.querySelector("#imcBarContainer");
    const resultat = document.querySelector("#resultat");

    if (!poids || !taille || poids <= 0 || taille <= 0) {
        resultat.innerHTML = `<p style="color:red;">Veuillez entrer des valeurs valides!</p>`;
        barContainer.style.display = "none";
        return;
    }

    if (taille > 3) {
        taille = taille / 100;
    }

    const imc = poids / (taille * taille);
    let interpretation = "";

    if (imc < 18.5) {
        interpretation = "Insuffisance pondérale";
    } else if (imc < 25) {
        interpretation = "Poids normal";
    } else if (imc < 30) {
        interpretation = "Surpoids";
    } else if (imc < 35) {
        interpretation = "Obésité modérée (classe 1)";
    } else if (imc < 40) {
        interpretation = "Obésité sévère (classe 2)";
    } else {
        interpretation = "Obésité morbide (classe 3)";
    }
    resultat.innerHTML = `
        <p>Votre IMC est : <strong>${imc.toFixed(2)}</strong></p>
        <p>Évaluation : <strong>${interpretation}</strong></p>`;

    // Afficher et animer la barre
    barContainer.style.display = "block";
    const imcPosition = Math.min(imc / 40 * 100, 100);
    bar.style.width = `${imcPosition}%`;

    enregistrerDansHistorique(imc.toFixed(2), interpretation);
}

function reinitialiser() {
    document.querySelector("#poids").value = '';
    document.querySelector("#taille").value = '';
    document.querySelector("#resultat").innerHTML = '';
    document.querySelector("#imcBarContainer").style.display = 'none';
    document.querySelector("#imcBar").style.width = '0%';
}

// Fonction pour enregistrer dans le localStorage
function enregistrerDansHistorique(imc, interpretation) {
    const historique = JSON.parse(localStorage.getItem("historiqueImc")) || [];
    const date = new Date().toLocaleString("fr-FR");
    historique.unshift({ imc, interpretation, date });

    // Limite à 7 entrées
    if (historique.length > 7) historique.pop();

    localStorage.setItem("historiqueImc", JSON.stringify(historique));
    afficherHistorique();
}

// 📄 Fonction pour afficher l'historique
function afficherHistorique() {
    const historique = JSON.parse(localStorage.getItem("historiqueImc")) || [];
    const liste = document.getElementById("historique");
    liste.innerHTML = "";

    if (historique.length === 0) {
        liste.innerHTML = "<li>Aucun calcul encore effectué.</li>";
        return;
    }

    historique.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.date} - IMC: ${item.imc} (${item.interpretation})`;
        liste.appendChild(li);
    });
}

//vider l'historique
function viderHistorique() {
    localStorage.removeItem("historiqueImc");
    afficherHistorique();
}

//charger à l'ouverture de la page
window.addEventListener("DOMContentLoaded", afficherHistorique);

/*
function calculerImc(){

    let poids = document.getElementById("poids").value;
    let taille = document.getElementById("taille").value;

    if (poids && taille > 0) {

        poids = parseFloat(poids)
        taille = parseFloat(taille);

        let imc = poids / (taille * taille);
        let resEval = imc
        
        if (imc <= "18.5") {
            resEval = "Insuffisance"
        } else if (imc >= "18.6" && imc <= "24.9"){
            resEval = "Poids normal"
        } else if (imc >= "25.0" && imc <= "29.9"){
            resEval = "Surpoids"
        } else if (imc >= "30.0" && imc <= "34.9"){
            resEval = "Obésité niveau 1"
        } else if (imc >= "35.0" && imc <= "39.9"){
            resEval = "Obésité niveau 2"
        }

        document.getElementById("resultat").innerHTML = "<p>Votre IMC est : <strong>" + imc.toFixed(2) + "</strong></p>" + "<p>Resultat : <strong>" + resEval + "</strong></p>"
        // .innerText = "Votre Imc est " + imc.toFixed(2) + "Resultat: " + resEval;       
    }
    else {
        document.getElementById("resultat").innerHTML = "<p style='color: red;'>Veuillez entrer des valeurs valides.</p>";
        // .interText = "Veuillez entrer des valeurs valides.";
    }
         return "La taille doit être supérieure à zéro.";
         // return imc.toFixed(2);
}    
*/
   
// toFixed(2) formater le nombre pour qu'il ait 2 décimales après la virgule.
// parseFloat() (car valeurs récupérées sont des chaînes de caractères)


