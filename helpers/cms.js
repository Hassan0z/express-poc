var shareTitle = "";
var shareId = "";
var shareTags = "";
var shareUrl = "";
var _ArticlePublishDate = ""; // USED IN TAG MANAGER

function articleCMS() {
    SetNewsFbCommentsPlugin();
    id = $("#hfNewsId").val();
    //'/api/GetArticle/Get?id=' + id,
    $.ajax({
        url: BACKEND_URL + '/api/articles/article/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (dataArticle) {
            var dataArticle = MapNewsDetailModel(dataArticle);

            CheckforLinkPostOrStory(dataArticle); // REDIRECTS TO MATCH PAGE / STROY PAGE

            setupMetaTags(dataArticle); // SETS METAS FOR OPEN GRAPH AND SOCIAL SHARE

            result = loadPreview(dataArticle.description); // CONVERTS CMS TAGS TO HTML
            $("#cms-content").html(result);
            $(".upper-title h2").html(dataArticle.tags.split(", ")[0]);
            $(".upper-title span").html(utility.postDate(dataArticle));
            _ArticlePublishDate = new Date(dataArticle.publishDate);
            $(".main-question a").html(dataArticle.title);
            $(".main-question a").attr("href", "/news/" + dataArticle.id + "/" + dataArticle.url);
            $(".main-question a").attr("style", "text-decoration:none");

            SetBloggerDetails(dataArticle);

            IncrementArticleView(id);

            var fbTags = "";
            var tags = dataArticle.tags.split(', ');
            for (var i = 0; i < tags.length; i++) {
                $('.tc-tags').append("<span>#" + tags[i].trim() + "</span>");
                //fbTags += "#" + tags[i].trim();
            }

            shareTitle = dataArticle.title;
            shareId = dataArticle.id;
            shareTags = fbTags;
            shareUrl = "/news/" + dataArticle.id + "/" + dataArticle.url;
            $(".tweet-share").off('click');
            $(".tweet-share").on('click', function () {
                shareArticleOnTwitter(shareTitle);
            });
            $(".fb-share").off('click');
            $(".fb-share").on('click', function () {
                shareArticleOnFacebook();
            });
            $(".google-share").off('click');
            $(".google-share").on('click', function () {
                shareArticleOnGoogle(shareTitle);
            });


            $('.news-inner-details-thumb-wrapper .wrapper .sixteen-by-seven').attr("style", "background: rgba(0, 0, 0, 0) url(\"/Images/ArticleImages/1.6/" + dataArticle.id + ".jpg\") no-repeat scroll 0 0 / contain ");
            configVideos();

            try {
                window.history.replaceState(null, dataArticle.title + " | Cricingif", "/news/" + id + "/" + dataArticle.url.split('?ogt=')[0]);

            } catch (e) {

            }
            setArticleBookmarkIcon(id)

            iFrameVideoWidthFix();
        }
    });

    //'/api/GetArticleRelatedArticles/Get?id=' + id
    $.get(BACKEND_URL  + "/api/articles/related/article/" + id)
        .done(function (data) {
            data = MapNewsDetailModel(data);
            $(".right-outer-container").append(GetRelatedArticlesHtml(data));
        });


}

function SetBloggerDetails(data) {
    $("#blogger-pic").attr("src", "/Images/BloggerImages/" + data.bloggerId + ".png");
    $("#blogger-pic").error(function () {
        this.onerror = null; this.src = '/Images/UserImages/0.png';
    });

    $("#blogger-name").html("By " + data.bloggerFName + " " + data.bloggerLName);
    var urlbloggerName = data.bloggerFName + " " + data.bloggerLName;
    urlbloggerName = utility.encodeUrlTitle(urlbloggerName);
    $('#link-blogger').attr("href", "/blogger/" + data.bloggerId + "/" + urlbloggerName);
}

function SetNewsFbCommentsPlugin() {

    try {
        //var id = $("#hfNewsId").val();
        //if (!id) return;

        var host = window.location.host; //.com part only
        //var dataHref = host + '/news/' + data.id + '/' + data.url;

        var datahref = window.location.href;
        if (datahref && datahref.indexOf("?") >= 0)
            datahref = datahref.split("?")[0];

        $("#fb-article-comments").html('<div class="fb-comments" data-href="' + datahref + '" data-width="100%" data-numposts="20" data-order-by="social"></div>');

    } catch (e) {
        console.log("Exceptionn in SetNewsFbCommentsPlugin");
    }
}

function setupMetaTags(data) {

    try {
        $('title').text(data.title.trim() + ' | Cricingif');

        var excerpt = "";
        if (data.excerpt.length > 0)
            excerpt = data.excerpt.trim();
        else
            excerpt = "Read full article at cricingif.com/news/" + data.id + "/" + data.url;

        $('meta[name=description]').attr('content', data.excerpt);

        $('meta[property="og:title"]').attr("content",data.title.trim());
        $('meta[name="twitter:title"]').attr("content",data.title.trim());


        //$('meta[property=og:description]').attr('content', data.excerpt);


        //open graph and twitter content setting
        $('head').append("<meta property='og:description' content='" + excerpt + "' />");
        $('head').append("<meta name='twitter:description' content='" + excerpt + "' />");
    } catch (e) {
        console.log("Exception in setupMetaTags");
    }


}

function iFrameVideoWidthFix() {
    $("#cms-content iframe[src*='youtube.com']").attr("width", "100%");
    //$("#cms-content iframe[src*='facebook.com']").attr("width", "100%");
}

function CheckforLinkPostOrStory(data) {
    try {

        if (!data) return;

        if (data.article_type == 4) {
            utility.hideLoader();
            utility.showLoader();
            if (!data.linkPostUrl) return;
            window.location.href = "/match/" + data.linkPostUrl.split('/')[data.linkPostUrl.split('/').length - 1];
        }
        else if (data.article_type == 5) {
            window.location.href = window.location.href.replace("/news/", "/stories/");
        }

    } catch (e) {

    }
}

function setArticleBookmarkIcon(id) {
    if (User.isAuthenticated) {

        $.getJSON(BACKEND_URL + "/api/users/bookmark/article/" + id + "/status")
            .done(function (data) {
                if (!data) return;
                else if (data == true) {
                    $('.heart-like-action').addClass('active-heart');
                }
                else {
                    $('.heart-like-action').removeClass('active-heart');
                }
            });

    }
    if (User.isAuthenticated) {
        BindBookmarkEvent();
    }
    else {
        $('.heart-like-action').off('click');
        $('.heart-like-action').removeClass('active-heart');
        $('.heart-like-action').click(function (e) {
            e.preventDefault;
            $("#signInModal").modal();
        });
    }
}

function BindBookmarkEvent(){
    $('.heart-like-action').off('click');
    $('.heart-like-action').click(function (e) {
        e.preventDefault;
        if ($(this).hasClass('active-heart')) {
            $('.heart-like-action').removeClass('active-heart');
            $.post(BACKEND_URL + "/api/users/bookmark/article/" + id + "/delete")
            .done(function () {
                loadBookmarkWidget();
            })
        }
        else {
            $('.heart-like-action').addClass('active-heart');
            $.post(BACKEND_URL + "/api/users/bookmark/article/" + id)
            .done(function () {
                loadBookmarkWidget();
            })
        }
    });
}

function GetRelatedArticlesHtml(data) {
    var finalHtml = "";
    for (var i = 0; i < data.length; i++) {
        finalHtml += FillRelatedArticle(data[i]);
    }
    return finalHtml;
}

function FillRelatedArticle(article) {
    var description = article.description;
    textIndex = description.indexOf("{{text ");
    description = description.substr(textIndex + 6, 100);
    var time = relatedArticleTime(article);
    return '<div class="news-sm-block right-column-box">' +
                '<div class="wrapper">' +
                 ' <div class="sixteen-by-nine" style="background-image:url(\'/Images/ArticleImages/1.6/' + article.id + '.jpg\');"></div>' +
                  '<div class="content"></div>' +
                '</div>' +
                '<div class="news-sm-content-wrapper">' +
                    '<div class="news-main-title">' +
                        '<div style="width:auto;" class="detail-text main-news-link inline-block">' +
                            '<a>' +
                                article.tags.split(", ")[0] +
                            '</a>' +
                        '</div>' +
                           '<div class ="news-sm-duration pull-right">' +
                          '<p style="font-size:0.9em;">' +
                             time +
                          '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class ="news-sub-title">' +
                                       " <a href=\"/news/" + article.id + "/" + article.url + "\" >"
                            + article.title +
                        '</a>' +

                    '</div>' +
                    '<div class="news-copy-text">' +
                        '<p class="copy-text">' +
                         article.excerpt +
                        '</p>' +
                    '</div>' +
                '</div>' +
              '</div>' +
            '</div>';
}

function relatedArticleTime(article) {
    postTime = new Date(article.publishdate);
    time = new Date(postTime.getUTCFullYear(), postTime.getUTCMonth(), postTime.getUTCDate(), postTime.getUTCHours(), postTime.getUTCMinutes(), postTime.getUTCSeconds());
    now = new Date();
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var seconds = (+now_utc - time) / 1000;

    days = Math.floor(seconds / 86400);
    seconds = seconds % 86400;
    hours = Math.floor(seconds / 3600);
    result = "";
    if (days > 0) {
        result += days + "d ";
        result = "";
    }
    else if (hours > 0)
        result += hours + "h ";
    else if (days == 0 && hours == 0)
        result = "Just now";

    return result;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

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
    twttr.widgets.load();
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


//Helper
function old_extractAllTweets(srcString) {
    var tweets = undefined;
    //do{
    tweetStartingIndex = srcString.indexOf("<%t ");
    if (tweetStartingIndex >= 0) {
        tweetEndingIndex = srcString.indexOf(" %>");
        if (tweetEndingIndex >= 0) {
            tweetString = srcString.substring(tweetStartingIndex + 4, tweetEndingIndex - 3);
            tweetSrcString = srcString.substring(tweetStartingIndex, tweetEndingIndex);
            srcString = srcString.replace(tweetSrcString, ConvertToTweet(tweetString));
            prvString = srcString;
        }
    }
    //}while();

}

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

function IncrementArticleView(id) {
    $.ajax({
        url: BACKEND_URL + "/api/articles/incrementview/article/" + id,
        type: 'GET',
        dataType: 'json',
        success: function (data) {

        }
    });

    try {
        var data = JSON.stringify([{
            "name": 61,
            "sessionId": "temp",
            "userID" : "1212",
            "timestamp": new Date().toISOString(),
            "data": JSON.stringify({
                "source": window.location.href,
            })
        }]);
        $.ajax({
            url: 'https://cricingif-analytics.azurewebsites.net/api/analytics',
            data: data,
            type: 'PUT',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {

            }
        });
    } catch (e) {
        console.log(e);
    }
}

function loadTrendWidget() {
    $.getJSON("/api/GetTrendingArticles/GET").done(function (data) {
        var selector = "#trendings";
        $(selector).html("");
        for (var i = 0; i < data.length; i++) {
            if (i == data.length) break;
            $(selector).append('<a href="/news/' + data[i].id + '/' + data[i].url + '"><p>' + data[i].title + '</p></a>');
        }
    });
}

function shareArticleOnFacebook() {
    var onMobile = false;
    if (utility.isMobile())
    {
        onMobile = true;
    }

    //if (!hashTags) hashTags = "#cricingif";

    FB.ui({
        method: 'share',
        mobie_iframe: onMobile,
        href: window.location.href
    }, function (response) {
    });

    //FB.ui({
    //    method: 'feed',
    //    name: productTitle,
    //    link: productLink,
    //    caption: productCaption,
    //    picture: productImage,
    //    description: productSummary
    //}, function (response) {
    //    if (response && response.post_id) { }
    //    else { }
    //});
}

function shareArticleOnTwitter(twtTitle) {
    var width = 575,
       height = 400,
       left = ($(window).width() - width) / 2,
       top = ($(window).height() - height) / 2,
       opts = 'status=1' +
    ',width=' + width +
    ',height=' + height +
    ',top=' + top +
    ',left=' + left;
    window.open('https://twitter.com/share?text=' + twtTitle, 'twitter', opts);
    return false;
}

function shareArticleOnGoogle(url) {
    window.open("https://plus.google.com/share?url=" + window.location.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
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

function loadNextVideo(index) {
    try {
        var video = $('#cms-content video'); // nth-child is 1-indexed
        if (index < video.length) {
            video[index].preload = "auto";
            video[index].load();
            video[index].pause();
            video[index].addEventListener('canplay', function (e) {
                $(video[index]).off('canplay');
                loadNextVideo(index + 1);
            }, false);
        }
    } catch (e) {

    }
}