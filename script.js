const throttle = (func, limit) => {
    let inThrottle;
    return function(... args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const printHelloWorld1 = throttle(() => {
    console.log("Hello, World!");
}, 1000);

window.addEventListener('mousemove', printHelloWorld1);
