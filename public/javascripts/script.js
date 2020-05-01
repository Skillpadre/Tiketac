let btnConfirm = document.getElementById('confirm');
let liste = document.getElementsByClassName('panier');
let text = "Résumé de la commande : ";


function popup() {
    for(let i=0; i<liste.length; i++){
        text += "\n" + liste[i].dataset.travel + " le : " + liste[i].dataset.date + " à : " + liste[i].dataset.depart_time;
}
text += "\n Total : " + btnConfirm.dataset.total;
    alert(text)
};


btnConfirm.onclick = popup;


