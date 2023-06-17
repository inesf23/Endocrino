let preguntas_aleatorias = true;
let mostrar_pantalla_juego_terminado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

window.onload = function() {
    base_preguntas = readText("base_preguntas.json");
    interprete_bp = JSON.parse(base_preguntas);
    escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
    selected_id("btn1"),
    selected_id("btn2"),
    selected_id("btn3"),
    selected_id("btn4"),
    selected_id("btn5")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

// Funcion para escoger pregunta aleatoria
function escogerPreguntaAleatoria(){
    let n;
    if (preguntas_aleatorias){
        n = Math.floor(Math.random()*interprete_bp.length);
    } else {
        n = 0;
    }

    while (npreguntas.includes(n)) {
        n++;
        if (n >= interprete_bp.length) {
            n = 0;
        }
        if (npreguntas.length == interprete_bp.length){
            // Aqui se reinicia el juego
            if(mostrar_pantalla_juego_terminado){
                swal.fire({
                    title : "Examen finalizado",
                    text:
                        "Puntuacion: " + preguntas_correctas + "/" + (preguntas_hechas-1),
                        icon: "succes"
                });
            }
            if (reiniciar_puntos_al_reiniciar_el_juego) {
                preguntas_correctas = 0
                preguntas_hechas = 0
            }
            npreguntas = [];
        }
    }
    npreguntas.push(n);
    preguntas_hechas++;

    escogerPregunta(n);
}

// Funcion para escoger pregunta
function escogerPregunta(n){

    pregunta = interprete_bp[n]
    selected_id("pregunta").innerHTML = pregunta.pregunta
    selected_id("numero").innerHTML = n;
    let pc = preguntas_correctas;
    if (preguntas_hechas > 1) {
        selected_id("puntuacion").innerHTML = pc + "/" + (preguntas_hechas -1);
    } else {
        selected_id("puntuacion").innerHTML = " ";
    }
    desordenarRespuestas(pregunta);
}

// Funcion para desordenar respuestas
function desordenarRespuestas(pregunta){
    posibles_respuestas = [
        pregunta.respuesta,
        pregunta.incorrecta1,
        pregunta.incorrecta2,
        pregunta.incorrecta3,
        pregunta.incorrecta4,
    ];
    posibles_respuestas.sort(()=> Math.random()-0.5);

    selected_id("btn1").innerHTML = posibles_respuestas[0];
    selected_id("btn2").innerHTML = posibles_respuestas[1];
    selected_id("btn3").innerHTML = posibles_respuestas[2];
    selected_id("btn4").innerHTML = posibles_respuestas[3];
    selected_id("btn5").innerHTML = posibles_respuestas[4];
}

let suspender_botones = false;

// Funcion para presionar botones
function presionar_btn(i){
    if(suspender_botones){
        return;
    }
    suspender_botones = true;
    if(posibles_respuestas[i]==pregunta.respuesta){
        preguntas_correctas++;
        btn_correspondiente[i].style.background = "lightgreen";
    } else {
        btn_correspondiente[i].style.background = "red";
        window.alert(pregunta.respuesta);
    }
    for(let j=0; j < 5; j++){
        if (posibles_respuestas[j] == pregunta.respuesta){
            btn_correspondiente[j].style.background = "lightgren";
            break;
        }
    }
    setTimeout(() => {
        reiniciar();
        suspender_botones = false;
    }, 1000);
}
// Funcion para reiniciar el juego
function reiniciar(){
    for(const btn of btn_correspondiente){
        btn.style.background = "white";
    }
    escogerPreguntaAleatoria();
}
// Para seleccionar un objeto segun su id
function selected_id(id){
    return document.getElementById(id)
}

// Para obtener el estilo del objeto
function style(id){
    return selected_id(id).style
}

// Para leer texto en una ruta local
// Es una funcion sincrona
function readText(ruta_local){
    var texto = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", ruta_local, false);
    xmlhttp.send();
    if (xmlhttp.status == 200){
        texto = xmlhttp.responseText;
    }
    return texto;
}