(function() {
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

	function getNormalizedString(srcString) {
		var prvString = srcString.replace(/\n/g, ' ');
		var aTagIndices = getIndicesOf("{{link ", srcString);
		
		if (aTagIndices.length > 0) {
			for (i = 0; i < aTagIndices.length; i++) {
				var aTagEndIndex = srcString.indexOf("}}", aTagIndices[i]) + 2;
				console.log(aTagEndIndex);
				var aToken = srcString.substring(aTagIndices[i], aTagEndIndex);
				var token = aToken.substring(6, aToken.length - 2);
				var args = token.split('++');
				var aElem = '<a href="'+args[0].trim()+'" target="_blank">'+args[1].trim()+'</a>';
				prvString = prvString.replace(aToken, aElem);
			}
		}
		return prvString;
	}

	module.exports = {
		getIndicesOf: getIndicesOf,
		getNormalizedString: getNormalizedString
	}
})()
