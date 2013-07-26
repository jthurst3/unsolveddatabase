<!DOCTYPE>
<!-- created mostly with reference to https://spark-public.s3.amazonaws.com/startup/images/part1-instructions.pdf-->
<html lang="en">
  <head>
    <title>The Unsolved Problems Database</title>
	
	<!-- from https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Collatz-stopping-time.svg/300px-Collatz-stopping-time.svg.png -->
	<link rel="icon" href="/assets/img/favicon.ico">
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<link rel="stylesheet" type="text/css" href="/css/bootstrap.css">
	<link href="/css/bootstrap-responsive.css" rel="stylesheet">
    <link rel="stylesheet" href="https://d396qusza40orc.cloudfront.net/startup%2Fcode%2Fbootstrap-combined.no-icons.min.css">
    <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css">
    <link rel="stylesheet" href="https://d396qusza40orc.cloudfront.net/startup%2Fcode%2Fsocial-buttons.css">
    <script src="https://d396qusza40orc.cloudfront.net/startup%2Fcode%2Fjquery.js"></script>
    <script src="https://d396qusza40orc.cloudfront.net/startup%2Fcode%2Fbootstrap.js"></script>
	<script src="/assets/js/faq.js"></script>
	<script src="/assets/js/jquery.js"></script>
	
	<link href="/assets/css/mainStyle.css" rel="stylesheet" >
	<link href="http://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css">
    </head>
  <body>
	  <!-- navigation pane -->
	  <?php include("header.php"); ?>
    <div class="container">
		<div class="row-fluid heading">
			<div class="span12"><h1>The Unsolved Problems Database</h1></div>
		</div>
		<div class="row-fluid subheading">
			<div class="span12"> 
				<p class="lead">Learn about the world's greatest mysteries.</p>
			</div>
		</div>
		<div class="row-fluid pitch">
			<div class="span5 offset1 video">
				<img class="img-polariod" src="http://placehold.it/480x300"/>
			</div>
	        <!-- We define a new 'actions' div to contain statistics, order, and share buttons.-->
	        <div class="span5 actions">
	          <div class="span8 offset2">
	            <div class="statistics">
	              <div class="span4">
	                <!-- linediv-l and linediv-r give dividing lines that look
	                different in horizontal and vertical layouts, illustrating
	                media queries. -->
	                <div class="linediv-l">
	                <h3>0</h3> <p>backers</p>
	                </div>
	              </div>
	              <div class="span4">
	                <div class="linediv-c">
	                  <h3>$0</h3> <p>of $1,000</p>
	                </div>
	              </div>
	              <div class="span4">
	                <div class="linediv-r">
	                <h3>---</h3> <p>days left</p>
	                </div>
	              </div>
	            </div>
	          </div>
	          <div class="span10 offset1">
	            <!-- Bootstrap progress bar -->
	            <!-- http://twitter.github.io/bootstrap/components.html#progress -->
	            <div class="thermometer progress active">
	              <div class="bar bar-success" style="width: 0%;"></div>
	              <div class="bar bar-warning" style="width: 0%;"></div>
	            </div>
	          </div>
	          <div class="span6 offset3 order">
	            <!-- Standard Bootstrap button. -->
	            <!-- http://twitter.github.io/bootstrap/base-css.html#buttons -->
	            <button class="btn btn-success btn-large">Contribute</button>
	          </div>
	          <div class="span8 offset2 social">
	            <!-- Social buttons are not included in default Bootstrap. -->
	            <!-- See: http://noizwaves.github.io/bootstrap-social-buttons -->
	            <button class="btn btn-twitter"><i class="icon-twitter"></i> | Twitter</button>
	            <a href="http://www.facebook.com/unsolveddatabase"--><button class="btn btn-facebook"><i class="icon-facebook"></i> | Facebook</button></a>
	          </div>
	        </div>
	      </div>
		  
		  
		</div>
		
        <!-- Beyond this part the marketing copy begins. -->
        <!-- https://developer.mozilla.org/en-US/docs/Web/CSS/text-align -->
        <!-- http://twitter.github.io/bootstrap/base-css.html#images -->
        <!-- http://placehold.it -->
        <div class="row-fluid section1">
          <div class="span5 offset1 asset">
            <img class="img-polaroid" src="http://placehold.it/480x300">
          </div>
          <div class="span5 copy">
            <p>
				Paragraph for writing about the site. Should also create at least one "unsolved problem page"
				and link it to this homepage.
				Here is the first problem: <a href="/problem/collatz">Collatz Conjecture</a>.
            </p>
          </div>
        </div>
        <div class="row-fluid section2">
          <div class="span5 offset1 copy copy-right">
            <p>
              Today's featured problem:
			  <a href="/problem/collatz">Collatz Conjecture</a>
            </p>
          </div>
          <div class="span5 asset">
            <img class="img-polaroid" src="http://placehold.it/480x300">
          </div>
        </div>
        <!-- For the FAQ, we introduce a little bit of JS, using the accordion. -->
        <!-- This brings in jquery.js and bootstrap.js as dependencies. -->
        <!-- http://twitter.github.io/bootstrap/javascript.html#collapse -->
        <div class="row-fluid faq">
            <div class="span10 offset1">
              <h3>FAQ</h3>
              <div class="accordion" id="accordion2">
				  <div class="faq"></div>
                <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse"
                       data-parent="#accordion2" href="#collapseOne">
                      What is the Unsolved Problems Database?
                    </a>
                  </div>
                  <div id="collapseOne" class="accordion-body collapse">
                    <div class="accordion-inner">
                      The Unsolved Problems Database is a website dedicated to explaining unsolved problems in academics to anyone wishing to learn more about them.
                    </div>
                  </div>
                </div>
                <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse"
                       data-parent="#accordion2" href="#collapseTwo">
                      What are unsolved problems?
                    </a>
                  </div>
                  <div id="collapseTwo" class="accordion-body collapse">
                    <div class="accordion-inner">
                      An "unsolved problem" is any problem that people don't know the answer to.
                    </div>
                  </div>
                </div>
                <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse"
                       data-parent="#accordion2" href="#collapseThree">
                      What types of unsolved problems are on this website?
                    </a>
                  </div>
                  <div id="collapseThree" class="accordion-body collapse">
                    <div class="accordion-inner">
						Unsolved problems in math, the natural sciences, engineering, economics, psychology, or any other academic field can be posted on this website.
                    </div>
                  </div>
                </div>
                <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse"
                       data-parent="#accordion2" href="#collapseFour">
					   Why didn't you include [this unsolved problem] on the website?
                    </a>
                  </div>
                  <div id="collapseFour" class="accordion-body collapse">
                    <div class="accordion-inner">
						Any user of this website can contribute an unsolved problem, as well as edit the descriptions of unsolved problems on the website. Thus, if you want [this unsolved problem] to be included in our database, sign up for free and contribute!
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>

        <!-- Not crucial, but we put this under a CC By-SA 3.0 license. -->
        <!-- http://creativecommons.org/licenses/ -->
        <div class="row-fluid footer">
          <div class="span12">
            <p>This work is licensed under
              the <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC
                By-SA 3.0
              </a> license.</p>
          </div>
        </div>
	  </div>
    </body>
</html>
      