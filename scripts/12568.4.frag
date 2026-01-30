#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distManhat(vec2 a, vec2 b){
	return (abs(a.x-b.x)+abs(a.y-b.y));	
}

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

	vec4 p = vec4(gl_FragCoord.xy / resolution.xy * 2. - 1., 0.0, 0.0);
	vec4 c = vec4(-1.0+2.0*mouse, 1.0, 1.0);
	vec4 r;
	
	float mcolor = 999.0;
	for (int i = 0; i < 6; i++) {
		p = vec4(p.x*p.x - p.y*p.y + c.x, 2.0*p.x*p.y + c.y, 
			 2.0*p.x*p.z - 2.0*p.y*p.w + c.z, 2.0*p.x*p.w + 2.0*p.y*p.z + c.w);
		mcolor = min(mcolor, distManhat(p.xy, p.zw));
		
		float dist = length(mcolor);
		if(closestDist > dist)
		{
			closestDist = mcolor;
			r = vec4(colors[i]/32., 1.0);
		}
	}
	
	gl_FragColor = vec4(.005/r/mcolor);
}//well, that's apparently possible - sphinx (also, whoever posted the "room" - badass)
	