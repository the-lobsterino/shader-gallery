#ifdef GL_ES
precision highp float;
#endif

// attempting the buddhabrot in glsl
// move the mouse to accumulate samples
// @timscaffidi

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backface;

const float OUTERS = 10.0;
const float ITERS =  1000.0;
const float PI = 3.1415926;

vec2 mul(vec2 w, vec2 z) {
	return vec2(w.x*z.x - w.y*z.y, w.x*z.y + w.y*z.x);
}

vec2 mandel(vec2 z, vec2 c) {
	return mul(z, z) + c;
}

void main( void ) {

	vec2 trans = vec2(-1.0, 0.0);
	vec2 scale = vec2(PI*2.0);
	vec2 p = ( gl_FragCoord.yx - resolution.yx/2.0) / min(resolution.x,resolution.y) * -scale  + trans;
	
	vec2 z = vec2(0.0, 0.0);
	vec2 offset = (mouse.yx-0.5)*PI*1.5;
	//offset += vec2(sin(time*126.78345), cos(time*234.345)) *0.0125;
	//vec2 offset = vec2(sin(time*10.0),cos(time*10.0)) * (mod(time*0.125,PI*1.2) - (PI*0.6));
	
	float is = 0.0;
	for(float i=0.0; i<ITERS; i++)
	{
		if(length(z) > 4.0) {
			is+= i;
			break;
		} 
		z = mandel(z + offset, p);
	}
	float value = (log(is+1.0))/(log(ITERS+1.0));
	float hue = is/ITERS * PI * 16. + PI/1.5;
	
	// hue/value calculation using sin
	float r = (sin(hue) * 0.5 + 0.5) * value;
	float g = (sin(hue + PI / 2.0) * 0.5 + 0.5) * value;
	float b = (sin(hue + PI) * 0.5 + 0.5) * value;
	vec3 color = vec3(r,g,b);
	vec3 sample = texture2D(backface, gl_FragCoord.xy/resolution).rgb;
	gl_FragColor = vec4(max(color,sample), 1.0 );
	//gl_FragColor = vec4(vec3(distance(p,offset)), 1.0);
}

