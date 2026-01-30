#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.14159265359;
	
vec2 opCheapBend( vec2 p, float d )
{
	d = max(d,0.1) ;
	
    float c = cos(pi*p.x) * d;
    float s = sin(pi) * d;
    mat2  m = mat2(c,-s,s,c);
    return vec2(m*p.xy);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float ratio = resolution.x / resolution.y;
	
	
	float d = distance(mouse, position);
	
	
	position = opCheapBend( position , d);
	
	float v = sin(position.y*200.0)+0.15/d;
	
	v = step(0.1,v);
	
	vec4 col = vec4(v,v,v,1.0);
	
	gl_FragColor = col;
}

