$(document).ready(function () {
  var ans={
    url:"h",
   result:""
  }
  
  $("#submitEmailClarifier").click(function (event) {
   
    if($("#emailbody").val()=="")
    {
      window.alert("Enter the Email body in textarea");
    }
    else
    {
    event.preventDefault();
    console.log("Perfectly fine")
    ajaxPostToEmailClarifier();
    }
  });
  $("#empty").click(function (event) {
    event.preventDefault();
    $("#small-dialog").css("display", "none");
    $("#emailbody").val("");
    $("textarea").removeClass("hwt-content");
  });
  $("#gradebutton").click(function (event) {
    
    event.preventDefault();
    $("#words").css("display", "none");
    $("#issues").css("display", "none");
    $("#grade").css("display", "block");
    $("#gradebutton").css("background-color", "#C0C0C0");
    $("#wordsbutton").css("background-color", "#807d7d");
    $("#issuesbutton").css("background-color", "#807d7d");
    
  });
  $("#wordsbutton").click(function (event) {
    
    event.preventDefault();
    $("#grade").css("display", "none");
    $("#issues").css("display", "none");
    $("#words").css("display", "block");
    $("#wordsbutton").css("background-color", "#C0C0C0");
    $("#gradebutton").css("background-color", "#807d7d");
    $("#issuesbutton").css("background-color", "#807d7d");
    
  });
  $("#issuesbutton").click(function (event) {
    
    event.preventDefault();
    $("#words").css("display", "none");
    $("#grade").css("display", "none");
    $("#issues").css("display", "block");
    $("#issuesbutton").css("background-color", "#C0C0C0");
    $("#wordsbutton").css("background-color", "#807d7d");
    $("#gradebutton").css("background-color", "#807d7d");
    
  });
  

  async function ajaxPostToEmailClarifier() {
    // PREPARE FORM DATA
    $("#loading-gif").css("display", "inline");
    var emailbody=$("#emailbody").val()

    var params = {
      AccountId: "AccountId", // your AWS user account ID
      RoleArn:
        "arn:aws:iam::AccountId:role/Cognito_EmailClarityCheckerUnauth_Role", // your Cognito unauth role (it wil look something like this)
      IdentityPoolId: "IdentityPoolId", // the identity pool id found in Cognito
    };

    // set the Amazon Cognito region
    AWS.config.region = "us-east-1";
    // initialize the Credentials object with our parameters
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

    // invoking the actual Lambda function
    var lambda = new AWS.Lambda();
    invoke_response = lambda.invoke(
      {
        FunctionName: "emailClarityChecker", // your function name
        LogType: "Tail",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          emailbody: emailbody,
        }), // how you send the email to the Lambda event
      },
      function (err, data) {
        if (err) {
          window.alert("Server Error.Please try again.");
          console.log(err, err.stack);
        } else {
          try{ 
           resultant=JSON.parse(JSON.parse(data.Payload).body);
           console.log(resultant);
          console.log("Thanks! You sent the request successfully");
         ajaxP2(resultant);
        }catch{
          window.alert("Server Error.Please try again.");
          $("#loading-gif").css("display", "none");
      }

      }

      }
    );

    async function ajaxP2(answers) {
      $("#words").html("");
      $("#grade").html("");
      $("#issuesul").html("");
      $("#issuesul1").html("");
      $("#issuesul2").html("");
      
      $("#small-dialog").css("display", "block");
      $("#loading-gif").css("display", "none");
      var highlightsArray=[
        {
          highlight: answers.long_sentences_morethan40,
          className: 'greaterthan40'
        },
        {
          highlight: answers.long_sentences_morethan30,
          className: 'greaterthan30'
        },
        {
          highlight: answers.check,
          className: 'spelling'
        }
      ];
      

      for(let i=0;i<answers.suggestions.length;i++)
      {
        var high={
          highlight: [answers.suggestions[i].index,answers.suggestions[i].index+answers.suggestions[i].offset],
          className: 'suggestion'
        }
        highlightsArray.push(high);
        if(i==answers.suggestions.length-1)
        {
          console.log(highlightsArray);
          $("#emailbody").highlightWithinTextarea({
            highlight: highlightsArray
           
        });
        
        }
      }
      
                console.log("After Post in postrequest");
                console.log(answers);
                $("#navbar").css("display", "block");
                $("#words").append("<ul><li><p>Characters Count: "+ answers.characters+" </p></li><li><p>Letters Count: "+ answers.letters+"</p></li><li><p>Syllables Count: "+ answers.syllables+" </p></li><li><p>Words Count: "+ answers.words+"</p></li><li><p>Numbers Count: "+ answers.numbers+"</p></li><li><p>Lines Count: "+ answers.lines+"</p></li><li><p>Sentence Count: "+ answers.sentenceCount+"</p></li><li><p>Nouns Count: "+ answers.nouns+"</p></li><li><p>Verbs Count: "+ answers.verbs+"</p></li><li><p>Adjectives Count: "+ answers.adjectives+"</p></li><li><p>Adverbs Count: "+ answers.adverbs+"</p></li><li><p>Rest Words Count: "+ answers.rest+"</p></li></ul>");
                $("#grade").append("<ul><li><p>Flesch Reading Ease: "+ answers.fleschReadingEase+" </p></li><li><p>Flesch Kincaid Grade: "+ answers.fleschKincaidGrade+"</p></li><li><p>Coleman Liau Index: "+ answers.colemanLiauIndex+" </p></li><li><p>Automated Readability Index: "+ answers.automatedReadabilityIndex+"</p></li><li><p>Dale Chall Readability Score: "+ answers.daleChallReadabilityScore+"</p></li><li><p>Difficult Words: "+ answers.difficultWords+"</p></li><li><p>Linsear Write Formula: "+ answers.linsearWriteFormula+"</p></li><li><p>Gunning Fog: "+ answers.gunningFog+"</p></li><li><p>Text Standard: "+ answers.textStandard+"</p></li><li><p>Smog Index: "+ answers.smogIndex+"</p></li></ul>");
                $("#issuesul1").append("<H2>Possible Spelling Issues</H2>");
                $("#issuesul1").append("<li ><u>Number of spelling mistakes:   "+answers.check.length +"</u></li>");
                
                $("#issuesul").append("<H2>Suggestions</H2>");
                for(let i=0;i<answers.suggestions.length;i++)
                {
                  $("#issuesul").append("<li>"+answers.suggestions[i].reason+"</li>")
                }
      
                $("#issuesul2").append("<H2 style='margin-top:8%;'>Readability Issues</H2>");
                $("#issuesul2").append("<li style='background-color:#fafa72'>Sentences > 40 Syllables:   "+answers.long_sentences_morethan40.length +"</li>");
                $("#issuesul2").append("<li style='background-color:rgb(185, 243, 130);'>Sentences > 30 Syllables:    "+answers.long_sentences_morethan30.length +"</li>");
    }
  }
});
