//source https://andreasmb.github.io/lever-jobs-embed/index.js

window.loadLeverJobs = function (options) {


  //Checking for potential Lever source or origin parameters
  var pageUrl = window.location.href;
  var leverParameter = '';
  var trackingPrefix = '?lever-'

  if( pageUrl.indexOf(trackingPrefix) >= 0){
    // Found Lever parameter
    var pageUrlSplit = pageUrl.split(trackingPrefix);
    leverParameter = '?lever-'+pageUrlSplit[1];
  }

  var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
  };

  function replaceTag(tag) {
      return tagsToReplace[tag] || tag;
  }

  function sanitizeHTML(str) {
      return str.replace(/[&<>]/g, replaceTag);
  }

  //Functions for checking if the variable is unspecified and removing script tags + null check
  function sanitizeAttribute(string) {
    if (string == '' || typeof string == 'undefined' ) {
      return;
    }
    string = sanitizeHTML(string);
    return string.replace(/\s+/ig, "");
  }

  // Adding the account name to the API URL
  var url = 'https://api.lever.co/v0/postings/' + options.accountName + '?group=team&mode=json';

  function createJobs(_data) {
    if (!_data) return;

    var content = "";

    for(var i = 0; i < _data.length; i++) {
      if (!_data[i]) continue;
      if (!_data[i].postings) continue;
      if (!(_data[i].postings.length > 0)) continue;

      var title = sanitizeHTML(_data[i].title || 'Uncategorized');
      var titlesanitizeAttribute = sanitizeAttribute(title);

      content += '<br/><h5 class="fl-heading"><span class="fl-heading-text">' + title + '</span></h5>';

      for (j = 0; j < _data[i].postings.length; j ++) {
        var posting = _data[i].postings[j];
        var postingTitle = sanitizeHTML(posting.text);
        var location = (posting.categories.location || 'Uncategorized');
        var locationsanitizeAttribute = sanitizeAttribute(location);
        var commitment = (posting.categories.commitment || 'Uncategorized');
        var commitmentsanitizeAttribute = sanitizeAttribute(commitment);
        var team = (posting.categories.team || 'Uncategorized' );
        var teamsanitizeAttribute = sanitizeAttribute(team);
        var link = posting.hostedUrl+leverParameter;

        //content +='<div class="fl-module-content f1-node-content"><h5 class="fl-heading"><a href="' 
        content +='<h5 class="fl-heading"><a href="' 
        content +=  link 
        content +='" target="_blank" rel="noopener"><span class="fl-heading-text">' 
        content += postingTitle 
        content += ' - ' 
        content += location
        content += '</span></a></h5>'
        //content += '</span></a></h5></div>'
        //content += '<a class="lever-job-title" href="' + link + '"">' + postingTitle + '</a><span class="lever-job-tag">' + location + '</span></li>';
      }
      //content += '</ul>';
    }
    document.getElementById("lever-jobs-container").innerHTML = content;
  }

  if (options.includeCss) {
    function addCss(fileName) {
      var head = document.head
        , link = document.createElement('link');

      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = fileName;

      head.appendChild(link);
    }
    addCss('https://andreasmb.github.io/lever-jobs-embed/embed-css/style.css');
  }

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = "json";

  request.onload = function() {
    if (request.status == 200) {
      createJobs(request.response);
    } else {
      console.log("Error fetching jobs.");
    }
  };

  request.onerror = function() {
    console.log("Error fetching jobs.");
  };

  request.send();


};

window.loadLeverJobs(window.leverJobsOptions);