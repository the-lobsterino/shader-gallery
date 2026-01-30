#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.y -= 0.5;
	position.y *= resolution.y/resolution.x;
	position.y += 0.5;
	
	vec3 color = vec3(0.0);
	float dist = 0.2 + 0.15 * sin(time * 0.0932);
	float px = sin(time * 0.15) * dist;
	float py = cos(time * 0.15) * dist;
	
	vec2 points[7];
	points[0] = mouse;
	points[1] = vec2(0.5+px, 0.5+py);
	points[2] = vec2(0.5+py, 0.5-px);
	points[3] = vec2(0.5-px, 0.5-py);
	points[4] = vec2(0.5-py, 0.5+px);
	points[5] = vec2(0.5, 0.5);

	points[0].y -= 0.5;
	points[0].y *= resolution.y/resolution.x;
	points[0].y += 0.5;
	
	vec3 colors[7];
	colors[0] = vec3(0.75, 0.15, 0.0);
	colors[1] = vec3(0.2, 0.6, 0.2);
	colors[2] = vec3(0.2, 0.5, 1.0);
	colors[3] = vec3(1.0, 0.5, 0.25);
	colors[4] = vec3(0.8, 0.5, 0.5);
	colors[5] = vec3(1.0, 0.5, 1.0);
	float closestDist = 99999.0;
	int closestId = -1;
	
	for(int i = 0; i < 6; i++)
	{
		float dist = distance(points[i], position);
		if(closestDist > dist)
		{
			closestDist = dist;
			closestId = i;
			gl_FragColor = vec4(colors[i] * 2.5 * pow(1.0 - dist, 8.0), 1.0);
		}
	}
}