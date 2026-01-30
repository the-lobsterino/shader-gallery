#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	
	float tempo = time;
	// very high freq analysis, don't use if prone to epileptic seizure...
	//    tempo *= pow(1e1, 4.8*length(mouse));
	
	vec2 uv = (gl_FragCoord.xy/resolution.xy * 2.0 - 1.0)*vec2(resolution.x/resolution.y, 1.0);
	uv = surfacePosition;
	
	
	float ph = (atan(uv.y, uv.x)+3.14)*1.*cos(time*.31);
	tempo += 100.*pow(length(uv), ph)*10.*cos(time*1e-45);
	
	float r = length(uv);
	float th = atan(uv.y, uv.x) + tempo*1e-2;
	uv = vec2(r*cos(th), r*sin(th));
	
	vec3 finalColor = vec3(0.0);
	
	vec2 z = uv;
	float c = 1.1+1e-1*cos(time*0.31)+4e0*cos(tempo*0.031);
	for (int i = 0; i < 64; ++i) {
		vec2 aux = z;
		z.y = aux.x*aux.x-aux.y*aux.y+c;
		z.x = 2.0*aux.x*aux.y;
		if (length(z) >= 1.0)
			finalColor += 0.09*vec3((sin(tempo*0.01)+1.0)/2.0, (cos(tempo*0.01)+1.0)/2.0, 1.0);
	}
	
	gl_FragColor = vec4( finalColor, 1.0 );

}