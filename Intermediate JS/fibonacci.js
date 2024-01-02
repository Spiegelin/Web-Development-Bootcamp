function fibonacciGenerator (n) {
    //Do NOT change any of the code above 
        
        //Write your code here:
        if (n === 0) {
            return [];
        }
        
        if (n === 1) {
            return [0];
        }
        
        if (n === 2) {
            return [0,1];
        }
        
        let sequence = [0,1];
        for (let i = 1; i < n-1; i++) {
            let next = sequence[i] + sequence[i-1];
            sequence.push(next);
        }
        return sequence;
        
        //Return an array of fibonacci numbers starting from 0.
    
    //Do NOT change any of the code below 
    }
    
    console.log(fibonacciGenerator(16));