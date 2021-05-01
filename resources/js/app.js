//selecting here all the elements
//new cases ,total cases all these ko select kiya hun idhar mai

const country_name_element=document.querySelector(".country .name");
const total_cases_element=document.querySelector(".total-cases .value");
const new_cases_element=document.querySelector(".total-cases .new-value");
const recovered_element=document.querySelector(".recovered .value");
const new_recovered_element=document.querySelector(".recovered .new-value");
const deaths_element=document.querySelector(".deaths .value");
const new_deaths_element=document.querySelector(".deaths .new-value");


const ctx=document.getElementById("axex_line_chart").getContext("2d");

let masterData=[];
let app_data=[],
	cases_list=[],
	recovered_list=[],
	deaths_list=[],
	dates=[],
	formatedDates=[];
	country_code=geoplugin_countryCode();
	let user_country;
	country_list.forEach(country=>{
		if(country.code==country_code){
			user_country=country.name;
		}
	}); 


	//users country code by geo plugin 




/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */
/*
fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=country`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
		}
	})
*/
function fetchData(user_country){
	country_name_element.innerHTML="Loading...";
	cases_list=[],recovered_list=[],deaths_list=[],data=[],formatedDates=[];
	
	fetch("https://covid-193.p.rapidapi.com/history?country="+user_country, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid-193.p.rapidapi.com",
			"x-rapidapi-key": "0cbbd32046msh2741f6d1c99da7bp18b50djsn152fae2b8dd5"
		}
	}).then(response=>
	{
		return response.json();
	})
	.then(response=>
	{
		
		data = response.response;
		masterData=[];
		//console.log(data);
		data.forEach(obj=>{
			//console.log(obj.day)
			let Cases = obj.cases;
			let Death = obj.deaths;
			//console.log(Cases);
			formatedDates.push(formatDate(obj.day));
			cases_list.push(parseInt(Cases.total));
			recovered_list.push(parseInt(Cases.recovered));
			deaths_list.push(parseInt(Death.total));
			masterData.push({
				'country_name':obj.country,
				'total_cases':Cases.total,
				'new_cases':Cases.new,
				'total_recovered':Cases.recovered,
				'total_deaths':Death.total,
				'new_deaths':Death.new
			})
		})
		
	})
	.then(()=>{
		updateUI();
		axesLineraChart();
	})



}
fetchData(user_country);

function updateUI() {
	updateStats();
}
function updateStats(){
	let last_entry=masterData[0];
	let before_last_entry=masterData[1];

	country_name_element.innerHTML=last_entry.country_name;

	total_cases_element.innerHTML=last_entry.total_cases||0;
	new_cases_element.innerHTML=last_entry.new_cases ||0;

	recovered_element.innerHTML=last_entry.total_recovered||0;
	new_recovered_element.innerHTML=parseInt( last_entry.total_recovered) -parseInt( before_last_entry.total_recovered);
	
	deaths_element.innerHTML=last_entry.total_deaths;
	//alert(last_entry.new_deaths||0);
	//$('#new-deaths-value').html(last_entry.new_deaths||0);
	//new_deaths_element.innerHtml=last_entry.new_deaths||0;
	document.getElementById("new-deaths-value").innerHTML = last_entry.new_deaths||0;
	
}

//Doing the chart update here
function axesLineraChart(){
	var my_chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Cases',
            data: cases_list.reverse(),
            fill:false,
            borderColor:'#FFF',
            backgroundColor:'#FFFF',
            borderWidth:1
            
        },{
        	label: 'Recovered',
            data: recovered_list.reverse(),
            fill:false,
            borderColor:'#009688',
            backgroundColor:'#009688',
            borderWidth:1
        },
        {
        	label: 'deaths',
            data: deaths_list.reverse(),
            fill:false,
            borderColor:'#F44336',
            backgroundColor:'#F44336',
            borderWidth:1
        }],
        
        labels:formatedDates.reverse()
    },
    options: {
    	response: true,
    	maintainAspectRatio:false

        
        }
    
});
}

//dates look so ugly ,so gotta format it. doing that below.

const monthsNames=['Jan','Feb','March','April','May','june','july','Aug','sept','october','November','December'];

function formatDate(dateString){
	let date=new Date(dateString);
	return `${date.getDate()} ${monthsNames[date.getMonth()]}`;

}
