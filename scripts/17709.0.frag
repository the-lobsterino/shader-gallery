#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


//return distance
float fold(vec3 p)
{
	
	float SCALE = 2.0+sin(time);
	float OFFSET = 1.0;
	float r;
	int nn=0;
	for (int n=0; n < 10; n++) {
		if(p.x+p.y<0.) p.xy = -p.yx;
		if(p.x+p.z<0.) p.xz = -p.zx;
		if(p.y+p.z<0.) p.zy = -p.yz;
		p = p*SCALE - OFFSET*(SCALE-1.0);
		nn = n;
	}
	return (length(p) ) * pow(SCALE, -float(nn));
}
void main( void ) {

	vec2 p = surfacePosition;
	vec3 c = vec3(0);
	
	c.x = fold(vec3(p,0));
	c.x = fract(c.x);
		
	gl_FragColor = vec4( c, 1.0 );

}