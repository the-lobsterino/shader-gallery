#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	
	vec2 p = -(mouse-0.5+0.5) + surfacePosition*(6.0+(4.0*sin(time)));//*0.5+0.5); 
	
	float t = time * 0.0001;
	float st = sin(t);
	float dp = dot(p,p);
	
	p = mix( p * dp, p / dp, st*0.5+0.5 );
	vec3 destColor = vec3(0.0);
	
	for(float i = 5.0; i < 27.0; ++i){
		float s = t * i / 50.0;
		vec2 q = p + length(p);//vec2(cos(s),sin(s*2.7)) * 0.5;
		destColor += 10000.0 * length(q * 0.27 );
	};
	
	gl_FragColor = vec4(fract(destColor*0.0016*(0.3*(sin(t)+sin(t+0.1)))), 15.0);
}