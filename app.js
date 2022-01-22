var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const { engine } = require('express-handlebars');
const lc = require('letter-count');
const syllables = require('syllables');
var WordPOS = require('wordpos'),
wordpos = new WordPOS();
const rs = require('text-readability');
var hbs= require( 'express-handlebars' );
const spell = require('spell-checker-js')
var writeGood = require('write-good');

var app = express();

app.set("views", path.join(__dirname, "views"));
// app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: false,partialsDir: __dirname + '/views/partials/'}));
// app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname + "/public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile("home.html", { root: __dirname + "/views" });
});

app.post("/submit", async function (req, res) {
  
  var ans={};
  ans.characters=lc.count(req.body.emailbody).chars;
  ans.letters=lc.count(req.body.emailbody).letters;
  ans.syllables=syllables(req.body.emailbody);
  ans.words=lc.count(req.body.emailbody).words;
  ans.numbers=lc.count(req.body.emailbody).numbers;
  ans.lines=lc.count(req.body.emailbody).lines;
  ans.fleschReadingEase=rs.fleschReadingEase(req.body.emailbody)
  ans.fleschKincaidGrade=rs.fleschKincaidGrade(req.body.emailbody)
  ans.colemanLiauIndex=rs.colemanLiauIndex(req.body.emailbody)
  ans.automatedReadabilityIndex=rs.automatedReadabilityIndex(req.body.emailbody)
  ans.daleChallReadabilityScore=rs.daleChallReadabilityScore(req.body.emailbody)
  ans.difficultWords=rs.difficultWords(req.body.emailbody)
  ans.linsearWriteFormula=rs.linsearWriteFormula(req.body.emailbody)
  ans.gunningFog=rs.gunningFog(req.body.emailbody)
  ans.textStandard=rs.textStandard(req.body.emailbody)
  ans.sentenceCount=rs.sentenceCount(req.body.emailbody)
  ans.fleschReadingEase=rs.fleschReadingEase(req.body.emailbody)
  ans.smogIndex=rs.smogIndex(req.body.emailbody)
  ans.automatedReadabilityIndex=rs.automatedReadabilityIndex(req.body.emailbody)
  ans.daleChallReadabilityScore=rs.daleChallReadabilityScore(req.body.emailbody)
  
  var nonewline=req.body.emailbody.replace(/(\r\n|\n|\r)/gm, "");
   long_sentences=nonewline.split(".");
 
  var long_sentences_morethan30=[];
  var long_sentences_morethan20=[];
  for(let i=0;i<long_sentences.length;i++)
  {
    var syllable=syllables(long_sentences[i])
    if(syllable>40)
    {
      long_sentences_morethan30.push(long_sentences[i]);
    }
    else if(syllable>30 && syllable<40)
    {
      long_sentences_morethan20.push(long_sentences[i]);
    }
    if(i==long_sentences.length-1)
    {
       ans.long_sentences_morethan30=long_sentences_morethan30;
      ans.long_sentences_morethan20=long_sentences_morethan20;
    }
  }
  
  

  var suggestions = writeGood(req.body.emailbody);
  ans.suggestions=suggestions;
  // Load dictionary
  spell.load('en')
  
  // Checking text
  const check = spell.check(req.body.emailbody)
  ans.check=check;
 wordpos.getPOS(req.body.emailbody).then(function(result) {
  ans.nouns=result.nouns.length
  ans.verbs=result.verbs.length
  ans.adjectives=result.adjectives.length
  ans.adverbs=result.adverbs.length
  ans.rest= result.rest.length
  console.log(ans);
  return res.send(ans);
})  
});

var port = process.env.PORT || 3000;

app.listen(port, () => console.log("server running at port " + port));
