
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

//5 - 100 : 1
#define grid 50.0
//0.2 - 0.6 : 0.1 
#define thickness 0.5
//0.0 - 10 : 1.0
#define red 5.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
  return fract(sin(dot(co.xy, resolution)) * 65000.98432);
}

void main (void) {
	vec2 v = gl_FragCoord.xy  / grid;
	
	v -= time + vec2(sin(v.y), cos(v.x));
	
	float brightness = fract(rand(floor(v)) + time);
	float hue = fract(rand(floor(v) + 1.) + time);

	brightness *= thickness - length(fract(v) - vec2(thickness, thickness));
	gl_FragColor = vec4(brightness * red, hue*brightness*(10.0 - red), 0.0, 1.0);
}
