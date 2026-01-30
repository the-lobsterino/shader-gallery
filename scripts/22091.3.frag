#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define E 2.71828182
#define PHI 1.618033988
float map(vec2 p)
{
	return log(p.x);
}

vec2 format_to_screen(vec2 uv)
{
	uv = uv * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
	return uv;
}

vec2 derive(vec2 position)
{
    vec2 epsilon = vec2(.0001, 0.);
    vec2 normal  = vec2(0.);
    normal.x     = map( position + epsilon.xy ) - map( position - epsilon.xy );
    normal.y     = map( position + epsilon.yx ) - map( position - epsilon.yx );
    return normalize(normal);
}


void main( void ) 
{
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 p	= (format_to_screen(uv)+vec2(1.25, .25))*(1.+mouse.y*32.);
	
	float w = .05;

	float l = 0.;
	l 	+= float(abs(p.x)	< w);
	l 	+= float(abs(p.y)	< w);
	l 	+= float(abs(1.-p.x)	< w);
	l 	+= float(abs(E-p.y)	< w);
	l 	+= float(abs(E-p.x)	< w);
	l 	+= float(abs(5.-p.y)	< w);
	l 	+= float(abs(5.-p.x)	< w);
//	l 	+= float(abs(5.-p.y)	< w);
	l 	+= float(abs(15.-p.x)	< w);


	float pl = 0.;
	//pl 	+= float(abs(PHI-p.x)	< w);
	//pl 	+= float(abs(PHI-p.y)	< w);
	
	float f = map(p);
	vec2 d  = derive(p);

	f 	= float(abs(f   - p.y) < w);
	d.x 	= float(abs(d.x - p.y) < w);
	
	f       += float(abs(1./log(p.x)+p.y)<w);
	gl_FragColor = vec4(d.x, f, pl, 0.) + l; 

}