#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// julia in julia :) --jz

#define MAX_ITER 16
#define ESCAPE 4.0
void main( void ) {

	vec2 p = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * 2.5;
	p.x *= resolution.x / resolution.y;
	vec2 i = p;
	float c = 0.0;
	vec2 sc = vec2(sin(time*0.11)*0.75, cos(time*0.012)*0.75);
	
	for (int n = 1; n < MAX_ITER; n++) {
		i = vec2(
				dot(i, vec2(i.x, -i.y)),
				2.0*i.x*i.y
			) - sc.yx;
		for (int m = 1; m < MAX_ITER; m++) {
			i = vec2(
				0.999999*dot(i, vec2(i.x, -i.y)),
				0.999999*2.0*i.x*i.y
			) + sc;
			if (length(i) > ESCAPE) {
				c += float(n+m) - log(log(length(i))/log(ESCAPE));		
				break;
			}

		}
		if (length(i) > ESCAPE) {
			c += float(n) - log(log(length(i))/log(ESCAPE));		
			break;
		}
	}
	c /= float(MAX_ITER);
	gl_FragColor = vec4( 
			vec3(
				c * abs(sin(c + time)),
				c * abs(sin(c + time + 2.0)),
				c * abs(sin(c + time + 4.0))
			),
			1.0 );

}