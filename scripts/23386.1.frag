#ifdef GL_ES
precision mediump float;
#endif

// so now we've got a oscilloscope, eh.
//and now we've got quasi-uniform thickness & 2-phase synchronous motor drive on the bench

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 plot(in vec2 pos, in float size, in float thickness)
{
	float t = pos.x + time;// / mouse.x;
	float sint = sin(t) * size;
	float cost = cos(t) * size;
	float dist1 = abs(sint-pos.y) / sqrt(cost*cost+1.0);
	float dist2 = abs(cost-pos.y) / sqrt(sint*sint+1.0);
	return vec3(0.0, thickness / dist1, thickness/dist2);
}

void main( void ) 
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float ratio = resolution.x / resolution.y;
	position.y = position.y / ratio + 0.2;
	position = (position - 0.5) * 120.0;
		
	vec3 color = vec3(0.0);
	if(abs(position.x) < 0.2) color = vec3(0.4);
	if(abs(position.y) < 0.2 / ratio) color = vec3(0.4);
	color += plot(position*0.1, mouse.y*3.5, 0.03);
	
	gl_FragColor = vec4(color, 1.0 );
}