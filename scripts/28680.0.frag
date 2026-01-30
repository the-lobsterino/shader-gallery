#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = gl_FragCoord.xy/resolution.xy - .5;
        
        float x = .5 + length(p) * cos( atan(p.y,-p.x) + time*.828 ) ;
	    
        gl_FragColor = mix( vec4(1, 0, 0, 1), vec4(1, 1, 0, 1), smoothstep(0.,1.,x) );
}