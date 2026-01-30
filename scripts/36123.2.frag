#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//--------------------------------------------------------------
// BioMorph5.glsl    by Valters Mednis    
// original: https://www.shadertoy.com/view/ltVGWG 
// tags: 2d, fractal, mandlebrot, power, 5, clifford, 
//       changing, biomorph, cliff, pickover, 
//       july, 1989, scientificamerican, 5th
// note: Use mouse to change constant. 
// info: http://paulbourke.net/fractals/biomorph/
//       http://www.madteddy.com/biomorph.htm 
//--------------------------------------------------------------

/*      Copyright (c) 2016 Valters Mednis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

#define ANTIALIAS_AMOUNT 4
#define ITERATIONS_MAX 10
#define EXIT_NUMBER 100.
#define SEGMENTS 3

float scaleFactor = 1.0;

//Function that returns a complex number to power of 5
vec2 complexPower5(vec2 c)
{
    vec2 cRes = c;
    for(int i = 1; i < SEGMENTS; i++)
    {
        // Multiply the result by the original complex number
    	vec2 c2 = cRes;
    	cRes.x = (c.x * c2.x) - (c.y * c2.y);
    	cRes.y = (c.x * c2.y) + (c.y * c2.x);
    }
    return cRes;
}

// Returns the color of a biomorph at position coord
vec4 colorBiomorph(vec2 coord, vec2 morphConstant)
{
    // This part is very similar to crude mandlebrot implementations
    vec2 z = coord;
    for(int i = 0; i < ITERATIONS_MAX; i++)
    {
        if((z.x * z.x < EXIT_NUMBER) 
        && (z.y * z.y < EXIT_NUMBER) 
        && ((z.x * z.x) + (z.y * z.y) < EXIT_NUMBER))
          z = complexPower5(z) + morphConstant;    // z = z^5 + c
    }
    
    // Unlike mandelbrot and likes this is not colored according to the number of iterations
    // it took to reach the exit number, but rather the according to the number itself after
    // these iterations
    if((z.x * z.x < EXIT_NUMBER) 
    || (z.y * z.y < EXIT_NUMBER))
    {
        return vec4(z.x*z.x*0.1, z.y*z.y*0.02, z.x*z.y*0.02, 1.0);
    }
    else
    {
//        return vec4(0.9, 0.9, 0.9, 1.0);
        return vec4(1.0-z.x*z.x*0.001, z.y*z.y*0.0001, z.x*z.y*0.015, 1.0);
    }
}

// Simple multisampling-antialising         ??? do this work as expected ???
// Effectively the same as rendering the thing in a larger resolution and then downscaling
vec4 antiAliasedBiomorph(vec2 uv, vec2 constant)
{
    vec4 result = vec4(0.0, 0.0, 0.0, 0.0);
    vec2 sampleStep = 1.0 / resolution.xy / float(ANTIALIAS_AMOUNT + 1);
    for(int i = 1; i < ANTIALIAS_AMOUNT + 1; i++)
    {
        for(int j = 1; j < ANTIALIAS_AMOUNT + 1; j++)
        {
            vec2 currentPos = uv + sampleStep * vec2(i,j);
            result += colorBiomorph((currentPos) * scaleFactor, constant);
        }
    }
    return result / float(ANTIALIAS_AMOUNT * ANTIALIAS_AMOUNT);
}

void main( void )
{
    vec2 uv = gl_FragCoord.xy / resolution.y;

    //Position the Biomorph
    uv.x -= 0.5 * (resolution.x / resolution.y) ;
    uv.y += 0.5;

    //scaleFactor = 4.0 - mouse.x; 
    
    //Render the Biomorph
    gl_FragColor = antiAliasedBiomorph(uv, mouse.xy+vec2(0.01 * sin(time / 4.0) + 0.15, 0.8));
}
