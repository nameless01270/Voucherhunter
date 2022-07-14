import passwordValidator from "password-validator";

export const validatePassword = (password) => {
  var schema = new passwordValidator();

  schema
  .is().min(8)                                    
  .is().max(100)                                 
  .has().uppercase()                            
  .has().lowercase()                           
  .has().digits(2)                            
  .has().not().spaces()                          
  .is().not().oneOf(['Passw0rd', 'Password123']);
  if (schema.validate(password)) {
    return true;
  } else {
    var failedList = schema.validate('password', { list: true });
    return failedList;
  }
};

export const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const validateEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  } else {
    return false;
  }
};