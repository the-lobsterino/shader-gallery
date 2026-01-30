// rakeshcjadav@gmail.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = 512.0 * ( gl_FragCoord.xy / resolution.x ) ;

	uv /=6.0;
	
        vec2 a = floor(uv);
        vec2 b = fract(uv);
	
	float t = mod(time, 3.14*2.0);
	float fSine = sin(t);
	float fCos = cos(t*0.2);
        vec4 w = fract((sin(a.x*7.0+31.0*a.y + 0.005*time)+vec4(0.035,0.01,0.0,0.7))*13.545317); // randoms
                
        vec3 col = 
		smoothstep(fSine,1.5,w.w) *               // intensity
		vec3(sqrt( 2.0*b.x*b.y*(1.0-b.x)*(1.0-b.y))); // pattern
        col = pow( 2.5*col, vec3(1.0,1.0,0.7) );    // contrast and color shape
	
	gl_FragColor = vec4( col , 1.0 );
}