#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p, vec2 c, float r)
{
	float d = 1.0 + sin(time)*0.02 - smoothstep(0.0, 0.005, abs(r-distance(p,c)));
	return d;
}

vec2 cosa(vec2 p)
{
	vec2 p2 = p + vec2(0.2*sin(3.0*p.x),0.1*sin(0.2*p.y));
	return vec2(sin(20.0*p2.x),sin(20.0*p2.y))*((cos(1.0*time)-1.0)*0.01 + 0.1);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.x - vec2(0.5, 0.25));
	float w = 2.0;
	float r = circle(cosa(p+vec2(0.0, 0.005*cos(w*time))), vec2(0.0,0.0), 0.1);
	float b = circle(cosa(p), vec2(0.0,0.0), 0.1);
	float g = circle(cosa(p+vec2(0.005*cos(w*time),0.0)), vec2(0.0,0.0), 0.1);;
	
	
	gl_FragColor = vec4(r, g, b, 1.0 ); [;gdrjjtýfhghgkhuf]
	 fdttrtdy
		 [retune] ;[retauy] teryuios;[\ [\83554885] [ratunio] utritoe
					      [butsore
					       hfgtduttd[]

}