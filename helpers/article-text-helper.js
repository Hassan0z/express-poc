module.exports = function(srcString) {
	var React = require('react');
	console.log(React);
	
	var shareTitle = "";
	var shareId = "";
	var shareTags = "";
	var shareUrl = "";
	var _ArticlePublishDate = ""; // USED IN TAG MANAGER

	loadPreview(srcString);
	function loadPreview(srcString) {
	    //var srcString = undefined;
	    var prvString = undefined;
	    //srcString = $("#txtSource").val();
	    srcString = srcString.replace(/\n/g, ' ');
	    prvString = srcString;
	    //resolve nested tags first
	    //var aTagStart = srcString.indexOf("{{link ");
	    //var aTagEnd = srcString.indexOf("}}",aTagStart) + 1;

	    var aTagIndices = getIndicesOf("{{link ", srcString);
	    if (aTagIndices.length > 0) {
	        for (i = 0; i < aTagIndices.length; i++) {
	            var aTagEndIndex = srcString.indexOf("}}", aTagIndices[i]) + 2;
	            var aToken = srcString.substring(aTagIndices[i], aTagEndIndex);
	            var linkMarkup = resolveLink(aToken);
	            prvString = prvString.replace(aToken, linkMarkup);
	        }
	    }


	    var finalPreview = parseAndReplace(prvString);

	    //check for interactions tags
	    var interactionIndex = finalPreview.indexOf("<interaction ");
	    if (interactionIndex > 0) {

	        var apesterScript = document.createElement('script');
	        apesterScript.setAttribute('src', '/js/apester-sdk.min.js');
	        document.head.appendChild(apesterScript);
	    }

	    //prvString = parseAndReplace(srcString);
	    //$("#txtPreview").html(finalPreview);
	    // twttr.widgets.load();
	    console.log(finalPreview);
	    return finalPreview;
	}
	function parseAndReplace(srcString) {

	    var finalString = srcString;
	    var tagsStartIndices = getIndicesOf("{{", srcString);
	    var tagsEndIndices = getIndicesOf("}}", srcString);
	    if (tagsStartIndices.length != tagsEndIndices.length) {
	        alert("Compile Error");
	        return;
	    }

	    for (i = 0 ; i < tagsStartIndices.length ; i++) {
	        var startIndex = tagsStartIndices[i];
	        var token = srcString.substring(startIndex, tagsEndIndices[i] + 2);

	        var type = token.split(' ')[0];

	        switch (type.replace('{{', '')) {
	            case 'h1':
	                var h1Markup = resolveH1(token);
	                finalString = finalString.replace(token, h1Markup);
	                break;
	            case 'h2':
	                var h2Markup = resolveH2(token);
	                finalString = finalString.replace(token, h2Markup);
	                break;
	            case 'title':
	                var titleMarkup = resolveTitle(token);
	                finalString = finalString.replace(token, titleMarkup);
	                break;
	            case 'detail':
	                var detailMarkup = resolveDetail(token);
	                finalString = finalString.replace(token, detailMarkup);
	                break;
	            case 'feature-image':
	                var imageMarkup = resolveFeatureImage(token);
	                finalString = finalString.replace(token, imageMarkup);
	                break;
	            case 'text':
	                var textMarkup = resolveText(token);
	                finalString = finalString.replace(token, textMarkup);
	                break;
	            case 'newline':
	                finalString = finalString.replace(token, "<br />");
	                break;
	            case 'image':
	                var imageMarkup = resolveImage(token);
	                finalString = finalString.replace(token, imageMarkup);
	                break;
	            case 'tweet':
	                var tweetMarkup = resolveTweet(token);
	                finalString = finalString.replace(token, tweetMarkup);
	                break;
	            case 'block-quote':
	                var quoteMarkup = resolveBlockQuote(token);
	                finalString = finalString.replace(token, quoteMarkup);
	                break;
	            case 'pull-quote':
	                var quoteMarkup = resolvePullQuote(token);
	                finalString = finalString.replace(token, quoteMarkup);
	                break;
	            case 'list':
	                var listMarkup = resolveList(token);
	                finalString = finalString.replace(token, listMarkup);
	                break;
	            case 'video':
	                var videoMarkup = resolveVideo(token);
	                finalString = finalString.replace(token, videoMarkup);
	                break;

	            default:

	        }//end switch
	    }//end for loop
	    return finalString;
	}//end function

	//resolvers
	function resolveFeatureImage(token) {
	    token = token.substring(15, token.length - 2);
	    var args = token.trim();
	    var imgElement = document.createElement("IMG");
	    imgElement.src = args;
	    imgElement.className += " article-img";
	    //imgElement.style = "max-width:100%;display:block"
	    return imgElement.outerHTML;
	}
	function resolveDetail(token) {
	    var args = token.substring(8, token.length - 2);
	    var h5Element = document.createElement("H5");
	    h5Element.innerHTML = args;
	    //h5Element.style = "text-transform:uppercase;font-size:12px;font-weight:semi-bold;font-family: 'Poppins', sans-serif;";
	    return h5Element.outerHTML;
	}
	function resolveTitle(token) {
	    var args = token.substring(7, token.length - 2);
	    var pElem = document.createElement("P");
	    pElem.innerHTML = args;
	    //h1Element.style = "font-size:24px;font-weight:semi-bold;font-family: 'Poppins', sans-serif;";
	    return '<div class="tc-quiz-ques" style="margin-top:20px;" >' + pElem.outerHTML + '</div>';
	}
	function resolveText(token) {
	    var args = token.substring(6, token.length - 2);
	    var pElement = document.createElement("P");
	    pElement.innerHTML = args;
	    //pElement.className = "nid-text-container";
	    //pElement.style = "font-size:14px;font-family:'Poppins',sans-serif;"
	    return pElement.outerHTML;
	}
	function resolveImage(token) {
	    token = token.substring(7, token.length - 2);
	    var args = token.split("++");
	    var imgElement = document.createElement("IMG");
	    imgElement.src = args[0];
	    imgElement.className += " article-img";
	    //imgElement.style = "display:block;width:100%;";
	    var captionMarkup = "";
	    if (args.length > 1) {
	        imgElement.setAttribute("alt", args[1]);

	        captionMarkup += "<div class ='tc-sm-text fa fa-camera'><p class='article-img-caption inline'>" + args[1] + "</p></div>";

	    }
	    //var imgHtml = `<div class="wrapper">
	    //              <div style="background-image: url('`
	    //                    + args[0] +
	    //                    `'); background-size:100% 100%;"  class="sixteen-by-nine"></div>
	    //              <div class ="content"></div>
	    //            </div>`;

	    var combinedMarkup = imgElement.outerHTML + captionMarkup;
	    return "<div align='center' style='margin-bottom: 10px;' >" + imgElement.outerHTML + "<div align='right' class='article-img'>" + captionMarkup + "</div></div>";
	}
	function resolveBlockQuote(token) {
	    var args = token.substring(14, token.length - 2);
	    args = args.split("++");

	    //h4Element.style = "font-size:16px;font-family:'Poppins',sans-serif;font-weight:semi-bold;"
	    var quoteElement = document.createElement("BLOCKQUOTE");
	    quoteElement.innerHTML = args[0].trim();
	    var cite = "";
	    if (args.length > 1) {
	        quoteElement.setAttribute("cite", args[1]);
	        cite = "<div class ='tc-sm-text'>" + args[1] + "</div>";
	    }

	    return "<div  align='center' style='margin-bottom: 10px;' ><div class='tc-quiz-ques'><p><span style='color:#C6E545;font-size: 1.7em;'> \" </span>" + args[0].trim() + "<span style='color:#C6E545;font-size: 1.7em;'> \" </span>" + cite + "</div></div>";
	}
	function resolvePullQuote(token) {
	    var args = token.substring(13, token.length - 2);
	    //h4Element.style = "font-style:italic;font-size:14px;font-family:'Poppins',sans-serif;font-weight:semi-bold;"
	    var quoteElement = document.createElement("p");
	    quoteElement.innerHTML = args.trim();
	    return "<div style='margin-bottom: 10px;' class='bq-outer-wrapper'><div class='bq-inner-wrapper'>" + quoteElement.outerHTML + "</div></div>";
	}

	function resolveTweet(token) {
	    var args = token.substring(7, token.length - 2).trim();

	    var divElement = document.createElement("DIV");
	    divElement.id = args;
	    divElement.align = "center";
	    var script = document.createElement("SCRIPT");
	    script.type = "text/javascript";
	    script.innerHTML = "twttr.widgets.createTweet('" + args + "',document.getElementById('" + args + "'),{ conversation: 'none', width: '400px'  });"; //cards: 'hidden', 
	    divElement.innerHTML += script.outerHTML;
	    //tweetString = "https://publish.twitter.com/oembed?url=" + args;
	    divElement.style = "margin-bottom: 10px;";
	    return divElement.outerHTML;
	}
	function resolveList(token) {
	    token = token.replace("{{list", '');
	    token = token.replace("}}", '');
	    token = token.replace('\n', '');
	    var args = token.split("++");
	    var listMarkup = "<div style='padding-left:50px;margin-bottom: 10px;'>"
	    args.forEach(function (item) {
	        listMarkup += "<div><div class='bullet-dot'></div><p class='bullet-text'>" + item.trim() + "</p></div><br />";
	    });
	    listMarkup += "</div>"
	    return listMarkup;
	}
	function resolveLink(token) {
	    token = token.substring(6, token.length - 2);
	    var args = token.split('++');
	    var linkElement = document.createElement("A");
	    linkElement.href = args[0].trim();
	    linkElement.target = "_blank";
	    if (args.length > 1) {
	        linkElement.text = args[1].trim();
	    }
	    return linkElement.outerHTML;
	}

	function resolveVideo(token) {
	    console.log(countryObj);
	    var args = token.substring(7, token.length - 2);
	    var args = args.split("++");
	    var sourceElement = document.createElement("SOURCE");
	    sourceElement.src = args[0].trim();
	    sourceElement.type = "video/mp4";
	    var videoElement = document.createElement("VIDEO");
	    if (countryObj.country_code.toLowerCase() == "ae" || countryObj.country_code.toLowerCase() == "uae" || countryObj.country_code.toLowerCase() == "in" || countryObj.country_code.toLowerCase() == "ind" || countryObj.country_code.toLowerCase() == "gb") {
	        videoElement.poster = "/Images/na.jpg";
	        sourceElement.src = "";
	    }
	    videoElement.innerHTML = sourceElement.outerHTML;
	    videoElement.controls = true;



	    var captionMarkup = "";
	    if (args.length > 1) {
	        captionMarkup += "<div class ='tc-sm-text'><p>" + args[1] + "</p></div>";
	    }

	    return "<div align='center' class='article-video' >" + videoElement.outerHTML + "<div class='article-video-caption'>" + captionMarkup + "</div></div>";
	}

	//Nabeel: 12-28-16, Comment: new tags added
	function resolveH1(token) {
	    var args = token.substring(5, token.length - 2);

	    return '<div class="article-content-h1" ><p>' + args + '</p></div>';
	}
	function resolveH2(token) {
	    var args = token.substring(5, token.length - 2);
	    return '<div class="article-content-h2" ><p>' + args + '</p></div>';
	}
	// end //

	function getIndicesOf(searchStr, str) {
	    var searchStrLen = searchStr.length;
	    if (searchStrLen == 0) {
	        return [];
	    }
	    var startIndex = 0, index, indices = [];

	    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
	        indices.push(index);
	        startIndex = index + searchStrLen;
	    }
	    return indices;
	}

	function configVideos() {
	    try {
	        var videos = $('#cms-content video');
	        if (videos.length) {

	            $.each(videos, function (index, video) {
	                video.preload = "none";
	            });

	            if (videos.length > 0) {
	                videos[0].preload = "auto";
	                videos[0].load();
	                videos[0].play();
	                videos[0].muted = true;
	                videos[0].addEventListener('canplay', function (e) {
	                    $(videos[0]).off('canplay');
	                    loadNextVideo(1);
	                }, false);
	            }
	        }
	    } catch (e) {

	    }
	}
};