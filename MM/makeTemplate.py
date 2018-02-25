
import json
import re

#list of accepted papers by number
acceptedpapers=["2", "3", "4", "5", "6", "7"]

paperdat={}
metaDat={}
metaDat["NumPapers"]=len(acceptedpapers)
metaDat["Institutions"] = 98
keys=[]
countries=[]
institutions=[]
authors=[]
imagepapers=[]
alltopics=[]
with open("paperdata.tsv","r") as infile:
	for line in infile:
		x=line.rstrip().split("\t")
		if x[0]=="Title":
			pass
		else:
			thauths=x[1].split(",")
			for a in thauths:
				authors.append(a)
			countries.append(x[6])
			institutions.append(x[7])
			keylist=x[8].split(",")
			for k in keylist:
				alltopics.append(k)
			paperdat[x[2]] = {
				"title":x[0].capitalize(),
				"prestype":x[3],
				"authors":thauths,
				"topics":keylist,
				"result":x[3],
				"number":x[2],
				"correspauth":x[4],
				"correspemail":x[5],
				"licence":x[9],
				"images":x[10]}

metaDat = {"countries":len(list(set(countries))),"institutions":len(list(set(institutions))),"authors":len(list(set(authors))),"NumPapers":len(acceptedpapers)}


#before running this you need an html formatted .txt file for each abstract you want to display in the papertemplate.html file
#def getAbstract(papernumber):
#	with open("finalpapertxt/paper"+papernumber+".txt","r") as infile:
#		abstract=""
#
#		for line in infile:
#			if len(line)>3:
#				if line.isupper():
#					pass
#				elif line[0]=="*":
#					pass
#				elif line[0].isdigit() and line[1] != '.':
#					pass
#				else:
#					abstract=abstract+line
			
#	return abstract


def makeCite(auths, paperURL, title, kws, number):
	authstring = ""
	alist=[]
	copyAuths=""
	for i in range(len(auths)):
		splitname=auths[i].split(" ")
		surname=splitname.pop()
		if splitname[-1] == "van" or splitname[-1] == "de":
			surname=splitname.pop()+" "+surname

		initials=""
		for name in splitname:
			if "." in name:
				initials=initials+name
			else:
				initials=initials+name[0]+"."
		citename=surname+", "+initials
		alist.append(citename)
	for i in range(len(alist)):
		if(i==0):
			copyAuths=alist[i]
		elif (i==len(alist)-1):
			copyAuths=copyAuths+" & "+alist[i]
		else:
			copyAuths=copyAuths+", "+alist[i]

	
	for i in range(len(auths)):
		if i==0:
			authstring=auths[i]
		else:
			authstring=authstring+" and "+auths[i]
	risauths=""
	

	for auth in auths:
		risauths=risauths+"\nAU  - "+auth
	keyWords=""
	for k in kws:
		keyWords=keyWords+"\nKW  - "+k
	
	#CHANGE AS APPROPRIATE
	bibString ="@inproceedings{evolang12,\nAuthor = {" + authstring + "},\nBooktitle = {The proceedings of the EVOLANG XII Modality Matters Workshop},\nEditor = {H. Little and A. Micklos},\nPublisher = {Online at url{" + paperURL + "}},\nTitle = {" +title + "},\nYear = {2018}}"
	risString = "TY  - CONF\nT1  - "+title+"\n"+risauths+"\nT2  - TThe proceedings of the EVOLANG XII Modality Matters Workshop\nED  - Hannah Little\nED  - Ashley Micklos\nED  - 2018\nUR  - "+paperURL+"\n"+"\nER  -"
	with open("bib/EvoLang12_"+paper+".bib","w") as outfile:
		outfile.write(bibString)
	with open("bib/EvoLang12_"+paper+".ris","w") as outfile:
		outfile.write(risString)
	copyString = copyAuths+" (2018). "+title+". In Little, H. & Micklos, A. (Eds.): The proceedings of the EVOLANG XII Modality Matters Workshop. Online at: " + paperURL
	return copyString

jsonEntries={}

with open("schedData.tsv","r") as infile:
	timeslots=[]
	for line in infile:
		x=line.rstrip().split("\t");
		timeslots.append(x)

for paper in acceptedpapers:
	submissionNumber=paper
	if paperdat[paper]["prestype"] == "poster":
		talkdate="April 17, 2018"
		talktime="18:00"
		talkloc="Main Hall"
	else:
		lowtitle=paperdat[paper]["title"].lower()
		for t in timeslots:
			talks=t[-4:]
			for i in range(len(talks)):
				talk=talks[i].lower()
				if talk==lowtitle:
					talkdate="NULL"
					if t[0] == "Monday":
						talkdate="April 16, 2018"
					
					talktime=t[1].split("-")[0]
					talkloc="Hotel Filmar"
					if talkdate=="NULL":
						print "ERROR: talkdate is", talkdate, "for submission", paper
					break

	paperURL = "http://evolang.org/torun/proceedings/papertemplate.html?p="+paper
	if paperdat[paper]["licence"] == "None" or paperdat[paper]["licence"] == "None":
            paperDL = "allpaperpdfs/EvoLangMM_paper"+submissionNumber+".pdf"
            theabstract=""
	if paperdat[paper]["images"]=="None":
		images="NONE"
		fDiv="NONE"
	citation=makeCite(paperdat[paper]["authors"],paperURL,paperdat[paper]["title"],paperdat[paper]["topics"],paper)
	linktext=re.sub('[ ]',"%20",paperdat[paper]["title"])
	linktext="Check%20out%20this%20paper%20from%20EvoLang12,%20\""+linktext+"\""
	tweetlink="https://twitter.com/intent/tweet?text="+linktext+"&hashtags=evolang12"+"&url="+paperURL
	fblink="https://facebook.com/sharer/sharer.php?u="+paperURL+"&quote="+linktext+" #evolang12"
	
	
	thisentry = {
		"title":paperdat[paper]["title"],
		"authorlist":paperdat[paper]["authors"],
		"download":paperDL,
		"citations":{"copy":citation,"bibtex":"bib/EvoLang12_"+paper+".bib","ris":"bib/EvoLang12_"+paper+".ris"},
		"sharing":{"twitter":tweetlink,"facebook":fblink},
		"abstracttext": theabstract,
		"keywords":paperdat[paper]["topics"],
		"correspemail":paperdat[paper]["correspemail"],
		"correspauth":paperdat[paper]["correspauth"],
		"weburl":"papertemplate.html?p="+paper,
		"images":images,
		"featureDiv":fDiv,
		"date": talkdate,
		"time":talktime,
		"location":talkloc,
		"prestype":paperdat[paper]["prestype"],
		"licence":paperdat[paper]["licence"]
	}
	jsonEntries[paper] = thisentry
 

metaDat["imagepapers"]=imagepapers	
alltopics=list(set(alltopics))

scheddict={}
scheddict["Monday"] = []
def getAuthsURL(title):
	t=title.lower()
	res=[]
	for p in jsonEntries:
		print jsonEntries[p]["title"].lower()
		if jsonEntries[p]["title"].lower() == t:
			res.append(jsonEntries[p]["weburl"])
			res.append((", ").join(jsonEntries[p]["authorlist"]))
			break
	return res

trackentry = '<div class="row shadow"><div class="col-md-2"><p>time</p></div><div class="col-md-2"><a href="url1"><p class="stitle">Title1</p><p class="authsub">Auths1</p></a></div><div class="col-md-2">'
coffees=["Plenary","coffee break","Business Meeting","Conference Dinner","lunch", "Guided tour of old town Torun","Poster Session - Wine and light snacks served", "Introduction", "Mini Discussion"]
coffee = '<div class="row shadow"><div class="col-md-2"><p>time</p></div><div class="col-md-10 text-center"><p class="text-center">Activity</p></div></div>'
#{"Tuesday":[entrylist]}
with open("schedData.tsv","r") as infile:
	for line in infile:
		x=line.rstrip().split("\t")
		day=x[0]
		time=x[1]
		if x[2] in coffees:
			tm = coffee.replace("time",time)
			row = tm.replace("Activity",x[2])
			scheddict[day].append(row)
		else:
			track=trackentry.replace("time",time)
			for i in range(2,3):
				track=track.replace("Title"+str(i-1),x[i].lower().capitalize())
				tauth=getAuthsURL(x[i])
				if tauth==[]:
					tauth.append("Authors Here")
					tauth.append("#")
				track=track.replace("Auths"+str(i-1),tauth[1])
				track=track.replace("url"+str(i-1),tauth[0])
			scheddict[day].append(track)

with open("schedbasic.html","w") as outfile:
	for key in scheddict:
		outfile.write("\n\n"+key+"\n\n")
		for event in scheddict[key]:
			outfile.write(event+"\n")






with open("js/allpapers.js","w") as outfile:
	outfile.write("var allPapers = ")
	json.dump(jsonEntries,outfile, indent=4)
	outfile.write("\nvar metadata = ")
	json.dump(metaDat,outfile, indent=4)
