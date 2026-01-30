// joko interactive

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

//RADIUS of our vignette, where 0.5 results in a circle fitting the screen
const float RADIUS = 0.75;

//softness of our vignette, between 0.0 and 1.0
const float SOFTNESS = 0.45;

float rand(vec2 n)
{
	return fract(sin(n.x*2732.7357+n.y*2542.3643)*4365.6247);	
}
void main( void )
{
	vec2 pos = surfacePosition;
    	//determine the vector length of the center position
    	float len = length(pos);
	
	float scale = 35.;
	//vec2 spot = floor(surfacePosition *scale)/scale;
	float spot = floor(len *scale)/scale;
	
	
	float base = rand(vec2(spot));
	
	float color = mod(base * time * .5, 2.);
	if(color > 1.) color = 2. - color;
	color = .75 * color + .25;
	
	float timePerc = mod(time * .1, 2.);
	if(timePerc > 1.) timePerc = 2. - timePerc;
	
	vec3 lefta = vec3(1., .5, 1.);
	vec3 leftb = vec3(0., .5, 1.);
	vec3 left = mix(lefta, leftb, timePerc);
	
	float timePerc2 = mod(time * .5, 2.);
	if(timePerc2 > 1.) timePerc2 = 2. - timePerc2;
	
	vec3 righta = vec3(0., 0., 1.);
	vec3 rightb = vec3(1., 1., 0.);
	vec3 right = mix(righta, rightb, timePerc2);
	
	vec3 squareColor = color * mix(left, right, pos.x);
	

    //use smoothstep to create a smooth vignette
    float vignette = smoothstep(RADIUS, RADIUS-SOFTNESS, len);
	
	
	gl_FragColor = vec4(
		mix(squareColor, squareColor * vignette, .8), 1.);
}