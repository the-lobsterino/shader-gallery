#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2  click;
uniform vec2  resolution;
#define PI 1.0

mat2 rotate2d(float angle){
	return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main( void ) {
//	vec3 col = texture2D(texture, vertTexCoord.st).rgb;

//	vec2 p = (gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
//	p = rotate2d((time * 1.0) * PI) * p;
//	float t = 0.02 / abs(abs(sin(0.5)) - length(p));

//	float a = 1.0 - col.r ; // make white transparent
	
//	col.rgb = 1.0 - col.rgb; // invert if wanted
	
//	gl_FragColor = vec4(vec3(t) * vec3(p.x, p.y, 1.0), a);	

	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	p = rotate2d((time * 1.0) * PI) * p;
	float t = 0.01 / abs(abs(sin(time)) - length(p));
    	gl_FragColor = vec4(vec3(t) * vec3(p.x,p.y,1.0), 5);

}