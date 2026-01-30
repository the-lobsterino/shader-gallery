#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( vec2 p )
{
	float h = dot(p,vec2(127.1,311.7));
	
    return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

vec3 asdf(vec2 uv, vec2 pos)
{
	vec2 m = mouse * 2.0 - 1.0;
	m.x *= resolution.x / resolution.y;
	float pn = noise(uv * time * fract(distance(m,pos)));
	float d1 = smoothstep(0.45 * pn, 0.55, distance(pos, uv));
	float a = fract(d1);
	return 1.0 - vec3(a);	
}

vec3 asd(vec2 uv, vec2 pos)
{
	float pn = noise(time*uv);
	float d1 = smoothstep(0.5,1.0,distance(pos, uv));
	float a = (d1);
	float b = (time * a);
	return 1.0 - vec3(b);
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec2 pos1 = mouse * 2.0 - 1.0;
	pos1.x *= resolution.x / resolution.y;
	vec2 pos2 = vec2(sin(time), cos(time)) - p;
	vec3 g1 = asdf(p, pos2) * asd(p, pos1);
	
	vec3 color = g1; 
	gl_FragColor = vec4(color, 1.0);

}