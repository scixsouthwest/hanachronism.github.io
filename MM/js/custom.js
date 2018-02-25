var paperInfo;


$(document).ready(function() {
	$(".puboptions").hide();
	//code change
	var corAuth1 ='<span id="auth1">'
	var corAuth2 = '</span> <a id="correspAuth" href="#" data-toggle="tooltip" trigger="hover focus click" title="email"><span style="color:black;font-size:15px"><i class="icon-mail icon-sm"></i></span></a>'

	var theurl=window.location.href;
	var holdparams=theurl.split("?")
	var params = {};
	for (var i=1; i<holdparams.length;i++) {
		console.log(holdparams[i]);
		var kpair=holdparams[i].split("=");

		params[kpair[0]]=kpair[1]
	}
	var wantsPaper= 'p' in params;
	var isSearching = 's' in params;
	if (isSearching) {
		var searchterms=params.s;
		if (searchterms.charAt(searchterms.length-1)=="#") {
			searchterms=searchterms.substring(0,searchterms.length-1);
		}
		window.location.href = "searchresults.html?s="+searchterms;
		//send user to page with list of relevant papers
	}
	if (wantsPaper && !isSearching) {
		var paper=params.p;
		if (paper.charAt(paper.length-1)=="#") {
			paper=paper.substring(0,paper.length-1);
		}
		paperInfo=allPapers[paper];

		var authors=paperInfo.authorlist;

		var fullcite=paperInfo.citations.copy;

		var otherauthors="";
		$("#fullcitation").text(fullcite);
		if (authors.length==1) {
			$("#authlist").html(corAuth1+authors[0]+corAuth2);
			$("#correspAuth").attr("title",paperInfo.correspemail);
		} else {
			//$("#auth1").text(authors[0]+", ");
			for (var i=0;i<authors.length;i++) {
				if (authors[i]==paperInfo.correspauth) {
					if(i==authors.length-1) {
						otherauthors=otherauthors+" and "+corAuth1+authors[i]+corAuth2
					} else {
						otherauthors=otherauthors+corAuth1+authors[i]+corAuth2;
					}
				} else {
					if (i==authors.length-1) {
						otherauthors=otherauthors+" and "+authors[i];
					} else if (i==0) {
						otherauthors=authors[i];
					} else {
						otherauthors=otherauthors+", "+authors[i];
					}
				}
			}
			$("#authlist").html(otherauthors);
			$("#correspAuth").attr("title",paperInfo.correspemail)
		}
		$("#otherAuths").text(otherauthors);
		$("#tweetPaper").attr("href",paperInfo.sharing.twitter);
		$("#facebookPaper").attr("href",paperInfo.sharing.facebook);
		$("#ptitle").text(paperInfo.title);
		$(".loadbreak").hide();
		console.log(paperInfo.licence);
		if (paperInfo.licence == "NONE" || paperInfo.licence=="NO PUBLISH") {
			$("#nopublish").show();
			$("#dlLink").attr("href","#");
			$("#abstractText").html("There is no summary available for this paper.");
		} else {
			$("#dlLink").attr("href",paperInfo.download);
			$("#dlLink").show();
			$("#abstractText").html(paperInfo.abstracttext);
			
			if (paperInfo.licence == "CC BY ND 4.0") {
				$("#licenseND").show();
			} else if (paperInfo.licence == "CC BY-NC-SA") {
				$("#licenseNCSA").show();
			} else {
				$("#licenseNCND").show();
			}
			
		}

		/*if (paper == "81") {
			$("#silink").show();
			$("#silink").attr("href", "SIMaterial/SIPaper81.zip");
		}

		if (paper=="93") {
			$("#silink").show();
			$("#silink").attr("href", "SIMaterial/SIPaper93.pdf");
		}

		if (paper=="185") {
			$("#silink").show();
			$("#silink").attr("href", "SIMaterial/SIPaper185.zip");
		}

		if (paper=="169") {
			$("#silink").show();
			$("#siling").attr("href","SIMaterial/SIPaper169.zip");
		}*/

		if (paperInfo.prestype =="talk") {
			$("#presIcon").html("<i class=\"icon-mic2\"></i>");
			$("#presType").html("Talk");
		} else {
			$("#presIcon").html("<i class=\"icon-presentation\"></i>");
			$("#presType").html("Poster");
		}

		$("#thedate").html(paperInfo.date);
		$("#thetime").html(paperInfo.time);
		$("#thelocation").html(paperInfo.location);
		
		$("#ptitle").show();
		$("#bibtex").attr("href",paperInfo.citations.bibtex);
		$("#ris").attr("href",paperInfo.citations.ris);
		$("#copyCitation").attr("data-content",fullcite);

		
		$('[data-toggle="tooltip"]').tooltip();

	}
		
	$("#copyCitation").click(function() {
			var dummy = document.getElementById("fullcitation").value=fullcite;  
			  // Select it
			  dummy.select();
			  // Copy its contents
			  document.execCommand("copy");
			  // Remove it as its not needed anymore
			  //document.body.removeChild(dummy);
	});


});