#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265358979;

const float num = 40.0;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 color = vec3(0.64, 0.8, 1.0);
	
	float cr, cg, cb, cl;
	for(float i=0.0; i < num; i++) {
		cl += 0.004/abs(length(vec2(
			pos.x-0.5+cos(PI*2.0*2.0*i/(num-1.0)+time*0.2)*0.5,
			pos.y-0.5+sin(PI*4.0*i/(num-1.0)+time*0.2)*0.5
		))-0.1+sin(time)*0.05)*0.2;
		cr = cl * color.x;
		cg = cl * color.y;
		cb = cl * color.z;
	}
	
	gl_FragColor = vec4(cr, cg, cb, 1.0 );

}