#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
#define sp surfacePosition
#define frot (abs(sp+vec2(0))+vec2(-.25,.1+cos(time*4.-abs(sp.x-.5)*5.*cos(time/3.55))*.05))

vec3 Hue(float hue){
	vec3 rgb = fract(hue + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0));
	rgb = abs(rgb * 2.0 - 1.0);
	return clamp(rgb * 3.0 - 1.0, 0.0, 1.0);
}


void main( void ) {
	float m = mix(10.0,100.0,10./7.);
	vec2 c = 2.0 * floor(m * frot) / m - vec2(0.5,0.0);
	vec2 p = 2.5 * (mod(m * frot,1.0)-0.5);
	int j = 0;
	vec2 z = p;
	
	for(int i = 0; i < 256; i++){
		j++;
		if(length(z) > 2.) break;
		z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;
	}
	float t = float(j) / 256.;
	vec4 ooobb = texture2D(backbuffer, (gl_FragCoord.xy+vec2(0,16)) / resolution.xy) * vec4(Hue(sin(time * 0.1 + p.y * 0.1)), 1.0);
	gl_FragColor = vec4(vec3(t * 0.75 + ooobb.xyz * 0.75),1);
}