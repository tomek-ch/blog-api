module.exports = (fields, body) => {
    return fields.reduce((data, field) => {
        const value = body[field];

        if (value !== undefined)
            return { ...data, [field]: value };
        return data;
        
    }, {});
};