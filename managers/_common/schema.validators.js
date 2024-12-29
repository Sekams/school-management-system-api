module.exports = {
    'username': (data)=>{
        if(data.trim().length < 3){
            return false;
        }
        return true;
    },
    'password': (data) => {
        const hasUpperCase = /[A-Z]/.test(data);
        const hasLowerCase = /[a-z]/.test(data);
        const hasNumbers = /\d/.test(data);
        const hasNonAlphas = /\W/.test(data);
        const isLongEnough = data.length >= 8;

        return hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas && isLongEnough;
    }
}