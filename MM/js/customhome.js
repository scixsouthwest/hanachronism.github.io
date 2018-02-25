//contained in index.html
$(document).ready(function() {
	$(".owl-height").css("height","600px");
	var featurePapers=metadata.imagepapers;
	const shuffled = featurePapers.sort(() => .5 - Math.random());// shuffle  
 	var selected = shuffled.slice(0,6) ; //get sub-array of first n elements AFTER shuffle
 	console.log(selected);

 	$("#feature-1").html(allPapers[selected[0]].featureDiv);
 	$("#feature-2").html(allPapers[selected[1]].featureDiv);
 	$("#feature-3").html(allPapers[selected[2]].featureDiv);
 	$("#feature-4").html(allPapers[selected[3]].featureDiv);
 	$("#feature-5").html(allPapers[selected[4]].featureDiv);
 	$("#feature-6").html(allPapers[selected[5]].featureDiv);
});