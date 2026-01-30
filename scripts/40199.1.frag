#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

void main(void){
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 m = mouse*10.0;
	
	p.x += cos(p.y*resolution.y*123.456*m.x)/resolution.x;
	p.y += cos(p.x*resolution.x*12.3456+m.y)/resolution.y;
	
	vec3 color = vec3(0.0, 0.3, 0.5);
	
	float f = 0.0;
	float PI = 3.141592;
	for(float i = 0.0; i < 20.0; i++){
		
		float s = sin(cos(m.x+time/12.34) + i * PI / 10.0) * 0.8;
		float c = cos(time + i * PI / 10.0) * 0.8;
 
		f += 1./( (abs(p.x + c) * abs(p.y + s)) * resolution.x * resolution.y );
	}
	
	#define texture2D_(D) (texture2D(backbuffer, fract((D+gl_FragCoord.xy)/resolution))-1./256.)
	#define texture2D_4(D) ( ( texture2D_( D + vec2(1,0)) + texture2D_( D + vec2(-1,0)) + texture2D_( D + vec2(0,-1)) + texture2D_( D + vec2(0,1)) )/4. )
	gl_FragColor = vec4(vec3(f * color), 1.0);
	vec2 np = normalize(surfacePosition);
	gl_FragColor = max(gl_FragColor, texture2D_4(0.) );
	gl_FragColor = max(gl_FragColor, texture2D_4(np) );
	gl_FragColor = max(gl_FragColor, texture2D_4(-np) );
	gl_FragColor = max(gl_FragColor, texture2D_4(np.yx) );
	gl_FragColor = max(gl_FragColor, texture2D_4(-np.yx) );
	gl_FragColor.r += (gl_FragColor.g-.5)*1e-2;
	gl_FragColor.g += (gl_FragColor.b-.5)*2e-2;
}