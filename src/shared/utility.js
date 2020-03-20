export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}

export const checkValidity = (value, rules) => {
    let isValid = true;
    if(rules) {
        if(rules.required) {
            isValid = isValid && value.trim() !== '';
        }

        if(rules.minLength) {
            isValid = isValid && value.length >= rules.minLength;
        }

        if(rules.maxLength) {
            isValid = isValid && value.length <= rules.maxLength;
        }

        if(rules.isEmail) {
            const pattern = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
            isValid = isValid && pattern.test(value);
        }

        if(rules.numeric) {
            const pattern = /^\d+$/;
            isValid = isValid && pattern.test(value);
        }
    }
    return isValid;
}