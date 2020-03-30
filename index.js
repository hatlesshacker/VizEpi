var global_t = 0
var global_affected = 0

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
    //First run.
    if (global_t == 0) {
        setTimeout(function () {
            $("#"+inf_1).addClass("infected")
            $("#"+inf_2).addClass("infected")
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
        for (let i = 1; i <= 20; i++) {
            var other_citizen = $("#"+i)
            if (current_citizen == other_citizen) {
                console.log("skip")
                continue
            }

            dist = distanceBetweenElems(current_citizen, other_citizen)
            if (dist < eff_radius) {
                if (!other_citizen.hasClass("infected")) {
                    if (prob_infected(inf_prob)) {
                        other_citizen.addClass("infected")
                        global_affected += 1;
                        console.log(global_affected)
                    }
                }
            }
        }
    });

    citizen_move()
}


// Initialize:
// Start with having 2 people infected.
inf_1 = getRandomInt(1, 10);
inf_2 = getRandomInt(1, 10);
while (inf_2 == inf_1) {
    inf_2 = getRandomInt(1, 10);
}

eff_radius = 10
inf_prob = 0.4 // 40% chance of getting infected

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

function affected_percentage() {
    return (global_affected/20)*100
}

function onRefresh(chart) {
	chart.config.data.datasets.forEach(function(dataset) {
		dataset.data.push({
			x: global_t,
			y: affected_percentage()
		});
	});
}

var color = Chart.helpers.color;
var config = {
	type: 'line',
	data: {
		datasets: [{
			label: '% of infection',
			backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
			borderColor: chartColors.blue,
			fill: false,
			cubicInterpolationMode: 'monotone',
			data: []
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Infection rate graph'
		},
		scales: {
			xAxes: [{
				type: 'realtime',
				realtime: {
					duration: 20000,
					refresh: 1000,
					delay: 2000,
					onRefresh: onRefresh
				}
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'value'
				}
			}]
		},
		tooltips: {
			mode: 'nearest',
			intersect: false
		},
		hover: {
			mode: 'nearest',
			intersect: false
		}
	}
};

var colorNames = Object.keys(chartColors);

$(document).ready(function(){
    var ctx = document.getElementById('liveChart').getContext('2d');
	window.liveChart = new Chart(ctx, config);
    citizen_move();
}); 