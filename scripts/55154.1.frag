#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	pos = fract(pos*20.0);
	pos*=2.0;
	pos-=1.0;
	
	vec3 col=vec3(1.0)*pos.y;
	float o = atan(pos.y/pos.x);
	
	float f1 = (1.-length(pos));
	float f2 = abs(sin(o*20.0-0.1*time));
	float f = f1+f2*0.0;
	bool flower = (f1+f2*0.4)>0.7;
	bool circle = (f1+f2*0.0)>0.7;

	if(flower)
		col.rgb = vec3(.8,.8,0);
	else
		col.rgb = vec3(0.2,0.4,0.3);

	if(circle)
		col.rgb = vec3(.8,.5,.3);

	gl_FragColor = vec4(col, 1.0);

}