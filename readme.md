# Read me
## Zokrates Hello World with SNARKs

Start this as soon as possible - this might take a couple minutes:
```
    cd <into your working directory>
    mkdir <folder you want to work out of>
   
    docker run -v <that folder you just made>:/home/zokrates/code -ti zokrates/zokrates:0.3.0 /bin/bash 
    
    EXAMPLE:
    docker run -v ~/Documents/Code/puzzle-hunt:/home/zokrates/code -ti zokrates/zokrates:0.3.0 /bin/bash 
```


cd code

~/zokrates compile -i addToTen.code

~/zokrates setup

~/zokrates compute-witness -a 2 3 4

~/zokrates generate-proof

~/zokrates export-verifier



____ for website 
 npm install http-server -g
