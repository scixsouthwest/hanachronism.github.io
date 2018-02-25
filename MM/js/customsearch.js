//contained for all html files as search works from magifying glass icon on upper right of every page
var showtalks=true;
var showposters=true;
function showPapers(paperList, searchTerms, searchsource) {
	if (paperList.length == 0) {
		$("#searchTitle").text("Sorry, no results were found for your search '"+searchTerms+"'");
		$("#subTitle").html("Try another search term, or <a href='browse.html'>browse through the proceedings</a>.");
	} else {
		if (searchsource == "search.html" || searchsource == "browsecheck") {
			var numresults=paperList.length.toString();
			$("#searchTitle").text(numresults+" results for '"+searchTerms+"'");
			$("#subTitle").text("Click on a result to see the full record.");
			$("#searchresults").show();
			for (var i=0;i<paperList.length;i++) {
				var paperTitle=allPapers[paperList[i]].title;
				var paperURL=allPapers[paperList[i]].weburl;
				var alist=allPapers[paperList[i]].authorlist.join(", ");
				var typeicon;
				if (allPapers[paperList[i]].prestype=="talk") {
					typeicon="icon-mic2";
				} else {
					typeicon="icon-presentation";
				}
				var paperDiv = '<div href="'+paperURL+'" id="'+paperList[i]+'" class="paperResult probootstrap-text"><a href="'+paperURL+'"><p style="color:black;margin-bottom:0">'+paperTitle+'</p><p style="color:grey;margin-bottom:0;font-size:0.8em">'+alist+'</p><p class="practicalInfo" style="color:#67A5C5;font-size:0.7em; margin:0;"><span id="presIcon"><i class="'+typeicon+'"></i></span> <span id="presType">'+allPapers[paperList[i]].prestype+'</span> | <span><i class="icon-calendar"></i></span> <span id="thedate">'+allPapers[paperList[i]].date+'</span></p><p class="practicalInfo" style="color:#67A5C5;font-size:0.7em; margin:0"><span><i class="icon-clock2"></i></span> <span id="thetime">'+allPapers[paperList[i]].time+'</span> | <span><i class="icon-location"></i></span> <span id="thelocation">'+allPapers[paperList[i]].location+'</span></p></a></div>'
				$("#paperList").append(paperDiv);
			}
		} else {
			var searchsplit=searchTerms.replace(" ","+")
			var newURL="search.html?s="+searchsplit
			window.location.href = newURL;
		}
	}
}

function getpapers(searchterm) {
	var relevantpapers=[];
	for (var key in allPapers) {
			var paperEntry=allPapers[key]
			if (paperEntry.prestype == "poster" && showposters==false) {
				//pass
			} else if (paperEntry.prestype=="talk" && showtalks==false) {
				//pass
			} else { 
			//console.log(paperEntry.keywords);
				var paptitle=paperEntry.title.toLowerCase().split(" ");
				for (var i=0; i<searchterm.length;i++){
					if (paptitle.includes(searchterm[i])) {
						relevantpapers.push(key);
					}
				}
				for (var j=0;j<paperEntry.keywords.length;j++) {
					if (searchterm.includes(paperEntry.keywords[j].toLowerCase())) {
						relevantpapers.push(key);
					}
				}
				for (var j=0;j<paperEntry.authorlist.length;j++) {
					var authFL=paperEntry.authorlist[j].split(" ")
					for (var aname=0;aname<authFL.length;aname++) {
						if (searchterm.includes(authFL[aname].toLowerCase())) {
							relevantpapers.push(key);
						}
					}
				}
			}
				
		}
	return relevantpapers;
}

$(document).ready(function() {
	$(".topics").change();
	$("section").on('click',function() {
		console.log("section clicked!!");
		console.log(this.id);
		$(this).css("background:red")
	});

	$(".topics").change(function() {
		var searchlist=[];
		$("#paperList").html("");
		$('input:checkbox.topicbrowse').each(function () {
       		var sThisVal = (this.checked ? $(this).val() : "");
       		if (sThisVal!="") {
       			searchlist.push(sThisVal);
       		}
       		
  		});
  		if (searchlist.length>0) {
  			var relpapers=getpapers(searchlist);
       		var q=searchlist.join(" ");
       		showPapers(relpapers, q, "browsecheck");
  		}
	});
	var theurl=window.location.href;
	console.log(theurl)
	var holdparams=theurl.split("?")
	//console.log(holdparams)
	var source=holdparams[0].slice(-11,holdparams[0].length)
	var endchar=source.substr(-1);
	if (endchar=="#") {
		source=holdparams[0].slice(-12,holdparams[0].length-1)
	}
	//console.log(source)
	var params = {};
	for (var i=1; i<holdparams.length;i++) {
		console.log(holdparams[i]);
		var kpair=holdparams[i].split("=");

		params[kpair[0]]=kpair[1]
	}
	var wantsPaper= 'p' in params;
	var isSearching = 's' in params;
	if (isSearching) {
		var sterm;
		sterm = params.s.toLowerCase();
		if (sterm.charAt(sterm.length-1)=="#") {
			sterm=sterm.substring(0,sterm.length-1);
		}
		sterm=sterm.split("+");
		var relevantpapers = getpapers(sterm);

		
		//show relevant papers
		var query=sterm.join(" ")
		showPapers(relevantpapers, query, source);
		//var searchquer=septerms.join("+")
		//window.location.href = "searchresults.html?s="+searchquer
		//send user to page with list of relevant papers
	}

	$(".paperResult").click(function() {
		window.location = $(this).attr("href");
	});
});