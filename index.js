var global_t = 0
var global_affected = 0
var global_STATE = false //TRUE: RUN, FALSE: STOP
var global_start_time;
var global_inf_1;
var global_inf_2;
var global_bong_hit;
var global_citizen_nos = 0;

function citizen_move() {
    anime({
        targets: '.citizen',
        translateX: function() {
            return anime.random(-50, 50);
            //return getRandomInt(20, 20);
        },
        translateY: function() {
            return anime.random(-50, 50);
            //return getRandomInt(20, 20);
        },
      
        easing: 'linear',
        duration: 500,
        complete: loop
    });
}

function prob_infected(n) {
    return !!n && Math.random() <= n;
};

function chart_xvals() {
    return Date.now()
}

function chart_yvals() {
    return (global_affected/global_citizen_nos)*100
}

function distanceBetweenElems(elem1, elem2) {
    var pos_x_1 = elem1.position().left;
    var pos_y_1 = elem1.position().top;
    var pos_x_2 = elem2.position().left;
    var pos_y_2 = elem2.position().top;

    var dx = (pos_x_1-pos_x_2)
    var dy = (pos_y_1-pos_y_2)


    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function loop() {
    if (!global_STATE) {
        return
    }

    //First run.
    if (global_t == 0) {
        setTimeout(function () {
            $("#"+global_inf_1).addClass("infected")
            $("#"+global_inf_2).addClass("infected")
        }, 1000)
    }


    global_t += 1;
    inf_id_array = []
    $(".infected").each(function () {
        inf_id_array.push($(this).attr("id"))
    })
    
    inf_id_array.forEach(citizen_id => {
        current_citizen = $("#"+citizen_id)
        // Check if others are with effective radius.
        // If yes, apply probablity distribution.
        for (let i = 1; i <= global_citizen_nos; i++) {
            var other_citizen = $("#"+i)
            if (current_citizen == other_citizen) {
                continue //SKIP
            }

            dist = distanceBetweenElems(current_citizen, other_citizen)
            if (dist < eff_radius) {
                if (!other_citizen.hasClass("infected")) {
                    if (prob_infected(inf_prob)) {
                        other_citizen.addClass("infected")
                        global_affected += 1;
                        console.log("HIT: "+(Date.now() - global_start_time)/1000)
                        //global_bong_hit = (Date.now() - global_start_time)/1000
                    }
                }
            }
        }
    });

    citizen_move()
}

function stop_loop() {
    global_citizen_nos = 0
    global_STATE = false
}

eff_radius = 0
inf_prob = 0

$(document).ready(function(){
    var ctx = document.getElementById('liveChart').getContext('2d');
    
    $("#runbutton").click(function () {
        //Button clicked. Run simulation.

        eff_radius = ($("#radRange").val())/10
        inf_prob   = $("#probRange").val()

        window.liveChart = new Chart(ctx, config);

        global_start_time = Date.now()

        $(".citizen").each(function () {
            global_citizen_nos++;
        })

        global_inf_1 = getRandomInt(1, global_citizen_nos);
        global_inf_2 = getRandomInt(1, global_citizen_nos);
        while (global_inf_2 == global_inf_1) {
            global_inf_2 = getRandomInt(1, global_citizen_nos);
        }

        console.log("Citizens: "+ global_citizen_nos)
        console.log("Efefctive radius: "+eff_radius)
        console.log("Probablity of getting infected: "+inf_prob+ "%")

        global_STATE = true;
        loop(); //Start the loop
    })

    $("#stopbutton").click(stop_loop)

    $('#addcitizen').click(function () {
        var current_citizen = 0
        $(".citizen").each(function () {
            current_citizen++;
        })

        $('.city').append(`<div class="citizen" id="`+(current_citizen+1)+`"></div>`)
    })

    $('#dropcitizen').click(function () {
        var current_citizen = 0
        $(".citizen").each(function () {
            current_citizen++;
        })

        $('#'+current_citizen).remove()
    })
}); 