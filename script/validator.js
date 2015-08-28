var validator = {
	validateString: function(value){
		if (typeof(value) !== 'string') {
			throw new Error('Invalid string value');
		}
	},
	validateStringLength: function(value, minLength, maxLength){
		this.validateString(value);
		if (value.length < minLength || maxLength < value.length) {
			throw new Error('Invalid string length');
		}
	},
	validateNonEmptyString(value){
		this.validateString(value);
		if (value.length === 0) {
			throw new Error('Invalid empty string');			
		}
	}
}

module.exports.validator = validator;