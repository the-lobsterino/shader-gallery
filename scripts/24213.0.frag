#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hmap(vec2 pos)
{
	float color = 0.0;
	float t = time * 0.0;
	color += sin( pos.x * cos( t / 15.0 ) * 80.0 ) + cos( pos.y * cos( t / 15.0 ) * 10.0 );
	color += sin( pos.y * sin( t / 10.0 ) * 40.0 ) + cos( pos.x * sin( t / 25.0 ) * 40.0 );
	color += sin( pos.x * sin( t / 5.0 ) * 10.0 ) + sin( pos.y * sin( t / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
	return (color+5.0)*0.2;
}

float hmap2(float x, float y)
{
	return hmap(vec2(x*0.07, y*0.7));
}

void main( void ) {
	float delt = 0.01;

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = hmap(position);
	
	vec3 ro = vec3(0.0, 3.0 + sin(time), 0.0 + time);
	vec2 pr = gl_FragCoord.xy * vec2(2, 2) - resolution.xy;
//	vec3 rd = vec3(pr.x*0.01, pr.y*0.01-2.0, 1.0);
	vec3 rd = vec3(pr.x*0.01, pr.y*0.01, 1);
	
	//rd = normalize(rd);
		
	float tout = 0.0;
	
	float t = 0.05;
	float res_t = 0.05;
	float lh = 0.0;
	float ly = 0.0;
	for (int i = 0; i < 500; ++i) {
		vec3 p = ro + rd*t;
		float h = hmap2(p.x, p.z);
		if (p.y < h) {
			tout = 1.0;
			res_t = t - delt + delt*(lh-ly)/(p.y-ly-h+lh);
			break;
		}
		delt = t*0.01;
		t += delt;
		lh = h;
		ly = p.y;
	}

	if (tout == 0.0) {
		gl_FragColor = vec4(0.0,color,color,1);
	} else {
		vec3 p = ro + rd*res_t;
		float a = hmap2(p.x, p.z);
		float b = hmap2(p.x+0.01, p.z);
		float c = hmap2(p.x, p.z+0.01);
		vec3 nrm = normalize(vec3(a-b, 0.01, a-c));
		
		float diffuse = dot(nrm, vec3(0.1, 0.7, -0.1));
		gl_FragColor = vec4(0.0,0.0,diffuse,1);
	}
	//	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}