#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float t = time * .5;

#define PI 3.1415926535

vec2 cartesian(){
	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x / resolution.y;
	return p;
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main( void ) {
	vec2 p = cartesian();
	
	vec2 rm = vec2( cos(t * .2), sin(t * .2)*2. );
	vec2 g = vec2( p.x * rm.x + p.y * -rm.y, 
		       p.y * rm.x + p.x * rm.y );
	
	float grid = mouse.x ;
	float gri2 = grid * .5;
	
	bool off = mod(g.x, grid) > gri2;
	if( mod(g.y  + (off ? gri2 : 0.0), grid) > gri2 )
		t += .05;
	
	float ang = atan(p.y,p.x);
	float dist = length(p);
	ang += log(dist)+t; //spiral and animation
	ang += cos(dist);
	ang = mod(ang, PI/1.0);
	
	float ang2 = ang+PI*mouse.y; //change the multiplier
	
	vec3 col = hsb2rgb(vec3(ang, 1.0, 1.0));
	vec3 col2 = hsb2rgb(vec3(ang2, 1.0, 1.0));
	col = mix(col, col2, dist);
	
	
	gl_FragColor = vec4(col, 1.0); 
	
}