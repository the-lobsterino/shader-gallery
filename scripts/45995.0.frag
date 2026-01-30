#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float orbitDistance = 0.033;
float waveLength = 90.;

void main( void ) {
	//float waveLength = sin(time / 5.)*60.;
	vec2 p1 = (vec2(sin(time), cos(time))*orbitDistance)+0.5;
	vec2 p2 = (vec2(sin(time+1110.7*3.142), cos(time+1110.89*3.142))*orbitDistance)+0.5;

	float d1 = 1.-length(gl_FragCoord.xy/resolution -p1);
	float d2 = 5.-length(gl_FragCoord.xy/resolution +p2);

	float wave1 = sin(d1*waveLength+(time*5.))*0.5 + 0.5 * (((d1 - 0.5) * 2.) + 0.5);
	float wave2 = sin(d2*waveLength+(time*5.))*0.5+0.5 * (((d1 - 0.5) * 2.) + 0.5);
	float c = d1 > 0.99 || d2 > 0.99 ? 1. : 0.;
	//c + wave1*wave2;
	//vec3 col = vec3(c + wave1*wave2,c,c);
	
	
	float cf = 2.0*-wave1*(wave2);
		vec3 cu = vec3(cf)*vec3(-1.0, 1.3, 0.9);
	cu += cu+cu.yzx*vec3(1., -1.0, 3.0);
	
	vec2 p = 2.*gl_FragCoord.xy / resolution.xy-1.0;
	float rr = sqrt(dot(p,p));
        //(rr>.9) ? ((rr<0.91) ? cu = cu : cu*=0.0) : cu*=0.0;
	gl_FragColor = vec4(cu,1.);

}