#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D lastFrame;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
#define ph (time*0.25)

#define surfacePosition (vec2(cos(ph*5.43210), sin(ph*3.456))+4.*surfacePosition/(cos(.054321*time)))
#define UNITS 200.
#define STEP 1.
#define SPEED 0.2
#define SPEED2 (1./12.)

void post_drag(){
	vec2 density = 1./resolution;
	vec2 origin = gl_FragCoord.xy*density;// - surfacePosition;
	vec2 sp = surfacePosition;
	
	origin += normalize(sp)*density;
	
	float th = atan(sp.x, sp.y)*4.+time*.7;
	origin += -.5*vec2(cos(th), sin(th))*density;
	
	gl_FragColor = max(gl_FragColor, (
		-texture2D(lastFrame, fract(origin))
		+texture2D(lastFrame, fract(origin+vec2(1,1)*density))
		+texture2D(lastFrame, fract(origin+vec2(1,0)*density))
		+texture2D(lastFrame, fract(origin+vec2(1,-1)*density))
		+texture2D(lastFrame, fract(origin+vec2(0,1)*density))
		+texture2D(lastFrame, fract(origin+vec2(0,-1)*density))
		+texture2D(lastFrame, fract(origin+vec2(-1,1)*density))
		+texture2D(lastFrame, fract(origin+vec2(-1,0)*density))
		+texture2D(lastFrame, fract(origin+vec2(-1,-1)*density))
	)/7.-1./128.);
}

vec3 colorFunc(float h) {
	return .75+.125*vec3(cos(time+h), sin(time-h), cos(5.*sin(time+h*5.)));
}

void main( void ) {
	float d = 3. * length(surfacePosition - vec2(0., 0.)) / (sin(sin(time * SPEED2 + time * 3.) + 200.));
	
	gl_FragColor = vec4(0);
	
	
	for(float i = 0.; i < 36.; i += 36. / UNITS){
		
		float d = 8.0 * length(surfacePosition/  sin(sin(time * i * SPEED2 + time * 3.) + 200.) - 0.4 * vec2(sin(time * i * SPEED + i + time * 3.) , cos(time * i * SPEED + i + time * 3.)));
		gl_FragColor += vec4(colorFunc(i)/d- 0.25, 1.0);
	}
	
	gl_FragColor = max(gl_FragColor, gl_FragColor * abs(sin(time)));
	
	post_drag();
}