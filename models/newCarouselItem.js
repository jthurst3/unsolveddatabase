var CarouselItem = require('./carouselitem');

module.exports.newCarouselItem = function(num2, pic2, url2, color2, text2, subtext2) {
	CarouselItem.findOne({number: num2}, function(error, result) {
		if(result == null || result == []) {
			var newCarouselItem = new CarouselItem({
				number: num2,
				pic: pic2,
				url: url2,
				color: color2,
				text: text2,
				subtext: subtext2
			});
			newCarouselItem.save(function(err,res) {
				if(err) {
					console.log(err);
				}
			});
		} else {
			console.log("Carousel item number already exists.");
		}
	})
}