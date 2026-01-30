#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;

#define b(a) texture2D(bb,a)

float rand2sTime(vec2 co){
    return fract(sin(dot(co.xy * time,vec2(12.9898,78.233))) * 43758.5453);
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec3 pix = vec3(1.0 / resolution, 0.0);
	vec3 pixinv = vec3(-pix.x, pix.y, 0.0);
	
	float v = 0.0;
	
	v = b(uv).r;
	
	vec4 nb = b(uv+pix.xy) + b(uv-pix.xy) + b(uv+pixinv.xy) + b(uv-pixinv.xy) + b(uv+pix.xz) + b(uv+pix.zy) + b(uv-pix.xz) + b(uv-pix.zy);
	
	v = v * step(2.0, nb.r) * (1.0 - step(3.01, nb.r)) + (1.0 - v) * step(3.0, nb.r) * (1.0 - step(3.01, nb.r));
	
	if(mouse.x < 0.1) v = step(0.5, pow(rand2sTime(uv) * sin(uv.x * 100.0),1.0));
	
	float halo = nb.r*0.1 + nb.a / 8.0;
	halo = min(1.0, halo);
	halo *= 0.99;

	gl_FragColor = vec4(v, 0.0, halo*0.6, halo);

}