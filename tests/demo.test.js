const userValidator = require('../validators/UserValidator')

test ('should return false', () => {
    const result = userValidator.isBirthDateValid('21')
    expect(result).toBe(false);
})

test('should return true', () => {
    const result = userValidator.isBirthDateValid('21/03/1999')
    expect(result).toBe(true);
})