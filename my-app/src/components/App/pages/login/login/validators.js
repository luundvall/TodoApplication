function getValidationRegex() {
    return /^[^@]+@[^@]+\.[^@]+$/;
}

function getEmptyValidator() {
    return [{
        validate: function (value) {
            return value.length > 0;
        },
        errorText: 'You need to enter a value'
    }];
}

export function emailValidators() {
    return getEmptyValidator().concat({
        validate: function (value) {
            return getValidationRegex().test(value);
        },
        errorText: 'Not a valid emailadress'
    })
}

export function passwordValidators() {
    return getEmptyValidator();
}
