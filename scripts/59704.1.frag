// pure ass
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p*2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	//p*=0.5;
	///p.x = dot(p,p);
	//p.y -= p.x;
	//p.x += sin(p.y+time);

	float colX = 0.0;
	float colY = 0.0;
	float colZ = 0.0;
	
	colX = distance(vec2(0.0, 0.0), p);
	colX = sin(colX*3.141592*2.0 - time*2.0 + 3.141592/3.0*0.0)*0.5+0.5;
	colX = smoothstep(0.7, 0.71, colX);
	
	colY = distance(vec2(0.0, 0.0), p);
	colY = sin(colY*3.141592*3.0 - time*2.0 + 3.141592/3.0*1.0)*0.5+0.5;
	colY = smoothstep(0.7, 0.71, colY);
	
	colZ = distance(vec2(0.0, 0.0), p);
	colZ = sin(colZ*3.141592*4.0 - time*2.0 + 3.141592/3.0*2.0)*0.5+0.5;
	colZ = smoothstep(0.7, 0.71, colZ);

	

	gl_FragColor = vec4( colX, colY, colZ, 1.0 );

}