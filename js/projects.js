var rename_button_id = null

var url_access = "http://localhost:5000/projects/access/"

$(document).ready(function () {
	$('.spinner').css('visibility', 'visible');
	var delete_button_text = 'Delete'
	var open_project_button_text = 'Open'
	var access_button_text = 'Manage access'
	var rename_button_text = 'Rename'

	//Display current time: 
	var today = new Date()
	var mon = today.getMonth()+1;
	var day = today.getDate();
	document.getElementById("currentTime").innerHTML = mon + "/" + day;

	// Load existing projects
	var uid = window.sessionStorage.getItem('user')
	var user_info = {}
	user_info.uid = uid
	$.ajax({
		type: "POST",
		url: "/loadProjects",
		data:JSON.stringify(user_info),
		contentType: "application/json; charset=utf-8"
	}).done(function(data){
		for(var i =0; i<data.length; i++){
			loadExistingProjects(data[i]['id'], data[i]['name'])
		}
		$('#spinner').css('visibility', 'hidden');
	})


	$('#renameProject').on('show.bs.modal', function (event) {
		rename_button_id = event.relatedTarget.id
	});



	document.getElementById('create_clicked').addEventListener("click", createNewProject)
	function createNewProject(){ 
		var project_id = generate_project_id()
		var newProjectName = document.getElementById('project_name').value;
		var projects = document.getElementById('projects')

		// Container for each project entry:
		var project = document.createElement('li')
		var element_id = concat_id(project_id, 'proj') //proj-0
		project.id = element_id
		project.className = 'd-flex justify-content-between linkdelete'

		// First div(project name): 
		var div_project_name = document.createElement('div')
		div_project_name.className = 'd-flex flex-row align-items-center'
		var project_name = document.createElement('h6')
		project_name.id = concat_id(project_id, 'name') // name-0
		project_name.className = 'mb-0 ml-2 linkrename'
		project_name.textContent = newProjectName

		div_project_name.append(project_name)

		//Second div(dropdown menu): 
		var div_btn_group = document.createElement('div')
		div_btn_group.className = 'btn-group'
		var button = document.createElement('button')
		button.className = 'btn btn-light dropdown-toggle'
		button.setAttribute('type', 'button')
		button.setAttribute('data-toggle','dropdown')
		button.setAttribute('aria-haspopup', 'true')
		button.setAttribute('aria-expanded', 'false')
		div_btn_group.append(button)

		var div_options = document.createElement('div')
		div_options.className = 'dropdown-menu dropdown-menu-right'

		//Button that open a project:
		var link_open = document.createElement('a')
		link_open.className = 'dropdown-item'
		link_open.setAttribute('type', 'button')
		link_open.textContent = open_project_button_text
		link_open.href = "/search?projectid="+project_id
		div_options.append(link_open)

		//Rename button:
		var button_rename = document.createElement('button')
		button_rename.className = 'dropdown-item rename'
		button_rename.textContent = rename_button_text
		button_rename.id = concat_id(project_id,'bnr') //bnr-0, button renames
		button_rename.setAttribute('type', 'button')
		button_rename.setAttribute('data-toggle', 'modal')
		button_rename.setAttribute('data-target', '#renameProject')
		div_options.append(button_rename)

		//Delete button:
		// https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
		var button_delete = document.createElement('button')
		button_delete.className = 'dropdown-item delete'
		button_delete.id = concat_id(project_id,'bnd')//bnd-0 button delete
		button_delete.onclick = function(){
			var id = this.id;
			var parsed_id = id.split('-')
			var delete_project = parsed_id[1]
			var delete_proj_id = 'proj' + '-' + delete_project
			
			// AJAX request to server:
			var project_info = {};
			project_info.id = delete_project;
			project_info.uid = uid
			console.log("deleting", project_info)
			$.ajax({
				type:"POST",
				url:"/deleteProject",
				contentType: "application/json",
				data: JSON.stringify(project_info),
				contentType: "application/json; charset=utf-8"
			})

			document.getElementById(delete_proj_id).remove();
		} ;
		button_delete.setAttribute('type', 'button')
		button_delete.textContent = delete_button_text
		div_options.append(button_delete)
		
		//Manage access link:
		var link_manage_access = document.createElement('a')
		link_manage_access.className = 'dropdown-item'
		link_manage_access.href = url_access + id
		link_manage_access.textContent = access_button_text
		div_options.append(link_manage_access)

		div_btn_group.append(div_options)
		project.append(div_project_name)
		project.append(div_btn_group)
		projects.append(project)

		//Close the modal: 
		$("#createProject .close").click()

		//Create project in firebase: 
        var project_info = {};
		project_info.name = newProjectName;
		project_info.id = project_id
		project_info.uid = uid;

		$.ajax({
			type:"POST",
			url:"/createProject",
			contentType: "application/json",
			data: JSON.stringify(project_info),
			contentType: "application/json; charset=utf-8"
		})

	}

	function loadExistingProjects(id, name){

		var projects = document.getElementById('projects')

		// Container for each project entry:
		var project = document.createElement('li')
		var project_id = concat_id(id, 'proj')
		project.id = project_id
		project.className = 'd-flex justify-content-between linkdelete'

		// First div(project name): 
		var div_project_name = document.createElement('div')
		div_project_name.className = 'd-flex flex-row align-items-center'
		var project_name = document.createElement('h6')
		project_name.id = concat_id(id, 'name') // name-0
		project_name.className = 'mb-0 ml-2 linkrename'
		project_name.textContent = name

		div_project_name.append(project_name)

		//Second div(dropdown menu): 
		var div_btn_group = document.createElement('div')
		div_btn_group.className = 'btn-group'
		var button = document.createElement('button')
		button.className = 'btn btn-light dropdown-toggle'
		button.setAttribute('type', 'button')
		button.setAttribute('data-toggle','dropdown')
		button.setAttribute('aria-haspopup', 'true')
		button.setAttribute('aria-expanded', 'false')
		div_btn_group.append(button)

		var div_options = document.createElement('div')
		div_options.className = 'dropdown-menu dropdown-menu-right'

		//Button that open a project:
		var link_open = document.createElement('a')
		link_open.className = 'dropdown-item'
		link_open.setAttribute('type', 'button')
		link_open.textContent = open_project_button_text
		link_open.href = "/search?projectid="+id
		div_options.append(link_open)

		//Rename button:
		var button_rename = document.createElement('button')
		button_rename.className = 'dropdown-item rename'
		button_rename.textContent = rename_button_text
		button_rename.id = concat_id(id,'bnr') //rename button
		button_rename.setAttribute('type', 'button')
		button_rename.setAttribute('data-toggle', 'modal')
		button_rename.setAttribute('data-target', '#renameProject')
		div_options.append(button_rename)

		//Delete button:
		// https://stackoverflow.com/questions/4825295/onclick-to-get-the-id-of-the-clicked-button
		var button_delete = document.createElement('button')
		button_delete.className = 'dropdown-item delete'
		button_delete.id = concat_id(id,'bnd')//bnd-0 button delete
		button_delete.onclick = function(){
			var id = this.id;
			var num_id = id.split('-')[1]
			var delete_proj_id = 'proj' + '-' + num_id
			// AJAX request to server:
			var project_info = {};
			project_info.id = num_id;
			project_info.uid = uid
			$.ajax({
				type:"POST",
				url:"/deleteProject",
				contentType: "application/json",
				data: JSON.stringify(project_info),
				contentType: "application/json; charset=utf-8"
			})
			document.getElementById(delete_proj_id).remove();
		};
		button_delete.setAttribute('type', 'button')
		button_delete.textContent = delete_button_text
		div_options.append(button_delete)
		
		//Manage access link:
		var link_manage_access = document.createElement('a')
		link_manage_access.className = 'dropdown-item'
		link_manage_access.href = url_access + id
		link_manage_access.textContent = access_button_text
		div_options.append(link_manage_access)


		// put together:
		div_btn_group.append(div_options)
		project.append(div_project_name)
		project.append(div_btn_group)
		projects.append(project)
		
	}

	document.getElementById('rename_clicked').addEventListener("click", renameProject)
	function renameProject(){
		var newProjectName = document.getElementById('rename_project').value;
		var parsed_id = rename_button_id.split('-')
		var project_id = parsed_id[1]
		var rename_h6_id = 'name' + '-' + project_id
		document.getElementById(rename_h6_id).textContent = newProjectName;

		var project_info = {};
		project_info.new_name = newProjectName;
		project_info.id = project_id;
		project_info.uid = uid
		$.ajax({
			type:"POST",
			url:"/renameProject",
			contentType: "application/json",
			data: JSON.stringify(project_info),
			contentType: "application/json; charset=utf-8"
		})
		$("#renameProject .close").click()

	}





	function concat_id(id, type){
		return type + "-" + id;
	}

	/**Generate projectID Generate unique ID by guid algorithm. Information from online references  */
	function generate_project_id() {
		let uuid = guid()
		uuid = uuid.toUpperCase();
		return uuid
	}
	function guid() {
		return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
});





	  
	  