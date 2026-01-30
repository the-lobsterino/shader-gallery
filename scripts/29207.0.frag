
precision highp float;
precision highp int;



uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int ntest = 100;

const float lim = 0.14;

float kalk(vec2 p) {
	int count = 0;
	vec2 b = vec2((p.x+p.y)/(p.x*p.x + p.y*p.y), (p.x-p.y)/(p.x*p.x + p.y*p.y));

	for (int i = 0; i < ntest; i++) {
		vec2 il = fract(b*float(i));
		if ((il.x < lim || il.x > (1.0-lim)) && (il.y < lim || il.y > (1.0-lim))) {
				count++;
		}
	}
	return float(count)/float(ntest);
}



void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	vec2 trans = position*2.0 - 1.0;
	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor = vec4(vec3(kalk(trans)),1);

}

