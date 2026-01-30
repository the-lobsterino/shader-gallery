
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
	vec2 uv = (-1.+2.*gl_FragCoord.xy/resolution.xy)*vec2(resolution.x/resolution.y,1.)/1.0;
	vec4 scene = vec4(vec3(0),1);
	
	float r = 3e-2/sqrt(length(resolution));
	const float iLim = 24.;
	for(float i=0.;i<iLim;i++) {
		float iR = 0.2*(i/iLim);
		float i0 = 0.2*(i/iLim);
		
		for(float j=0.;j<iLim;j++) {
			if(2.*j+1. > i) break;
			iR += .04;
			i0 += iR;
			vec2 iP = iR*vec2(cos(32.*((i+j)/iLim)+i0), sin(i0+time));
			scene.xyz += r/(length(iP-uv)+length(scene)*0.003);
		}
	}
	
	gl_FragColor =vec4(scene);	
}