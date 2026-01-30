//a short series of examples as a primer for glsl sandbox


//this webpage allows you to program GPU (Graph Proccessing Unit) programs directly to the screen
//it is a public site that anyone can post to  

//the language is GLSL (OpenGL Shading Language)
//as you observed, it is limited a subset of C designed for simple gpu programs 
//the primary difference from C is that support for operations on small vectors and matrices is builtin 
//there are no files or memory to read in, and no inputs but the screen resolution, mouse, and time (all optional)
//and this web version is especially limited to basic operations (eg + - * / min max dot etc...)
//the only possible output is a 4 component vector 'gl_FragColor' which displays directly to the screen as color

//each 'pixel' (aka 'fragment') of the screen is essentially its own independent mini-cpu (techninally they are alu's)
//and the power of the gpu hardware allows for some rather incredible processing (eg http://glslsandbox.com/e#50174.10)

//despite these limits, the elegance and instant feedback make it a very useful tool
//code is extremely composable and can be copy pasted from one program to another with no need for modifications
//thus you can think of it as programming directly to a complex field of coordinates along the height and width of the screen

//(it's just a fancy web graphing calculator, really ;D)

//always remember, despite the result being color, absolute mathematical rigor must still be applied
//let the colors guide you quickly, but be sure to write tests such that your eyes can't be fooled




// examples :
//http://glslsandbox.com/e#50392.4 //this intro
//http://glslsandbox.com/e#50392.3 //coordinates as colors
//http://glslsandbox.com/e#50392.2 //controlling execution with coordinates
//http://glslsandbox.com/e#50392.1 //distance fields and lines
//http://glslsandbox.com/e#50392.0 //binary number field
//(decrement the decimal to proceed through the lessons)



//lastly, this is a quick reference card, and only the last two pages apply here (check out the examples first, though - the card is a bit dense)
//https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf


#ifdef GL_ES
precision mediump float;
#endif

void main( void ) 
{
}

