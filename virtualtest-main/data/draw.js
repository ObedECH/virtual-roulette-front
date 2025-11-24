var prizesCatalog = [];

fetch('data/prizes.json')
	.then(resp => resp.json())
	.then(data => prizesCatalog = data)
	.catch(() => console.warn('No se pudo cargar prizes.json'));

$(function () {
	//#region variables generales
	var generalSpeed = 10;
	var participantNumber = '1';
	var isSortButtonOnClick = false;
	var isBigAward = true;
	var participants = [];
	var regionalId = isBigAward ? 'NACIONAL' : $('#regionalId').val();

	var stopNumbers = [
		false,
		false,
		false,
		false,
		false,
		false
	];
	var dataTableConfig = {
		// "dom": "Bfrtip",
		"dom": "Bflrtip",
		"buttons": [
			// "copy", 
			// "csv", 
			// "excel", 
			// "pdf", 
			// "print"
		],
		"searching": true,
		"ordering": false,
		"language": {
			"processing": "Procesando...",
			"lengthMenu": "Mostrar _MENU_ registros",
			"zeroRecords": "No se encontraron resultados",
			"emptyTable": "Ningún dato disponible en esta tabla",
			"infoEmpty": "Mostrar del 0 al 0 de un total: 0",
			"info": "Mostrar del _START_ al _END_ de un total: _TOTAL_",
			"infoFiltered": "(filtrado de un total de _MAX_ registros)",
			"search": "Buscar:",
			"infoThousands": ",",
			"loadingRecords": "Cargando...",
			"paginate": {
				"first": "Primero",
				"last": "Último",
				"next": "Siguiente",
				"previous": "Anterior"
			},
			"aria": {
				"sortAscending": ": Activar para ordenar la columna de manera ascendente",
				"sortDescending": ": Activar para ordenar la columna de manera descendente"
			}
		},
		"pagingType": "simple_numbers",
		"scrollY": "200px",
		"sScrollX": "100%",
		"scrollX": true,
		"scrollCollapse": true,
		"order": [[2, "asc"]]
	};

	var rouletter = $('div.roulette1');
	var rouletter2 = $("div.roulette2");
	var rouletter3 = $("div.roulette3");
	var rouletter4 = $("div.roulette4");
	var rouletter5 = $("div.roulette5");
	var rouletter6 = $("div.roulette6");
	// var rouletter7 = $("div.roulette7");
	//#endregion	

	$(".roulette1").find("img").hover(function () {
		console.log($(this).height());
	});

	$(".roulette2").find("img").hover(function () {
		console.log($(this).height());
	});

	var appendLogMsg = function (msg) {
		$("#msg")
			.append('<p class="muted" style="position: absolute;">' + msg + "</p>")
			.scrollTop(100000000);
	};

	$('.start').click(function () {
		setValues();
		setDisabledButtons(true);

		if (!isSortButtonDisabled()) {
			createAndExecuteRouletters();
		} else {
			setDisabledButtons(false);
		}
	});

	var setValues = function () {
		participants = [];
		$('.show_big_award_winner')
			.html('');
		// $('body').css(
		// 	'background', 
		// 	'url("Estilos/imagenes/fondo.png")'
		// );
		$('#myVideo').hide();
	}

	$('#bigAward').click(function () {
		isBigAward = $("#bigAward").is(':checked');

		$('#regionDisplay').html(isBigAward ? '' : $('#regionalId').val() || '');

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
			$('.roulette-default').hide();
			$('#participantNumberLabel').css('display', 'block');
			$('#participantNumber').css('display', 'block');
			// $('#regionalIdLabel').css('display', 'block');
			// $('#regionalId').css('display', 'block');
			createDataTable();
			createDataTable();
			initRouletters();
		} else {
			cleanDataTableRow();
			$('.employeName').html(
				'<div class="show_big_award_winner"></div>'
			);
			$('#participantNumberLabel').css('display', 'none');
			$('#participantNumber').css('display', 'none');
			// $('#regionalIdLabel').css('display', 'none');
			// $('#regionalId').css('display', 'none');
			$('.show_big_award_winner').show();
		}
		setValues();
	});

	$('#participantNumber').change(function () {
		partipantNumberFieldDisabled();
	});

	$('#participantNumber').keyup(function () {
		partipantNumberFieldDisabled();
	});

	$('#regionalId').change(function () {
		getRegionalId();
	});

	var getRegionalId = function () {
		regionalId = $('#regionalId').val();
		$('#regionDisplay').html(regionalId);
	}


	var partipantNumberFieldDisabled = function () {
		participantNumber = $('#participantNumber')
			.val() === ''
			? '0'
			: $('#participantNumber').val();

		$('.start').prop(
			"disabled",
			isSortButtonDisabled()
		);
	}

	var isSortButtonDisabled = function () {
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
				// participante.region,
				participante.area,
				participante.prize + ' - ' + participante.prizeDescription,
				//participante.prize,
				//participante.prizeDescription,
				// participante.dateRegistry
			]);
		});

		setDisabledButtons(false);
		participants = [];
		table.rows.add(participantesTmp).draw();
	}

	var setDisabledButtons = function (executing) {
		if (executing) {
			$('.start').prop("disabled", true);
			$('#bigAward').prop("disabled", true);
			$('#participantNumber').prop("disabled", true);
			$('#regionalId').prop("disabled", true);
		} else {
			$('.start').prop("disabled", isSortButtonDisabled());
			$('#bigAward').prop("disabled", false);
			$('#participantNumber').prop("disabled", isBigAward);
			$('#regionalId').prop("disabled", isBigAward);
			$('.start').focus();
		}
		stopNumbers = [false, false, false, false, false, false];
	}

	var createAndExecuteRouletters = function () {
		var participantNumberUrl = isBigAward ? '1' : participantNumber;
		var region = isBigAward ? 'NACIONAL' : $('#regionalId').val();

		getNumber(participantNumberUrl, region).then(data => {
			if (data.length > 0) {
				if (isBigAward) {
					participants.push(data[0]);
					getRouletters(data[0], false);
				} else {
					cleanDataTableRow();
					initRouletters();
					participants = data;
					setDataTableRow();

					if (data.length < participantNumber) {
						alert("Sólo se obtuvieron " + data.length + " ganadores de " + participantNumber + " solicitados");
					}
				}
			} else {
				cleanDataTableRow();
				alert("Ya no hay más premios por asignar a la región seleccionada");
				setDisabledButtons(false);
			}
		}).catch(error => {
			setDisabledButtons(false);
		});
	}

	var getParameter = function (field, id, duration) {
		var parameter = {
			speed: generalSpeed,
			fieldPosition: field,
			userId: id,
			stopImageNumber: id.charAt(field),
			duration: 9,
			stopCallback: function () {
				stopNumbers[field] = true;
				if (stopNumbers.filter(sn => sn === true).length === 6) {
					$('.show_big_award_winner').show();

					// var image = new Image();
					// image.src = 'Estilos/imagenes/ANIMA FEL.gif';

					// $('body').css(
					// 	'background-image', 
					// 	'url("Estilos/imagenes/mega-azul-felicidades.png")'
					// );
					$('.show_big_award_winner')
						.append(getWinnerHtml(participants[0], 1));
					$('#myVideo').show();

					// $('.show_big_award_winner')
					// .append(`
					// 	<video autoplay muted loop id="myVideo">
					// 	<source src="./Estilos/imagenes/anime 2.mp4" type="video/mp4">
					// 	</video>
					// `);

					for (let index = 2; index < 6; index++) {
						setTimeout(() => {
							$('.show_big_award_winner')
								.append(getWinnerHtml(participants[0], index));
						}, (index - 1) * 3000);

						setTimeout(() => {
							setDisabledButtons(false);
						}, 4 * 3000);
					}
				}
			}
		};

		return parameter;
	}

	var createDataTable = function (data) {
		// <th>Id</th>
		// <th>Región</th>
		// <th>Fecha</th>
		var html = `
		<div class="data_table_winners">
				<table id="example" class="display nowrap" style="border-style: double;width:100%;background: #cb7314;">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Área</th>
							<th>Premio</th>
						</tr>
					</thead>
					<tbody>
					</tbody>							
				</table>
			</div>
		`;
		$('.employeName').html(html);
		$.extend(true, $.fn.dataTable.defaults, dataTableConfig);

		$('#example').DataTable();
	}

	var getWinnerHtml = function (data, key) {
		var html = '';
		var prizeFromCatalog = prizesCatalog.find(prize => Number(prize.id) === Number(data.prize));
		var prizeImage = data.imagen || data.prizeImage || data.image || (prizeFromCatalog ? prizeFromCatalog.imagen : '');
		var prizeVisual = prizeImage
			? `<img src="${prizeImage}" alt="Premio ${data.prizeDescription}">`
			: `<div class="winner-card__placeholder">Imagen no disponible</div>`;

		switch (key) {
			case 1: html = `
						<div class="prize-image">
							${prizeImage ? `<img src="${prizeImage}" alt="Premio ${data.prizeDescription}">` : ''}
						</div>
						<p class="data-general">
						<strong style="color: #ffffff;">Premio:</strong>			
						${data.prize} - ${data.prizeDescription}</p><br>						
					`;
				break;
			case 2: html = `						
							<strong>
							<p class="data-general">
							<strong style="color: #ffffff;">Región:</strong>
							${data.region}</p><br>						
						`;
				break;
			case 3: html = `						
							<strong>
							<p class="data-general">
							<strong style="color: #ffffff;">Área:</strong>			
							${data.area}</p><br>						
						`;
				break;
			case 4: html = `						
							<strong>
							<p class="data-general">
							<strong style="color: #ffffff;">Puesto:</strong>
							${data.company}</p><br>
						`;
				break;
			case 5: html = `						
							<strong>
							<p class="data-name">
							<strong style="color: #ffffff;">Nombre:</strong>
							${data.name}</p><br>
						`;
				break;

			default:
				break;
		}

		return html;
	}

	var getRouletters = function (data, init = false) {
		data = data;
		var id = data.id.toString();
		if (id.length < 6) {
			id = '0'.repeat(6 - id.length) + id;
		}

		rouletter.roulette(getParameter(0, id, 1));
		rouletter2.roulette(getParameter(1, id, 3));
		rouletter3.roulette(getParameter(2, id, 3));
		rouletter4.roulette(getParameter(3, id, 5));
		rouletter5.roulette(getParameter(4, id, 5));
		rouletter6.roulette(getParameter(5, id, 7));

		// rouletter.roulette();		
		// rouletter2.roulette();
		// rouletter3.roulette();
		// rouletter4.roulette();
		// rouletter5.roulette();
		// rouletter6.roulette();

		if (init) {

		} else {
			$('.roulette-default').hide();
			rouletter.roulette('start');
			rouletter2.roulette("start");
			rouletter3.roulette("start");
			rouletter4.roulette("start");
			rouletter5.roulette("start");
			rouletter6.roulette("start");
		}
	}

	var initRouletters = function (init = true) {
		getRouletters({
			id: '',
		}, init);
	}

	var cleanDataTableRow = function () {
		var table = $("#example").DataTable();
		table.rows().clear().draw();
	}

	$('.start').focus();
});
