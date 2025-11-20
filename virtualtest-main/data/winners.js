$(function () {
	//#region variables generales
	var generalSpeed = 10;
	var participantNumber = '1';
	var isBigAward = false;
	var isSortButtonOnClick = false;
	var isWinnerButtonOnClick = false;
	var participants = [];
	var dataTableConfig = {		
			// "dom": "Bfrtip",
			"dom": "Bflrtip",
			"buttons": [
				// "copy", 
				// "csv", 
				"excel", 
				{
					text:      'Refrescar',
					titleAttr: 'Refrescar',
					action: function ( e, dt, node, config ) {
						setDisabledButtons(true);
						setValues();
						getWinners();
					}
				}
				// "pdf", 
				// "print"
			],
			"searching": true,
			"ordering": true,
			"language": {
				"processing": "Procesando...",
				"lengthMenu": "Mostrar _MENU_ registros",
				"zeroRecords": "No se encontraron resultados",
				"emptyTable": "Ningún dato disponible en esta tabla",
				"infoEmpty":      "Mostrar del 0 al 0 de un total: 0",
				"info":           "Mostrar del _START_ al _END_ de un total: _TOTAL_",
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
			"scrollY": "350px",
			"sScrollX": "100%",
			"scrollX": true,	
			"scrollCollapse": true
			//,
			//"order": [[ 1, "asc" ]]	
		
	};
	//#endregion

	var appendLogMsg = function (msg) {
		$("#msg")
		.append('<p class="muted">' + msg + "</p>")
		.scrollTop(100000000);
	};	
	
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
	}

	var setDataTableRow = function () {
		var table = $("#example").DataTable();
		var participantesTmp = [];

		participants.forEach((participante) => {
			participantesTmp.push([
				participante.id,
				participante.name,
				participante.region,
				participante.area,
				participante.prize,
				participante.prizeDescription,
				participante.dateRegistry
			]);
		});		
		
		setDisabledButtons(false);
		participants = [];
		table.rows.add( participantesTmp).draw();
	}

	var setDisabledButtons = function(executing) {
		if (executing) {
			$('.winners').prop("disabled", true);
		} else {
			$('.winners').prop("disabled", false);
		}
	}

	var getWinners = function() {
		getWinnerServer().then(data => {
			cleanDataTableRow();
			if (data.length > 0) {
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
	
	getInitWinners();

	var cleanDataTableRow = function () {
		var table = $("#example").DataTable();
		table.rows().clear().draw();
	}
});
