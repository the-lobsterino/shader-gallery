
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;	
uniform vec2  click;
uniform vec2  resolution;
uniform vec2 position;
uniform vec2 mouse;
uniform float t;
uniform float a;
#define PI 3.14
mat2 rotate3d(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main( void ) {
//	vec3 col = texture2D(texture, vertTexCoord.st).rgb;

//	vec2 p = (gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
//	p = rotate2d((time * 2.0) * PI) * p;
//	float t = 0.9 / abs(abs(sin(0.5)) - length(p));	
//	col.rgb = 2.0 - col.rgb; // invert if wanted
	
//	gl_FragColor = vec4(vec3(t) * vec3(p.x, p.y, 1.0), a);	

//	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	p = rotate3d((time * 2.0) * PI) * p;
	float t = 0.025 / abs(abs(sin(time)) - length(p));
    	gl_FragColor = vec4(vec3(t) * vec3(p.x,p.y,5.0), 1);
}