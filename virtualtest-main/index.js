$(function () {
	//#region variables generales
	var generalSpeed = 10;
	var participantNumber = '1';
	var isBigAward = false;
	var isSortButtonOnClick = false;
	var isWinnerButtonOnClick = false;
	var isBigAward = false;
	var participants = [];
	var regionalId = isBigAward ? '' : $('#regionalId').val();		

	var stopNumbers = [
		false,
		false,
		false,
		false,
		false,
		false,
		false
	];

	var rouletter = $('div.roulette1');
	var rouletter2 = $("div.roulette2");
	var rouletter3 = $("div.roulette3");
	var rouletter4 = $("div.roulette4");
	var rouletter5 = $("div.roulette5");
	var rouletter6 = $("div.roulette6");
	var rouletter7 = $("div.roulette7");
	//#endregion	

	$(".roulette1").find("img").hover(function () {
		console.log($(this).height());
	});

	$(".roulette2").find("img").hover(function () {
		console.log($(this).height());
	});

	var appendLogMsg = function (msg) {
		$("#msg")
		.append('<p class="muted">' + msg + "</p>")
		.scrollTop(100000000);
	};	
	
	$('.start').click(function(){		
		setValues();		
		setDisabledButtons(true);

		if (!isSortButtonDisabled()) {
			createAndExecuteRouletters();
		} else {
			setDisabledButtons(false);
		}
	});

	$('.winners').click(function(){		
		setDisabledButtons(true);
		setValues();
		getWinners();
	});

	var getInitWinners = function() {
		setDisabledButtons(true);
		setValues();
		getWinners();
	}

	var setValues = function() {
		participants = [];
		$('.show_big_award_winner')
			.html('');
	}

	$('#bigAward').click(function() {
		isBigAward = $("#bigAward").is(':checked');
		$('#participantNumber').prop(
			"disabled",
			isBigAward
		);

		$('#regionalId').prop(
			"disabled",
			isBigAward
		);

		$('.start').prop(
			"disabled",
			isSortButtonDisabled()
		);

		if (!isBigAward) {
			$('.show_big_award_winner').hide();	
			$('.number-winners').show();	
			$('.regions-data').show();
			$('.data_table_winners').show();
			initRouletters();
		} else {
			$('.data_table_winners').hide();	
			$('.number-winners').hide();
			$('.regions-data').hide();	
			$('.show_big_award_winner').show();	
		}
	});

	$('#participantNumber').change(function() {
		console.log(stopNumbers);
		partipantNumberFieldDisabled();
	});

	$('#participantNumber').keyup(function() {
		partipantNumberFieldDisabled();
	});

	$('#regionalId').change(function() {
		getRegionalId();
	});

	var getRegionalId = function() {
		regionalId = $('#regionalId').val();		
	}
	

	var partipantNumberFieldDisabled = function() {
		participantNumber = $('#participantNumber')
		.val() === '' 
		? '0' 
		: $('#participantNumber').val();		

		$('.start').prop(
			"disabled",
			isSortButtonDisabled()
		);
	}

	var isSortButtonDisabled = function() {
		var min = parseInt($('#participantNumber').attr('min'));
		var max = parseInt($('#participantNumber').attr('max'));

		var isSortButtonDisabled = !(
			(
				!isBigAward && 
				(
					parseInt(participantNumber) >= min && 
					parseInt(participantNumber) <= max
				)
			) ||
			isBigAward
		);

		return isSortButtonDisabled;
	}

	var setDataTableRow = function () {
		var table = $("#example").DataTable();
		var participantesTmp = [];

		participants.forEach((participante) => {
			participantesTmp.push([
				// participante.id,
				participante.name,
				participante.region,
				participante.company,
				participante.area,
				participante.prize,
				participante.dateRegistry
			]);
		});		
		
		setDisabledButtons(false);
		participants = [];
		table.rows.add( participantesTmp).draw();
	}

	var setDisabledButtons = function(executing) {
		if (executing) {
			$('.start').prop("disabled", true);
			$('.winners').prop("disabled", true);
			$('#bigAward').prop("disabled", true);
			$('#participantNumber').prop("disabled", true);
		} else {
			$('.start').prop("disabled", isSortButtonDisabled());
			$('.winners').prop("disabled", false);
			$('#bigAward').prop("disabled", false);
			$('#participantNumber').prop("disabled", isBigAward);
			$('.start').focus();
		}
		stopNumbers = [false, false, false, false, false, false, false];
	}

	var getWinners = function() {
		getWinnerServer().then(data => {
			cleanDataTableRow();
			if (data.length > 0) {				
				// if(data.filter(d => d.id === '185076')) {
				// 	participants.push({
				// 		id: '1010101',
				// 		name: 'Martin Jefe',
				// 		award: '29'
				// 	});
				// 	alert('sorry Liliana');
				// } else {
				// 	participants = data;
				// }
				participants = data;
				setDataTableRow();
			} else {
				$('.winners').prop("disabled", false)
			}
		}).catch(error => {
			$('.winners').prop("disabled", false)
			alert('Error en el servidor')
		});	
	}
	
	var createAndExecuteRouletters = function() {
		var participantNumberUrl = isBigAward ? '1' : participantNumber;
		var region = isBigAward ? 'NACIONAL' : $('#regionalId').val();

		getNumber(participantNumberUrl, region).then(data => {
			if (data.length > 0) {
				if (isBigAward) {
					participants.push(data[0]);
					getRouletters(data[0]);
				} else {
					cleanDataTableRow();
					initRouletters();
					participants = data;
					setDataTableRow();
				}
			} else {
				setDisabledButtons(false);
			}
		}).catch(error => {
			setDisabledButtons(false);
		});		
	}

	var getParameter = function(field, id, duration) {
		var parameter = {
			speed : generalSpeed,
			fieldPosition : field,
			userId : id,
			stopImageNumber : id.charAt(field),
			duration : 9,
			stopCallback : function() {
				stopNumbers[field] = true;
				if (stopNumbers.filter(sn => sn === true).length === 7) {
					$('.show_big_award_winner')
						.html(getWinnerHtml(participants[0]));
					setDisabledButtons(false);
					// set_width();write_fire();launch();setInterval('stepthrough()', speed);
				}
			}
		};		
		
		return parameter;
	}

	var getWinnerHtml = function(data) {
		var html = `
			<strong>
			<p class="data-name">
			<strong style="color: snow;">Nombre:</strong>
			 ${data.name}</p><br>
			<p class="data-general">
			<strong style="color: snow;">Región:</strong>			
			 ${data.region}</p><br>
			<p class="data-general">
			<strong style="color: snow;">Compañía:</strong>
			 ${data.company}</p><br>
			<p class="data-general">
			<strong style="color: snow;">Area:</strong>			
			 ${data.area}</p><br>
			<p class="data-general">
			<strong style="color: snow;">Premio Id:</strong>			
			 ${data.prize}</p><br>
			<p class="data-general">
			<strong style="color: snow;">Fecha:</strong>						
			 ${data.dateRegistry}</p><br>
			</strong>
		`;

		return html;
	}

	var getRouletters = function(data, init = false) {
		data = data;
		var id = data.id.toString();	
		if (id.length < 7) {
			id = '0'.repeat(7 - id.length) + id;
		}
		
		rouletter.roulette(getParameter(0, id, 1));		
		rouletter2.roulette(getParameter(1, id, 3));
		rouletter3.roulette(getParameter(2, id, 3));
		rouletter4.roulette(getParameter(3, id, 5));
		rouletter5.roulette(getParameter(4, id, 5));
		rouletter6.roulette(getParameter(5, id, 7));
		rouletter7.roulette(getParameter(6, id, 9));

		if (!init) {
			rouletter.roulette('start');
			rouletter2.roulette("start");			
			rouletter3.roulette("start");			
			rouletter4.roulette("start");			
			rouletter5.roulette("start");			
			rouletter6.roulette("start");			
			rouletter7.roulette("start");
		}
	}

	var initRouletters = function() {
		getRouletters({
			id: '',
		}, true);
	}

	initRouletters();	

	var cleanDataTableRow = function () {
		var table = $("#example").DataTable();
		table.rows().clear().draw();
	}

	$('.start').focus();
});
