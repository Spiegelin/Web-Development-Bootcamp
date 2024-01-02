function whosPaying(names) {
    
    /******Don't change the code above*******/
        
        //Write your code here.
        const n = Math.floor((Math.random() * names.length));
        
        return `${names[n]} is going to buy lunch today!`
        
        
        
        
    
    
    /******Don't change the code below*******/    
    }
    
console.log(whosPaying(["Angela", "Ben", "Jenny", "Michael", "Chloe"]));