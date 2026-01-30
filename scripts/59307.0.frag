precision mediump float;
uniform float time;
uniform vec2 resolution;

const float tpi = 3.1415926535 * 2.0;

bool inTheBox(vec2 p, vec2 t, vec2 b) {
  return p.x > t.x && p.x < b.x && p.y > t.y && p.y < b.y;
}


void main( void ) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	float pixel = length(1.0 / resolution.xy);
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect;

	float color = 0.0;
	float d = 0.0;
	float r = 0.1;
	
	const float j_width = 100.0;
	const float j_start = 6.0;
	const float i_count = 10.0;
		
	for (float j = j_start + j_width; j > j_start; j -= 1.0) {
	  for (float i = 0.0; i < tpi; i += tpi / i_count) {
	    float u = i + sin(j + time);
	    vec2 p = 0.5 * aspect + vec2(cos(u), sin(u)) * (r + (j - j_start) / j_width);
	    float r2 = max(pixel, pixel * j_width / (j - j_start + 1.0));
		
	    if (inTheBox(position, p - vec2(r2), p + vec2(r2))) color = 1.0;
	  }
	}
	

	gl_FragColor = vec4( vec3(color), 1.0 );

}