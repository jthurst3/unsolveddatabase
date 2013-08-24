var faq = "<div class=\"accordion-group\">
                  <div class=\"accordion-heading\">
                    <a class=\"accordion-toggle\" data-toggle=\"collapse\"
                       data-parent=\"#accordion2\" href=\"#collapse#{num}\">
                      #{question}
                    </a>
                  </div>
                  <div id=\"collapse#{num}\" class=\"accordion-body collapse\">
                    <div class=\"accordion-inner\">
                      #{answer}
                    </div>
                  </div>
                </div>";

				var q1 = {'num' : 1, 'question' : "What's an FAQ?", 'answer' : "A frequently asked question."};
				
				var html = faq.interpolate(q1);
				
				$(container).insert(html);