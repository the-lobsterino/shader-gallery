#ifdef GL_ES
precision mediump float;
#endif

// VRG de la vega tarking here
// Any Idea to make it run at 256. points ?
// 	Fixed with use of int loop

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pixel(vec2 pos, float size){
	return clamp(size-distance(pos.xy, floor(gl_FragCoord.xy)), 0., size)*size*0.025;
}

void main( void ) {
	float tmpColor = 0.0;
	vec3 color = vec3(0.);
	const int itarget = 512;
	const float target = float(itarget);
	
	float offsetA = 0.3*time;
	float offsetB = 0.5*time;
	float offsetC = 0.4*time;
	vec2 offsetD = (resolution.xy * 0.25);
	vec2 offset;
	float k = 0.;
	float n = 0.;
	float incr = 1./target;
	for (int i=0; i<itarget; i++)
	{
		offset = vec2(sin(k + offsetA), sin(1.5*k + offsetB) + sin(2.5 * k + offsetC)) * offsetD;
		tmpColor = pixel(floor(resolution.xy * 0.5 + offset), 5.+10.*n/target);
		color += mix(vec3(1., 0., 0.), vec3(0., 1., 0.), n/target)*tmpColor;
		k += 12.0*incr;
		n++;
	}
	gl_FragColor = vec4(color, 1.);
}