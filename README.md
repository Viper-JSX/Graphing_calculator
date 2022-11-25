# Graphing calculator

# Table of contents: 
* General info
* Technologies
* For developer (what and why)
* How to run

# Introduction
This calculator is used to draw graphs of mathematical functions. There is a field where you can write a function then this function will be interpreted and displayed 
in form of graph. Do not draw more than one graph due to performance issues


# Technologies
* HTML
* CSS
* JavaScript

# How to run
Simply drag and drop index.html file in your browser


# For developer
* The function is evaluated by eval() function. Inside mathematical function all X's replaced by a number and then evaluated as an arithmetical expression using eval(). 
The very graph consists of divs(divs are the main performance issue, this should be done using canvas) which are rotated by certain degree to match the beginning of 
other div. The degree is calculated using differentioation and arctangent function: $ atan((y2 - y1) / (x2 - x1)) => angle
* The app has some bugs with interpretation of function like when user writes 3x instead of 3*x
