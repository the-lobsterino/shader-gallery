#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


const float max_its = 100.;

float mandelbrot(vec2 z){
    vec2 c = z;
    for(float i = 0.; i < max_its; i++) {
        if(dot(z, z) > 4.) return i;
        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
    }
    return max_its;
}


void main( void ) {
	//vec2 p = ((gl_FragCoord.xy / resolution.xx) - vec2(0.5, 0.25)) * 5.0;
    vec2 p = surfacePosition * 2.0;
    gl_FragColor = vec4(mandelbrot(p) / abs(sin(time) * 100.));
}