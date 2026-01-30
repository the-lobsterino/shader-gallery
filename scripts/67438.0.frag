// N060920N

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main( void ) {
    // input: pixel coordinates
    vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;

	/** /
	p.y -= 0.1*sin(time+p.x*0.1);
	p.x -= 0.1*sin(time+p.y*0.1);
	/**/
	
	vec2 rot = rotate(p, sin(5.2*time));
	p = rot;
	
    // angle of each pixel to the center of the screen
    float a = atan(p.y,p.x);
    
    // modified distance metric
    float r = pow( pow(p.x*p.x,1.0) + pow(p.y*p.y,3.0), 2.0/5.0 );
    
    // index texture by (animated inverse) radius and angle
    vec2 uv = vec2( 1./r + 0.2*time, a );

    // pattern: cosines
    float f = sin(6.0*uv.x)*sin(6.0*uv.y);

    // color fetch: palette
    vec3 col = .3 + 1.1*sin( sin(time)*3.1416*f + vec3(sin(time),sin(time)*0.5,cos(time)*1.0) );
    
    // lighting: darken at the center    
    col = col*r;
    
    // output: pixel color
    gl_FragColor = vec4( col, 1.0 );

}